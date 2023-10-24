import { ReactNode } from 'react';
import styles from './App.module.css';

interface SidebarProps {
  children: ReactNode;
}

function Container({ children }: SidebarProps) {
  return <div className={styles['dashboard-body']}>{children}</div>;
}

export default Container;
