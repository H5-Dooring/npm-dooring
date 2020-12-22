import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ItemCallback } from 'react-grid-layout';
import ViewRender from '../core/ViewRender';
import { uuid } from '../tool';
import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import styles from './index.less';

interface SourceBoxProps {
  pointData:  { id: string; item: any; point: any; isMenu?: any }[];
  curPoint: any;
  pageConfig: any;
  scaleNum: number;
  canvasId: string;
  allType: string[];
  dragState: { x: number; y: number };
  setDragState: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  addPointData: (data:any) => {};
  copyPointData: (data:any) => {};
  delPointData: (data:any) => {};
  modPointData: (data:any) => {};
}

const SourceBox = memo((props: SourceBoxProps) => {
  const { 
    pointData,
    curPoint,
    pageConfig,
    scaleNum, 
    canvasId, 
    allType, 
    dragState, 
    setDragState, 
    addPointData,
    copyPointData,
    delPointData,
    modPointData
  } = props;

  const [canvasRect, setCanvasRect] = useState([]);
  const [{ isOver }, drop] = useDrop({
    accept: allType,
    drop: (item, monitor) => {
      let parentDiv:any = document.getElementById(canvasId),
        pointRect = parentDiv.getBoundingClientRect(),
        top = pointRect.top,
        pointEnd:any = monitor.getSourceClientOffset(),
        y = pointEnd.y < top ? 0 : pointEnd.y - top,
        col = 24, // 网格列数
        cellHeight = 2,
        w = item.type === 'Icon' ? 3 : col;
      // 转换成网格规则的坐标和大小
      let gridY = Math.ceil(y / cellHeight);
      addPointData({
        id: uuid(6, 10),
        item,
        point: { i: `x-${pointData.length}`, x: 0, y: gridY, w, h: item.h, isBounded: true },
        status: 'inToCanvas'
      })
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  const dragStop: ItemCallback = (layout, oldItem, newItem, placeholder, e, element) => {
    const curPointData = pointData.filter(item => item.id === newItem.i)[0];
    modPointData({ ...curPointData, point: newItem })
  };

  const onDragStart: ItemCallback = (layout, oldItem, newItem, placeholder, e, element) => {
    window.dr_stop = 0;
    const curPointData = pointData.filter(item => item.id === newItem.i)[0];
    modPointData({ ...curPointData })
  };

  const onResizeStop: ItemCallback = (layout, oldItem, newItem, placeholder, e, element) => {
    const curPointData = pointData.filter(item => item.id === newItem.i)[0];
    modPointData({ ...curPointData, point: newItem })
  };

  const handleContextMenuDel = () => {
    if(curPoint) {
      delPointData({ id: curPoint.id })
    }
  };

  const handleContextMenuCopy = () => {
    if(curPoint) {
      copyPointData({ id: curPoint.id })
    }
  };

  const onConTextClick = (type:string) => {
    if(type === 'del') {
      handleContextMenuDel()
    }else if(type === 'copy') {
      handleContextMenuCopy()
    }
  };

  const MyAwesomeMenu = useCallback(() => (
    <Menu id='menu_id'>
      <Item onClick={() => onConTextClick('copy')}>复制</Item>
      <Item onClick={() => onConTextClick('del')}>删除</Item>
    </Menu>
  ), [onConTextClick]);

  useEffect(() => {
    let { width, height } = document.getElementById(canvasId)!.getBoundingClientRect();
    setCanvasRect([width, height]);
  }, [canvasId]);

  useEffect(() => {
    function pasteFn (event:any) {
      let items = event.clipboardData && event.clipboardData.items;
      let file = null;
      if (items && items.length) {
        // 检索剪切板items
        let item:any = Array.from(items).pop();
        if (item.type.indexOf('image') !== -1) {
          let file = item.getAsFile();

          const reader = new FileReader();
          reader.onload = function(e) {
            const img = new Image();
            img.src = e?.target?.result;
            img.onload = function() {
              let realH = Math.round(img.height / 2),
                  realW = Math.round(24 * img.width / 375),
                  w = img.width > 375 ? 24 : realW,
                  h = Math.round(realH / realW * w);
              
              addPointData({
                id: uuid(6, 10),
                item: {
                  category: "base",
                  config: {
                    align: "center",
                    imgUrl: [
                      { uid: "001", name: file.name, status: "done", url: e?.target?.result }
                    ],
                    round: 0,
                    subTitColor: "rgba(0,0,0,1)",
                    subTitFontSize: 16,
                    subTitFontWeight: "400",
                    subTitText: "",
                    titColor: "rgba(0,0,0,1)",
                    titFontSize: 20,
                    titFontWeight: "400",
                    titText: "",
                    translate: [0, 0],
                  },
                  h,
                  type: "Image"
                },
                point: { i: `x-${pointData.length}`, x: 0, y: 300, w, h, isBounded: true },
                status: 'inToCanvas'
              })
            }
          };
          reader.readAsDataURL(file);
        }
      }
      // 此时file就是剪切板中的图片文件
    }

    document.addEventListener('paste', pasteFn, false);
    return () => {
      document.removeEventListener('paste', pasteFn, false);
    }
  }, [])

  const opacity = isOver ? 0.7 : 1;

  const render = useMemo(() => {
    return (
      <Draggable
        position={dragState}
        handle=".js_box"
        onStop={(e: DraggableEvent, data: DraggableData) => {
          setDragState({ x: data.x, y: data.y });
        }}
      >
        <div className={styles.canvasBox}>
          <MenuProvider id="menu_id">
            <div
              style={{
                transform: `scale(${scaleNum})`,
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <div
                id={canvasId}
                className={styles.canvas}
                style={{
                  opacity,
                  backgroundColor: pageConfig.bgColor,
                  backgroundImage: pageConfig.bgImage ? `url(${pageConfig.bgImage[0].url})` : 'initial',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
                ref={drop}
              >
                {pointData.length > 0 ? (
                  <ViewRender
                    pointData={pointData}
                    width={canvasRect[0] || 0}
                    dragStop={dragStop}
                    onDragStart={onDragStart}
                    onResizeStop={onResizeStop}
                  />
                ) : null}
              </div>
            </div>
          </MenuProvider>
        </div>
      </Draggable>
    );
  }, [
    canvasId,
    canvasRect,
    dragState,
    dragStop,
    drop,
    onDragStart,
    onResizeStop,
    opacity,
    pointData,
    scaleNum,
    setDragState
  ]);
  return <>
          { render }
          <MyAwesomeMenu />
         </>
});

export default SourceBox
