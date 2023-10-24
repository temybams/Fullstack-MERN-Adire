/* eslint-disable react/jsx-boolean-value */
import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './App.module.css';
import Adire from './Adire.png';
import { apiUrl, clientUrl } from '../../../config/config';

interface User {
  Name: string;
  ProfilePhoto: string;
}

function Navbar({ receiveDataFromChild }: any) {
  let isCustomersPage = false;
  if (
    window.location.href.startsWith(`${clientUrl}/order/allorders`) ||
    window.location.href.startsWith(`${clientUrl}/customers/viewcustomers`)
  ) {
    isCustomersPage = true;
  }

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: '320px',
      height: '48px',
      top: '24px',
      background: 'var(--grey-50, #f9fafb)',
      borderRadius: '4px',
      font: 'var(--body-1-regular, 400 16px/150%, sans-serif)',
    }),
    value: (provided: any) => ({
      ...provided,
      font: 'var(--button-normal-14, 400 14px/20px "Inter", sans-serif)',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      font: 'var(--button-normal-14, 400 14px/20px "Inter", sans-serif)',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      display: 'none',
      color: 'var(--grey-600, #374151)',
    }),
    option: (provided: any) => ({
      ...provided,
      font: 'var(--button-normal-14, 400 14px/20px "Inter", sans-serif)',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      font: 'var(--button-normal-14, 400 14px/20px "Inter", sans-serif)',
    }),
    // menu: (provided: any) => ({
    //   ...provided,
    //   zIndex: 100000000,
    //   overflow: 'visible', // Allow the dropdown to overflow
    // }),
  };

  const [userData, setUserData] = useState<User | null>(null);
  const fetchData = async () => {
    try {
      const token = document.cookie.split('=')[1];
      const response = await axios.get(`${apiUrl}/adire/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (window.location.href.startsWith(`${clientUrl}/dashboard`)) {
      fetchData();
    }
  }, [userData]);

  const localStorageName = localStorage.getItem('Name');
  const localStorageProfilePhoto = localStorage.getItem('ProfilePhoto');

  if (userData && !localStorageName && !localStorageProfilePhoto) {
    localStorage.setItem('Name', userData?.Name);
    localStorage.setItem('ProfilePhoto', userData?.ProfilePhoto);
  }

  const Name = localStorageName;
  const ProfilePhoto = localStorageProfilePhoto;
  const profilePhotoUrl = ProfilePhoto ? `${ProfilePhoto}` : Adire;
  const token = document.cookie.split('=')[1];
  const [query, setQuery] = useState('');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const handleSelectChange = async (selectedOption: any) => {
    if (selectedOption === null) {
      receiveDataFromChild(''); // Replace with the appropriate value you want to pass when cleared
    } else {
      await setSelectedCustomer(selectedOption.label);
      receiveDataFromChild(selectedOption.label);
    }
  };
  const handleChange = (newValue: any) => {
    setQuery(newValue);
    fetch(`${apiUrl}/adire/order/searchcustomer?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((customer: any) => ({
          label: customer[0],
          value: customer[1],
        }));
        setCustomerOptions(options);
      })
      .catch((error) => {
        console.error(error);
        console.error(selectedCustomer);
      });
  };

  return (
    <div className={styles['frame-user']}>
      <div className={styles['rectangle-user']} />
      <div className={styles['frame-username']}>
        <div className={styles.profile}>
          <img className={styles['profile-21']} src={profilePhotoUrl} alt="" />
          <div className={styles['hi-somto']}>
            {`Hi, ${Name ? Name.split(' ')[0] : ''}`}
          </div>
        </div>
      </div>
      {isCustomersPage ? (
        <div style={{ position: 'absolute' }}>
          <Select
            options={customerOptions}
            onChange={handleSelectChange}
            onInputChange={handleChange}
            placeholder="Search"
            isClearable={true}
            styles={customStyles}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Navbar;
