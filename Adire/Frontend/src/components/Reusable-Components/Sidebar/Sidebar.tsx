/* eslint-disable no-plusplus */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
// eslint-disable-next-line react/no-array-index-key
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import SidebarData from './SidebarData';
import styles from './App.module.css';
import { apiUrl } from '../../../config/config';

const token = document.cookie.split('=')[1];
const logotUser = async () => {
  console.log('token', token);
  const response = await axios.post(
    `${apiUrl}/adire/user/signout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

function clearCookies() {
  // Clear all cookies by setting their expiration date to a past date
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const cookieName = cookie.split('=')[0];
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

function Sidebar() {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(logotUser, {
    onSuccess: () => {
      clearCookies();
      localStorage.clear();
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
  });

  const handleLogOut = () => {
    // googleLogout();
    document.cookie = '';
    mutate();
  };

  const currentPath = window.location.pathname;
  const isLinkActive = (link: string): boolean => {
    if (currentPath.includes(link)) {
      return true;
    }
    if (currentPath === link) {
      return true;
    }
    if (currentPath.startsWith(link.slice(0, 4))) {
      return true;
    }
    if (currentPath.startsWith(`${link}`)) {
      return true;
    }

    return false;
  };

  return (
    <div className="Sidebar">
      <div className="frame-16452">
        <Link to="/" className="adire">
          Adire
        </Link>
        <div className="ellipse-1" />
      </div>

      <div className={styles.textsx}>Overview</div>

      <ul className="SidebarList">
        {SidebarData.map((val: any, key: number) => {
          let { title } = val;

          const isActive = isLinkActive(val.link);
          if (val.link === '/dashboard') {
            if (
              !isActive &&
              !['/customers', '/orders', '/receipts'].some((path) =>
                currentPath.startsWith(path)
              )
            ) {
              title = 'Dashboard';
            }
          }

          if (
            val.link === '/customers' ||
            val.link === '/customers/viewcustomers'
          ) {
            if (
              !isActive &&
              !['/orders', '/dashboard', '/receipts'].some((path) =>
                currentPath.startsWith(path)
              )
            ) {
              title = 'Customers';
            }
          }

          if (val.link === '/orders' || val.link === '/order/allorders') {
            if (
              !isActive &&
              !['/customers', '/dashboard', '/receipts'].some((path) =>
                currentPath.startsWith(path)
              )
            ) {
              title = 'Orders';
            }
          }

          if (val.link === '/orders' || val.link === '/order/allorders') {
            if (!isActive) {
              title = 'Orders';
            }
          }

          return (
            <li
              key={key}
              className="row"
              id={isActive ? 'active' : ''}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{title}</div>
            </li>
          );
        })}
      </ul>

      <div className={styles['frame-16594']}>
        <hr className={styles.hrline} />
        {/* <div className={styles['frame-16489']}>
          <div className={styles.textxx}>Others</div>
        </div> */}
        <Link
          to="/others/receipts"
          className={
            isLinkActive('/others/receipt')
              ? styles['frame-16489-active']
              : styles['frame-16489']
          }
        >
          <div className={styles.textxx}>Others</div>
        </Link>

        <Link
          to="/account/editprofile"
          className={
            isLinkActive('/account') ? styles.textss2active : styles.textss2
          }
        >
          Account Settings
        </Link>
      </div>
      <div className={styles['frame-16450']}>
        <div className="line-34" />
        <div className="frame-16246">
          <div className="frame-16383">
            <svg
              className="icon-logout"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 8L15.59 9.41L17.17 11H9V13H17.17L15.59 14.58L17 16L21 12L17 8ZM5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5Z"
                fill="#5925DC"
              />
            </svg>

            <button
              className="logout"
              onClick={handleLogOut}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Sidebar;
