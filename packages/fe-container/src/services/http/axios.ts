import axios, {AxiosRequestConfig} from "axios";

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig);

export default axiosInstance;
