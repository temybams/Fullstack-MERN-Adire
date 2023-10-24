/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unknown-property */
// /* eslint-disable jsx-a11y/label-has-associated-control */
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import { apiUrl } from '../../config/config';
import 'react-toastify/dist/ReactToastify.css';
import styles from './signup.module.css'; // Import the CSS module

const validationSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Email: Yup.string()
    .email('Email is invalid')
    .required('Email is required')
    .trim(),
  PhoneNumber: Yup.string()
    .matches(
      /^(\+?(\d{1,3}))?([-. ])?(\()?\d{3}(\))?([- ])?\d{3}([- ])?\d{4}$/,
      'Invalid phone number format'
    )
    .trim()
    .min(11, 'Phone number must be at least 11 characters')
    .max(14, 'Phone number must not exceed 14 characters'),
  Password: Yup.string().required('Password is required').min(6),
});

const isDisabledSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Email: Yup.string().required('Email is required'),
  PhoneNumber: Yup.string().required('Phone number is required'),
  Password: Yup.string().required('Password is required'),
});

const signupUser = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/adire/user/signup`, formData);
  return response.data;
};

// const googleSSOMutation = async () => {
//   window.location.href = `${apiUrl}/auth/google`;
// };

const App = () => {
  const navigate = useNavigate();
  const [isLoading2, setisSignUpDisabled] = useState(false);
  const initialFormData = {
    Name: '',
    Password: '',
    PhoneNumber: '',
    Email: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const { mutate, isLoading } = useMutation(signupUser, {
    onSuccess: () => {
      toast.success('Token sent to email!, please check your email and verify');
      window.setTimeout(() => {
        navigate('/login');
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
    onSettled: () => {
      setisSignUpDisabled(false);
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
          setisSignUpDisabled(true);

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
          <h3 className={styles.header}> Create your account</h3>
          <p className={styles.paragraph1}>Full Name</p>
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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.99993 9.99998C7.78293 9.99998 5.98093 8.20599 5.98093 5.99998C5.98093 3.79398 7.78293 1.99998 9.99993 1.99998C12.2169 1.99998 14.0189 3.79398 14.0189 5.99998C14.0189 8.20599 12.2169 9.99998 9.99993 9.99998ZM13.7759 10.673C14.6022 10.015 15.2394 9.14995 15.6227 8.16576C16.0059 7.18156 16.1216 6.11336 15.9579 5.06993C15.5609 2.44693 13.3689 0.347977 10.7219 0.0419769C7.06993 -0.381023 3.97193 2.44898 3.97193 5.99998C3.97193 7.88998 4.85193 9.57396 6.22393 10.673C2.85193 11.934 0.389927 14.895 0.00392716 18.891C-0.00956888 19.0311 0.00633118 19.1726 0.0506038 19.3063C0.0948764 19.4399 0.166551 19.5628 0.261045 19.6672C0.355539 19.7716 0.470772 19.855 0.599379 19.9123C0.727985 19.9696 0.867137 19.9995 1.00793 20C1.25473 20.002 1.49336 19.9118 1.67705 19.7469C1.86075 19.5821 1.97626 19.3546 2.00093 19.109C2.40393 14.646 5.83693 12 9.99993 12C14.1629 12 17.5959 14.646 17.9989 19.109C18.0236 19.3546 18.1391 19.5821 18.3228 19.7469C18.5065 19.9118 18.7451 20.002 18.9919 20C19.5879 20 20.0519 19.482 19.9949 18.891C19.6099 14.895 17.1479 11.934 13.7749 10.673"
                fill="#98A2B3"
              />
            </svg>
            <input
              type="text"
              id="name"
              name="Name"
              placeholder="Type your full name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </div>
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
              placeholder="Type your email"
              value={formData.Email}
              onChange={handleInputChange}
              required
            />
          </div>
          <p className={styles.paragraph1}>Phone Number</p>
          <div className={styles.logincontainer}>
            <svg
              className={styles['phone-alt']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.26354 10.6056L6.79571 7.57219C7.05237 7.2422 7.18071 7.07719 7.24796 6.89214C7.30747 6.7284 7.33209 6.55402 7.32024 6.3802C7.30685 6.18376 7.22922 5.98968 7.07396 5.60152L6.48171 4.12091C6.25194 3.54648 6.13706 3.25927 5.93887 3.07101C5.76423 2.90512 5.54538 2.79322 5.30865 2.74877C5.04 2.69833 4.73989 2.77335 4.13969 2.9234L2.50024 3.33332C2.50024 11.6667 8.33332 17.5 16.6669 17.5L17.0766 15.8603C17.2266 15.2601 17.3017 14.96 17.2512 14.6914C17.2068 14.4546 17.0949 14.2358 16.929 14.0611C16.7407 13.8629 16.4535 13.7481 15.8791 13.5183L14.5578 12.9898C14.115 12.8126 13.8936 12.7241 13.6728 12.7173C13.4777 12.7113 13.2839 12.7511 13.1069 12.8334C12.9067 12.9266 12.7381 13.0953 12.4008 13.4325L9.82886 15.964"
                stroke="#98A2B3"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              type="text"
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder="Enter phone number"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <p className={styles.paragraph1}>Password</p>
          <div className={styles.logincontainer2}>
            <svg
              className={styles.lock}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1667 8.33333V6.66667C14.1667 4.36548 12.3012 2.5 10 2.5C7.69885 2.5 5.83337 4.36548 5.83337 6.66667V8.33333M7.33337 17.5H12.6667C14.0668 17.5 14.7669 17.5 15.3017 17.2275C15.7721 16.9878 16.1545 16.6054 16.3942 16.135C16.6667 15.6002 16.6667 14.9001 16.6667 13.5V12.3333C16.6667 10.9332 16.6667 10.2331 16.3942 9.69836C16.1545 9.22795 15.7721 8.8455 15.3017 8.60582C14.7669 8.33333 14.0668 8.33333 12.6667 8.33333H7.33337C5.93324 8.33333 5.23318 8.33333 4.6984 8.60582C4.22799 8.8455 3.84554 9.22795 3.60586 9.69836C3.33337 10.2331 3.33337 10.9332 3.33337 12.3333V13.5C3.33337 14.9001 3.33337 15.6002 3.60586 16.135C3.84554 16.6054 4.22799 16.9878 4.6984 17.2275C5.23318 17.5 5.93324 17.5 7.33337 17.5Z"
                stroke="#98A2B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
          <button
            onClick={handleSubmit}
            className={styles.button}
            type="submit"
            disabled={isSubmitDisabled() || isLoading}
          >
            {isLoading ? (
              <p className={styles.paragraph2}> Signing up .... </p>
            ) : (
              <p className={styles.paragraph2}> Sign Up </p>
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
            Already have an account?{' '}
            <Link className={styles.linkstyle} to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
