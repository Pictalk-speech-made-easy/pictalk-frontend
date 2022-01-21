import Vue from 'vue';
import axios from 'axios';

export default function (context) {
  axios.interceptors.request.use((config) => {
    if (process.client && !config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
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
  /*
axios.interceptors.response.use((response) => {
  // If err 401 redirect to homepage with notifications
  return response;
}, async (error) => {
  if (error.response?.status == 401) {
    await context.store.dispatch("logout");
    context.store.commit('editUser', {});
    context.redirect('/');
    return Promise.reject(error);
  }
});*/
}


//Vue.use(axios);
