import axios from 'axios'

export default ({
  $config
}) => {
  axios.defaults.baseURL = $config.baseURL;
  console.log(axios.defaults.baseURL);
}
