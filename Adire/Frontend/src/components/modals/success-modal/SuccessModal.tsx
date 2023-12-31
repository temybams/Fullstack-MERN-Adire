/* eslint-disable import/no-extraneous-dependencies */

import PropTypes from 'prop-types';
import styles from './SuccessModal.module.css';

function FeedbackModal({
  title,
  message,
  buttonText,
  icon,
  buttonStyle,
  buttonTextStyle,
  link,
}: any) {
  return (
    <div className={styles.overlay}>
      <div className={styles['success-modal']}>
        <div className={styles['frame-8405']}>
          {icon && (
            <svg
              className={styles.success}
              width="65"
              height="64"
              viewBox="0 0 65 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.5 8C27.7533 8 23.1131 9.40758 19.1663 12.0447C15.2195 14.6819 12.1434 18.4302 10.3269 22.8156C8.51039 27.201 8.03511 32.0266 8.96116 36.6822C9.8872 41.3377 12.173 45.6141 15.5294 48.9706C18.8859 52.327 23.1623 54.6128 27.8178 55.5388C32.4734 56.4649 37.299 55.9896 41.6844 54.1731C46.0698 52.3566 49.8181 49.2805 52.4553 45.3337C55.0924 41.3869 56.5 36.7468 56.5 32C56.5 25.6348 53.9714 19.5303 49.4706 15.0294C44.9697 10.5286 38.8652 8 32.5 8ZM43.82 27.18L32.5 38.48C31.375 39.6036 29.85 40.2347 28.26 40.2347C26.67 40.2347 25.145 39.6036 24.02 38.48L21.18 35.66C20.9935 35.4735 20.8456 35.2521 20.7447 35.0085C20.6438 34.7649 20.5918 34.5037 20.5918 34.24C20.5918 33.9763 20.6438 33.7151 20.7447 33.4715C20.8456 33.2279 20.9935 33.0065 21.18 32.82C21.3665 32.6335 21.5879 32.4856 21.8315 32.3847C22.0751 32.2838 22.3363 32.2318 22.6 32.2318C22.8637 32.2318 23.1249 32.2838 23.3685 32.3847C23.6121 32.4856 23.8335 32.6335 24.02 32.82L26.84 35.66C27.0259 35.8475 27.2471 35.9962 27.4909 36.0978C27.7346 36.1993 27.996 36.2516 28.26 36.2516C28.524 36.2516 28.7854 36.1993 29.0292 36.0978C29.2729 35.9962 29.4941 35.8475 29.68 35.66L40.98 24.34C41.1665 24.1535 41.3879 24.0056 41.6315 23.9047C41.8751 23.8038 42.1363 23.7518 42.4 23.7518C42.6637 23.7518 42.9249 23.8038 43.1685 23.9047C43.4121 24.0056 43.6335 24.1535 43.82 24.34C44.0065 24.5265 44.1544 24.7479 44.2553 24.9915C44.3562 25.2351 44.4082 25.4963 44.4082 25.76C44.4082 26.0237 44.3562 26.2849 44.2553 26.5285C44.1544 26.7721 44.0065 26.9935 43.82 27.18Z"
                fill="#34A853"
              />
            </svg>
          )}
          <div className={styles['frame-8404']}>
            <div className={styles.successful}>{title}</div>
            <div className={styles['frame-8345']}>
              <div className={styles['frame-8344']}>
                <div className={styles['feedback-message']}>{message}</div>
              </div>
              <div className={styles[buttonStyle]}>
                <a className={styles[buttonTextStyle]} href={link}>
                  {buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FeedbackModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
  buttonTextStyle: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.bool,
};

FeedbackModal.defaultProps = {
  icon: false,
};

export default FeedbackModal;
