import axios from 'axios'

export default ({
  $config
}) => {
  console.log($config.baseURL);
  axios.defaults.baseURL = $config.baseURL;
  console.log(axios.defaults.baseURL);
}
