/* eslint-disable react/no-unknown-property */
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { apiUrl } from '../../config/config';
import styles from './VerifyEmail.module.css';

const verifyEmail = async () => {
  const token2 = window.location.pathname.split('/')[2];
  const response = await axios.patch(
    `${apiUrl}/adire/user/verifyemail/${token2}`
  );

  return response.data.data;
};

function App() {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(verifyEmail, {
    onSuccess: () => {
      navigate(`/login`);
    },
    onError: (error: any) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    mutate();
  };
  return (
    <div className={styles['confirm-email-sign-up']}>
      <div className={styles['frame-8346']}>
        <div className={styles.container}>
          <div className={styles.svg}>
            <svg
              className={styles['mail-open-check']}
              width="57"
              height="56"
              // viewBox="0 0 57 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.56693 23.3335L24.3582 34.5722C25.8551 35.5701 26.6035 36.069 27.4125 36.2629C28.1274 36.4342 28.8726 36.4342 29.5875 36.2629C30.3965 36.069 31.1449 35.5701 32.6418 34.5722L49.4331 23.3335M23.8333 22.5556L27.0641 25.6667L34.3333 18.6667M22.5435 10.7408L12.7435 16.8953C10.8292 18.0975 9.87212 18.6985 9.17791 19.5111C8.56347 20.2303 8.10116 21.0665 7.8189 21.9694C7.5 22.9894 7.5 24.1196 7.5 26.38V35.4667C7.5 39.387 7.5 41.3472 8.26295 42.8446C8.93407 44.1617 10.0049 45.2326 11.3221 45.9037C12.8194 46.6667 14.7796 46.6667 18.7 46.6667H38.3C42.2204 46.6667 44.1805 46.6667 45.6779 45.9037C46.9951 45.2326 48.0659 44.1617 48.737 42.8446C49.5 41.3472 49.5 39.387 49.5 35.4667V26.38C49.5 24.1196 49.5 22.9894 49.1811 21.9694C48.8988 21.0665 48.4365 20.2303 47.8221 19.5111C47.1279 18.6985 46.1708 18.0975 44.2565 16.8953L34.4565 10.7408C32.2962 9.38407 31.2161 8.70572 30.057 8.44129C29.0322 8.20748 27.9678 8.20748 26.943 8.44129C25.7839 8.70572 24.7038 9.38407 22.5435 10.7408Z"
                stroke="#34A853"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <h3 className={styles.header}>Verify your email</h3>
          <div className={styles['frame-8345']}>
            <div className={styles['frame-8344']}>
              <div
                className={
                  styles[
                    'hi-there-use-the-link-below-to-verify-your-email-and-start-enjoying-adire'
                  ]
                }
              >
                Hi there, use the link below to verify
                <br />
                your email and start enjoying Adire
              </div>
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className={styles['button-default']}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.text}>Verifying Email ....</div>
              ) : (
                <div className={styles.text}>Verify email</div>
              )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
