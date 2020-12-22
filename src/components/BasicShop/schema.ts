import BasicSchema from './BasicComponents/schema';
import MediaSchema from './MediaComponents/schema';
import VisualSchema from './VisualComponents/schema';
import ShopSchema from './ShopComponents/schema';

const schema = {
  ...BasicSchema,
  ...MediaSchema,
  ...VisualSchema,
  ...ShopSchema
};

export default schema;
