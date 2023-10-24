import React from 'react';
import Tailor from '../assets/Tailor.jpg';
import styles from './App.module.css';

const Body: React.FC = function Body() {
  return (
    <div className={styles['body-1']}>
      <div className={styles['body-content']}>
        <h2>Manage customers, track orders, and make data-driven decisions</h2>
        <p>
          Experience seamless customers and orders management and increased
          productivity with our user-friendly platform, designed to meet the
          needs of tailors of all sizes.
        </p>
        <div className={styles.button}>
          <a href="/signup">Get Started</a>
        </div>
      </div>

      <div className={styles['image-hero']}>
        <svg
          className={styles['rectangle-2043']}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41.2418 0H753V507.24C753 507.24 189.04 774.45 41.2418 507.24C-51.5522 339.475 41.2418 0 41.2418 0Z"
            fill="#9B8AFB"
          />
        </svg>
        <img className={styles.tailor} src={Tailor} alt="Tailor" />
      </div>
    </div>
  );
};

export default Body;
