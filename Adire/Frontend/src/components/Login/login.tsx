/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../config/config';
import styles from './login.module.css'; // Import the SCSS module

const validationSchema = Yup.object().shape({
  Email: Yup.string().email('Invalid email').required('Email is required'),
  Password: Yup.string().required('Password is required'),
});

const isDisabledSchema = Yup.object().shape({
  Email: Yup.string().required('Email is required'),
  Password: Yup.string().required('Password is required'),
});

const loginUser = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/adire/user/signin`, formData);
  return response.data;
};

// const googleSSOMutation = async () => {
//   window.location.href = `${apiUrl}/auth/google`;
// };

const App = () => {
  const navigate = useNavigate();
  const [isLoading2, setisLoginDisabled] = useState(false);
  const initialFormData = {
    Email: '',
    Password: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: (data) => {
      localStorage.clear();
      document.cookie = `token=${data.token}`;
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
    onSettled: () => {
      setisLoginDisabled(false);
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      document.cookie = '';
      await validationSchema.validate(formData, { abortEarly: false });
      mutate(formData);
    } catch (error: any) {
      console.log(error.errors);
      toast.dismiss();
      toast.error(Object.values(error.errors).join('\n'));
    }
  };

  const isSubmitDisabled = () => {
    try {
      isDisabledSchema.validateSync(formData, { abortEarly: false });
      return false;
    } catch (error) {
      return true;
    }
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      localStorage.clear();
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              // Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: 'application/json',
            },
          }
        )
        .then((res) => {
          setisLoginDisabled(true);
          document.cookie = '';
          axios
            .post(`${apiUrl}/auth/google/callback`, res.data)
            .then((res2) => {
              document.cookie = `token=${res2.data.token}`;
              localStorage.clear();
              window.location.href = `/dashboard`;
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log('Login Failed:', error),
  });
  return (
    <div className={styles.body}>
      <div className={styles.adire}>
        <h2 className={styles.adiretext}>Adire</h2>
        <div className={styles.adiredot} />
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.signin}>
          <h3 className={styles.header}> Hi, Welcome back</h3>
          <p className={styles.paragraph1}>Email</p>
          <div className={styles.logincontainer}>
            <svg
              className={styles['mail-alt-1']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.476 6.66666C17.476 6.66666 14.125 10.8333 10 10.8333C5.875 10.8333 2.52399 6.66666 2.52399 6.66666M6.5 15.8333H13.5C14.9001 15.8333 15.6002 15.8333 16.135 15.5608C16.6054 15.3212 16.9878 14.9387 17.2275 14.4683C17.5 13.9335 17.5 13.2335 17.5 11.8333V8.16666C17.5 6.76653 17.5 6.06646 17.2275 5.53168C16.9878 5.06128 16.6054 4.67882 16.135 4.43914C15.6002 4.16666 14.9001 4.16666 13.5 4.16666H6.5C5.09987 4.16666 4.3998 4.16666 3.86502 4.43914C3.39462 4.67882 3.01217 5.06128 2.77248 5.53168C2.5 6.06646 2.5 6.76653 2.5 8.16666V11.8333C2.5 13.2335 2.5 13.9335 2.77248 14.4683C3.01217 14.9387 3.39462 15.3212 3.86502 15.5608C4.3998 15.8333 5.09987 15.8333 6.5 15.8333Z"
                stroke="#98A2B3"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              type="email"
              id="email"
              name="Email"
              placeholder="Enter your email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              title="Please enter your username"
            />
          </div>
          <p className={styles.paragraph1}>Password</p>
          <div className={styles.logincontainer2}>
            <svg
              className={styles['key-alt']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 7.5H12.5083M12.5 12.5C15.2614 12.5 17.5 10.2614 17.5 7.5C17.5 4.73858 15.2614 2.5 12.5 2.5C9.73858 2.5 7.5 4.73858 7.5 7.5C7.5 7.72807 7.51527 7.95256 7.54484 8.17253C7.59348 8.53432 7.6178 8.71521 7.60143 8.82966C7.58438 8.94888 7.56267 9.01312 7.50391 9.11825C7.4475 9.21917 7.34809 9.31857 7.14928 9.51739L2.89052 13.7761C2.7464 13.9203 2.67433 13.9923 2.6228 14.0764C2.57711 14.151 2.54344 14.2323 2.52303 14.3173C2.5 14.4132 2.5 14.5151 2.5 14.719V16.1667C2.5 16.6334 2.5 16.8667 2.59083 17.045C2.67072 17.2018 2.79821 17.3293 2.95501 17.4092C3.13327 17.5 3.36662 17.5 3.83333 17.5H5.28105C5.48487 17.5 5.58679 17.5 5.68269 17.477C5.76772 17.4566 5.84901 17.4229 5.92357 17.3772C6.00767 17.3257 6.07973 17.2536 6.22386 17.1095L10.4826 12.8507C10.6814 12.6519 10.7808 12.5525 10.8818 12.4961C10.9869 12.4373 11.0511 12.4156 11.1703 12.3986C11.2848 12.3822 11.4657 12.4065 11.8275 12.4552C12.0474 12.4847 12.2719 12.5 12.5 12.5Z"
                stroke="#98A2B3"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              type="Password"
              id="Password"
              name="Password"
              placeholder="Enter your password"
              value={formData.Password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Link className={styles.linkstyle} to="/login/forgotpassword">
            Forgot Password?
          </Link>
          <button
            onClick={handleSubmit}
            className={styles.button}
            type="submit"
            disabled={isSubmitDisabled() || isLoading}
          >
            {isLoading ? (
              <p className={styles.paragraph2}>Logging in ....</p>
            ) : (
              <p className={styles.paragraph2}>Login</p>
            )}
          </button>
          <div className={styles.or}>Or</div>
          <button
            type="submit"
            onClick={() => login()}
            className={styles['button-default3']}
            disabled={isLoading}
          >
            <svg
              className={styles.google}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1784_115)">
                <path
                  d="M4.43242 12.0862L3.73625 14.6852L1.19176 14.739C0.431328 13.3286 0 11.7148 0 10C0 8.34176 0.403281 6.77801 1.11812 5.40109H1.11867L3.38398 5.8164L4.37633 8.06812C4.16863 8.67363 4.05543 9.32363 4.05543 10C4.05551 10.7341 4.18848 11.4374 4.43242 12.0862Z"
                  fill="#FBBB00"
                />
                <path
                  d="M19.8253 8.13187C19.9401 8.7368 20 9.36152 20 10C20 10.7159 19.9247 11.4143 19.7813 12.0879C19.2945 14.3802 18.0225 16.3819 16.2605 17.7984L16.2599 17.7978L13.4066 17.6522L13.0028 15.1313C14.172 14.4456 15.0858 13.3725 15.5671 12.0879H10.2198V8.13187H19.8253Z"
                  fill="#518EF8"
                />
                <path
                  d="M16.2599 17.7978L16.2604 17.7984C14.5467 19.1758 12.3698 20 10 20C6.19177 20 2.8808 17.8714 1.19177 14.739L4.43244 12.0863C5.27693 14.3401 7.45111 15.9445 10 15.9445C11.0956 15.9445 12.122 15.6484 13.0027 15.1313L16.2599 17.7978Z"
                  fill="#28B446"
                />
                <path
                  d="M16.383 2.30219L13.1434 4.95437C12.2319 4.38461 11.1544 4.05547 10 4.05547C7.39344 4.05547 5.17859 5.73348 4.37641 8.06812L1.11871 5.40109H1.11816C2.78246 2.1923 6.1352 0 10 0C12.4264 0 14.6511 0.864297 16.383 2.30219Z"
                  fill="#F14336"
                />
              </g>
              <defs>
                /{' '}
                <clipPath id="clip0_1784_115">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {isLoading2 ? (
              <div className={styles.text}>Redirecting...</div>
            ) : (
              <div className={styles.text}>Google</div>
            )}
          </button>
          <div className={styles.account}>
            Don't have an account?{' '}
            <Link className={styles.linkstyle} to="/signup">
              Create account
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
