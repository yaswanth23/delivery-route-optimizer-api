const axios = require("axios");

exports.handler = async (event) => {
  try {
    const LOCATIONS = [
      {
        name: "MG Road, Bangalore",
        coordinates: {
          lat: 12.9758,
          lng: 77.6045,
        },
      },
      {
        name: "Koramangala, Bangalore",
        coordinates: {
          lat: 12.9352,
          lng: 77.6245,
        },
      },
      {
        name: "Indiranagar, Bangalore",
        coordinates: {
          lat: 12.9784,
          lng: 77.6408,
        },
      },
      {
        name: "Whitefield, Bangalore",
        coordinates: {
          lat: 12.9698,
          lng: 77.7499,
        },
      },
      {
        name: "Jayanagar, Bangalore",
        coordinates: {
          lat: 12.9308,
          lng: 77.5838,
        },
      },
      {
        name: "Electronic City, Bangalore",
        coordinates: {
          lat: 12.8456,
          lng: 77.6603,
        },
      },
      {
        name: "Yelahanka, Bangalore",
        coordinates: {
          lat: 13.1007,
          lng: 77.5963,
        },
      },
      {
        name: "Malleshwaram, Bangalore",
        coordinates: {
          lat: 13.0068,
          lng: 77.5692,
        },
      },
      {
        name: "Bannerghatta Road, Bangalore",
        coordinates: {
          lat: 12.8876,
          lng: 77.597,
        },
      },
      {
        name: "Hebbal, Bangalore",
        coordinates: {
          lat: 13.0359,
          lng: 77.597,
        },
      },
    ];

    const data = {
      startLocation: event.startLocation,
    };
    console.log("data: ", data);

    let findlocation = LOCATIONS.find(
      (location) =>
        location.coordinates.lat === data.startLocation.lat &&
        location.coordinates.lng === data.startLocation.lng
    );

    if (!findlocation) {
      return {
        statusCode: 500,
        error: "Start location not found in the provided locations.",
      };
    }

    const route = await calculateRoute(data, LOCATIONS);
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

async function calculateRoute(data, LOCATIONS) {
  try {
    let startLocation = data.startLocation;
    let unvisitedLocations = [...LOCATIONS];
    let route = [];

    while (unvisitedLocations.length > 0) {
      let nearestLocation = null;
      let shortestDistance = Infinity;
      let shortestDistanceText = null;

      for (const location of unvisitedLocations) {
        const distanceData = await calculateDistance(
          startLocation,
          location.coordinates
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
        nearestLocation.shortestDistanceText = shortestDistanceText;
        route.push(nearestLocation);
        unvisitedLocations = unvisitedLocations.filter(
          (loc) => loc !== nearestLocation
        );
        startLocation = nearestLocation.coordinates;
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

async function calculateDistance(source, destination) {
  try {
    const apiKey = "AIzaSyAg1jbL4bRBmiqWx5ZQImooTyRSMQTOtcs";
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.lat},${source.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    if (response.data.status === "OK") {
      const distance = response.data.rows[0]?.elements[0]?.distance?.text;
      const duration = response.data.rows[0]?.elements[0]?.duration?.text;

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
