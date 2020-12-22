import React from 'react';
import A from '../../assets/A.png';
import B from '../../assets/B.png';
import C from '../../assets/3.png';
import D from '../../assets/D.png';
import E from '../../assets/F.png';
import G from '../../assets/4.png';
import H from '../../assets/5.png';
import F from '../../assets/6.png';
import B2 from '../../assets/2A.png';
import styles from './index.less';

const Help = () => {
  return (
    <div className={styles.helpWrap}>
      <h2>H5-Dooring使用指南</h2>
      <div className={styles.helpItem}>
        <h3>1. 首页功能介绍</h3>
        <div className={styles.imgWrap}><img src={A} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>2. 编辑器页面 - 基本结构说明</h3>
        <div className={styles.imgWrap}><img src={B} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>3. 编辑器页面 - 功能说明</h3>
        <div className={styles.imgWrap}><img src={C} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>4. 编辑器页 - 复制/删除功能说明</h3>
        <div className={styles.imgWrap}><img src={D} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>5. 编辑器一键复制图片到画布使用说明</h3>
        <div className={styles.imgWrap}><img src={E} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>6. 管理后台入口</h3>
        <div className={styles.imgWrap}><img src={G} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>7. 页面管理系统使用</h3>
        <div className={styles.imgWrap}><img src={H} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>8. 页面数据分析, 数据收集</h3>
        <div className={styles.imgWrap}><img src={F} alt="H5编辑器, H5制作, H5设计"/></div>
      </div>
      <div className={styles.helpItem}>
        <h3>9. 本地如何运行下载好的代码</h3>
        <div className={styles.imgWrap}><img src={B2} alt="H5编辑器, H5制作, H5设计"/></div>
        <ul>
          <li>1. 可以将压缩包解压直接放到服务器根目录, 访问根目录地址即可</li>
          <li>2. vscode安装Live Server插件, 将下载的压缩包解压成文件夹, 用vscode打开, 点击Live Server即可, 注意要删除启动路径的index.html, 改成/</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
