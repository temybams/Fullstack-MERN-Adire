import styles from './404.module.css';

function Loader() {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['loading-spinner']} />
    </div>
  );
}

export default Loader;
