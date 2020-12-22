import ZhuanLan from './ZhuanLan/template';
import Tab from './Tab/template';
import List from './List/template';

const basicTemplate = [
  ZhuanLan,
  List,
  Tab
];
const ShopTemplate = basicTemplate.map(v => {
  return { ...v, category: 'shop' };
});

export default ShopTemplate;
