/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import styles from './ViewCustomers.module.css';
import { apiUrl } from '../../../config/config';

function generateClassName(baseClassName: string, index: number) {
  return `${baseClassName}-${index + 2601}`;
}

function App({
  customers,
  incrementPage,
  decrementPage,
  changePage,
  maxPage,
}: any) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  // const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const openModal = async (e: any) => {
    const customerId = e.target.parentNode.id;
    // const rect = e.target.getBoundingClientRect();
    // const top = rect.top + window.scrollY;
    // const left = rect.left + window.scrollX;
    await setSelectedCustomerId(customerId);
    // console.log(selectedCustomerId);
    // setModalPosition({ top, left });
    // console.log(modalPosition);
    if (showModal) {
      return setShowModal(false);
    }
    return setShowModal(true);
    // console.log(showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdate = () => {
    if (selectedCustomerId) {
      navigate(`/customers/update/${selectedCustomerId}`);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (selectedCustomerId)
      try {
        const token = document.cookie.split('=')[1];
        const response = await axios.delete(
          `${apiUrl}/adire/customer/deletecustomer/${selectedCustomerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);
        closeModal();
        window.location.reload();
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
  };
  const maxLength = 18;
  const maxLength2 = 20;
  return (
    <div className={styles['all-customers']}>
      <div className={styles['frame-2492']}>
        <div className={styles['rectangle-2051']} />
        <div className={styles['frame-2493']}>
          <div className={styles['rectangle-2052']} />
          <div className={styles['frame-2491']}>
            <div className={styles['name-of-customer']}>Name of customer</div>
            <div className={styles.address}>Address</div>
            <div className={styles['phone-number']}>Phone Number</div>
            <div className={styles['number-of-orders']}>Number of Orders</div>
            <div className={styles.action}>Action</div>
          </div>
        </div>
        {customers.customers.map((customer: any, index: any) => (
          <div
            key={index}
            className={styles[generateClassName('frame', index)]}
          >
            {customer.Name.length > maxLength2 ? (
              <div className={styles['kelechi-chibuzor']}>
                {customer.Name.slice(0, maxLength2)}...
              </div>
            ) : (
              <div className={styles['kelechi-chibuzor']}>{customer.Name}</div>
            )}
            {customer.Address.length > maxLength ? (
              <div className={styles['_32-simbi-street-ojo']}>
                {customer.Address.slice(0, maxLength)}...
              </div>
            ) : (
              <div className={styles['_32-simbi-street-ojo']}>
                {customer.Address}
              </div>
            )}
            <div className={styles['_10']}>{customer.Orders.length}</div>
            <div className={styles['_07089675544']}>{customer.PhoneNumber}</div>
            <button type="button" id={customer._id} onClick={openModal}>
              <svg
                className={styles['dots-horizontal']}
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
          </div>
        ))}
        {showModal && (
          <div
            className={styles['rectangle-311']}
            // style={{
            //   top: `${modalPosition.top}px`,
            //   left: `${modalPosition.left}px`,
            // }}
          >
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
      <a href="/customers" className={styles['frame-16484']}>
        <div className={styles.text}>Create Customer</div>
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
      <div className={styles['frame-16477']}>
        <div className={styles['frame-16474']}>
          <div className={styles.customers}>Customers</div>
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
