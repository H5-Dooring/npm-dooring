import Loading from '@/components/LoadingCp';
import { useMemo, memo, FC } from 'react';
import React, { Suspense } from 'react';
// import { AllTemplateType } from './schema';

export type componentsType = 'media' | 'base' | 'visible' | 'shop';

const DynamicFunc = (type: any, componentsType: componentsType) =>
  (props: DynamicType) => {
    const { config, isTpl } = props;
    const Component = React.lazy(():any => {
      if (componentsType === 'base') {
        return import(`@/components/BasicShop/BasicComponents/${type}`);
      } else if (componentsType === 'media') {
        return import(`@/components/BasicShop/MediaComponents/${type}`);
      } else if(componentsType === 'visible') {
        return import(`@/components/BasicShop/VisualComponents/${type}`);
      } else if(componentsType === 'shop') {
        return import(`@/components/BasicShop/ShopComponents/${type}`);
      }
    });
    return <Component {...config} isTpl={isTpl} />;
  };
  

type DynamicType = {
  isTpl: boolean;
  config: { [key: string]: any };
  type: any;
  componentsType: componentsType;
  category: componentsType;
};
const DynamicEngine = memo((props: DynamicType) => {
  const { type, config, category } = props;
  const Dynamic = useMemo(() => {
    return (DynamicFunc(type, category) as unknown) as FC<DynamicType>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, config]);

  return <Suspense fallback={Loading}>
           <Dynamic {...props} />
         </Suspense>
});

export default DynamicEngine;
