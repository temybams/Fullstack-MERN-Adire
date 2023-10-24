import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useQuery } from 'react-query';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import Dashboard from '../components/Dashboard/dashboard';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';
import { apiUrl, clientUrl } from '../config/config';

function DashboardScreen() {
  const params = new URLSearchParams(window.location.search);
  const ciphertext = params.get('page');
  if (ciphertext) {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, 'AdireGroup1GoogleToken');
      const googleToken = bytes.toString(CryptoJS.enc.Utf8);
      if (googleToken) {
        document.cookie = '';
        document.cookie = `token=${googleToken}`;
        localStorage.clear();
        window.location.href = `${clientUrl}/dashboard`;
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
    }
  }
  const fetchUserData = async () => {
    if (ciphertext) {
      window.location.href = `${clientUrl}/dashboard`;
    }
    const token = document.cookie.split('=')[1];
    const response = await axios.get(`${apiUrl}/adire/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    'userData',
    fetchUserData
  );
  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <Dashboard userData={data} />
        </Container>
        <Sidebar />
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    if ((error as any).response.status === 401) {
      window.location.href = `${clientUrl}/login`;
    } else if ((error as any).response.status === 403) {
      window.location.href = `${clientUrl}/forbidden`;
    } else return <ServerError />;
  }
}

export default DashboardScreen;
