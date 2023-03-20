import React, { useEffect, useState } from 'react';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

export default function ShortcutCard(props) {
  const { userRole } = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState('#'); //项目信息修改弹窗显示
  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    setSrc_fileAdd(
      `/#/single/pms/SaveProject/${EncryptBase64(JSON.stringify({ xmid: -1, type: true }))}`,
    );
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);
  const getShortcutItem = (imgTxt, txt, fn) => {
    return (
      <div className="shortcut-item" onClick={fn}>
        <img
          className="item-img"
          src={require(`../../../../assets/homePage/icon_${imgTxt}@2x.png`)}
          alt=""
        />
        <div className="item-txt">{txt}</div>
      </div>
    );
  };
  const closeFileAddModal = () => {
    // getPrjInfo(userRole);
    setFileAddVisible(false);
  };
  const getShortcutBox = () => {
    if (userRole === '') return '';
    if (userRole === '普通人员')
      return (
        <div className="shortcut-box">
          {getShortcutItem('xjxm', '新建项目', () => setFileAddVisible(true))}
          {getShortcutItem('bgtx', '报告填写', () => {
            window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`;
          })}
        </div>
      );
    return (
      <div className="shortcut-box">
        {getShortcutItem('xjxm', '新建项目', () => setFileAddVisible(true))}
        {getShortcutItem('yian', '议案审批', () => {})}
        {getShortcutItem('ysck', '预算查看', () => {})}
        {getShortcutItem('bgck', '报告查看', () => {})}
      </div>
    );
  };
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
      // message.success('保存成功');
      //projectId跳转到生命周期页面
      const handleType = sessionStorage.getItem('projectId');
      if (handleType === '1') {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
        };
        window.location.href = `/#/pms/manage/LifeCycleManagement/${EncryptBase64(
          JSON.stringify(params),
        )}`;
      }
    }
  };

  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '新建项目',
    width: '70%',
    height: '120rem',
    style: { top: '2rem' },
    visible: fileAddVisible,
    footer: null,
  };
  return (
    <div className="shortcut-card-box">
      快捷入口
      {fileAddVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={fileAddModalProps}
          onCancel={closeFileAddModal}
          src={src_fileAdd}
        />
      )}
      {getShortcutBox()}
    </div>
  );
}
