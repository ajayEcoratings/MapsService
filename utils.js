import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

const baseGooglePlacesURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const API_KEY = process.env.GOOGLE_API_KEY;

const filterNearbyPlaces = (data, validNames) => {
  const { results } = data;
  return results.filter(({ name }) =>
    validNames.some((el) => name.toLowerCase().includes(el))
  );
};

const makeRequest = async (keyword, radius, lat, lng) => {
  try {
    const response = await axios.get(baseGooglePlacesURL, {
      params: {
        location: `${lat},${lng}`,
        type: "natural_feature",
        radius: radius,
        keyword: keyword,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

export const findResults = async (lat, lng) => {
    const keywords = ["river", "lake", "ocean", "sea"];
    const circles = ["30000", "100000", "250000"];
  
    for (let radius of circles) {
      for (let keyword of keywords) {
        try {
          const places = await makeRequest(keyword, radius, lat, lng);
          const validPlaces = filterNearbyPlaces(places, keywords);
  
          if (validPlaces.length > 0) {
            validPlaces.sort((A, B) => {
              const distanceA = calculateDistance(lat, lng, A.geometry.location.lat, A.geometry.location.lng);
              const distanceB = calculateDistance(lat, lng, B.geometry.location.lat, B.geometry.location.lng);
              return distanceA - distanceB;
            });
  
            return {
              radiusLimit: radius,
              nearestPlace: {
                name: validPlaces[0].name,
                lat: validPlaces[0].geometry.location.lat,
                lng: validPlaces[0].geometry.location.lng,
              },
              distance: calculateDistance(lat, lng, validPlaces[0].geometry.location.lat, validPlaces[0].geometry.location.lng),
            };
          }
        } catch (error) {
          console.error("Error occurred:", error.message);
          throw error;
        }
      }
    }
  
    return { radius: "251000" };
  };
