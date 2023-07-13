import axios from "axios";

//Travel Advisor API
export const getPlacesDetails = async (type, sw, ne) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          tr_latitude: ne.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
        },
        headers: {
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
          "x-rapidapi-key":
            "b130cfa9c2msh81ead9baead3a52p10faf6jsnf6c4a0dbaf75", //process.env.TRAVEL_ADVISOR_API_KEY,
        },
      }
    );

    return response?.data?.data;
  } catch (error) {
    console.log("getPlacesDetails error: ", error);
  }
};
