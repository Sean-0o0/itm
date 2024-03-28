import React, { useEffect, useState } from 'react';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { message, Modal } from 'antd';
import PrjTypeModal from './PrjTypeModal';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import OverviewCard from '../OverviewCard';

export default function ShortcutCard(props) {
  const {
    userRole,
    getPrjInfo,
    toDoData = [],
    toDoDataNum = 0,
    dictionary,
    reflush,
    getToDoData,
    popLoading,
    AUTH = [], //权限点控制
  } = props;
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
          {AUTH.includes('quickEntranceNewProject') &&
            getShortcutItem('xjxm', '新建项目', () => {
              setVisible(true);
            })}
          {AUTH.includes('quickEntranceReportFilling') &&
            getShortcutItem('bgtx', '报告填写', () => jumpToLBPage('ZBYBTX'))}
        </div>
      );
    return (
      <div className="shortcut-box">
        {AUTH.includes('quickEntranceMessage') && userRole === '二级部门领导' && (
          <OverviewCard
            componentType="shortcut"
            toDoData={toDoData}
            dictionary={dictionary}
            toDoDataNum={toDoDataNum}
            reflush={reflush}
            getToDoData={getToDoData}
            popLoading={popLoading}
          />
        )}
        {AUTH.includes('quickEntranceNewProject') &&
          getShortcutItem('xjxm', '新建项目', () => {
            setVisible(true);
          })}
        {AUTH.includes('quickEntranceMotionApproval') &&
          userRole !== '二级部门领导' &&
          getShortcutItem('yian', '议案审批', () => jumpToLBPage('V_XWHYALC_LDSP'))}
        {AUTH.includes('quickEntranceBudegetView') &&
          getShortcutItem('ysck', '预算查看', () => jumpToLBPage('YSTJ'))}
        {AUTH.includes('quickEntranceReport') &&
          getShortcutItem(
            'bgck',
            '报告查看',
            () => (window.location.href = '/#/pms/manage/CustomReportInfo'),
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
  };
  //新建项目成功后，刷新数据
  const handleFileAddSuccess = () => {
    closeFileAddModal();
    getPrjInfo(userRole); //刷新数据
  };

  //个数为 0 时隐藏  -  加新的入口时，这边也要记得加
  if (
    userRole === '' ||
    (userRole === '普通人员' &&
      !AUTH.includes('quickEntranceNewProject') &&
      !AUTH.includes('quickEntranceReportFilling'))
  )
    return null;
  if (
    !(userRole === '二级部门领导' && AUTH.includes('quickEntranceMessage')) &&
    !AUTH.includes('quickEntranceNewProject') &&
    !(userRole !== '二级部门领导' && AUTH.includes('quickEntranceMotionApproval')) &&
    !AUTH.includes('quickEntranceBudegetView') &&
    !AUTH.includes('quickEntranceReport')
  )
    return null;
    
  return (
    <div className="shortcut-card-box">
      <div className="home-card-title-box">快捷入口</div>
      {fileAddVisible && (
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'1000px'}
          // height={'700px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
          style={{ top: '10px' }}
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
            successCallBack={handleFileAddSuccess}
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
        refresh={() => getPrjInfo(userRole)}
        fromHome={true} //来自首页
      />
      {getShortcutBox()}
    </div>
  );
}
