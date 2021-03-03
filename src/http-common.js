import axios from "axios";

export default axios.create({
  baseURL: "base_url",
  headers: {
    "Content-type": "application/json"
  }
});

