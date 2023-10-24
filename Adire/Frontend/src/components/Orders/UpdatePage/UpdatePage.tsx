/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-boolean-value */
import axios from 'axios';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import * as Yup from 'yup';
import { apiUrl } from '../../../config/config';
import styles from './UpdatePage.module.css';
import FabricModal from '../../modals/FabricModal/FabricModal';

// const validationSchema = Yup.object().shape({
//   Status: Yup.string(),
//   ProjectDuration: Yup.string(),
//   Price: Yup.number(),
//   DueDate: Yup.date(),
//   OrderImages: Yup.array(),
//   Measurement: Yup.object().shape({
//     Chest: Yup.number(),
//     Shoulder: Yup.number(),
//     Back: Yup.number(),
//     Neck: Yup.number(),
//     UnderBust: Yup.number(),
//     ArmHole: Yup.number(),
//     HalfLength: Yup.number(),
//     Waist: Yup.number(),
//     TrouserWaist: Yup.number(),
//     Hip: Yup.number(),
//     Thighs: Yup.number(),
//     SleeveLength: Yup.number(),
//     Wrist: Yup.number(),
//     Calf: Yup.number(),
//     Ankle: Yup.number(),
//     TrouserLength: Yup.number(),
//     FullLength: Yup.number(),
//   }),
// });

function App({ order }: any) {
  const { id1 } = useParams();
  const navigate = useNavigate();
  const [ModalVisible, setModalVisible] = useState(false);
  const [childData, setChildData] = useState('');
  const token = document.cookie.split('=')[1];
  const CreateOrder = async (formData: any) => {
    const response = await axios.patch(
      `${apiUrl}/adire/order/editorder/${id1}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ' Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  };
  const { mutate, isLoading } = useMutation(CreateOrder, {
    onSuccess: () => {
      // setModalVisible(true);
      navigate('/order/allorders');
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(error.response.data.message);
      console.error('Error:', error.response);
    },
  });
  const [inputFields, setInputFields] = useState(['']);
  const handleAddField = () => {
    setInputFields([...inputFields, '']);
  };

  const handleRemoveField = () => {
    if (inputFields.length > 1) {
      const updatedInputs = inputFields.slice(0, -1);
      setInputFields(updatedInputs);
    }
  };
  const existingFieldCount = 17;

  const [expanded, setExpanded] = useState(false);

  const handleSelectClick = () => {
    setExpanded(!expanded);
  };

  interface IFormData {
    Status: string;
    MaterialType: string;
    Measurement: {
      Chest: string;
      Shoulder: string;
      Back: string;
      Neck: string;
      UnderBust: string;
      ArmHole: string;
      HalfLength: string;
      Waist: string;
      TrouserWaist: string;
      Hip: string;
      Thighs: string;
      SleeveLength: string;
      Wrist: string;
      Calf: string;
      Ankle: string;
      TrouserLength: string;
      FullLength: string;
    };
    ProjectDuration: string;
    DueDate: string | Date | undefined;
    OrderImages: (string | File)[];
    Price: string;
  }

  const initialFormData: IFormData = {
    Status: '',
    MaterialType: '',
    ProjectDuration: '',
    DueDate: '',
    Measurement: {
      Chest: '',
      Shoulder: '',
      Back: '',
      Neck: '',
      UnderBust: '',
      ArmHole: '',
      HalfLength: '',
      Waist: '',
      TrouserWaist: '',
      Hip: '',
      Thighs: '',
      SleeveLength: '',
      Wrist: '',
      Calf: '',
      Ankle: '',
      TrouserLength: '',
      FullLength: '',
    },
    OrderImages: [],
    Price: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFileName1, setSelectedFileName1] = useState('Choose Image 1');
  const [selectedFileName2, setSelectedFileName2] = useState('Choose Image 2');
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    formData.MaterialType = childData;
    const { name, value, type, id } = e.target;
    if (name.startsWith('Measurement.') && parseFloat(value) < 0) {
      toast.dismiss();
      toast.error('Measurement values cannot be negative');
      return;
    }

    if (
      e.target instanceof HTMLInputElement &&
      name === 'OrderImages' &&
      type === 'file'
    ) {
      const files = e.target.files;
      const selectedFiles = Array.isArray(formData[name])
        ? [...formData[name]]
        : [];
      if (id === 'imageInput1') {
        if (files && files[0].size > 10485760) {
          toast.error('Image size too large');
          return;
        }
        // selectedFiles[].push(files[0]);
        setSelectedFileName1(files ? files[0].name : 'Choose Image 1');
        selectedFiles[0] = files ? files[0] : '';
      }
      if (id === 'imageInput2') {
        if (files && files[0].size > 10485760) {
          toast.error('Image size too large, max 10MB');
          return;
        }
        // selectedFiles.push(files[0]);
        setSelectedFileName2(files ? files[0].name : 'Choose Image 2');
        selectedFiles[1] = files ? files[0] : '';
      }

      setFormData({
        ...formData,
        [name]: selectedFiles,
      });
    } else {
      if (name.startsWith('Measurement.')) {
        const measurementField = name.replace('Measurement.', '');

        setFormData({
          ...formData,
          Measurement: {
            ...formData.Measurement,
            [measurementField]: value,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // validationSchema.validateSync(formData, { abortEarly: false });
      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  };

  // Callback function to receive data from the child component
  const sendDataToParent = async (data: string) => {
    await setChildData(data);
    formData.MaterialType = childData;
  };

  const [date, setDate] = useState<Date>();

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className={styles['create-order']}>
      <div className={styles['frame-16634']}>
        <div className={styles['frame-16633']}>
          <div className={styles['frame-16631']}>
            <div className={styles['frame-16477']}>
              <div className={styles['frame-16474']}>
                <div className={styles['create-new-order']}>Update Order</div>
                <div
                  className={
                    styles[
                      'empower-your-business-with-seamless-order-management'
                    ]
                  }
                >
                  Empower Your Business with Seamless <br />
                  Order Management
                </div>
              </div>
            </div>
            <div className={styles['button-default']}>
              <a href="order/allorders" className={styles.text}>
                {' '}
                View all
              </a>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className={styles.flex}
            encType="multipart/form-data"
          >
            <div className={styles['customer-name']}>Order Status</div>
            <label htmlFor="dropdown" className={styles['button-default3']}>
              <select
                className={styles.text2}
                id="Status"
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                required
              >
                <option>{order.Status}</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <div className={styles['frame-16632']}>
              <div className={styles['frame-8461']}>
                {/* <div className={styles['customer-name']}>Customer Name</div> */}

                {/* <div className={styles['button-default2']}>
                  <input
                    className={styles.text2}
                    type="text"
                    id="CustomerName"
                    name="CustomerName"
                    placeholder="Type the name of customer"
                    value={formData.CustomerName}
                    onChange={handleInputChange}
                    required
                  />
                </div> */}
              </div>
              <div className={styles['frame-8458']}>
                <div className={styles['project-duration']}>
                  Project Duration
                </div>
                <label htmlFor="dropdown" className={styles['button-default3']}>
                  <select
                    className={styles.text2}
                    id="ProjectDuration"
                    name="ProjectDuration"
                    value={formData.ProjectDuration}
                    onChange={handleInputChange}
                    required
                  >
                    <option>{order.ProjectDuration}</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="3 Weeks">3 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </label>
              </div>
              <div className={styles['frame-16618']}>
                <div className={styles['frame-16628']}>
                  <div className={styles['frame-16627']}>
                    <div className={styles['frame-16626']}>
                      <div className={styles.price}>Price</div>
                      <div className={styles['frame-16625']}>
                        <svg
                          className={styles.naira}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_3067_839)">
                            <path
                              d="M9.99982 20C7.32857 20 4.81764 18.9597 2.92889 17.0706C1.03982 15.1819 -0.000488281 12.6709 -0.000488281 10C-0.000488281 7.32906 1.03982 4.81812 2.92889 2.92937C4.81764 1.04031 7.32857 0 9.99982 0C12.6708 0 15.182 1.04031 17.0708 2.92937C18.9598 4.81812 20.0001 7.32906 20.0001 10C20.0001 12.6709 18.9598 15.1819 17.0708 17.0706C15.182 18.9597 12.6708 20 9.99982 20ZM9.99982 0.625C7.49545 0.625 5.14139 1.60031 3.37076 3.37125C1.59982 5.14187 0.624512 7.49594 0.624512 10C0.624512 12.5041 1.59982 14.8581 3.37076 16.6287C5.14139 18.3997 7.49545 19.375 9.99982 19.375C12.5039 19.375 14.8583 18.3997 16.6289 16.6287C18.3998 14.8581 19.3751 12.5041 19.3751 10C19.3751 7.49594 18.3998 5.14187 16.6289 3.37125C14.8583 1.60031 12.5039 0.625 9.99982 0.625Z"
                              fill="black"
                            />
                            <path
                              d="M12.8125 15.3125H12L7.1875 6.28906V15.3125H6.5625V5.3125H7.375L12.1875 14.3359V5.3125H12.8125V15.3125Z"
                              fill="black"
                            />
                            <path
                              d="M5.3125 9.0625H14.0625V9.6875H5.3125V9.0625Z"
                              fill="black"
                            />
                            <path
                              d="M5.3125 10.9375H14.0625V11.5625H5.3125V10.9375Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3067_839">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className={styles['chevron-down']}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#98A2B3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className={styles['button-default4']}>
                      <input
                        className={styles.text2}
                        type="number"
                        id="Price"
                        name="Price"
                        value={formData.Price}
                        onChange={handleInputChange}
                        required
                        placeholder={order.Price}
                      />
                    </div>
                  </div>
                  <div className={styles['frame-16480']}>
                    <div className={styles['due-date']}>Due Date</div>
                    <div className={styles['button-default4']}>
                      <svg
                        className={styles['calendar-day']}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 7.5H17.5M5.83333 2.5V4.16667M14.1667 2.5V4.16667M5 10H8.33333V13.3333H5V10ZM5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1586 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7668 17.5 14.8333V6.83333C17.5 5.89991 17.5 5.4332 17.3183 5.07668C17.1586 4.76308 16.9036 4.50811 16.59 4.34832C16.2335 4.16667 15.7668 4.16667 14.8333 4.16667H5.16667C4.23325 4.16667 3.76654 4.16667 3.41002 4.34832C3.09641 4.50811 2.84144 4.76308 2.68166 5.07668C2.5 5.4332 2.5 5.89991 2.5 6.83333V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z"
                          stroke="#98A2B3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {/* <input
                        type="date"
                        id="DueDate"
                        name="DueDate"
                        value={formData.DueDate}
                        onChange={handleInputChange}
                        required
                      /> */}
                      <DatePicker
                        selected={date}
                        dateFormat="dd-MM-yyyy"
                        id="DueDate"
                        name="DueDate"
                        onChange={handleDateChange}
                        required
                        className={styles['date-picker-input']}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['frame-166299']}>
                {expanded ? (
                  <div>
                    <div className={styles['fram-16635']}>
                      <div className={styles['fram-8460']}>
                        <div className={styles['material-type2']}>
                          Material Type
                        </div>
                        <FabricModal
                          ModalVisible={ModalVisible}
                          setModalVisible={setModalVisible}
                          sendDataToParent={sendDataToParent}
                        />
                        <button
                          type="button"
                          className={styles['button-default5']}
                          onClick={() => {
                            setModalVisible(true);
                          }}
                        >
                          <div className={styles.text3}>Select Material(s)</div>
                        </button>
                      </div>
                      <div className={styles['button-defaultz2']}>
                        {childData.length > 2 ? (
                          <div className={styles.text12}>{childData}</div>
                        ) : (
                          <div className={styles.text12}>
                            {order.MaterialType}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles['new-16485']}>
                      <div className={styles['new-16481']}>
                        <div className={styles['new-16479']}>
                          <button
                            type="button"
                            className={styles['add-image']}
                            onClick={handleSelectClick}
                          >
                            Add Image
                          </button>
                          <div className={styles['new-16620']}>
                            <div className={styles['button-default444']}>
                              <label
                                className={styles.customButton}
                                htmlFor="imageInput1"
                              >
                                <svg
                                  className={styles['image-square']}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.8872 13.2814L10.4561 11.8623C9.79833 11.2099 9.46943 10.8838 9.09078 10.7615C8.75767 10.6538 8.39914 10.6538 8.06603 10.7615C7.68738 10.8838 7.35848 11.2099 6.70069 11.8623L3.36829 15.2186M11.8872 13.2814L12.1717 12.9993C12.8433 12.3333 13.1791 12.0003 13.5644 11.8788C13.9032 11.7719 14.2674 11.7761 14.6036 11.8907C14.986 12.0211 15.3141 12.3617 15.9702 13.043L16.6666 13.7502M11.8872 13.2814L15.1833 16.6357M6.00077 3.33374H14.0008C14.9342 3.33374 15.4009 3.33374 15.7574 3.5154C16.071 3.67519 16.326 3.93015 16.4858 4.24376C16.6674 4.60028 16.6674 5.06699 16.6674 6.00041V14.0004C16.6674 14.9338 16.6674 15.4005 16.4858 15.7571C16.326 16.0707 16.071 16.3256 15.7574 16.4854C15.4009 16.6671 14.9342 16.6671 14.0008 16.6671H6.00077C5.06735 16.6671 4.60064 16.6671 4.24412 16.4854C3.93052 16.3256 3.67555 16.0707 3.51576 15.7571C3.33411 15.4005 3.33411 14.9338 3.33411 14.0004V6.00041C3.33411 5.06699 3.33411 4.60028 3.51576 4.24376C3.67555 3.93015 3.93052 3.67519 4.24412 3.5154C4.60064 3.33374 5.06735 3.33374 6.00077 3.33374ZM14.1674 7.50041C14.1674 8.42088 13.4212 9.16707 12.5008 9.16707C11.5803 9.16707 10.8341 8.42088 10.8341 7.50041C10.8341 6.57993 11.5803 5.83374 12.5008 5.83374C13.4212 5.83374 14.1674 6.57993 14.1674 7.50041Z"
                                    stroke="#98A2B3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className={styles.textsinputs}>
                                  {' '}
                                  {selectedFileName1}
                                </div>
                              </label>
                              <input
                                className={styles.text2}
                                type="file"
                                accept="image/*"
                                onChange={handleInputChange}
                                id="imageInput1"
                                name="OrderImages"
                                multiple
                                style={{ display: 'none' }}
                              />
                            </div>

                            <div className={styles['button-default444']}>
                              <label
                                className={styles.customButton}
                                htmlFor="imageInput2"
                              >
                                <svg
                                  className={styles['image-square']}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.8872 13.2814L10.4561 11.8623C9.79833 11.2099 9.46943 10.8838 9.09078 10.7615C8.75767 10.6538 8.39914 10.6538 8.06603 10.7615C7.68738 10.8838 7.35848 11.2099 6.70069 11.8623L3.36829 15.2186M11.8872 13.2814L12.1717 12.9993C12.8433 12.3333 13.1791 12.0003 13.5644 11.8788C13.9032 11.7719 14.2674 11.7761 14.6036 11.8907C14.986 12.0211 15.3141 12.3617 15.9702 13.043L16.6666 13.7502M11.8872 13.2814L15.1833 16.6357M6.00077 3.33374H14.0008C14.9342 3.33374 15.4009 3.33374 15.7574 3.5154C16.071 3.67519 16.326 3.93015 16.4858 4.24376C16.6674 4.60028 16.6674 5.06699 16.6674 6.00041V14.0004C16.6674 14.9338 16.6674 15.4005 16.4858 15.7571C16.326 16.0707 16.071 16.3256 15.7574 16.4854C15.4009 16.6671 14.9342 16.6671 14.0008 16.6671H6.00077C5.06735 16.6671 4.60064 16.6671 4.24412 16.4854C3.93052 16.3256 3.67555 16.0707 3.51576 15.7571C3.33411 15.4005 3.33411 14.9338 3.33411 14.0004V6.00041C3.33411 5.06699 3.33411 4.60028 3.51576 4.24376C3.67555 3.93015 3.93052 3.67519 4.24412 3.5154C4.60064 3.33374 5.06735 3.33374 6.00077 3.33374ZM14.1674 7.50041C14.1674 8.42088 13.4212 9.16707 12.5008 9.16707C11.5803 9.16707 10.8341 8.42088 10.8341 7.50041C10.8341 6.57993 11.5803 5.83374 12.5008 5.83374C13.4212 5.83374 14.1674 6.57993 14.1674 7.50041Z"
                                    stroke="#98A2B3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className={styles.textsinputs}>
                                  {' '}
                                  {selectedFileName2}
                                </div>
                              </label>
                              <input
                                className={styles.text2}
                                type="file"
                                accept="image/*"
                                onChange={handleInputChange}
                                id="imageInput2"
                                name="OrderImages"
                                multiple
                                style={{ display: 'none' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles['button-default221']}>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className={styles.text222}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className={styles.text55}>
                              Updating Order....
                            </div>
                          ) : (
                            <div className={styles.text55}>Update Order</div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Default view
                  <div className={styles['frame-16630']}>
                    <div className={styles['frame-16629']}>
                      <FabricModal
                        ModalVisible={ModalVisible}
                        setModalVisible={setModalVisible}
                        sendDataToParent={sendDataToParent}
                      />
                      <div className={styles['frame-8460']}>
                        <div className={styles['material-type']}>
                          Material Type
                        </div>

                        <button
                          type="button"
                          className={styles['button-default5']}
                          onClick={() => {
                            setModalVisible(true);
                          }}
                        >
                          <div className={styles.text3}>Select Material(s)</div>
                        </button>
                      </div>

                      <div className={styles['frame-164799']}>
                        <button
                          type="button"
                          className={styles['add-image']}
                          onClick={handleSelectClick}
                        >
                          Add Image
                        </button>

                        <div className={styles['button-default444']}>
                          <label
                            className={styles.customButton}
                            htmlFor="imageInput1"
                          >
                            <svg
                              className={styles['image-square']}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.8872 13.2814L10.4561 11.8623C9.79833 11.2099 9.46943 10.8838 9.09078 10.7615C8.75767 10.6538 8.39914 10.6538 8.06603 10.7615C7.68738 10.8838 7.35848 11.2099 6.70069 11.8623L3.36829 15.2186M11.8872 13.2814L12.1717 12.9993C12.8433 12.3333 13.1791 12.0003 13.5644 11.8788C13.9032 11.7719 14.2674 11.7761 14.6036 11.8907C14.986 12.0211 15.3141 12.3617 15.9702 13.043L16.6666 13.7502M11.8872 13.2814L15.1833 16.6357M6.00077 3.33374H14.0008C14.9342 3.33374 15.4009 3.33374 15.7574 3.5154C16.071 3.67519 16.326 3.93015 16.4858 4.24376C16.6674 4.60028 16.6674 5.06699 16.6674 6.00041V14.0004C16.6674 14.9338 16.6674 15.4005 16.4858 15.7571C16.326 16.0707 16.071 16.3256 15.7574 16.4854C15.4009 16.6671 14.9342 16.6671 14.0008 16.6671H6.00077C5.06735 16.6671 4.60064 16.6671 4.24412 16.4854C3.93052 16.3256 3.67555 16.0707 3.51576 15.7571C3.33411 15.4005 3.33411 14.9338 3.33411 14.0004V6.00041C3.33411 5.06699 3.33411 4.60028 3.51576 4.24376C3.67555 3.93015 3.93052 3.67519 4.24412 3.5154C4.60064 3.33374 5.06735 3.33374 6.00077 3.33374ZM14.1674 7.50041C14.1674 8.42088 13.4212 9.16707 12.5008 9.16707C11.5803 9.16707 10.8341 8.42088 10.8341 7.50041C10.8341 6.57993 11.5803 5.83374 12.5008 5.83374C13.4212 5.83374 14.1674 6.57993 14.1674 7.50041Z"
                                stroke="#98A2B3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className={styles.textsinputs}>
                              {' '}
                              {selectedFileName1}
                            </div>
                          </label>
                          <input
                            className={styles.text2}
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                            id="imageInput1"
                            name="OrderImages"
                            multiple
                            style={{ display: 'none' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles['button-default221']}>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className={styles.text222}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className={styles.text55}>
                            Updating Order....
                          </div>
                        ) : (
                          <div className={styles.text55}>Update Order</div>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles['frame-16585']}>
              <div className={styles['frame-16586']}>
                <div className={styles['frame-16554']}>
                  <div className={styles['measurements-in']}>
                    Measurements in:
                  </div>
                  <div className={styles['button-default7']}>
                    <div className={styles.text5}>Inches</div>

                    <svg
                      className={styles['icon-arrow-down2']}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.175 6.91211L10 10.7288L13.825 6.91211L15 8.08711L10 13.0871L5 8.08711L6.175 6.91211Z"
                        fill="#101828"
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.divider} />
              </div>
              <div className={styles['frame-16584']}>
                <div className={styles['frame-16583']}>
                  <div className={styles['frame-16577']}>
                    <div className={styles['frame-16559']}>
                      <div className={styles['frame-16556']}>
                        <div className={styles['_1-chest-bust']}>
                          1. Chest/Bust
                        </div>
                      </div>
                      <input
                        className={styles['button-default8']}
                        type="number"
                        id="Measurement.Chest"
                        name="Measurement.Chest"
                        value={formData.Measurement.Chest}
                        placeholder={order.Measurement.Chest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16569']}>
                      <div className={styles['_2-shoulder']}>2. Shoulder</div>
                      <input
                        type="number"
                        id="Shoulder"
                        name="Measurement.Shoulder"
                        className={styles['button-default8']}
                        value={formData.Measurement.Shoulder}
                        placeholder={order.Measurement.Shoulder}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16566']}>
                      <div className={styles['_3-back']}>3. Back</div>
                      <input
                        type="number"
                        id="Back"
                        name="Measurement.Back"
                        className={styles['button-default8']}
                        value={formData.Measurement.Back}
                        placeholder={order.Measurement.Back}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16564']}>
                      <div className={styles['_4-neck']}>4. Neck</div>
                      <input
                        type="number"
                        id="Neck"
                        name="Measurement.Neck"
                        className={styles['button-default8']}
                        value={formData.Measurement.Neck}
                        placeholder={order.Measurement.Neck}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16562']}>
                      <div className={styles['_5-under-bust']}>
                        5. Under bust
                      </div>
                      <input
                        type="number"
                        id="Underbust"
                        name="Measurement.UnderBust"
                        className={styles['button-default8']}
                        value={formData.Measurement.UnderBust}
                        placeholder={order.Measurement.UnderBust}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16571']}>
                      <div className={styles['_6-armhole']}>6. Armhole</div>
                      <input
                        type="number"
                        id="Armhole"
                        name="Measurement.ArmHole"
                        className={styles['button-default8']}
                        value={formData.Measurement.ArmHole}
                        placeholder={order.Measurement.ArmHole}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16575']}>
                      <div className={styles['_7-half-legth']}>
                        7. Half length
                      </div>
                      <input
                        type="number"
                        id="HalfLength"
                        name="Measurement.HalfLength"
                        className={styles['button-default8']}
                        value={formData.Measurement.HalfLength}
                        placeholder={order.Measurement.HalfLength}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16563']}>
                      <div className={styles['_8-waist']}>8. Waist</div>
                      <input
                        className={styles['button-default8']}
                        type="number"
                        id="Lap"
                        name="Measurement.Waist"
                        value={formData.Measurement.Waist}
                        placeholder={order.Measurement.Waist}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16573']}>
                      <div className={styles['_9-trouser-waist']}>
                        9. Trouser waist
                      </div>
                      <input
                        type="number"
                        id="TrouserWaist"
                        className={styles['button-default8']}
                        name="Measurement.TrouserWaist"
                        value={formData.Measurement.TrouserWaist}
                        placeholder={order.Measurement.TrouserWaist}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16565']}>
                      <div className={styles['_10-hip']}>10. Hip</div>
                      <input
                        type="number"
                        id="Hip"
                        className={styles['button-default8']}
                        name="Measurement.Hip"
                        value={formData.Measurement.Hip}
                        placeholder={order.Measurement.Hip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16574']}>
                      <div className={styles['_11-thighs']}>11. Thighs</div>
                      <input
                        className={styles['button-default8']}
                        type="number"
                        id="Thigh"
                        name="Measurement.Thighs"
                        value={formData.Measurement.Thighs}
                        placeholder={order.Measurement.Thighs}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles['frame-16560']}>
                      <div className={styles['_12-sleeve-length']}>
                        12. Sleeve length
                      </div>
                      <input
                        type="number"
                        id="SleveLength"
                        className={styles['button-default8']}
                        name="Measurement.SleeveLength"
                        value={formData.Measurement.SleeveLength}
                        placeholder={order.Measurement.SleeveLength}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.divider2} />
                </div>
                <div className={styles['frame-16582']}>
                  <div className={styles['frame-16570']}>
                    <div className={styles['frame-16558']}>
                      <div className={styles['_13-wrist']}>13. Wrist</div>
                    </div>
                    <input
                      type="number"
                      id="Wrist"
                      className={styles['button-default8']}
                      name="Measurement.Wrist"
                      value={formData.Measurement.Wrist}
                      placeholder={order.Measurement.Wrist}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles['frame-16576']}>
                    <div className={styles['_14-calf']}>14. Calf</div>
                    <input
                      type="number"
                      id="Calf"
                      className={styles['button-default8']}
                      name="Measurement.Calf"
                      value={formData.Measurement.Calf}
                      placeholder={order.Measurement.Calf}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles['frame-16575']}>
                    <div className={styles['_15-ankle']}>15. Ankle</div>
                    <input
                      className={styles['button-default8']}
                      type="number"
                      id="Ankle"
                      name="Measurement.Ankle"
                      value={formData.Measurement.Ankle}
                      placeholder={order.Measurement.Ankle}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles['frame-16572']}>
                    <div className={styles['_16-trouser-length']}>
                      16. Trouser length
                    </div>
                    <input
                      type="number"
                      id="TrouserLength"
                      className={styles['button-default8']}
                      name="Measurement.TrouserLength"
                      value={formData.Measurement.TrouserLength}
                      placeholder={order.Measurement.TrouserLength}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles['frame-16567']}>
                    <div className={styles['_17-full-length']}>
                      17. Full length
                    </div>
                    <div>
                      <input
                        type="number"
                        className={styles['button-default8']}
                        id="FullLength"
                        name="Measurement.FullLength"
                        value={formData.Measurement.FullLength}
                        placeholder={order.Measurement.FullLength}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles['frame-16589']}>
                    <div className={styles['frame-16581']}>
                      <div className={styles['frame-16580']}>
                        <div className={styles.other}>Other</div>
                        <div className={styles['frame-16578']}>
                          <div
                            className={styles['minus-plus']}
                            onClick={handleAddField}
                          >
                            <svg
                              className={styles.plus}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 10H15M10 5V15"
                                stroke="#131A29"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="0.5"
                                y="0.5"
                                width="19"
                                height="19"
                                stroke="#012A4A"
                              />
                            </svg>
                          </div>

                          <div
                            className={styles['minus-plus']}
                            onClick={handleRemoveField}
                          >
                            <svg
                              className={styles.minus}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 10L15 10"
                                stroke="#131A29"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="0.5"
                                y="0.5"
                                width="19"
                                height="19"
                                stroke="#012A4A"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.divider3} />
                    </div>
                    {inputFields.map((input, index) => (
                      <div className={styles['frame-165772']} key={index}>
                        <div className={styles._18}>
                          {existingFieldCount + index + 1}.
                          <input className={styles['input-test']} type="text" />
                        </div>
                        <input
                          type="text"
                          className={styles['button-default8']}
                          value={input}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
