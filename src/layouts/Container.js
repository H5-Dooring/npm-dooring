import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Result, Tabs } from 'antd';
import {
  PieChartOutlined,
  PlayCircleOutlined,
  HighlightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ShopOutlined
} from '@ant-design/icons';
import key from 'keymaster';
import HeaderComponent from './components/Header';
import SourceBox from './SourceBox';
import TargetBox from './TargetBox';
import Calibration from './components/Calibration';
import DynamicEngine from '../core/DynamicEngine';
import FormEditor from '../core/FormRender';
import CanvasControl from './components/CanvasControl';
import template from '../components/BasicShop/BasicComponents/template';
import mediaTpl from '../components/BasicShop/MediaComponents/template';
import graphTpl from '../components/BasicShop/VisualComponents/template';
import shopTpl from '../components/BasicShop/ShopComponents/template';
import schema from '../components/BasicShop/schema';
import { throttle, uuid } from '../tool';

import styles from './index.less';

const { TabPane } = Tabs;

function overSave(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

const Container = props => {
  const [scaleNum, setScale] = useState(1);
  const [rightColla, setRightColla] = useState(true);
  const [dragstate, setDragState] = useState({ x: 0, y: 0 });
  const [diffmove, setDiffMove] = useState({
    start: { x: 0, y: 0 },
    move: false,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [pointData, setPointdata] = useState(JSON.parse(localStorage.getItem('userData') || "[]"));
  const [pageConfig, setPageConfig] = useState(localStorage.getItem('pageConfig') || "{}");
  const [curPoint, setCurPoint] = useState(null);
  const [userPages, setUserPages] = useState([]);

  const containerRef = useRef(null);

  // 指定画布的id
  let canvasId = 'js_canvas';

  const backSize = () => {
    setScale(1);
    setDragState({ x: 0, y: 0 });
  };

  const CpIcon = {
    base: <HighlightOutlined />,
    media: <PlayCircleOutlined />,
    visible: <PieChartOutlined />,
    shop: <ShopOutlined />
  };

  const generateHeader = (type, text) => {
    return (
      <div>
        {CpIcon[type]} {text}
      </div>
    );
  };

  const handleSlider = useMemo(() => {
    return (type) => {
      if (type) {
        setScale((prev) => +(prev + 0.1).toFixed(1));
      } else {
        setScale((prev) => +(prev - 0.1).toFixed(1));
      }
    };
  }, []);

  const modPointData = (payload) => {
    const { id } = payload
    const newPointData = pointData.map(item => {
      if(item.id === id) {
        return payload
      }
      return { ...item }

    })
    overSave('userData', newPointData)
    // 组装editableEl
    const { config, h, type, category } = payload.item
    const editableEl = schema[type].editData

    setPointdata(newPointData)
    setCurPoint({...payload, item: { config, h, type, category, editableEl }})
  }

  const handleFormSave = data => {
    modPointData({ ...curPoint, item: { ...curPoint.item, config: data } })
  };

  const clearData = () => {
    overSave('userData', [])
    overSave('pageConfig', {})
    setPointdata([])
    setCurPoint(null)
  };

  const changeRightColla = useMemo(() => {
    return (c) => {
      setRightColla(c);
    };
  }, []);

  const modPageConfig = useCallback((payload) => {
    overSave('pageConfig', payload)
    setPageConfig(payload)
  },[]);

  const addPointData = (payload) => {
    let newPointData = [...pointData, payload]
    overSave('userData', newPointData)
    // 组装editableEl
    const { config, h, type, category } = payload.item
    const editableEl = schema[type].editData
    setPointdata(newPointData)
    setCurPoint({...payload, item: { config, h, type, category, editableEl }})
  }

  const delPointData = (payload) => {
    const { id } = payload
    const newPointData = pointData.filter(item => item.id !== id)
    overSave('userData', newPointData)
    setPointdata(newPointData)
    setCurPoint(null)
  }

  const copyPointData = (payload) => {
    const { id } = payload
    const newPointData = []
    pointData.forEach(item => {
      newPointData.push({ ...item })
      if(item.id === id) {
        newPointData.push({ ...item, id: uuid(6, 10) })
      }
    })
    overSave('userData', pointData)
    setPointdata(newPointData)
  }

  const redohandler = () => {
    
  };

  const undohandler = () => {
    
  };

  const addUserPage = useCallback((payload) => {
    let newUserPages = [...userPages, payload]
    overSave('userPages', newUserPages)
    setUserPages(newUserPages)
    setPointdata([])
  }, []);

  const importTpl = (payload) => {
    const { pageConfig, tpl } = payload;
    overSave('userData', tpl)
    overSave('pageConfig', pageConfig || {})
    setPointdata(tpl)
    setPageConfig(pageConfig)
    setCurPoint(null)
  };

  useEffect(() => {
    if (pstate?.curPoint && pstate.curPoint.status === 'inToCanvas') {
      setRightColla(false);
    }
  }, [pstate?.curPoint]);

  const allType = useMemo(() => {
    let arr = [];
    template.forEach(v => {
      arr.push(v.type);
    });
    mediaTpl.forEach(v => {
      arr.push(v.type);
    });
    graphTpl.forEach(v => {
      arr.push(v.type);
    });
    shopTpl.forEach(v => {
      arr.push(v.type);
    });
    return arr;
  }, []);

  const ref = useRef(null);
  const renderRight = useMemo(() => {
    return (
      <div
        ref={ref}
        className={styles.attrSetting}
        style={{
          transition: 'all ease-in-out 0.5s',
          transform: rightColla ? 'translate(100%,0)' : 'translate(0,0)',
        }}
      >
        {pointData.length && curPoint ? (
          <>
            <div className={styles.tit}>属性设置</div>
            <FormEditor
              config={curPoint.item.editableEl}
              uid={curPoint.id}
              defaultValue={curPoint.item.config}
              onSave={handleFormSave}
              rightPannelRef={ref}
            />
          </>
        ) : (
          <div style={{ paddingTop: '100px' }}>
            <Result
              status="404"
              title="还没有数据哦"
              subTitle="赶快拖拽组件来生成你的H5页面吧～"
            />
          </div>
        )}
      </div>
    )
  }, [
    pointData.length,
    curPoint,
    // handleDel,
    handleFormSave,
    pointData.length,
    rightColla
  ]);

  const mousemovefn = useMemo(() => {
    return (e) => {
      if (diffmove.move) {
        let diffx;
        let diffy;
        const newX = e.clientX;
        const newY = e.clientY;
        diffx = newX - diffmove.start.x;
        diffy = newY - diffmove.start.y;
        setDiffMove({
          start: {
            x: newX,
            y: newY,
          },
          move: true,
        });
        setDragState(prev => {
          return {
            x: prev.x + diffx,
            y: prev.y + diffy,
          };
        });
      }
    };
  }, [diffmove.move, diffmove.start.x, diffmove.start.y]);

  const mouseupfn = useMemo(() => {
    return () => {
      setDiffMove({
        start: { x: 0, y: 0 },
        move: false,
      });
    };
  }, []);

  const mousedownfn = useMemo(() => {
    return (e) => {
      if (e.target === containerRef.current) {
        setDiffMove({
          start: {
            x: e.clientX,
            y: e.clientY,
          },
          move: true,
        });
      }
    };
  }, []);

  const onwheelFn = useMemo(() => {
    return (e) => {
      if (e.deltaY < 0) {
        setDragState(prev => ({
          x: prev.x,
          y: prev.y + 40,
        }));
      } else {
        setDragState(prev => ({
          x: prev.x,
          y: prev.y - 40,
        }));
      }
    };
  }, []);

  useEffect(() => {
    if (diffmove.move && containerRef.current) {
      containerRef.current.style.cursor = 'move';
    } else {
      containerRef.current.style.cursor = 'default';
    }
  }, [diffmove.move]);

  const changeCollapse = useMemo(() => {
    return (c) => {
      setCollapsed(c);
    };
  }, []);

  const tabRender = useMemo(() => {
    if (collapsed) {
      return (
        <>
          <TabPane tab={generateHeader('base', '')} key="1"></TabPane>
          <TabPane tab={generateHeader('media', '')} key="2"></TabPane>
          <TabPane tab={generateHeader('visible', '')} key="3"></TabPane>
          <TabPane tab={generateHeader('shop', '')} key="4"></TabPane>
        </>
      );
    } else {
      return (
        <>
          <TabPane tab={generateHeader('base', '')} key="1">
            <div className={styles.ctitle}>基础组件</div>
            {template.map((value, i) => {
              return (
                <TargetBox item={value} key={i} canvasId={canvasId}>
                  <DynamicEngine
                    {...value}
                    config={schema[value.type].config}
                    componentsType="base"
                    isTpl={true}
                  />
                </TargetBox>
              );
            })}
          </TabPane>
          <TabPane tab={generateHeader('media', '')} key="2">
            <div className={styles.ctitle}>媒体组件</div>
            {mediaTpl.map((value, i) => (
              <TargetBox item={value} key={i} canvasId={canvasId}>
                <DynamicEngine
                  {...value}
                  config={schema[value.type].config}
                  componentsType="media"
                  isTpl={true}
                />
              </TargetBox>
            ))}
          </TabPane>
          <TabPane tab={generateHeader('visible', '')} key="3">
            <div className={styles.ctitle}>可视化组件</div>
            {graphTpl.map((value, i) => (
              <TargetBox item={value} key={i} canvasId={canvasId}>
                <DynamicEngine
                  {...value}
                  config={schema[value.type].config}
                  componentsType={'visible'}
                  isTpl={true}
                />
              </TargetBox>
            ))}
          </TabPane>
          <TabPane tab={generateHeader('shop', '')} key="4">
            <div className={styles.ctitle}>商品组件</div>
            {shopTpl.map((value, i) => (
              <TargetBox item={value} key={i} canvasId={canvasId}>
                <DynamicEngine
                  {...value}
                  config={schema[value.type].config}
                  componentsType={'shop'}
                  isTpl={true}
                />
              </TargetBox>
            ))}
          </TabPane>
        </>
      );
    }
  }, [canvasId, collapsed, generateHeader, graphTpl, mediaTpl, schema, template]);

  useEffect(() => {
    // 复制
    key('⌘+c, ctrl+c', () => {
      if(!window.dr_stop && curPoint) {
        const { id } = curPoint
        const newPointData = []
        pointData.forEach(item => {
          newPointData.push({ ...item })
          if(item.id === id) {
            newPointData.push({ ...item, id: uuid(6, 10) })
          }
        })
        overSave('userData', newPointData)

        setPointdata(newPointData)
      }
    })
    // 删除
    key('delete, backspace', () => {
      if(!window.dr_stop && curPoint) {
        const { id } = curPoint
        const newPointData = pointData.filter(item => item.id !== id)
        overSave('userData', newPointData)
        setPointdata(newPointData)
        setCurPoint(null)
      }
    })
  }, [])
  
  return (
    <div className={styles.editorWrap}>
      <HeaderComponent
        redohandler={redohandler}
        undohandler={undohandler}
        pointData={pointData}
        clearData={clearData}
        location={props.location}
        importTpl={importTpl}
        addUserPage={addUserPage}
        pageConfig={pageConfig}
        modePageConfig={modePageConfig}
      />
      <div className={styles.container}>
        <div 
          className={styles.list}
          style={{
            transition: 'all ease-in-out 0.5s',
            position: 'fixed',
            width: collapsed ? '50px' : '350px',
            overflow: 'hidden',
            zIndex: 200,
            boxShadow: 'none',
          }}
        >
          <div className={styles.componentList}>
            <Tabs
              className="editorTabclass"
              onTabClick={() => changeCollapse(false)}
              defaultActiveKey="1"
              tabPosition={'left'}
            >
              {tabRender}
            </Tabs>
          </div>
          <div
            className={styles.collapsed}
            style={{ position: 'absolute', bottom: '100px', left: '20px' }}
            onClick={() => changeCollapse(!collapsed)}
          >
            {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          </div>
        </div>
        <div
          style={{
            width: collapsed ? '50px' : '350px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>
        <div 
          className={styles.tickMark} 
          ref={containerRef}
          onMouseDown={mousedownfn}
          onMouseMove={throttle(mousemovefn, 500)}
          onMouseUp={mouseupfn}
          onMouseLeave={mouseupfn}
          onWheel={onwheelFn}
          id="calibration"
        >
          <div className={styles.tickMarkTop}>
            <Calibration direction="up" id="calibrationUp" multiple={scaleNum} />
          </div>
          <div className={styles.tickMarkLeft}>
            <Calibration direction="right" id="calibrationRight" multiple={scaleNum} />
          </div>
          <SourceBox 
            dragState={dragstate}
            setDragState={setDragState}
            scaleNum={scaleNum} 
            canvasId={canvasId} 
            allType={allType}
            pointData={pointData}
            curPoint={curPoint}
            pageConfig={pageConfig}
            addPointData={addPointData}
            copyPointData={copyPointData}
            delPointData={delPointData}
            modPointData={modPointData}
          />
          <CanvasControl
            scaleNum={scaleNum}
            handleSlider={handleSlider}
            backSize={backSize}
          />
        </div>
        { renderRight }
        <div
          className={styles.rightcolla}
          style={{
            position: 'absolute',
            right: rightColla ? 0 : '304px',
            transform: 'translate(0,-50%)',
            transition: 'all ease-in-out 0.5s',
          }}
          onClick={() => changeRightColla(!rightColla)}
        >
          {!rightColla ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>
        <div
          style={{
            width: rightColla ? 0 : '304px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Container
