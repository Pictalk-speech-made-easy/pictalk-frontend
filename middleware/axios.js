import axios from 'axios';
export default function (context) {
  axios.interceptors.request.use((config) => {
    if (!config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com') && !config.url.includes('donations-api.pictalk.org') && !config.url.includes('stripe.com') && !config.url.includes('ipify.org')) {
      let token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
    (error) => {
      return Promise.reject(error);
    });
}