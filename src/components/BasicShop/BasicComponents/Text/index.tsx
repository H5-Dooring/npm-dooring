import React, { memo } from 'react';
import styles from './index.less';
import { ITextConfig } from './schema';
import logo from '../../../../assets/12-文本.png';

interface TextType extends ITextConfig {
  isTpl?: boolean;
}

const Text = memo((props: TextType) => {
  const { align, text, fontSize, color, lineHeight, isTpl, link, fontWeight, bgColor, padding, radius } = props;
  const toLink = () => {
    if(link) {
      window.location.href = link.indexOf('http') > -1 ? link : `http://${link}`;
    }
  }
  const isEditorPage = window.location.pathname.indexOf('editor') > -1
  return isTpl ? (
    <div>
      <img style={{width: '100%'}} src={logo} alt=""></img>
    </div>
  ) : (
    <div 
      className={styles.textWrap} 
      style={{ 
        color, 
        textAlign: align, 
        fontSize, 
        lineHeight, 
        fontWeight: +fontWeight,
        backgroundColor: bgColor,
        padding,
        borderRadius: radius,
        pointerEvents: isEditorPage ? 'none' : 'fill'
      }} onClick={toLink}>
      {text}
    </div>
  );
});
export default Text;
