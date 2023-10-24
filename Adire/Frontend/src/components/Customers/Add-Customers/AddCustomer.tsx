/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import FeedbackModal from '../../modals/success-modal/SuccessModal';
import styles from './AddCustomer.module.css';
import Customer from './rectangle-2044.png';
import { apiUrl } from '../../../config/config';

const validationSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Address: Yup.string().required('Address is required'),
  PhoneNumber: Yup.string()
    .matches(
      /^(\+?(\d{1,3}))?([-. ])?(\()?\d{3}(\))?([- ])?\d{3}([- ])?\d{4}$/,
      'Invalid phone number format'
    )
    .trim()
    .min(11, 'Phone number must be at least 11 characters')
    .max(14, 'Phone number must not exceed 14 characters')
    .required('Phone Number is required'),
});

const isDisabledSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Address: Yup.string().required('Address is required'),
  PhoneNumber: Yup.string().required('Phone Number is required'),
});

const token = document.cookie.split('=')[1];
const addcustomer = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/adire/customer/addcustomer`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

function App() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const initialFormData = {
    Name: '',
    Address: '',
    PhoneNumber: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const { mutate, isLoading } = useMutation(addcustomer, {
    onSuccess: () => {
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      toast.dismiss();
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      mutate(formData);
    } catch (error: any) {
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
    <div className={styles.customers}>
      {showSuccessModal && (
        <FeedbackModal
          title="Successfully Added"
          message="You have successfully added a customer."
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
                  placeholder="Type the name of the customer"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles['frame-8460']}>
              <div className={styles.address}>Address</div>
              <div className={styles['button-default']}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder="Type in address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles['frame-8459']}>
              <div className={styles['phone-number']}>Phone Number</div>
              <div className={styles['button-default']}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder="Enter phone number"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  required
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
            disabled={isSubmitDisabled() || isLoading}
          >
            {isLoading ? (
              <p className={styles.text5}>Adding Customer....</p>
            ) : (
              <p className={styles.text5}>Create Customer</p>
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
