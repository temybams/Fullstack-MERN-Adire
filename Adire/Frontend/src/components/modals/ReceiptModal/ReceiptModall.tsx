import { useState } from 'react';
import styles from './ReceiptModal.module.css';

function Receipt() {
  const [ModalVisible, setModalVisible] = useState(false);

  // const handleModalClick = () => {
  //   setModalVisible(!ModalVisible); // Toggle modal visibility
  // };

  return (
    <div>
    {ModalVisible && (
    <div className={styles['modal-default']}>
      <div className={styles['rectangle-1']}></div>
      <div className={styles['rectangle-1']}></div>
      <div className={styles['frame-16414']}>
        <div className={styles['frame-16413']}>
          <div className={styles['order-details']}>Order Details</div>
          <div
            className={
              styles[
                'make-sure-you-confirm-all-items-before-generating-receipt'
              ]
            }
          >
            Make sure you confirm all items before generating receipt
          </div>
        </div>
      </div>
      <svg
        className={styles['icon-clear']}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="#757575"
        />
      </svg>

      <button type="button" className={styles['frame-16355']}>
        <div className={styles['button-default']}>
          <div className={styles['text']}>Generate Receipt</div>
        </div>
      </button>
      <div className={styles['divider']}></div>
      <div className={styles['frame-16498']}>
        <img className={styles['rectangle-2053']} src="rectangle-2053.png" />
      </div>
      <div className={styles['frame-16509']}>
        <div className={styles['frame-16502']}>
          <div className={styles['frame-16500']}>
            <div className={styles['n-a-m-e']}>N A M E</div>
            <div className={styles['kelechi-chibuzor']}>Kelechi Chibuzor</div>
          </div>
          <div className={styles['frame-16499']}>
            <div className={styles['p-h-o-n-e-n-u-m-b-e-r']}>
              P H O N E N U M B E R
            </div>
            <div className={styles['_07068653342']}>07068653342</div>
          </div>
          <div className={styles['frame-16501']}>
            <div className={styles['a-d-d-r-r-e-s-s']}>A D D R R E S S</div>
            <div className={styles['_10-kazeem-taiwo-street-ago-palace']}>
              10, Kazeem Taiwo,
              <br />
              Street, Ago Palace
            </div>
          </div>
        </div>
        <div className={styles['frame-16508']}>
          <div className={styles['frame-16506']}>
            <div className={styles['frame-16500']}>
              <div className={styles['m-a-t-e-r-i-a-l-t-y-p-e']}>
                M A T E R I A L T Y P E
              </div>
              <div className={styles['cotton']}>Cotton</div>
            </div>
            <div className={styles['frame-16503']}>
              <div className={styles['m-e-a-s-e-a-r-e-m-e-n-t-s']}>
                M E A S E A R E M E N T S
              </div>
              <div
                className={styles['lenght-5-chest-32-ankle-3-thigh-16-lap-14']}
              >
                Lenght 5, Chest 32, Ankle 3, <br />
                Thigh 16, Lap 14
              </div>
            </div>
          </div>
          <div className={styles['frame-16507']}>
            <div className={styles['frame-16505']}>
              <div className={styles['d-a-t-e']}>D A T E</div>
              <div className={styles['feb-15-2023']}>Feb 15, 2023</div>
            </div>
            <div className={styles['frame-16504']}>
              <div className={styles['d-u-r-a-t-i-o-n']}>D U R A T I O N</div>
              <div className={styles['_2-weeks']}>2 Weeks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
    </div>
  );
}

export default Receipt;
