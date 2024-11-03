const PNR_STATUS_API_URL =
  'https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus';
const STATION_API_URL =
  'https://rstations.p.rapidapi.com/v1/railways/stations/india';
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

async function getPnrStatus(pnrNumber) {
  const cacheKey = `ir-pnr-${pnrNumber}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey) || '{}');

  if (cachedData.data) {
    return cachedData.data;
  }

  try {
    const parsedUrl = new URL(PNR_STATUS_API_URL);

    const response = await fetch(`${PNR_STATUS_API_URL}/${pnrNumber}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': parsedUrl.hostname,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pnr details');
    }

    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ data }));
    return data;
  } catch (error) {
    console.error('Error fetching pnr details:', error);
    throw error;
  }
}

async function getStationDetail(stationCode) {
  const cacheKey = `ir-station-${stationCode}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey) || '{}');

  if (cachedData.data) {
    return cachedData.data;
  }

  try {
    const parsedUrl = new URL(STATION_API_URL);
    const response = await fetch(`${STATION_API_URL}`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': parsedUrl.hostname,
      },
      body: { search: stationCode },
    });

    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ data }));
  } catch (error) {
    console.error('Error fetching pnr details:', error);
    throw error;
  }
}

export { getPnrStatus, getStationDetail };
