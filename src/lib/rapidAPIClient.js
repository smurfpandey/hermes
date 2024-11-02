const AIRPORT_DETAIL_API_URL =
  'https://airports-by-api-ninjas.p.rapidapi.com/v1/airports';
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

async function getAirportByIATA(iataCode) {
  const cacheKey = `airport-${iataCode}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey) || '{}');

  if (cachedData.data) {
    return cachedData.data;
  }
  try {
    const parsedUrl = new URL(AIRPORT_DETAIL_API_URL);

    const response = await fetch(`${AIRPORT_DETAIL_API_URL}?iata=${iataCode}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': parsedUrl.hostname,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch airport details');
    }

    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ data }));
    return data;
  } catch (error) {
    console.error('Error fetching airport details:', error);
    throw error;
  }
}

export { getAirportByIATA };
