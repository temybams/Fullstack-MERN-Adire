import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import App from '../components/Receipts/SingleReceipt/SignleReceipt';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';
import { apiUrl, clientUrl } from '../config/config';

function ReceiptScreen() {
  const navigate = useNavigate();
  const { id } = useParams<any>();
  const fetchReceipt = async () => {
    const response = await axios.get(`${apiUrl}/adire/order/getreceipt/${id}`);
    return response.data.data;
  };

  const { data, isLoading, isError, error } = useQuery('receipt', fetchReceipt);
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
      navigate(`${clientUrl}/login`);
    } else if ((error as any).response.status === 403) {
      navigate(`${clientUrl}/forbidden`);
    } else return <ServerError />;
  }
}

export default ReceiptScreen;
