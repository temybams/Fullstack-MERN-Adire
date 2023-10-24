import axios from 'axios';
import { useEffect } from 'react';
import Footer from '../components/Home/footer/Footer';
import Navbar from '../components/Home/navbar/Navbar';
import Body from '../components/Home/body/Body';
import { apiUrl } from '../config/config';
// import '../components/Home/App.css';

const HomeScreen = function HomeScreen() {
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
  return (
    <div>
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
};

export default HomeScreen;
