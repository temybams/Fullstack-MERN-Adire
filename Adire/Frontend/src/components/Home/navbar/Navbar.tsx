import React from 'react';
import styles from './App.module.css';

const Navbar: React.FC = function Navbar() {
  return (
    <div className={styles['container-1']}>
      <div className={styles.logo}>
        <div className={styles['logo-name']}>
          <h2>Adire</h2>
        </div>
        <div className={styles['logo-img']} />
      </div>
      <div className={styles['nav-bar']}>
        <div className={styles['container-2']}>
          <a href="/">About</a>
        </div>
        <div className={styles['frame-8406']}>
          <div className={styles.login}>
            <a href="/login">Login</a>
          </div>
          <div className={styles['button-defaulttope']}>
            <div className={styles.text}>
              <a href="/signup">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
