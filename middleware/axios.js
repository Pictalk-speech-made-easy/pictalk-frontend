import axios from 'axios';
export default function (context) {
  axios.interceptors.request.use(async (config) => {
    console.log("Intercepting axios request")
    if (!config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
      let token = context.$keycloak?.token;
      if (token) {
        console.log("Setting token in axios interceptor")
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
    (error) => {
      return Promise.reject(error);
    });
}