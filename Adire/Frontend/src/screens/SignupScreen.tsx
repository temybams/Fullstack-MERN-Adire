import axios from 'axios';
import { useEffect } from 'react';
import App from '../components/Signup/signup';
import { apiUrl } from '../config/config';

const SignupScreen = function SignupScreen() {
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

export default SignupScreen;
