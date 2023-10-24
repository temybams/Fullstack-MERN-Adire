/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import clipboardCopy from 'clipboard-copy';
import { apiUrl, clientUrl } from '../../../config/config';
import styles from './AllReceipts.module.css';

function App({
  receiptData2,
  incrementPage,
  decrementPage,
  changePage,
  maxPage,
}: any) {
  function handleCopyClick(link: string) {
    clipboardCopy(link)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  }

  const downloadPDF = async (e: any) => {
    try {
      const recieptId = e.target.id;
      const token = document.cookie.split('=')[1];
      const response = await axios.get(
        `${apiUrl}/adire/order/downloadreceipt/${recieptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'receipt.pdf';
      a.click();
      toast.success('Downloaded Successfully');
    } catch (error) {
      toast.error('Download Failed');
      console.error('Error:', error);
    }
  };
  return (
    <div className={styles.receipts}>
      <div className={styles['receipt-center']}>
        {receiptData2.map((data: any) => (
          <div className={styles['receipt-innerbox']} key={data.ID}>
            <div className={styles['receipt-summary']}>Receipt Summary</div>
            <div className={styles['name-space']}>
              <div className={styles.name}>N A M E</div>
              <div className={styles.name1}>{data.Name}</div>
            </div>
            <div className={styles.phonenumber}>P H O N E N U M B E R</div>
            <div className={styles.number}>{data.PhoneNumber}</div>
            <div className={styles['address-space']}>
              <div className={styles.addrress}>A D D R R E S S</div>
              <div className={styles.address1}>{data.Address}</div>
            </div>
            <div className={styles.material}>
              <div className={styles.materialtype}>M A T E R I A L T Y P E</div>
              <div className={styles.cotton}>{data.MaterialType}</div>
            </div>
            <div className={styles['measurement-space']}>
              <div className={styles.measearements}>
                M E A S E A R E M E N T S
              </div>
              <div className={styles['measurement-data']}>
                {data.Measurements}
              </div>
            </div>
            <div className={styles['date-space']}>
              <div className={styles.date}>D A T E</div>
              <div className={styles['date-data']}>{data.Date}</div>
            </div>
            <div className={styles['duration-space']}>
              <div className={styles.duration}>D U R A T I O N</div>
              <div className={styles['duration-data']}>{data.Duration}</div>
            </div>
            <div className={styles.buttons}>
              <div className={styles.pdf}>
                <button
                  type="submit"
                  id={data.ID}
                  onClick={downloadPDF}
                  className={styles['download-pdf']}
                >
                  Download PDF
                </button>
              </div>
              <div className={styles.share0}>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyClick(`${clientUrl}/others/receipt/${data.ID}`)
                  }
                  className={styles.share}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['pagination']}>
        <div className={styles['pagination2']}>
          <button
            onClick={decrementPage}
            className={styles['button']}
            type="button"
          >
            <svg
              className={styles['arrow-left']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8334 10.0003H4.16675M4.16675 10.0003L10.0001 15.8337M4.16675 10.0003L10.0001 4.16699"
                stroke="#344054"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className={styles['text']}>Previous</div>
          </button>

          <div className={styles['pagination-numbers']}>
            {[...Array(maxPage)].map((_, index) => (
              <div className={styles['pagination-number-base2']} key={index}>
                <button
                  onClick={() => changePage(index + 1)}
                  className={styles['content']}
                  type="button"
                >
                  <div className={styles['number']}>{index + 1}</div>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={incrementPage}
            className={styles['button']}
            type="button"
          >
            <div className={styles.text}>Next</div>
            <svg
              className={styles['arrow-right']}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.16675 10.0003H15.8334M15.8334 10.0003L10.0001 4.16699M15.8334 10.0003L10.0001 15.8337"
                stroke="#344054"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <a href="/orders" className={styles['frame-16590']}>
        <svg
          className={styles['icon-arrow-back']}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {' '}
          <path
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill="#101828"
          />
        </svg>
        <div className={styles.text}>Go back</div>
      </a>
      <ToastContainer />
    </div>
  );
}

export default App;
