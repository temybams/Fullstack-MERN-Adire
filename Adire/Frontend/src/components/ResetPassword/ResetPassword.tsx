/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unknown-property */
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { apiUrl } from '../../config/config';
import styles from './ResetPassword.module.css';

const validationSchema = Yup.object().shape({
  Password: Yup.string().required('Password is required'),
  ConfirmPassword: Yup.string()
    .required('Confrim Password is required')
    .min(6, 'Confirm Password must be at least 6 characters long')
    .oneOf([Yup.ref('Password')], 'Passwords must match'),
});

const isDisabledSchema = Yup.object().shape({
  Password: Yup.string().required('Password is required'),
  ConfirmPassword: Yup.string().required('Confrim Password is required'),
});

function App() {
  const { token } = useParams<{ token: string }>();
  const initialFormData = {
    Password: '',
    ConfirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetPassword = async (formData: any) => {
    const response = await axios.patch(
      `${apiUrl}/adire/user/resetpassword/${token}`,
      formData
    );
    return response.data;
  };

  const { mutate, isLoading } = useMutation(resetPassword, {
    onSuccess: () => {
      toast.success("Password reset successful, you'll be redirected to login");
      window.setTimeout(() => {
        window.location.href = '/login';
      }, 5000);
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
    console.log(formData);
    try {
      isDisabledSchema.validateSync(formData, { abortEarly: false });
      return false;
    } catch (error) {
      return true;
    }
  };
  return (
    <div className={styles.body}>
      <div className={styles.adire}>
        <h2 className={styles.adiretext}>Adire</h2>
        <div className={styles.adiredot} />
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.resetpassword}>
          <h3 className={styles.header}> Reset Password</h3>
          <p className={styles.paragraph1}>New Password</p>
          <div className={styles.passwordcontainer}>
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
          <p className={styles.paragraph1}>Confrim Password</p>
          <div className={styles.passwordcontainer}>
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
              type="password"
              id="ConfirmPassword"
              name="ConfirmPassword"
              placeholder="Enter your password"
              value={formData.ConfirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || isSubmitDisabled()}
            onClick={handleSubmit}
            className={styles.button}
          >
            {isLoading ? (
              <p className={styles.paragraph2}>Sending Email ....</p>
            ) : (
              <p className={styles.paragraph2}>Reset Password</p>
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
