import React from 'react';
import styles from './index.less';

export default () => (
  <div
    style={{
      paddingTop: 100,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className={styles.loader}></div>
  </div>
);
