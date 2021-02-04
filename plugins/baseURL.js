import axios from 'axios'

export default ({
  $config
}) => {
  axios.defaults.baseURL = $config.baseURL;
}
