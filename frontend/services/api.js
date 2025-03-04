import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example function to get data from Flask
export const fetchData = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default api;
