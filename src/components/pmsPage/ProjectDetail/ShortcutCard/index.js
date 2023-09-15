import React, { useEffect, useState, useRef } from 'react';
import { Modal, message } from 'antd';
import moment from 'moment';
import { FinishProject } from '../../../../services/pmsServices';
import AttendanceRegister from './AttendanceRegister';

export default function ShortcutCard(props) {
  const { xmid, ZYXMKQLX = [], funcProps = {}, prjData } = props;
  const { prjBasic = {}, member = [] } = prjData;
  const { getPrjDtlData, setIsSpinning, handlePromiseAll } = funcProps;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [modalVisible, setModalVisible] = useState({
    attendanceRegister: false,
  }); //弹窗显隐

  useEffect(() => {
    return () => {};
  }, []);

  //考勤登记的按钮权限，给到项目里面的所有人
  const isMember = () => {
    let arr = member.map(x => x.RYID);
    return arr.includes(String(LOGIN_USER_INFO.id));
  };

  //获取快捷方式块
  const getShortcutItem = (imgTxt, txt, fn) => {
    return (
      <div className="shortcut-item" onClick={fn}>
        <div className="item-img">
          <img src={require(`../../../../assets/projectDetail/icon_${imgTxt}.png`)} alt="" />
        </div>
        <div className="item-txt">{txt}</div>
      </div>
    );
  };

  //项目完结
  const handlePrjFinish = (id = -1) => {
    // Modal.confirm({
    //   title: '提示：',
    //   content: `是否确定完结该项目？`,
    //   okText: '确定',
    //   cancelText: '取消',
    //   onOk: () => {
    //     setIsSpinning(true);
    //     FinishProject({
    //       finishDate: Number(moment().format('YYYYMMDD')),
    //       projectId: Number(id),
    //     })
    //       .then(res => {
    //         if (res?.success) {
    //           getPrjDtlData();
    //           // setIsSpinning(false);
    //           setTimeout(() => {
    //             message.success('完结成功', 1);
    //           }, 200);
    //         }
    //       })
    //       .catch(e => {
    //         console.error('🚀项目完结', e);
    //         message.error('完结失败', 1);
    //         setIsSpinning(false);
    //       });
    //   },
    // });
  };

  const handleAttendanceRegister = () => {
    setModalVisible(p => ({ ...p, attendanceRegister: true }));
  };

  return (
    <div className="shortcut-card-box">
      <div className="top-title">快捷入口</div>
      <AttendanceRegister
        xmid={xmid}
        visible={modalVisible.attendanceRegister}
        setVisible={v => setModalVisible(p => ({ ...p, attendanceRegister: v }))}
        ZYXMKQLX={ZYXMKQLX}
        handlePromiseAll={handlePromiseAll}
      />
      <div className="content">
        {getShortcutItem('zscq', '知识产权', () => {})}
        {getShortcutItem('hjry', '获奖荣誉', () => {})}
        {getShortcutItem('xclr', '信创录入', () => {})}
        {prjBasic?.YSLX === '科研预算' &&
          isMember() &&
          getShortcutItem('kqdj', '考勤登记', handleAttendanceRegister)}
        {prjBasic.WJZT !== '1' && getShortcutItem('xmwj', '项目完结', () => handlePrjFinish(xmid))}
      </div>
    </div>
  );
}
