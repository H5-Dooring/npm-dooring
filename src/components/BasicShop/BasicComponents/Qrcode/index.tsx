import React, { memo } from 'react';
import QRCode from 'qrcode.react';
import { IQrcodeConfig } from './schema';
import logo from '../../../../assets/10-二维码.png';

interface QrcodeType extends IQrcodeConfig {
  isTpl?: boolean;
}

const Qrcode = memo((props: QrcodeType) => {
  const { imgUrl, url, bgColor, fgColor, codeSize, isTpl, imgW, imgH } = props;
  return isTpl ? (
    <div>
      <img style={{width: '100%'}} src={logo} alt=""></img>
    </div>
  ) : (
    <div style={{ width: '100%', maxWidth: '220px', margin: '16px auto', textAlign: 'center' }}>
      {/* <img src={qrcode && qrcode[0].url} alt={text} style={{ width: '100%' }} draggable="false" /> */}
      <QRCode value={url} size={codeSize} bgColor={bgColor} fgColor={fgColor} imageSettings={{src: imgUrl[0].url, x: null, y: null, excavate: true, height: imgH, width: imgW}} />
    </div>
  );
});

export default Qrcode;
