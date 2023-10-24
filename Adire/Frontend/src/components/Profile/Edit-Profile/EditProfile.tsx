/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation } from 'react-query';
// import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './EditProfile.module.css';
import { apiUrl } from '../../../config/config';
import Account from './Rectangle 307.png';

// const validationSchema = Yup.object().shape({
//   PhoneNumber: Yup.string()
//     .notRequired()
//     .matches(
//       /^(\+?(\d{1,3}))?([-. ])?(\()?\d{3}(\))?([- ])?\d{3}([- ])?\d{4}$/,
//       'Invalid phone number format'
//     )
//     .min(11, 'Phone number must be at least 11 characters')
//     .max(14, 'Phone number must not exceed 14 characters')
//     .notRequired(),
//   FullName: Yup.string().notRequired(),
// });

const updateUser = async (formData: any) => {
  const token = document.cookie.split('=')[1];
  const response = await axios.patch(
    `${apiUrl}/adire/user/updateprofile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

function App({ profile }: any) {
  const initialFormData = {
    Name: '',
    PhoneNumber: '',
    Address: '',
    ProfilePhoto: '',
  };

  const { mutate, isLoading } = useMutation(updateUser, {
    onSuccess: () => {
      localStorage.setItem('Name', profile?.Name);
      localStorage.setItem('ProfilePhoto', profile?.ProfilePhoto);
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
  });

  const [formData, setFormData] = useState(initialFormData);
  const handleinputChange = (e: any) => {
    const { name, value, type, files } = e.target;
    if (name === 'ProfilePhoto' && type === 'file') {
      if (files && files[0].size > 10485760) {
        toast.error('Image size too large');
        return;
      }
      const file = files[0];
      // console.log(file);
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mutate(formData);
  };

  localStorage.setItem('Name', profile?.Name);
  localStorage.setItem('ProfilePhoto', profile?.ProfilePhoto);

  return (
    // <div className={styles.container}>
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
      <div className={styles['frame-8936']}>
        <div className={styles['frame-8923']}>
          <img src={Account} alt="" />
          <div className={styles.account}>Account</div>
        </div>
      </div>
      <div className={styles.divider} />
      <form onSubmit={handleSubmit} className={styles['frame-16640']}>
        <div className={styles['frame-16607']}>
          <div className={styles['frame-8956']}>
            <div className={styles['edit-profile2']}>Edit Profile </div>
            <div className={styles['only-you-can-view-and-edit-your-profile']}>
              Only you can view and edit your profile{' '}
            </div>
          </div>
          <div className={styles['frame-16606']}>
            <div className={styles['frame-16604']}>
              <img src={profile.ProfilePhoto} alt="" />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="imageInput"
                  name="ProfilePhoto"
                  onChange={handleinputChange}
                />
                <label htmlFor="imageInput">
                  <svg
                    className={styles.pen}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="6" fill="#3538CD" />
                    <path
                      d="M15.4381 5.56122L18.2627 8.39355M2.9856 21.0081C3.11154 20.1265 3.18172 19.2094 3.47588 18.3642C3.64534 17.8774 3.87684 17.4144 4.16466 16.9867C4.48901 16.5047 4.90879 16.0849 5.74834 15.2454L17.4097 3.58969C18.1907 2.80865 19.457 2.80864 20.2381 3.58969C21.0191 4.37074 21.0191 5.63707 20.2381 6.41812L8.39723 18.2533C7.68587 18.9647 7.33019 19.3204 6.92734 19.6084C6.56970 19.8641 6.18504 20.0797 5.78029 20.2514C4.89644 20.6262 3.91687 20.7838 2.9856 21.0081Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>
            </div>
            <div className={styles['frame-8958']}>
              <div className={styles['frame-8957']}>
                <div className={styles['frame-8955']}>
                  <div className={styles['frame-8857']}>
                    <div className={styles.text}>Full Name</div>
                    <input
                      className={styles['button-default']}
                      type="text"
                      name="Name"
                      placeholder={profile.Name}
                      onChange={handleinputChange}
                    />
                  </div>
                  <div className={styles['frame-8858']}>
                    <div className={styles.text}>Email</div>
                    <input
                      className={styles['button-default2']}
                      type="email"
                      placeholder={profile.Email}
                      name="Email"
                      onChange={handleinputChange}
                    />
                  </div>{' '}
                  <div className={styles['frame-8860']}>
                    <div className={styles.text}>Phone Number</div>
                    <input
                      className={styles['button-default']}
                      type="number"
                      placeholder={profile.PhoneNumber}
                      name="PhoneNumber"
                      value={formData.PhoneNumber}
                      onChange={handleinputChange}
                    />
                  </div>{' '}
                  <div className={styles['frame-8938']}>
                    <div className={styles.text}>Address</div>
                    <input
                      className={styles['button-default3']}
                      type="text"
                      placeholder={profile.Address}
                      name="Address"
                      value={formData.Address}
                      onChange={handleinputChange}
                    />
                  </div>
                </div>
                <div className={styles.text10}>
                  <button
                    type="button"
                    className={styles['button-default4']}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? ' Updating Profile....' : ' Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* </div> */}
      <ToastContainer />
    </div>
  );
}

export default App;
