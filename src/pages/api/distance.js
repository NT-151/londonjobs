// pages/api/distance.js
import axios from "axios";

export default async function handler(req, res) {
  const { postcode1, postcode2 } = req.query;
  const apiKey = "AIzaSyBbPwrO-qqKuCxf74_GFy6m-vm9NDzGLzA"; // Replace with your actual API key

  // Function to calculate the Haversine distance between two points
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
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
  };

  try {
    // Get coordinates for both postcodes
    const getCoordinates = async (postcode) => {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${apiKey}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
      } else {
        throw new Error("Geocoding failed");
      }
    };

    const [coords1, coords2] = await Promise.all([
      getCoordinates(postcode1),
      getCoordinates(postcode2),
    ]);

    // Calculate distance using the Haversine formula
    const distance = haversineDistance(
      coords1.latitude,
      coords1.longitude,
      coords2.latitude,
      coords2.longitude
    );

    res.status(200).json({ distance });
  } catch (error) {
    console.error("Error calculating distance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
