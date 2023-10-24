/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import AllOrder from '../components/Orders/All-orders/AllOrders';
import { apiUrl, clientUrl } from '../config/config';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';
import Loader from '../components/Reusable-Components/Loader/Loader';

function AllOrderScreen() {
  const [childData, setChildData] = useState('');
  const [childData2, setChildData2] = useState('');
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>();

  const receiveDataFromChild = (data: string) => {
    setChildData(data);
  };

  const receiveDataFromChild2 = (data: string) => {
    setChildData2(data);
  };

  useEffect(() => {}, [pageNumber]);
  const incrementPage = async () => {
    if (pageNumber < maxPage!) {
      await setPageNumber((p) => p + 1);
      navigate(`?page=${pageNumber}`);
    }
  };

  const decrementPage = async () => {
    if (pageNumber > 1) {
      await setPageNumber((p) => p - 1);
      navigate(`?page=${pageNumber}`);
    }
  };

  const changePage = async (page: number) => {
    await setPageNumber(page);
    navigate(`?page=${pageNumber}`);
  };

  useEffect(() => {}, [pageNumber]);

  const fetchOrdersData = async (_key: any) => {
    let sort = '';
    let status = '';
    if (childData2 === 'Oldest') {
      sort = 'Oldest';
    } else if (childData2 === 'Newest') {
      sort = 'Newest';
    } else status = childData2;
    const token = document.cookie.split('=')[1];
    const response = await axios.get(
      `${apiUrl}/adire/order/getorders?page=${pageNumber}&query=${childData}&status=${status}&sort=${sort}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMaxPage(response.data.totalPages);
    return response.data.data;
  };
  useEffect(() => {
    fetchOrdersData(null);
  }, [pageNumber, childData, childData2]);

  const { data, isLoading, isError, error } = useQuery(
    ['ordersData', pageNumber, childData, childData2],
    () => fetchOrdersData('ordersData'),
    {
      keepPreviousData: true,
    }
  );

  if (data) {
    return (
      <div>
        <Navbar receiveDataFromChild={receiveDataFromChild} />
        <Container>
          <AllOrder
            receiveDataFromChild2={receiveDataFromChild2}
            orders={data}
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            changePage={changePage}
            maxPage={maxPage}
          />
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

export default AllOrderScreen;
