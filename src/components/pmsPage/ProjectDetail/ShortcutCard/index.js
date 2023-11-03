import React, { useEffect, useState, useRef } from 'react';
import { Modal, message, Popover } from 'antd';
import moment from 'moment';
import { FinishProject, QueryProjectListPara } from '../../../../services/pmsServices';
import AttendanceRegister from './AttendanceRegister';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import { EncryptBase64 } from '../../../Common/Encrypt';
import OprAHModal from '../../AwardHonor/OprModal';
import OprIPModal from '../../IntelProperty/OprModal';
import { useHistory } from 'react-router-dom';

export default function ShortcutCard(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    xmid,
    ZYXMKQLX = [],
    prjData = {},
    showSCDD = false,
    routes = [],
    showKQXX = false,
    isGLY = {},
    grayTest = {},
  } = dataProps;
  const { prjBasic = {}, member = [] } = prjData;
  const { getPrjDtlData, setIsSpinning, handlePromiseAll, setShowSCDD } = funcProps;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [modalVisible, setModalVisible] = useState({
    attendanceRegister: false,
    createIterationPrj: false,
    intelProperty: false,
    awardHonor: false,
  }); //弹窗显隐
  const [IPAHData, setIPAHData] = useState({
    oprType: 'ADD',
    rowData: undefined,
    activeKey: '',
    isSB: false, //是否申报
    fromPrjDetail: false, //入口是否在项目详情
    parentRow: undefined, //申报行的父行数据{}
  }); //知识产权、获奖荣誉
  const history = useHistory();

  useEffect(() => {
    return () => {};
  }, []);

  // 获取关联迭代项目下拉框数据 - 用于判断是否显示生成迭代
  const getGlddxmData = () => {
    // setIsSpinning(true);
    QueryProjectListPara({
      current: 1,
      pageSize: -1, //这边是迭代项目id
      paging: -1,
      sort: '',
      total: -1,
      cxlx: 'DDXM',
    })
      .then(res => {
        if (res?.success) {
          const data = [...JSON.parse(res.projectRecord)].map(x => x.ID);
          const isPrjExist = data.includes(String(xmid));
          const isNotCplHard =
            prjBasic.XMLX === '软硬件项目' &&
            (prjBasic.SFBHYJ === '2' ||
              (prjBasic.SFBHYJ === '1' && parseFloat(prjBasic.RJYSJE) > 0));
          setShowSCDD(isPrjExist && isNotCplHard);
        }
      })
      .catch(e => {
        // setIsSpinning(false);
        console.error('关联迭代项目下拉框数据', e);
        message.error('关联迭代项目下拉框数据查询失败', 1);
      });
  };

  //考勤登记的按钮权限，给到项目里面的所有人
  const isMember = () => {
    let arr = member.filter(x => x.RYZT === '1').map(x => x.RYID);
    return arr.includes(String(LOGIN_USER_INFO.id));
  };

  //获取快捷方式块
  const getShortcutItem = (imgTxt, txt, fn, content) => {
    return (
      <div className="shortcut-item" onClick={fn}>
        {content ? (
          <Popover
            placement="rightTop"
            title={null}
            content={content}
            overlayClassName="btn-more-content-popover"
          >
            <div className="item-img">
              <img src={require(`../../../../assets/projectDetail/icon_${imgTxt}.png`)} alt="" />
            </div>
          </Popover>
        ) : (
          <div className="item-img">
            <img src={require(`../../../../assets/projectDetail/icon_${imgTxt}.png`)} alt="" />
          </div>
        )}
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

  //考勤登记
  const handleAttendanceRegister = () => {
    setModalVisible(p => ({ ...p, attendanceRegister: true }));
  };

  //生成迭代
  const createIterationPrj = () => {
    setModalVisible(p => ({ ...p, createIterationPrj: true }));
  };

  //知识产权、获奖荣誉回调
  const handleAddIntelProperty = activeKey => {
    setModalVisible(p => ({ ...p, intelProperty: true }));
    setIPAHData(p => ({
      ...p,
      oprType: 'ADD',
      rowData: undefined,
      activeKey,
    }));
  };
  const handleAddAwardHonor = activeKey => {
    setModalVisible(p => ({ ...p, awardHonor: true }));
    setIPAHData(p => ({
      ...p,
      oprType: 'ADD',
      rowData: undefined,
      activeKey,
      isSB: true, //是否申报
      parentRow: undefined, //申报行的父行数据{}
      fromPrjDetail: { xmmc: prjBasic.XMMC, xmid: String(xmid) }, //入口是否在项目详情
    }));
  };

  //知识产权、获奖荣誉选项
  const intelPropertyMenu = (
    <div className="list">
      <div className="item" key="RJZZ" onClick={() => handleAddIntelProperty('RJZZ')}>
        软件著作权
      </div>
      <div className="item" key="FMZL" onClick={() => handleAddIntelProperty('FMZL')}>
        发明专利
      </div>
      <div className="item" key="HYBZ" onClick={() => handleAddIntelProperty('HYZZ')}>
        行业标准
      </div>
      <div className="item" key="QYBZ" onClick={() => handleAddIntelProperty('QYBZ')}>
        企业标准
      </div>
    </div>
  );
  const awardHonorMenu = (
    <div className="list">
      <div className="item" key="KJJX" onClick={() => handleAddAwardHonor('KJJX')}>
        科技奖项
      </div>
      <div className="item" key="YJKT" onClick={() => handleAddAwardHonor('YJKT')}>
        研究课题
      </div>
    </div>
  );

  //跳转
  const handleModalRefresh = (name, obj = {}) => {
    history.push({
      pathname: `/pms/manage/${name}/${EncryptBase64(JSON.stringify(obj))}`,
    });
  };

  if (!((showKQXX && isMember()) || showSCDD || grayTest.ZSCQ)) return null;
  return (
    <div className="shortcut-card-box">
      <div className="top-title">快捷入口</div>
      {/* 考勤登记 */}
      <AttendanceRegister
        xmid={xmid}
        visible={modalVisible.attendanceRegister}
        setVisible={v => setModalVisible(p => ({ ...p, attendanceRegister: v }))}
        ZYXMKQLX={ZYXMKQLX}
        handlePromiseAll={handlePromiseAll}
      />
      {/* 知识产权 */}
      {modalVisible.intelProperty && (
        <OprIPModal
          visible={modalVisible.intelProperty}
          setVisible={v => setModalVisible(p => ({ ...p, intelProperty: v }))}
          oprType={IPAHData.oprType}
          type={IPAHData.activeKey}
          rowData={IPAHData.rowData}
          refresh={v => handleModalRefresh('IntelProperty', v)}
          fromPrjDetail={{ xmmc: prjBasic.XMMC, xmid: String(xmid) }} //入口是否在项目详情
          isGLY={isGLY.zscq}
        />
      )}
      {/* 获奖荣誉 */}
      {modalVisible.awardHonor && (
        <OprAHModal
          setVisible={v => setModalVisible(p => ({ ...p, awardHonor: v }))}
          type={IPAHData.activeKey}
          data={{ ...IPAHData, visible: modalVisible.awardHonor }}
          refresh={v => handleModalRefresh('AwardHonor', v)}
          isGLY={isGLY.hjry}
        />
      )}
      <Modal
        wrapClassName="editMessage-modify xbjgEditStyle"
        width={1000}
        maskClosable={false}
        zIndex={100}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        style={{ top: 10 }}
        visible={modalVisible.createIterationPrj}
        okText="保存"
        destroyOnClose
        bodyStyle={{
          padding: 0,
        }}
        onCancel={() => setModalVisible(p => ({ ...p, createIterationPrj: false }))}
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
          closeModel={() => setModalVisible(p => ({ ...p, createIterationPrj: false }))}
          successCallBack={() => {
            getGlddxmData();
            setModalVisible(p => ({ ...p, createIterationPrj: false }));
          }}
          xmid={-1} //新建入-1
          projectType={'1'} //项目类型为软硬件，才有这个按钮
          scddProps={{
            glddxmId: String(xmid),
            routes,
          }} //生成迭代需要用的参数
        />
      </Modal>
      <div className="content">
        {grayTest.ZSCQ && getShortcutItem('zscq', '知识产权', () => {}, intelPropertyMenu)}
        {grayTest.ZSCQ && getShortcutItem('hjry', '获奖荣誉', () => {}, awardHonorMenu)}
        {/* {getShortcutItem('xclr', '信创录入', () => {})} */}
        {showKQXX && isMember() && getShortcutItem('kqdj', '考勤登记', handleAttendanceRegister)}
        {showSCDD && getShortcutItem('scdd', '生成迭代', createIterationPrj)}
        {/* {prjBasic.WJZT !== '1' && getShortcutItem('xmwj', '项目完结', () => handlePrjFinish(xmid))} */}
      </div>
    </div>
  );
}
