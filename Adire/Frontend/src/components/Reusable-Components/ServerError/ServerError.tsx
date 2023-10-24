import styles from './ServerError.module.css';

function Loader() {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['loading-spinner']} />
    </div>
  );
}

export default Loader;
