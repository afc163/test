import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default ({ className, data: { links, copyright } }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {
        links &&
        <div className={styles.links}>
          {links.map(link => <a href={link.href}>{link.title}</a>)}
        </div>
      }
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </div>
  );
};
