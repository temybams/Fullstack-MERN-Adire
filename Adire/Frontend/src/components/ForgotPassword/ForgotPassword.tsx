/* eslint-disable react/no-unknown-property */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation } from 'react-query';
import axios from 'axios';
import * as Yup from 'yup';
import { apiUrl } from '../../config/config';
import styles from './ForgotPassword.module.css';

const validationSchema = Yup.object().shape({
  Email: Yup.string().email('Invalid email').required('Email is required'),
});

const isDisabledSchema = Yup.object().shape({
  Email: Yup.string().required('Email is required'),
});

const resetPassword = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/adire/user/forgetpassword`,
    formData
  );
  return response.data;
};

function App() {
  const initialFormData = {
    Email: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { mutate, isLoading } = useMutation(resetPassword, {
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
  });

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
  return (
    <div className={styles.container}>
      <form className={styles.forgotpassword}>
        <h3 className={styles.header}>Forgot Password</h3>
        <p className={styles.paragraph1}>
          Enter the email associated with your account and we`ll send an email
          with the instruction to rest your password{' '}
        </p>
        <p className={styles.paragraph2}>Email</p>
        <div className={styles.emailcontainer}>
          <svg
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
            value={formData.Email}
            required
            onChange={handleInputChange}
            className={styles.emailinput}
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSubmitDisabled()}
          onClick={handleSubmit}
          className={styles.button}
        >
          {isLoading ? (
            <p className={styles.paragraph3}>Sending Email ....</p>
          ) : (
            <p className={styles.paragraph3}>Reset Password</p>
          )}
        </button>
        <Link className={styles.login} to="/login">
          Back to Login
        </Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default App;
