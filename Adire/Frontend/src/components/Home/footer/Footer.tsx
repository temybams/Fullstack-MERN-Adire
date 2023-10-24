import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import styles from './App.module.css';

const Footer: React.FC = function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['logo-adire']}>
          <div className={styles['logo-name']}>Adire</div>
          <div className={styles.circle} />
        </div>

        <div className={styles['links-container']}>
          <div className={styles.frame}>
            <div className={styles.link}>About</div>
            <div className={styles.link}>Privacy</div>
            <div className={styles.link}>FAQ</div>
          </div>
        </div>
      </div>

      <hr className={styles.separator} />
      <div className={styles['frame-2']}>
        <div className={styles['rights-reserved']}>
          All rights reserved. &copy;2023 Adire.
        </div>
        <div className={styles['footer-icon']}>
          <div className={styles['footer-social']}>
            <a href="/">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="/">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
          <div className={styles['help-email']}>Help@adire.com</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
