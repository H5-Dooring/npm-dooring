import React, { memo, useState, useEffect } from 'react'
import { Modal, Button, Tabs, Empty, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loading from '../LoadingCp'
import { serverUrl }from '../../tool'
import cateTpl from './cate'
import styles from './index.less'

const { TabPane } = Tabs;

export default memo(function ModalTpl(props) {
  const { showModalTpl, onSelectTpl, onCloseModalTpl } = props
  const [isLoading, setLoading] = useState(false)
  const [tpls, setTpls] = useState([])
  const [cates, setCates] = useState({})

  const useTpl = (tid) => {
    const config = {
        title: 'dooring温馨提示',
        content: (
          <div>
            导入模板会覆盖画布已有的数据，确认要导入吗？
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk() {
            setLoading(true)
            req.get(`/visible/tpl/get?tid=${tid}`).then(res => {
                res && onSelectTpl && onSelectTpl({tpl: res.tpl, pageConfig: res.pageConfig || { title: res.name }})
                setLoading(false)
                onCloseModalTpl()
            }).catch(err => {
                setLoading(false)
            })
        }
    };
    Modal.confirm(config);
  }

  const handlePaneChange = (key) => {
    setTpls(cates[key] || [])
  }

  useEffect(() => {
    setLoading(true)
  }, [])

  return <Modal
            title="选择模版"
            visible={showModalTpl}
            onCancel={onCloseModalTpl}
            destroyOnClose={true}
            width={930}
            footer={null}
        >
            <div className={styles.tplWrap}>
                {
                    !isLoading ? 
                    <Tabs tabPosition="left" defaultActiveKey="其他" onChange={handlePaneChange}>
                        {
                            cateTpl.map((item, i) => {
                                return <TabPane tab={item} key={item}>
                                            <div style={{maxHeight: '480px', width: '100%', overflow: 'auto', display: 'flex', flexWrap: 'wrap'}}>
                                                {
                                                    tpls.length ? tpls.map((item,i) => {
                                                        return <div className={styles.tpl} key={i}>
                                                                    <img src={item.img} alt="dooring可视化" />
                                                                    <div className={styles.btn}><Button type="primary" onClick={() => useTpl(item.tid)}>立即使用</Button></div>
                                                                    
                                                                    <CopyToClipboard text={`${serverUrl}/h5?tid=${item.tid}&isTpl=1`}
                                                                        onCopy={() => { message.success('已复制到剪切板')}}>
                                                                        <div className={styles.btn} style={{marginTop: '40px'}}><Button>复制链接</Button></div>
                                                                    </CopyToClipboard>
                                                                </div>
                                                    }) : <div style={{marginLeft: '160px', marginTop: '160px'}}><Empty description="还没有该品类模版哦, 我们正在飞速配置中..." /></div>
                                                }
                                            </div>
                                            
                                       </TabPane>
                            })
                        }
                    </Tabs>
                    :
                    <Loading />
                }
            </div>
        </Modal>
})