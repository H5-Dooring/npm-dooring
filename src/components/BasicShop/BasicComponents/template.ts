import Carousel from './Carousel/template';
import Footer from './Footer/template';
import Form from './Form/template';
import Header from './Header/template';
import Icon from './Icon/template';
import Image from './Image/template';
import LongText from './LongText/template';
import Notice from './Notice/template';
import Card from './Card/template';
import Qrcode from './Qrcode/template';
import Text from './Text/template';
import XButton from './XButton/template';
import WhiteTpl from './WhiteTpl/template';
import RichText from './RichText/template';

const basicTemplate = [
  Carousel,
  Form,
  Header,
  Footer,
  Icon,
  Image,
  WhiteTpl,
  LongText,
  Notice,
  Card,
  Qrcode,
  Text,
  XButton,
  RichText
];
const BasicTemplate = basicTemplate.map(v => {
  return { ...v, category: 'base' };
});

export default BasicTemplate;
