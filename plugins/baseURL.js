import axios from 'axios'

export default ({
  $config
}) => {
  console.log($config.baseURL);
  console.log($config.httpURL);
  console.log($config.httpsURL);
  axios.defaults.baseURL = $config.baseURL;
  console.log(axios.defaults.baseURL);
}
