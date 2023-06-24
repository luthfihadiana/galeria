import Image from 'next/image'
import styles from './Modal.module.css';

export default function Modal({
  visible,
  onClose,
  children,
  title = '',
}){
  return(
    <div className={`${styles.backdrop} ${!visible ? styles.hide : ''}`}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
}