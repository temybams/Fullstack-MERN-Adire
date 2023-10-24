import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
// import * as Yup from 'yup';
import Account from './Rectangle 307.png';
import styles from './ChangePassword.module.css';
import { apiUrl } from '../../../config/config';

// const validationSchema = Yup.object().shape({
//   OldPassword: Yup.string().required('Old Password is required'),
//   Password: Yup.string()
//     .min(8, 'Password must be at least 8 characters')
//     .required('Password is required'),
//   ConfirmPassword: Yup.string()
//     .oneOf([Yup.ref('Password')], 'Passwords must match')
//     .required('Confirm Password is required'),
// });

// const isDisabledSchema = Yup.object().shape({
//   OldPassword: Yup.string().required('Old Password is required'),
//   Password: Yup.string().required('Password is required'),
//   ConfirmPassword: Yup.string().required('Confirm Password is required'),
// });

function App() {
  const initialFormData = {
    Password: '',
    OldPassword: '',
    ConfirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleinputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const token = document.cookie.split('=')[1];
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${apiUrl}/adire/user/changepassword`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error('Error', error.response);
    }
  };

  return (
    <div className={styles['student-dashboard-profile-edit']}>
      <div className={styles['frame-8959']}>
        <Link to="/account/editprofile" className={styles['edit-profile']}>
          Edit Profile
        </Link>
        <Link
          to="/account/changepassword"
          className={styles['change-password']}
        >
          Change Password
        </Link>
      </div>
      <div className={styles['frame-16251']}>
        <div className={styles['frame-8923']}>
          <div className={styles['frame-8923']}>
            <img src={Account} alt="" />
            <div className={styles.account}>Account</div>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <form onSubmit={handleSubmit} className={styles['frame-8958']}>
        <div className={styles['frame-8956']}>
          <div className={styles['change-password2']}>Change Password</div>
        </div>
        <div className={styles['frame-8957']}>
          <div className={styles['frame-8955']}>
            <div className={styles['frame-8857']}>
              <div className={styles.text}>Old password</div>
              <input
                className={styles['button-default']}
                type="password"
                placeholder="Type in old Password"
                name="OldPassword"
                value={formData.OldPassword}
                onChange={handleinputChange}
                required
              />
            </div>
            <div className={styles['frame-8860']}>
              <div className={styles.text}>New Password</div>
              <input
                className={styles['button-default']}
                type="password"
                placeholder="Type in new Password"
                name="Password"
                value={formData.Password}
                onChange={handleinputChange}
                required
              />
            </div>
          </div>
          <div className={styles['frame-8861']}>
            <div className={styles.text}>Confirm Password</div>
            <input
              className={styles['button-default']}
              type="password"
              placeholder="Confirm New Password"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
              onChange={handleinputChange}
              required
            />
          </div>
          <div className={styles['button-default2']}>
            <button
              type="button"
              className={styles.text3}
              onClick={handleSubmit}
            >
              Save change
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default App;
