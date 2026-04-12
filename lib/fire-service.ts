// lib/fire-service.ts
const FIRMS_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/json';
const INPE_API_URL = 'https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/api/focos';
const AMAZON_BBOX = '-73.9,-18.0,-44.0,5.0'; // Bounding Box da Amazônia

function normalizeNasaResponse(json: any) {
  if (Array.isArray(json)) return json
  if (json?.data && Array.isArray(json.data)) return json.data
  if (json?.features && Array.isArray(json.features)) return json.features
  if (json?.results && Array.isArray(json.results)) return json.results
  return []
}

function normalizeInpeResponse(json: any) {
  if (Array.isArray(json)) return json
  if (json?.data && Array.isArray(json.data)) return json.data
  if (json?.features && Array.isArray(json.features)) return json.features
  return []
}

export async function fetchFireData() {
  const apiKey = process.env.NEXT_PUBLIC_NASA_FIRMS_KEY
  const nasaRes = await fetch(`${FIRMS_BASE_URL}/${apiKey}/VIIRS_SNPP_NRT/${AMAZON_BBOX}/1`)
  const inpeRes = await fetch(`${INPE_API_URL}/referencia/bioma?bioma_id=1`)

  const nasaJson = nasaRes.ok ? await nasaRes.json() : null
  const inpeJson = inpeRes.ok ? await inpeRes.json() : null

  return {
    nasa: normalizeNasaResponse(nasaJson),
    inpe: normalizeInpeResponse(inpeJson),
  }
}

const INPE_STATS_URL = 'https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/api/estatistica/bioma'

export async function fetchInpeStatistics() {
  // Busca estatísticas mensais/anuais para o Bioma Amazônia (ID: 1)
  const response = await fetch(`${INPE_STATS_URL}?bioma_id=1`);
  if (!response.ok) throw new Error('Falha ao buscar estatísticas do INPE');
  const json = await response.json()
  if (Array.isArray(json)) return json
  if (json?.data && Array.isArray(json.data)) return json.data
  return []
}