import axios from "axios";
let adminUrl = "https://tureappapiforreact.onrender.com/api/";
export const baseURL = adminUrl;

let axiosInstance = axios.create({
  baseURL,
});



axiosInstance.interceptors.request.use(
  async function (config) {

    const token = localStorage.getItem("user_token");
    
    if (token) {
      config.headers["x-access-token"] = token; 
    }
    
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axiosInstance;
