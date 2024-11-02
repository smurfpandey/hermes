const AMADEUS_API_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const FLIGHT_SCHEDULE_API_URL =
  'https://test.api.amadeus.com/v2/schedule/flights';
const AIRPORT_DETAILS_API_URL =
  'https://test.api.amadeus.com/v1/reference-data/locations';
const CLIENT_ID = import.meta.env.VITE_AMADEUS_KEY;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_SECERT;
const TOKEN_KEY = 'amadeus_access_token';

async function fetchAccessToken() {
  const cachedToken = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}');
  const currentTime = Math.floor(Date.now() / 1000);

  if (cachedToken.access_token && cachedToken.expires_at > currentTime) {
    return cachedToken.access_token;
  }

  try {
    const response = await fetch(AMADEUS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    const token = {
      access_token: data.access_token,
      expires_at: currentTime + data.expires_in,
    };

    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    return token.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

async function fetchFlightSchedule(carrierCode, flightNumber, departureDate) {
  const cacheKey = `${carrierCode}-${flightNumber}-${departureDate}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  const currentTime = Date.now();

  // Check if cached data is available and not expired (e.g., valid for 1 hour)
  if (
    cachedData.data &&
    cachedData.timestamp &&
    currentTime - cachedData.timestamp < 3600000
  ) {
    return cachedData.data;
  }

  const accessToken = await fetchAccessToken();

  try {
    const response = await fetch(
      `${FLIGHT_SCHEDULE_API_URL}?carrierCode=${carrierCode}&flightNumber=${flightNumber}&scheduledDepartureDate=${departureDate}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch flight schedule');
    }

    const data = await response.json();
    // Cache the new data with a timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: currentTime }),
    );
    return data;
  } catch (error) {
    console.error('Error fetching flight schedule:', error);
    throw error;
  }
}

export { fetchFlightSchedule };
