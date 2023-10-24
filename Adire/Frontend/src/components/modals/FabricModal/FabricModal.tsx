/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import styles from './FabricModal.module.css';

function FabricModal({ ModalVisible, setModalVisible, sendDataToParent }: any) {
  // console.log(ModalVisible);
  // console.log(setModalVisible);
  // console.log(sendDataToParent);
  const handleModalClick = () => {
    setModalVisible(!ModalVisible);
  };
  const selectedFabrics: string[] = [];
  const [isOpen, setIsOpen] = useState(true);

  const handleCancel = () => {
    setIsOpen(false);
    console.log(isOpen);
    // onClose();
  };

  const handleSelect = () => {
    sendDataToParent(selectedFabrics.join(', '));
    setModalVisible(!ModalVisible);
    setIsOpen(false);
    // onConfirm(selectedFabrics);
  };

  const handleMaterialClick = (e: any) => {
    const { checked, value } = e.target;
    if (checked) {
      selectedFabrics.push(value);
    } else {
      const index = selectedFabrics.indexOf(value);
      if (index > -1) {
        selectedFabrics.splice(index, 1);
      }
    }
  };

  const fabrics = [
    'Ankara',
    'Chiffon',
    'Cotton',
    'Crepe',
    'Jacquard',
    'Kampala',
    'Lace',
    'Linen',
    'Satin',
    'Silk',
    'Velvet',
    'Wool',
  ];
  return (
    <div>
      {ModalVisible && (
        <div className={styles.overlay}>
          <div className={styles.holder}>
            <div className={styles.topxx} onClick={handleModalClick}>
              <svg
                className={styles['icon-clear']}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleCancel}
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="#757575"
                />
              </svg>
            </div>
            <div className={styles.headline}>Fabrics</div>
            <div className={styles.fabOptions}>
              {fabrics.map((f, index) => (
                <div key={index} className={styles.holdLabel}>
                  <div className={styles.styleinput}>
                    <input
                      type="checkbox"
                      id={f}
                      onClick={handleMaterialClick}
                      value={f}
                      className={styles.inputss}
                    />
                  </div>
                  <label className="fablabel">{f}</label>
                </div>
              ))}
            </div>
            <div className={styles.fabControls}>
              <button
                type="button"
                onClick={handleModalClick}
                className={styles['button-default']}
              >
                <div className={styles.text}>Cancel</div>
              </button>
              <button
                type="button"
                onClick={handleSelect}
                className={styles['button-default2']}
              >
                <div className={styles.text2}>Select</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FabricModal;
