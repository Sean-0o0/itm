import React, { useEffect, useState } from 'react';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import {message, Modal} from 'antd';
import PrjTypeModal from './PrjTypeModal';
import NewProjectModelV2 from "../../../../pages/workPlatForm/singlePage/NewProjectModelV2";

export default function ShortcutCard(props) {
  const {userRole, getPrjInfo} = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [visible, setVisible] = useState(false); //类型弹窗显隐

  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  //跳转livebos页面
  const jumpToLBPage = tableName => {
    // console.log('openLiveBosModal', tableName);
    window.location.href = `/#/UIProcessor?Table=${tableName}&hideTitlebar=true`;
  };

  //获取快捷方式块
  const getShortcutItem = (imgTxt, txt, fn) => {
    return (
      <div className="shortcut-item" onClick={fn}>
        <div className="item-img">
          <img src={require(`../../../../assets/homePage/icon_${imgTxt}@2x.png`)} alt="" />
        </div>
        <div className="item-txt">{txt}</div>
      </div>
    );
  };

  //获取快捷方式盒子
  const getShortcutBox = () => {
    if (userRole === '') return '';
    if (userRole === '普通人员')
      return (
        <div className="shortcut-box">
          {getShortcutItem('xjxm', '新建项目', () => {
            setVisible(true);
            // setFileAddVisible(true)
          })}
          {getShortcutItem('bgtx', '报告填写', () => jumpToLBPage('ZBYBTX'))}
        </div>
      );
    return (
      <div className="shortcut-box">
        {getShortcutItem('xjxm', '新建项目', () => {
          setVisible(true);
          // setFileAddVisible(true)
        })}
        {getShortcutItem('yian', '议案审批', () => jumpToLBPage('V_XWHYALC_LDSP'))}
        {getShortcutItem('ysck', '预算查看', () => jumpToLBPage('YSTJ'))}
        {getShortcutItem(
          'bgck',
          '报告查看',
          () => (window.location.href = '/#/pms/manage/WeeklyReportTable'),
        )}
      </div>
    );
  };

  //监听新建项目弹窗状态
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
      getPrjInfo(userRole); //刷新数据
      // message.success('保存成功');
    }
  };

  //关闭新建项目弹窗
  const closeFileAddModal = () => {
    setFileAddVisible(false);
    // window.location.href ='/#/pms/manage/ProjectInfo';
  };

  //新建项目弹窗参数
  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '新建项目',
    width: '1000px',
    height: '700px',
    style: { top: '10px' },
    visible: fileAddVisible,
    footer: null,
  };

  return (
    <div className="shortcut-card-box">
      <div className="home-card-title-box">快捷入口</div>

      {/*{fileAddVisible && (*/}
      {/*  <BridgeModel*/}
      {/*    isSpining="customize"*/}
      {/*    modalProps={fileAddModalProps}*/}
      {/*    onCancel={closeFileAddModal}*/}
      {/*    src={src_fileAdd}*/}
      {/*  />*/}
      {/*)}*/}
      {fileAddVisible && (
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'1000px'}
          // height={'700px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{backgroundColor: 'rgb(0 0 0 / 30%)'}}
          style={{top: '10px'}}
          visible={fileAddVisible}
          okText="保存"
          bodyStyle={{
            padding: 0,
          }}
          onCancel={closeFileAddModal}
          title={
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3361FF',
                color: 'white',
                borderRadius: '8px 8px 0 0',
                fontSize: '16px',
              }}
            >
              <strong>新建项目</strong>
            </div>
          }
          footer={null}
        >
          <NewProjectModelV2
            closeModel={closeFileAddModal}
            successCallBack={closeFileAddModal}
            xmid={src_fileAdd.xmid}
            type={src_fileAdd.type}
            projectType={src_fileAdd.projectType}
          />
        </Modal>
      )}
      <PrjTypeModal
        visible={visible}
        setVisible={setVisible}
        setFileAddVisible={setFileAddVisible}
        setSrc_fileAdd={setSrc_fileAdd}
        fromHome={true} //来自首页
      />
      {getShortcutBox()}
    </div>
  );
}
