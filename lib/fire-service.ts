"use server"

// lib/fire-service.ts

const FIRMS_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
// Atualizando para o domínio mais recente conhecido do INPE, mas com proteção de falha
const INPE_API_URL = 'https://queimadas.dgi.inpe.br/api/focos';
const SOUTH_AMERICA_BBOX = '-82,-56,-34,13'; 

// === FUNÇÕES DE CONVERSÃO ===
function parseCSVToJSON(csvText: string) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return []; 
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    let obj: any = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index];
    });
    return obj;
  });
}

function normalizeInpeResponse(json: any) {
  if (Array.isArray(json)) return json;
  if (json?.data && Array.isArray(json.data)) return json.data;
  if (json?.features && Array.isArray(json.features)) return json.features;
  return [];
}

// === DADOS DE BACKUP (FALLBACK) ===
const getMockNasaData = () => {
  console.warn("⚠️ Usando MOCK DATA para NASA (Verifique sua MAP_KEY)");
  // Gerando dados simulados focados no Amazonas para preencher os gráficos
  return Array.from({ length: 45 }).map((_, i) => ({
    latitude: (-3.4653 + (Math.random() * 5 - 2.5)).toString(),
    longitude: (-62.2159 + (Math.random() * 5 - 2.5)).toString(),
    bright_ti4: (310 + Math.random() * 40).toString(), // Acima de 330 é High Severity
    acq_date: new Date().toISOString().split('T')[0],
    acq_time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    confidence: Math.random() > 0.5 ? 'h' : 'n'
  }));
};

const getMockInpeData = () => {
  console.warn("⚠️ Usando MOCK DATA para INPE (API Indisponível/404)");
  return {
    features: Array.from({ length: 15 }).map((_, i) => ({
      geometry: { coordinates: [-62.2159 + (Math.random() * 5 - 2.5), -3.4653 + (Math.random() * 5 - 2.5)] },
      properties: {
        municipio: ["Manaus", "Lábrea", "Apuí", "Novo Aripuanã", "Manicoré"][Math.floor(Math.random() * 5)],
        estado: "AM",
        satelite: "AQUA_M-T",
        data_hora_gmt: new Date().toISOString()
      }
    }))
  };
};

export async function fetchFireData() {
  const apiKey = process.env.NEXT_PUBLIC_NASA_FIRMS_KEY;
  let nasaData = [];
  let inpeData: any = { features: [] };

  // 1. BUSCA NASA COM FALLBACK
  try {
    const nasaRes = await fetch(`${FIRMS_BASE_URL}/${apiKey}/VIIRS_SNPP_NRT/${SOUTH_AMERICA_BBOX}/1`);
    if (nasaRes.ok) {
      nasaData = parseCSVToJSON(await nasaRes.text());
    } else {
      console.error(`Erro NASA FIRMS (${nasaRes.status}):`, await nasaRes.text());
      //nasaData = getMockNasaData(); // Fallback
    }
  } catch (error) {
    //nasaData = getMockNasaData(); // Fallback
    console.error('Erro de rede na requisição da NASA:', error);
  }

  // 2. BUSCA INPE COM FALLBACK
  try {
    const inpeRes = await fetch(`${INPE_API_URL}/?pais_id=33`);
    if (inpeRes.ok) {
      inpeData = { features: normalizeInpeResponse(await inpeRes.json()) };
    } else {
      //inpeData = getMockInpeData(); // Fallback
      console.error(`Erro INPE (${inpeRes.status})`);
    }
  } catch (error) {
    //inpeData = getMockInpeData(); // Fallback
    console.error('Erro de rede na requisição do INPE:', error);
  }

  return { nasa: nasaData, inpe: inpeData }
}

export async function fetchInpeStatistics() {
  try {
    const response = await fetch(`https://queimadas.dgi.inpe.br/api/estatisticas/bioma?bioma_id=1`);
    if (response.ok) {
      const json = await response.json();
      return Array.isArray(json) ? json : (json?.data || []);
    }
    console.error(`Erro ao buscar estatísticas (${response.status})`);
    return [];
  } catch (error) {
    console.error('Erro ao buscar estatísticas do INPE:', error);
    return [];
  }
}