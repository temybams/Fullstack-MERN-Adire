import axios from 'axios';
import { useEffect } from 'react';
import App from '../components/Login/login';
import { apiUrl } from '../config/config';

const AboutScreen = function AboutScreen() {
  const startServer = async () => {
    try {
      await axios.get(apiUrl);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    startServer();
  }, []);
  return <App />;
};

export default AboutScreen;
