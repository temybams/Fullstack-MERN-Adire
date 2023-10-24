import axios from 'axios';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import UpdatePage from '../components/Orders/UpdatePage/UpdatePage';
import { apiUrl, clientUrl } from '../config/config';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';

const token = document.cookie.split('=')[1];
function OrdersScreen() {
  const { id1 } = useParams<any>();
  const fetchOrderData = async () => {
    const response = await axios.get(`${apiUrl}/adire/order/getorder/${id1}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    'orderData',
    fetchOrderData
  );
  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <UpdatePage order={data} />
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

export default OrdersScreen;
