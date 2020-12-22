import {
  IColorConfigType,
  INumberConfigType,
  ITextConfigType,
  IUploadConfigType,
  ISelectConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  TTextDefaultType,
  TUploadDefaultType,
  TSelectDefaultType,
} from '@/core/FormComponents/types';

import { serverUrl } from '@/utils/tool';

export type TLevelSelectKeyType = 'L' | 'M' | 'Q' | 'H';

export type TQrcodeEditData = Array<
  IUploadConfigType | ITextConfigType | IColorConfigType | INumberConfigType | ISelectConfigType<TLevelSelectKeyType>
>;
export interface IQrcodeConfig {
  url: TTextDefaultType;
  codeSize: TNumberDefaultType;
  imgUrl: TUploadDefaultType;
  bgColor: TColorDefaultType;
  fgColor: TColorDefaultType;
  level: TSelectDefaultType<TLevelSelectKeyType>;
  imgW: TNumberDefaultType;
  imgH: TNumberDefaultType;
}

export interface IQrcodeSchema {
  editData: TQrcodeEditData;
  config: IQrcodeConfig;
}

const Qrcode: IQrcodeSchema = {
  editData: [
    {
      key: 'url',
      name: 'url地址',
      type: 'Text',
    },
    {
      key: 'codeSize',
      name: '二维码尺寸',
      type: 'Number',
    },
    {
      key: 'bgColor',
      name: '背景色',
      type: 'Color',
    },
    {
      key: 'fgColor',
      name: '前景色',
      type: 'Color',
    },
    {
      key: 'level',
      name: '等级',
      type: 'Select',
      range: [
        {
          key: 'L',
          text: '低',
        },
        {
          key: 'M',
          text: '中',
        },
        {
          key: 'Q',
          text: '良',
        },
        {
          key: 'H',
          text: '高',
        },
      ],
    },
    {
      key: 'imgUrl',
      name: '二维码图标',
      type: 'Upload',
      isCrop: true,
      cropRate: 1,
    },
    {
      key: 'imgW',
      name: '图标宽度',
      type: 'Number',
    },
    {
      key: 'imgH',
      name: '图标高度',
      type: 'Number',
    },
  ],
  config: {
    url: 'https://github.com/MrXujiang/h5-Dooring',
    codeSize: 180,
    bgColor: 'rgba(255,255,255,1)',
    fgColor: 'rgba(0,0,0,1)',
    level: 'L',
    imgUrl: [
      {
        uid: '001',
        name: 'image.png',
        status: 'done',
        url: `http://h5.dooring.cn/h5_plus/static/logo.3d15201a.svg`,
      },
    ],
    imgW: 48,
    imgH: 12
  },
};

export default Qrcode;
