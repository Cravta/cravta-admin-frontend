// axiosInstance.js
import axios from 'axios';
// import {useDispatch} from 'react-redux';


// const dispatch = useDispatch();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      config.headers['Content-Type']="application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const addAuthInterceptor = (navigate) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // navigate('/token-refreshing');
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );


          const newToken = res.data.token;
          console.log(res);
          
          setAccessToken(newToken);
          localStorage.setItem('token', newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);

        } catch (refreshError) {
            // if(localStorage.getItem('token') ) {
            //     toast.error("Session Expired, Login Failed!")
            // }
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
