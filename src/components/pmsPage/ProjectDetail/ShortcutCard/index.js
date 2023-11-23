import React, { useEffect, useState, useRef } from 'react';
import { Modal, message, Popover } from 'antd';
import moment from 'moment';
import { FinishProject, QueryIteProjectList } from '../../../../services/pmsServices';
import AttendanceRegister from './AttendanceRegister';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import { EncryptBase64 } from '../../../Common/Encrypt';
import OprAHModal from '../../AwardHonor/OprModal';
import OprIPModal from '../../IntelProperty/OprModal';
import { useHistory } from 'react-router-dom';
import ScatterFlowers from './ScatterFlowers';
import PrjFinishModal from './PrjFinishModal';

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
    is_XMJL_FXMJL = false,
  } = dataProps;
  const { prjBasic = {}, member = [], contrastArr = [] } = prjData;
  const { getPrjDtlData, setIsSpinning, handlePromiseAll, setShowSCDD } = funcProps;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [modalVisible, setModalVisible] = useState({
    attendanceRegister: false,
    createIterationPrj: false,
    intelProperty: false,
    awardHonor: false,
    prjFinish: false, //项目完结
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
  const flowers = useRef(null);

  useEffect(() => {
    return () => {};
  }, []);

  // 获取关联迭代项目下拉框数据 - 用于判断是否显示生成迭代
  const getGlddxmData = () => {
    // setIsSpinning(true);
    QueryIteProjectList({
      current: 1,
      pageSize: -1, //这边是迭代项目id
      paging: -1,
      sort: '',
      total: -1,
      cxlx: 'DDXM',
    })
      .then(res => {
        if (res?.success) {
          const data = [...JSON.parse(res.projectRecord)].map(x => String(x.ID));
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
    setModalVisible(p => ({ ...p, prjFinish: true }));
  };

  //完结撒花
  const scatterFlowers = () => {
    let dpr = 1;
    var devicePixelRatio = window.devicePixelRatio;
    if (devicePixelRatio >= 3) {
      dpr = 3;
    } else if (devicePixelRatio >= 2) {
      dpr = 2;
    } else {
      dpr = 1;
    }
    window.dpr = dpr;
    new ScatterFlowers({
      canvas: flowers.current,
      flowersColor: [
        ['250,174,255-60-11', '244,150,255-80-63', '247,197,255-100-100'],
        ['255,255,0-80-25', '255,255,0-100-100'],
        ['195,255,176-80-0', '69,197,117-100-100'],
        ['79,213,255-80-0', '43,187,250-100-100'],
        ['43,0,255-80-0', '43,0,255-100-100'],
        ['255,0,0-80-0', '255,0,0-100-100'],
      ],
      faceColor: '255,200,44-100', // 笑脸颜色
      eyeColor: '76,64,65-100', // 眼睛颜色
      mouthColor: '255,109,64-100', // 笑嘴颜色
      flowersLength: 20,
      autoStart: true,
      faceFlag: true,
      faceR: 15,
      eyeR: 2,
      mouthR: 4,
    });
  };

  //项目完结刷新
  const handlePrjFinishRefresh = () => {
    getPrjDtlData();
    setTimeout(() => {
      message.success('完结成功', 1);
      setIsSpinning(false);
      scatterFlowers();
    }, 200);
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

  //目前 非项目成员 无快捷入口
  if (!isMember()) return null;
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
      {/* 生成迭代新建项目 */}
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
      {/* 项目完结 */}
      <PrjFinishModal
        visible={modalVisible.prjFinish}
        setVisible={v => setModalVisible(p => ({ ...p, prjFinish: v }))}
        data={{ xmid, xmjd: prjBasic.XMJD, contrastArr, refresh: handlePrjFinishRefresh }}
      />
      <div className="content">
        {is_XMJL_FXMJL && getShortcutItem('zscq', '知识产权', () => {}, intelPropertyMenu)}
        {is_XMJL_FXMJL && getShortcutItem('hjry', '获奖荣誉', () => {}, awardHonorMenu)}
        {showKQXX && isMember() && getShortcutItem('kqdj', '考勤登记', handleAttendanceRegister)}
        {is_XMJL_FXMJL && showSCDD && getShortcutItem('scdd', '生成迭代', createIterationPrj)}
        {is_XMJL_FXMJL &&
          grayTest.DDMK &&
          prjBasic.WJZT !== '1' &&
          getShortcutItem('xmwj', '项目完结', () => handlePrjFinish(xmid))}
      </div>
      <canvas
        ref={flowers}
        height={400}
        width={800}
        style={{ position: 'absolute', top: 0, right: 310, pointerEvents: 'none' }}
      ></canvas>
    </div>
  );
}
