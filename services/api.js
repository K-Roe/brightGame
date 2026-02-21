import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  // 10.0.2.2 is the special alias for the Android Emulator to see your PC's localhost
  baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;