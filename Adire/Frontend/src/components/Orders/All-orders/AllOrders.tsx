/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { apiUrl } from '../../../config/config';
import styles from './AllOrders.module.css';

function generateClassName(baseClassName: string, index: number) {
  return `${baseClassName}-${index + 2601}`;
}

function App({
  receiveDataFromChild2,
  orders,
  incrementPage,
  decrementPage,
  changePage,
  maxPage,
}: any) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId0, setSelectedOrderId] = useState(null);
  const openModal = async (e: any) => {
    setShowModal(false);
    const orderId = e.target.parentNode.id || e.target.id;
    await setSelectedOrderId(orderId);
    if (showModal) {
      return setShowModal(false);
    }
    return setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleUpdate = () => {
    if (selectedOrderId0) {
      navigate(`/orders/update/${selectedOrderId0}`);
      closeModal();
    }
  };

  const handleGenerateReceipt = async (e: any) => {
    try {
      const selectedOrderId = e.target.parentNode.id || e.target.id;
      const token = document.cookie.split('=')[1];
      await axios.post(
        `${apiUrl}/adire/user/generatereceipt/${selectedOrderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/others/receipt/${selectedOrderId}`);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (selectedOrderId0)
      try {
        const token = document.cookie.split('=')[1];
        const response = await axios.delete(
          `${apiUrl}/adire/order/deleteorder/${selectedOrderId0}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);
        closeModal();
        window.setTimeout(() => {
          window.location.reload();
        }, 5000);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
  };
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusChange = (e: any) => {
    // console.log('I was called');
    // console.log(e);
    receiveDataFromChild2(e.target.value);

    setSelectedStatus(e.target.value);
  };

  const maxLength = 19;
  const maxLength2 = 20;

  return (
    <div className={styles['all-customers']}>
      {showModal && (
        <div className={styles['rectangle-311']}>
          <div className={styles['frame-16306']}>
            <div className={styles['frame-16305']}>
              <svg
                className={styles['pen-square']}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8329 3.33203H5.99959C5.06617 3.33203 4.59946 3.33203 4.24294 3.51369C3.92934 3.67348 3.67437 3.92844 3.51458 4.24205C3.33292 4.59857 3.33292 5.06528 3.33292 5.9987V13.9987C3.33292 14.9321 3.33292 15.3988 3.51458 15.7553C3.67437 16.069 3.92934 16.3239 4.24294 16.4837C4.59946 16.6654 5.06617 16.6654 5.99959 16.6654H13.9996C14.933 16.6654 15.3997 16.6654 15.7562 16.4837C16.0698 16.3239 16.3248 16.069 16.4846 15.7553C16.6663 15.3988 16.6663 14.9321 16.6663 13.9987V9.9987M8.76587 11.5787L9.86152 11.3622C10.4527 11.2454 10.7483 11.1869 11.024 11.0793C11.2687 10.9838 11.5012 10.8597 11.7167 10.7096C11.9596 10.5405 12.1726 10.3274 12.5988 9.90129L16.8891 5.61093C17.4618 5.03822 17.4618 4.10967 16.8891 3.53696C16.3164 2.96424 15.3879 2.96424 14.8152 3.53696L10.4515 7.90065C10.0522 8.29996 9.8525 8.49961 9.69126 8.72593C9.54811 8.92685 9.4277 9.14304 9.33226 9.37052C9.22475 9.62678 9.16013 9.90163 9.0309 10.4513L8.76587 11.5787Z"
                  stroke="#5925DC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <button
                type="button"
                onClick={handleUpdate}
                className={styles.edit}
              >
                Edit
              </button>
            </div>
            <div className={styles['frame-16307']}>
              <svg
                className={styles['icon-Delete']}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 7.5V15.8333H6.66666V7.5H13.3333ZM12.0833 2.5H7.91666L7.08333 3.33333H4.16666V5H15.8333V3.33333H12.9167L12.0833 2.5ZM15 5.83333H5V15.8333C5 16.75 5.75 17.5 6.66666 17.5H13.3333C14.25 17.5 15 16.75 15 15.8333V5.83333Z"
                  fill="#5925DC"
                />
              </svg>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.delete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles['frame-2492']}>
        <div className={styles['rectangle-2051']} />
        <div className={styles['frame-2493']}>
          <div className={styles['rectangle-2052']} />
          <div className={styles['frame-2491']}>
            <div className={styles['name-of-customer']}>Name of customer</div>
            <div className={styles['email-address']}> Address</div>
            <div className={styles['phone-number']}>Phone Number</div>
            <div className={styles.status}>Status</div>
            <div className={styles.action}>Receipt</div>
            <div className={styles.receipt}>Action</div>
          </div>
        </div>
        {orders.map((order: any, index: any) => (
          <div
            key={index}
            className={styles[generateClassName('frame', index)]}
          >
            {order.CustomerName.length > maxLength2 ? (
              <div className={styles['kelechi-chibuzor']}>
                {order.CustomerName.slice(0, maxLength2)}...
              </div>
            ) : (
              <div className={styles['kelechi-chibuzor']}>
                {order.CustomerName}
              </div>
            )}
            {order.Address.length > maxLength ? (
              <div className={styles['_32-simbi-street-ojo']}>
                {order.Address.slice(0, maxLength)}...
              </div>
            ) : (
              <div className={styles['_32-simbi-street-ojo']}>
                {order.Address}
              </div>
            )}

            {/* <div className={styles['_10']}>{order.Status}</div> */}
            <div
              className={`${styles['_10']} ${
                order.Status === 'Pending' ? styles.pending : ''
              } ${
                order.Status === 'In Progress' ? styles['in-progress'] : ''
              } ${order.Status === 'Completed' ? styles.completed : ''} ${
                order.Status === 'Cancelled' ? styles.cancelled : ''
              }`}
            >
              {order.Status}
            </div>

            <div className={styles['_07089675544']}>{order.PhoneNumber}</div>
            <button type="button" id={order._id} onClick={openModal}>
              <svg
                className={styles['dots-horizontal8']}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
                  fill="#475467"
                />
                <path
                  d="M19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12Z"
                  fill="#475467"
                />
                <path
                  d="M7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z"
                  fill="#475467"
                />
                <path
                  d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z"
                  stroke="#131A29"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles['my-button']}
              onClick={handleGenerateReceipt}
              id={order._id}
            >
              <div className={styles.text3}>Generate receipt</div>
            </button>
          </div>
        ))}

        <div className={styles.divider} />
        <div className={styles.divider2} />
        <div className={styles.divider3} />
        <div className={styles.divider4} />
        <div className={styles.divider5} />
        <div className={styles.divider6} />
        <div className={styles.divider7} />
      </div>

      <div className={styles['pagination']}>
        <div className={styles['pagination2']}>
          <button
            onClick={decrementPage}
            className={styles['button']}
            type="button"
          >
            <svg
              className={styles['arrow-left']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8334 10.0003H4.16675M4.16675 10.0003L10.0001 15.8337M4.16675 10.0003L10.0001 4.16699"
                stroke="#344054"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className={styles['text']}>Previous</div>
          </button>

          <div className={styles['pagination-numbers']}>
            {[...Array(maxPage)].map((_, index) => (
              <div className={styles['pagination-number-base2']} key={index}>
                <button
                  onClick={() => changePage(index + 1)}
                  className={styles['content']}
                  type="button"
                >
                  <div className={styles['number']}>{index + 1}</div>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={incrementPage}
            className={styles['button']}
            type="button"
          >
            <div className={styles.text}>Next</div>
            <svg
              className={styles['arrow-right']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.16675 10.0003H15.8334M15.8334 10.0003L10.0001 4.16699M15.8334 10.0003L10.0001 15.8337"
                stroke="#344054"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <a href="/orders" className={styles['frame-16484']}>
        <div className={styles.text}>Create Order</div>
        <svg
          className={styles['arrow-right']}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16675 10.0003H15.8334M15.8334 10.0003L10.0001 4.16699M15.8334 10.0003L10.0001 15.8337"
            stroke="#344054"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      {/* <div className={styles['button-default94']}>
        <svg
          className={styles['icon-filter-alt']}
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.33739 5.00004H14.6707L10.4957 10.25L6.33739 5.00004ZM4.04572 4.67504C5.72905 6.83337 8.83739 10.8334 8.83739 10.8334V15.8334C8.83739 16.2917 9.21239 16.6667 9.67072 16.6667H11.3374C11.7957 16.6667 12.1707 16.2917 12.1707 15.8334V10.8334C12.1707 10.8334 15.2707 6.83337 16.9541 4.67504C17.3791 4.12504 16.9874 3.33337 16.2957 3.33337H4.70405C4.01239 3.33337 3.62072 4.12504 4.04572 4.67504Z"
            fill="#757575"
          />
        </svg>

        <div className={styles['text144']}>Filter</div>
      </div> */}

      {/* <div className="filter-container"> */}

      <div className={styles['filter-container']}>
        <div className={styles['button-default94']}>
          <svg
            className={styles['icon-filter-alt']}
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.33739 5.00004H14.6707L10.4957 10.25L6.33739 5.00004ZM4.04572 4.67504C5.72905 6.83337 8.83739 10.8334 8.83739 10.8334V15.8334C8.83739 16.2917 9.21239 16.6667 9.67072 16.6667H11.3374C11.7957 16.6667 12.1707 16.2917 12.1707 15.8334V10.8334C12.1707 10.8334 15.2707 6.83337 16.9541 4.67504C17.3791 4.12504 16.9874 3.33337 16.2957 3.33337H4.70405C4.01239 3.33337 3.62072 4.12504 4.04572 4.67504Z"
              fill="#757575"
            />
          </svg>
          <select
            id="orderStatusFilter"
            value={selectedStatus}
            onChange={handleStatusChange}
            className={styles['custom-select']}
          >
            <option value="">Filter</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* </div> */}
      <div className={styles['frame-16477']}>
        <div className={styles['frame-16474']}>
          <div className={styles.customers}>All Orders</div>
          <div
            className={
              styles['adding-value-to-customers-one-solution-at-a-time']
            }
          >
            Adding value to customers, one solution <br />
            at a time.
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
