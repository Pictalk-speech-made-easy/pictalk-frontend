import axios from 'axios';
export default function (context) {
  axios.interceptors.request.use(async (config) => {
    console.log("Intercepting axios request")
    if (!config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
      console.log("Getting token from keycloak");
      console.log(context.$keycloak?.token)
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