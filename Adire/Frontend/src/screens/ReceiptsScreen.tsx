/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Receipts from '../components/Receipts/View-Receipts/AllReceipts';
import Container from '../components/Reusable-Components/Container/Container';
import { apiUrl, clientUrl } from '../config/config';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';

function ReceiptScreen() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>();

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
    const token = document.cookie.split('=')[1];
    const response = await axios.get(
      `${apiUrl}/adire/order/getreceipts?page=${pageNumber}`,
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
  }, [pageNumber]);

  const { data, isLoading, isError, error } = useQuery(
    ['receipts', pageNumber],
    () => fetchOrdersData('receipts'),
    {
      keepPreviousData: true,
    }
  );
  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <Receipts
            receiptData2={data}
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

export default ReceiptScreen;
