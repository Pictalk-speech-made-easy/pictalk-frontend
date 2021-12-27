import Vue from 'vue';
import axios from 'axios';

export default function (context) {
  axios.interceptors.request.use((config) => {
    if (process.client && !config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
      let token = localStorage.getItem('token');
      if (token) {
        console.log("Putting Auth header in request");
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },

    (error) => {
      return Promise.reject(error);
    });
}


//Vue.use(axios);
