import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5123",
  headers: {
    "Content-Type": "application/json",
    Platform: "web",
  },
  responseType: "json",
});

export { API };
