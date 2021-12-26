import Vue from 'vue';
import axios from 'axios';

export default function (context) {
  axios.interceptors.request.use((config) => {

      if (process.client && ) {
        let token = localStorage.getItem('token');

        if (token) {
          config.headers['Authorization'] = `Bearer ${ token }`;
        }


      }
      return config;
    },

    (error) => {
      return Promise.reject(error);
    });
}


//Vue.use(axios);
