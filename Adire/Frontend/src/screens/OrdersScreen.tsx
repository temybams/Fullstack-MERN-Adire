import axios from 'axios';
import { useState } from 'react';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import Order from '../components/Orders/Add-Order/AddOrder';
import { apiUrl } from '../config/config';
import Loader from '../components/Reusable-Components/Loader/Loader';

function OrdersScreen() {
  const token = document.cookie.split('=')[1];
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/adire/user/authcheck`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setData(true);
      }
    } catch (err) {
      setError(true);
    }
  };
  fetchData();
  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <Order />
        </Container>
        <Sidebar />
      </div>
    );
  }
  if (error) {
    return <div>No auth</div>;
  }

  return <Loader />;
}

export default OrdersScreen;
