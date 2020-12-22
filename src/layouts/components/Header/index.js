import React, { useRef, useState, useMemo, useCallback, useEffect, memo } from 'react'
import { 
  Button, 
  Input, 
  Select, 
  Popover, 
  Modal, 
  Tooltip, 
  message, 
  Alert,
  Upload,
  Badge
} from 'antd'
import {
  ArrowLeftOutlined,
  MobileOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  AuditOutlined,
  UndoOutlined,
  RedoOutlined,
  FileAddOutlined,
  SaveOutlined,
  UploadOutlined,
  InstagramOutlined
} from '@ant-design/icons'
import QRCode from 'qrcode.react'
import { saveAs } from 'file-saver'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import ModalTpl from '../../../components/ModalTpl'
import cateTpl from '../../../components/ModalTpl/cate'
import MyUpload from '../../../core/FormComponents/Upload';
import Color from '../../../core/FormComponents/Color';
import { uuid, serverUrl } from '../../../tool';
import Logo from '../../../assets/logo.svg';

import styles from './index.less'

const { TextArea } = Input;
const { Option } = Select;

const HeaderComponent = memo((props) => {
  const { pointData, clearData, location, undohandler, redohandler, importTpl, addUserPage, modePageConfig, pageConfig } = props
  const [ showFaceModal, setShowFaceModal ] = useState(false)
  const [showModalTpl, setShowModalTpl] = useState(false)
  const [pageConfVisible, setPageConfVisible] = useState(false)
  const [showModalIframe, setShowModalIframe] = useState(false)
  const [saveTplModalVisible, setSaveTplModalVisible] = useState(false)
  const [saveLink, setSaveLink] = useState('')
  const [saveH5Link, setSaveH5Link] = useState('')
  const [faceUrl, setFaceUrl] = useState('')
  const iptRef = useRef(null)
  const selectRef = useRef(null)

  const config = {
    title: 'dooring温馨提示',
    content: (
      <div>
        新建页面前是否保存已有更改？
      </div>
    ),
    okText: '确定',
    cancelText: '取消',
    onOk() {
      addUserPage && addUserPage(pointData)
      clearData && clearData()
    },
    onCancel() {
      console.log('cancel')
    }
  }

  const toPreview = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData))
  }

  const toHelp = () => {
    window.open('/h5_plus/help')
  }

  const content = () => {
    const { tid } = location.query || '';
    return <QRCode value={`${window.location.protocol}//${window.location.host}/h5_plus/preview?tid=${tid}`} />
  }

  const pageConfigData = {...pageConfig};

  const handlePageChange = (v, key) => {
    if(key === 'remove') {
      delete pageConfigData['bgImage']
    }else {
      pageConfigData[key] = v
    }
  }

  const handlePageSubmit = () => {
    setPageConfVisible(false);
    modePageConfig && modePageConfig(pageConfigData);
  }

  const pageConfigView = useCallback(() => {
    return <div className={styles.pageConfig}>
      <div className={styles.formControl}>
        <span className={styles.label}>标题:</span>
        <Input defaultValue={pageConfig.title} placeholder="请输入页面标题" onChange={(e) => handlePageChange(e.target.value, 'title')} />
      </div>
      <div className={styles.formControl}>
        <span className={styles.label}>描述:</span>
        <TextArea defaultValue={pageConfig.desc} placeholder="请输入页面描述" onChange={(e) => handlePageChange(e.target.value, 'desc')} />
      </div>
      <div className={styles.formControl}>
        <span className={styles.label}>背景色:</span>
        <Color value={pageConfig.bgColor || 'rgba(255,255,255,1)'} onChange={(v) => handlePageChange(v, 'bgColor')} />
      </div>
      <div className={styles.formControl}>
        <span className={styles.label}>背景图片:</span>
        <div style={{position: 'relative', width: '100%'}}><MyUpload fileList={pageConfig.bgImage || []} onChange={(v) => handlePageChange(v, 'bgImage')} onRemove={(v) => handlePageChange(v, 'remove')} /></div>
      </div>
      <div className={styles.formControl}>
      <span className={styles.label}></span>
        <Button type="primary" style={{marginRight: '20px'}} onClick={handlePageSubmit} block>保存</Button>
      </div>
    </div>
  },[pageConfig])

  const handleSaveTpl = () => {
    setSaveTplModalVisible(true)
    setSaveLink('')
  }

  const handleSelectChange = (v) => {
    selectRef.current = v;
  }

  const handleSaveTplOk = () => {
    if(saveLink) {
      setSaveTplModalVisible(false)
      return
    }
    let name = iptRef.current.state.value
    let cate = selectRef.current
    if(!cate || !name) {
      message.error('模版名称和模版分类不能为空!')
      return
    }

    console.log({ name, cate, img: faceUrl, tpl: pointData, pageConfig })
  }

  const handleSaveTplCancel = () => {
    setSaveTplModalVisible(false)
    setSaveLink('')
  }

  const useTemplate = () => {
    setShowModalTpl(true)
  }

  const downLoadJson = () => {
    const json = pointData.map(v => ({...v, item: {config: v.item.config, h: v.item.h, type: v.item.type, category: v.item.category}}))
    const config = { tpl: json, pageConfig }
    const jsonStr = JSON.stringify(config)
    const blob = new Blob([jsonStr], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "template.json")
  }

  const handleSaveCode = () => {
    Modal.confirm({
      title: '确定要下载吗? ',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log(pageConfig, pointData)
      }
    }) 
  }

  const toBack = () => {
    const { tid } = props.location.query || ''
  };

  const savePreview = () => {
    console.log(pointData, pageConfig)
  }

  const handleSelectTpl = (data) => {
    importTpl && importTpl(data)
  }

  const saveContent = useCallback(() => {
    return <div className={styles.saveWrap}>
      <div style={{fontSize: '12px', color: '#ccc'}}>注:发布内容应遵循国家相关法律规定, 否则平台放有权删除内容</div>
      <div style={{textAlign: 'center', padding: '10px 0'}}><QRCode value={saveH5Link} /></div>
      <CopyToClipboard text={saveH5Link}
          onCopy={() => { message.success('已复制到剪切板')}}>
          <Button type="primary" size="small">一键复制地址</Button>
      </CopyToClipboard>
    </div>  
  }, [saveH5Link])

  const savePage = () => {
    console.log(pointData, pageConfig)
  }

  const handleCloseModalTpl = () => {
    setShowModalTpl(false)
  }

  const newPage = () => {
    Modal.confirm(config);
  }

  const generateFace = (flag) => {
    // flag 0为默认图片, 1为生成图片
    if(flag) {
      localStorage.setItem('pointData', JSON.stringify(pointData))
      setShowModalIframe(true)
    }else {
      setFaceUrl(`${serverUrl}/uploads/tpl_default_175166661ea.png`)
    }
  }

  const generatePoster = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData))
    setShowModalIframe(true)
    setTimeout(() => {
      setShowFaceModal(true)
    }, 3600)
  }

  const deleteAll = () => {
    Modal.confirm({
      title: '确认清空画布?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        clearData()
      }
    });
  }

  const handleReloadPage = () => {
    document.getElementById('previewPage').contentWindow.location.reload()
  }

  useEffect(() => {

    // 定义截图子页面句柄函数
    window.getFaceUrl = (url) => {
      setFaceUrl(url)
      setShowModalIframe(false)
    }
  }, [])

  const uploadprops = useMemo(() => ({
    name: 'file',
    showUploadList: false,
    beforeUpload(file, fileList) {
      // 解析并提取json数据
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        importTpl && importTpl(JSON.parse(data))
      };
      reader.readAsText(file);
    }
  }), []);


  return (
    <div className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.backBtn} onClick={toBack}><ArrowLeftOutlined /></div>
          <div className={styles.logo} title="Dooring"><a href={`${serverUrl}/h5_visible`}><img src={Logo} alt="Dooring-强大的h5编辑器" /></a></div>
        </div>
        <div className={styles.controlArea}>
            <Button type="primary" style={{marginRight: '8px'}} onClick={useTemplate}>模版库</Button>
            
            <Button type="link" style={{marginRight: '8px'}} onClick={handleSaveTpl} disabled={!pointData.length}>保存模版</Button>
            
            <Tooltip placement="bottom" title="保存并自动发布">
              <Popover placement="bottom" title={null} content={saveContent} trigger="click">
                <Button type="link" style={{ marginRight: '8px' }} onClick={savePage} disabled={!pointData.length}>
                  <SaveOutlined />
                </Button>
              </Popover>
            </Tooltip>

            <Tooltip placement="bottom" title="上传json文件">
              <Upload {...uploadprops}>
                <Button type="link" style={{ marginRight: '8px' }}>
                  <UploadOutlined />
                </Button>
              </Upload>
            </Tooltip>

            <Tooltip placement="bottom" title="新建页面">
              <Button type="link" style={{ marginRight: '6px' }} title="新建页面" onClick={newPage}>
                <FileAddOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement="bottom" title="下载源码">
              <Button type="link" style={{marginRight: '6px'}} onClick={handleSaveCode} disabled={!pointData.length} title="下载源文件"><DownloadOutlined /></Button>
            </Tooltip>

            <Tooltip placement="bottom" title="下载json文件">
              <Button type="link" style={{marginRight: '6px'}} title="下载json文件" onClick={downLoadJson} disabled={!pointData.length}><CopyOutlined /></Button>
            </Tooltip>

            <Tooltip placement="bottom" title="真机测试">
              <Popover placement="bottom" title={null} content={content} trigger="click">
                  <Button type="link" style={{marginRight: '6px'}} onClick={savePreview} disabled={!pointData.length} title="真机测试"><MobileOutlined /></Button>
              </Popover>
            </Tooltip>

            <Tooltip placement="bottom" title="撤销">
              <Button type="link" style={{ marginRight: '6px' }} title="撤销" onClick={undohandler}>
                <UndoOutlined />
              </Button>
            </Tooltip>
            
            <Tooltip placement="bottom" title="重做">
              <Button type="link" style={{ marginRight: '6px' }} title="重做" onClick={redohandler} disabled={!pointData.length}>
                <RedoOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement="bottom" title="清空">
              <Button type="link" style={{marginRight: '6px'}} title="清空" onClick={deleteAll} disabled={!pointData.length}><DeleteOutlined /></Button>
            </Tooltip>

            <Tooltip placement="bottom" title="一键生成海报分享图">
              <Badge dot offset={[-18, 10]}>
                <Button type="link" style={{marginRight: '6px'}} onClick={generatePoster} disabled={!pointData.length}><InstagramOutlined /></Button>
              </Badge>
            </Tooltip>

            <Button type="link" style={{marginRight: '6px'}} onClick={toPreview} disabled={!pointData.length} title="预览">预览</Button>
            
            <Badge dot offset={[-18, 10]}>
              <Button type="link" onClick={toHelp} title="使用帮助">帮助</Button>
            </Badge>
            
        </div>
        <div className={styles.btnArea}>
          <Popover 
            placement="bottom" 
            title="页面配置" 
            content={pageConfigView} 
            trigger="click" 
            visible={pageConfVisible}
            onVisibleChange={(v) => setPageConfVisible(v)}
          >
            <Button type="primary" ghost style={{marginRight: '12px'}}><AuditOutlined />页面设置</Button>
          </Popover>
        </div>
    
        <Modal
          title="保存模版"
          visible={saveTplModalVisible}
          onOk={handleSaveTplOk}
          onCancel={handleSaveTplCancel}
          okText={saveLink ? "关闭" : "保存"}
          cancelText="取消"
          width={420}
          closable={false}
          destroyOnClose={true}
        >
          <Alert message="保存模版后意味着你的模版将被更多人看见或使用, 平台有权对不符合模版要求的模版进行删除" type="info" showIcon closable />
          <div className={styles.saveForm}>
            <div className={styles.formIpt}>
              <span>模版名称：</span><Input ref={iptRef} />
            </div>
            <div className={styles.formIpt}>
              <span>模版分类：</span>
              <Select style={{ width: '100%' }} onChange={handleSelectChange}>
                {
                  cateTpl.map((item, i) => <Option value={item} key={i}>{ item }</Option>)
                }
              </Select>
            </div>
            <div className={styles.formIpt}>
              <span>封面设置：</span>
              <Button type="primary" size="small" style={{marginRight: '20px'}} onClick={() => generateFace(1)}>一键生成封面</Button>
            </div>
            {
              !!faceUrl && 
              <div className={classnames(styles.formIpt, styles.imgWrap)}>
                <img src={faceUrl} style={{maxWidth: '100%'}} />
              </div>
            }
            {
              !!saveLink &&
              <>
                <div className={styles.formIpt}>
                  <span>访问链接：</span><Input value={saveLink} />
                </div>
                <span style={{display: 'block', color: 'red', marginTop: '-10px'}}>注意: 刷新页面后模版自动同步到模版库中</span>
              </>
            }
          </div>
        </Modal>
        <Modal
          title="生成封面中...(长时间未反应请点右侧按钮重试)"
          visible={showModalIframe}
          footer={null}
          width={414}
          closeIcon={<RedoOutlined />}
          destroyOnClose={true}
          onCancel={handleReloadPage}
          maskClosable={false}
        >
          <iframe id="previewPage" src={`/h5_plus/preview?tid=${props.location.query.tid}&gf=1`} style={{width: '100%', border: 'none', height: '600px'}}></iframe>
        </Modal>
        <Modal
          title="封面图(右键复制图片)"
          visible={showFaceModal}
          footer={null}
          width={414}
          destroyOnClose={true}
          onCancel={() => setShowFaceModal(false)}
        >
          <img src={faceUrl} style={{width: '100%'}} />
        </Modal>
        
        <ModalTpl showModalTpl={showModalTpl} onCloseModalTpl={handleCloseModalTpl} onSelectTpl={handleSelectTpl} />
    </div>
  )
})

export default HeaderComponent
