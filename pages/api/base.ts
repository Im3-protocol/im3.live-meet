import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://cloud.im3.live',
});
