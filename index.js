const axios = require("axios");

exports.handler = async (event) => {
  try {
    const data = {
      coordinates: event.coordinates,
    };
    console.log("data: ", data);

    const route = await calculateRoute(data);
    console.log("Route calculated:", route);

    return {
      statusCode: 200,
      data: route,
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: "Failed to calculate route.",
    };
  }
};

async function calculateRoute(data) {
  try {
    let startLocation = data.coordinates[0];
    let unvisitedLocations = [...data.coordinates];
    let route = [];
    let addressesMap = new Map();

    while (unvisitedLocations.length > 0) {
      let nearestLocation = null;
      let shortestDistance = Infinity;
      let shortestDistanceText = null;

      for (const location of unvisitedLocations) {
        const distanceData = await calculateDistance(
          startLocation,
          location,
          addressesMap
        );

        const distanceInMeters = distanceData.distanceInMeters;
        const distanceText = distanceData.distance;

        if (distanceInMeters < shortestDistance) {
          shortestDistance = distanceInMeters;
          nearestLocation = location;
          shortestDistanceText = distanceText;
        }
      }

      if (nearestLocation) {
        nearestLocation.originAddress = addressesMap.get(
          `${nearestLocation.lat},${nearestLocation.lng}`
        );
        nearestLocation.shortestDistanceText = shortestDistanceText;
        route.push(nearestLocation);
        unvisitedLocations = unvisitedLocations.filter(
          (loc) =>
            loc.lat !== nearestLocation.lat || loc.lng !== nearestLocation.lng
        );
        startLocation = {
          lat: nearestLocation.lat,
          lng: nearestLocation.lng,
        };
      } else {
        throw new Error("Failed to find the nearest location.");
      }
    }

    return route;
  } catch (error) {
    console.error("Error calculating route:", error);
    throw error;
  }
}

async function calculateDistance(source, destination, addressesMap) {
  try {
    const apiKey = "AIzaSyAg1jbL4bRBmiqWx5ZQImooTyRSMQTOtcs";
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.lat},${source.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    if (response.data.status === "OK") {
      const distance = response.data.rows[0]?.elements[0]?.distance?.text;
      const duration = response.data.rows[0]?.elements[0]?.duration?.text;
      const originAddresses = response.data.origin_addresses[0];
      const destinationAddresses = response.data.destination_addresses[0];

      const sourceKey = `${source.lat},${source.lng}`;
      const destKey = `${destination.lat},${destination.lng}`;
      if (!addressesMap.has(sourceKey)) {
        addressesMap.set(sourceKey, originAddresses);
      }
      if (!addressesMap.has(destKey)) {
        addressesMap.set(destKey, destinationAddresses);
      }

      const distanceInMeters =
        response.data.rows[0]?.elements[0]?.distance?.value;

      return {
        distance,
        distanceInMeters,
        duration,
      };
    } else {
      throw new Error(
        "Failed to calculate route. Please check coordinates and API key."
      );
    }
  } catch (error) {
    console.error("Error calculating route:", error);
    throw error;
  }
}
