import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import App from '../components/Customers/Update-customers/UpdateCustomers';
import { apiUrl, clientUrl } from '../config/config';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';

const token = document.cookie.split('=')[1];

function CustomersScreen() {
  const { id } = useParams<any>();
  const fetchCustomerData = async () => {
    const response = await axios.get(
      `${apiUrl}/adire/customer/getcustomer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.customer;
  };
  const { data, isLoading, isError, error } = useQuery(
    'customerData',
    fetchCustomerData
  );

  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <App data={data} />
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

export default CustomersScreen;
