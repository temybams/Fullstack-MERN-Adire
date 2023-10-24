/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import FeedbackModal from '../../modals/success-modal/SuccessModal';
import styles from './UpdateCustomers.module.css';
import Customer from './rectangle-2044.png';
import { apiUrl } from '../../../config/config';

const validationSchema = Yup.object().shape({
  Name: Yup.string(),
  Address: Yup.string(),
  PhoneNumber: Yup.string()
    .notRequired()
    .matches(
      /^(\+?(\d{1,3}))?([-. ])?(\()?\d{3}(\))?([- ])?\d{3}([- ])?\d{4}$/,
      'Invalid phone number format'
    )
    .min(11, 'Phone number must be at least 11 characters')
    .max(14, 'Phone number must not exceed 14 characters'),
});

function App({ data }: any) {
  const { id } = useParams<any>();
  const token = document.cookie.split('=')[1];
  const updatecustomer = async (formData: any) => {
    const response = await axios.patch(
      `${apiUrl}/adire/customer/updatecustomer/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  interface FormData {
    Name: string;
    Address: string;
    PhoneNumber: string;
  }
  const initialFormData: FormData = {
    Name: '',
    Address: '',
    PhoneNumber: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const { mutate, isLoading } = useMutation(updatecustomer, {
    onSuccess: () => {
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const filteredFormData: Partial<FormData> = Object.keys(formData).reduce(
        (acc, key) => {
          if (formData[key as keyof FormData] !== '') {
            acc[key as keyof FormData] = formData[key as keyof FormData];
          }
          return acc;
        },
        {} as Partial<FormData>
      );
      await validationSchema.validate(filteredFormData, { abortEarly: false });
      mutate(filteredFormData);
    } catch (error: any) {
      console.log(error);
      toast.dismiss();
      toast.error(Object.values(error.errors).join('\n'));
    }
  };

  return (
    <div className={styles.customers}>
      {showSuccessModal && (
        <FeedbackModal
          title="Successfully Updated"
          message="You have successfully updated this customer."
          buttonText="Done"
          buttonStyle="button-default2"
          buttonTextStyle="text2"
          link="/customers/viewcustomers"
          icon
        />
      )}
      <div className={styles['frame-16475']}>
        <div className={styles['frame-8463']}>
          <form onSubmit={handleSubmit} className={styles['frame-8462']}>
            <div className={styles['frame-8461']}>
              <div className={styles['name-of-customer']}>Name of Customer</div>
              <div className={styles['button-default']}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder={data.Name}
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles['frame-8460']}>
              <div className={styles.address}>Address</div>
              <div className={styles['button-default']}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder={data.Address}
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles['frame-8459']}>
              <div className={styles['phone-number']}>Phone Number</div>
              <div className={styles['button-default']}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder={data.PhoneNumber}
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* <div className={styles['frame-8458']}>
              <div className={styles['number-of-orders']}>Number of Orders</div>
              <div className={styles['button-default']}>
                <div className={styles.text}>Enter number of orders e.g 10</div>
              </div>
            </div> */}
          </form>
        </div>
        <div className={styles['button-default2']}>
          <button
            className={styles.text2}
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <p className={styles.text5}>Updating Customer....</p>
            ) : (
              <p className={styles.text5}>Update Customer</p>
            )}
          </button>
        </div>
      </div>
      <div className={styles['frame-16476']}>
        <img className={styles['rectangle-2044']} src={Customer} alt="" />
        <div className={styles['rectangle-2045']} />
        <div
          className={
            styles['take-control-of-your-future-and-start-working-for-yourse']
          }
        >
          Take control of your future and start working for yourse
        </div>
      </div>
      <div className={styles['frame-16478']}>
        <div className={styles['frame-16477']}>
          <div className={styles['frame-16474']}>
            <div className={styles.customers2}>Customers</div>
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
        <div className={styles['button-default3']}>
          <a href="customers/viewcustomers" className={styles.text3}>
            View all{' '}
          </a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
