/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from 'react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import App from '../components/Customers/View-Customers/ViewCustomers';
import { apiUrl, clientUrl } from '../config/config';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';

function CustomersScreen() {
  const [childData, setChildData] = useState('');
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>();

  const receiveDataFromChild = (data: string) => {
    setChildData(data);
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

  const fetchCustomersData = async () => {
    const token = document.cookie.split('=')[1];
    const response = await axios.get(
      `${apiUrl}/adire/customer/getcustomers?page=${pageNumber}&query=${childData}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMaxPage(response.data.totalPages);
    return response.data;
  };
  useEffect(() => {
    fetchCustomersData();
  }, [pageNumber, childData]);

  const { data, isLoading, isError, error } = useQuery(
    ['customersData', pageNumber, childData],
    () => fetchCustomersData(),
    {
      keepPreviousData: true,
    }
  );

  if (data) {
    return (
      <div>
        <Navbar receiveDataFromChild={receiveDataFromChild} />
        <Container>
          <App
            customers={data}
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
      window.location.href = `${clientUrl}/login`;
    } else if ((error as any).response.status === 403) {
      window.location.href = `${clientUrl}/forbidden`;
    } else return <ServerError />;
  }
}

export default CustomersScreen;
