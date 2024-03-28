import React, { useEffect, useState, useRef } from 'react';
import { Modal, message, Popover, Popconfirm } from 'antd';
import moment from 'moment';
import {
  QueryUserRole,
  QueryEmployeeAppraiseList,
  ConvertToSelfDevIteProject,
} from '../../../../services/pmsServices';
import AttendanceRegister from './AttendanceRegister';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import { EncryptBase64 } from '../../../Common/Encrypt';
import OprAHModal from '../../AwardHonor/OprModal';
import OprIPModal from '../../IntelProperty/OprModal';
import { useHistory } from 'react-router-dom';
import ScatterFlowers from './ScatterFlowers';
import PrjFinishModal from './PrjFinishModal';
import OpenValuationModal from '../../MutualEvaluation/OpenValuationModal';
import { connect } from 'dva';
import ProjectAbortModal from './ProjectAbortModal';

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(function ShortcutCard(props) {
  const { dataProps = {}, funcProps = {}, authorities = {} } = props;
  const AUTH = authorities.XMXQ || []; //权限点控制
  const {
    xmid,
    ZYXMKQLX = [],
    prjData = {},
    showSCDD = false,
    routes = [],
    showKQXX = false,
    isGLY = {},
    grayTest = {},
    is_XMJL_FXMJL = false, // 项目详情页的是否是项目经理或者副项目经理，非账号登录人的
    allStaffData = [], //用于判断 验收报告 事项是否已完成
    ysspHide = false,
    isSinglePayment = false, //单费用付款项目
    isEnd = false,
  } = dataProps;

  const { prjBasic = {}, member = [], contrastArr = [] } = prjData;
  // console.log('xxxxxxxxxxxxxxxxxxprjBasic', prjBasic, )
  const {
    getPrjDtlData,
    setIsSpinning,
    handlePromiseAll,
    setShowSCDD,
    setOpenNewIteContent,
  } = funcProps;

  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  const [modalVisible, setModalVisible] = useState({
    attendanceRegister: false,
    createIterationPrj: false,
    intelProperty: false,
    awardHonor: false,
    prjFinish: false, //项目完结
    pjztgl: false, //评价状态管理弹窗,
    projectAbort: false, //是否展示项目终止弹窗
  }); //弹窗显隐

  const [hasEvaluationData, setHasEvaluationData] = useState(false); // 评价列表是否有数据
  const [isForbiddenLeader, setIsForbiddenLeader] = useState(false); // 是否是禁止查看人员互评的领导
  const [isProjectMember, setIsProjectMember] = useState(false); // 是否是项目成员

  const [IPAHData, setIPAHData] = useState({
    oprType: 'ADD',
    rowData: undefined,
    activeKey: '',
    isSB: false, //是否申报
    fromPrjDetail: false, //入口是否在项目详情
    parentRow: undefined, //申报行的父行数据{}
  }); //知识产权、获奖荣誉

  //新增升级内容弹窗
  //当 自研项目 类型时，且不包含自研迭代项目标签，且其 验收报告事项 已完成 时显示按钮
  const showZWDD =
    prjData.prjBasic?.XMLX?.includes('自研项目') &&
    !prjData.prjBasic?.XMBQ?.includes('自研迭代项目') &&
    allStaffData.findIndex(x => x.sxmc === '验收报告' && x.zxqk !== ' ') !== -1;

  const history = useHistory();
  const flowers = useRef(null);

  useEffect(() => {
    if (member.length > 0) {
      judgeMutualEvaluationShow();
    }
    return () => {};
  }, [JSON.stringify(member)]);

  //考勤登记的按钮权限，给到项目里面的所有人
  const isMember = () => {
    let arr = member.filter(x => x.RYZT === '1').map(x => x.RYID);
    return arr.includes(String(LOGIN_USER_INFO.id));
  };

  /**
   * 获取快捷方式块
   * @param {*} imgTxt 图片名称
   * @param {*} txt  文字标题
   * @param {*} fn 图片点击的回调函数
   * @param {*} content 鼠标hover显示的可选列表
   * @param {*} popConfirmTxt 二次确认文本，有值时，点击按钮有二次确认
   * @returns
   */
  const getShortcutItem = ({ imgTxt, txt, fn, content = false, popConfirmTxt = false }) => {
    return (
      <Popconfirm title={popConfirmTxt} onConfirm={fn} disabled={popConfirmTxt === false}>
        <div className="shortcut-item" onClick={popConfirmTxt === false ? fn : () => {}}>
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
      </Popconfirm>
    );
  };

  //项目完结
  const handlePrjFinish = (id = -1) => {
    setModalVisible(p => ({ ...p, prjFinish: true }));
  };

  /** 打开项目终止弹窗 */
  const openProjectAbortModal = () => {
    setModalVisible(val => ({ ...val, projectAbort: true }));
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
    setModalVisible(p => ({
      ...p,
      attendanceRegister: true,
    }));
  };

  //转为自研迭代项目 - 打开新增升级内容弹窗
  const handleZWDD = () => {
    setIsSpinning(true);
    ConvertToSelfDevIteProject({
      projectId: Number(xmid),
    })
      .then(res => {
        if (res.success) {
          setIsSpinning(false);
          getPrjDtlData();
          //打开新增升级内容弹窗
          setOpenNewIteContent(true);
        }
      })
      .catch(e => {
        console.log('🚀 ~ handleZWDD ~ e:', e);
        message.error('操作失败', 1);
        setIsSpinning(false);
      });
  };

  //生成迭代
  const createIterationPrj = () => {
    setModalVisible(p => ({
      ...p,
      createIterationPrj: true,
    }));
  };

  //知识产权、获奖荣誉回调
  const handleAddIntelProperty = activeKey => {
    setModalVisible(p => ({
      ...p,
      intelProperty: true,
    }));
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
      isSB: activeKey !== 'KJRY', //是否申报 科技荣誉这边不为true
      parentRow: undefined, //申报行的父行数据{}
      fromPrjDetail: {
        xmmc: prjBasic.XMMC,
        xmid: String(xmid),
      }, //入口是否在项目详情
    }));
  };

  //知识产权选项
  const intelPropertyMenu = (
    <div className="list">
      <div className="item" key="RJZZ" onClick={() => handleAddIntelProperty('RJZZ')}>
        软件著作权
      </div>
      <div className="item" key="FMZL" onClick={() => handleAddIntelProperty('FMZL')}>
        发明专利
      </div>
      <div className="item" key="HYBZ" onClick={() => handleAddIntelProperty('HYBZ')}>
        行业标准
      </div>
      <div className="item" key="QYBZ" onClick={() => handleAddIntelProperty('QYBZ')}>
        企业标准
      </div>
    </div>
  );

  //获奖荣誉选项
  const awardHonorMenu = (
    <div className="list">
      <div className="item" key="KJJX" onClick={() => handleAddAwardHonor('KJJX')}>
        科技奖项
      </div>
      <div className="item" key="KJRY" onClick={() => handleAddAwardHonor('KJRY')}>
        科技荣誉
      </div>
      <div className="item" key="YJKT" onClick={() => handleAddAwardHonor('YJKT')}>
        研究课题
      </div>
    </div>
  );

  /** 人员互评选项 */
  const mutualEvaluationMenu = (
    <div className="list">
      {/* 如果没数据，就隐藏人员评价，只展示评价管理*/}
      {Number(prjBasic.SFBHZXM || 0) <= 0 &&
        isForbiddenLeader === false &&
        hasEvaluationData === true && (
          <div
            className="item"
            key="RYHP"
            onClick={() => {
              switchToEmployeePage('evaluation');
            }}
          >
            人员互评
          </div>
        )}
      {
        <div
          className="item"
          key="PJZTGL"
          onClick={() => {
            switchToEmployeePage('manage');
          }}
        >
          评价状态管理
        </div>
      }
    </div>
  );

  //跳转
  const handleModalRefresh = (name, obj = {}) => {
    history.push({
      pathname: `/pms/manage/${name}/${EncryptBase64(JSON.stringify(obj))}`,
    });
  };

  /**
   * 人员互评跳转
   * @param {*} switchType  evaluation：互评  manage：评价管理
   */
  const switchToEmployeePage = switchType => {
    if (switchType === 'evaluation') {
      //传参项目名称到人员互评界面;
      history.push({
        pathname: `/pms/manage/MutualEvaluation/${EncryptBase64(
          JSON.stringify({
            xmmc: prjBasic.XMMC,
            routes,
          }),
        )}`,
      });
    } else if (switchType === 'manage') {
      //弹窗展示评价状态管理页面
      setModalVisible(p => ({ ...p, pjztgl: true }));
    }
  };

  /**
   * 点击人员互评
   */
  const mutualEvaluationClick = isMemuShow => {
    if (isMemuShow === false) {
      switchToEmployeePage('evaluation');
    }
  };

  /** 判断是否展示人员互评弹窗 */
  const judgeMutualEvaluationShow = async () => {
    try {
      //判断是否是禁止查看的领导
      const { id } = LOGIN_USER_INFO;
      const res = await QueryUserRole({ userId: id });
      if (res.code === 1) {
        const { role: loginRole } = res;
        //互评按钮，仅项目人员可看，角色为信息技术事业部领导和一级部门领导的不能看

        // console.log('登录人角色', loginRole)

        if (loginRole === '信息技术事业部领导' || loginRole === '一级部门领导') {
          setIsForbiddenLeader(true);
        } else [setIsForbiddenLeader(false)];
      }

      //判断是否项目人员
      let isMember = false;
      member.forEach(item => {
        if (String(item.RYID) === String(LOGIN_USER_INFO.id)) {
          isMember = true;
        }
      });
      setIsProjectMember(isMember);

      //判断该项目有没有评价列表
      const queryListParams = {
        projectName: prjBasic.XMMC,
        queryType: 'XMGK',
        userType: 'XMJL',
      };
      const listRes = await QueryEmployeeAppraiseList(queryListParams);
      if (listRes.code === 1) {
        const { gkResult } = listRes;
        const listObj = JSON.parse(gkResult);
        if (listObj.length !== 0) {
          setHasEvaluationData(true);
        } else {
          setHasEvaluationData(false);
        }
      }
    } catch (err) {
      console.error('🚀 ~ judgeMutualEvaluationShow ~ err:', err);
      message.error(`判断是否展示人员互评图标失败`, 2);
    }
  };

  //加新的入口，这边也要加下
  useEffect(() => {
    if (member.length > 0)
      console.log(
        '权限控制：是否显示快捷入口: ' + '\n非项目成员：' + !isMember(),
        '\n预算审批隐藏：' + ysspHide,
        '\n项目终止隐藏：' + isEnd,
        '\n知识产权：' + (is_XMJL_FXMJL && AUTH.includes('intellectualProperty')),
        '\n获奖荣誉：' + (is_XMJL_FXMJL && AUTH.includes('awardsAndHonors')),
        '\n考勤：' + (showKQXX && AUTH.includes('attendanceRegistration')),
        '\n生成迭代：' + (is_XMJL_FXMJL && showSCDD && AUTH.includes('generateIteration')),
        '\n完结：' + (is_XMJL_FXMJL && prjBasic.WJZT !== '1' && AUTH.includes('projectFinish')),
        '\n终止：' + (is_XMJL_FXMJL && !['4', '5'].includes(prjBasic.WJZT) && AUTH.includes('projectTermination')),
        '\n评价管理：' + authorities.RYPJ?.includes('OpenEvaluation'),
        '\n转为迭代：' + (is_XMJL_FXMJL && showZWDD && AUTH.includes('turnIteration')),
      );
    return () => {};
  }, [JSON.stringify(member)]);

  //加新的入口，这边也要加下
  if (
    !isMember() ||
    ysspHide ||
    isEnd ||
    !(
      (is_XMJL_FXMJL && AUTH.includes('intellectualProperty')) ||
      (is_XMJL_FXMJL && AUTH.includes('awardsAndHonors')) ||
      (showKQXX && AUTH.includes('attendanceRegistration')) ||
      (is_XMJL_FXMJL && showSCDD && AUTH.includes('generateIteration')) ||
      (is_XMJL_FXMJL && prjBasic.WJZT !== '1' && AUTH.includes('projectFinish')) ||
      (is_XMJL_FXMJL && !['4', '5'].includes(prjBasic.WJZT) && AUTH.includes('projectTermination')) ||
      authorities.RYPJ?.includes('OpenEvaluation') ||
      (is_XMJL_FXMJL && showZWDD && AUTH.includes('turnIteration'))
    )
  )
    return null;

  return (
    <div className="shortcut-card-box">
      <div className="top-title">快捷入口</div>
      {isSinglePayment ? (
        // 单费用页面
        <div className="content">
          {is_XMJL_FXMJL &&
            prjBasic.WJZT !== '1' &&
            AUTH.includes('projectFinish') &&
            getShortcutItem({
              imgTxt: 'xmwj',
              txt: '项目完结',
              fn: () => handlePrjFinish(xmid),
            })}

          {is_XMJL_FXMJL &&
            !['4', '5'].includes(prjBasic.WJZT) &&
            AUTH.includes('projectTermination') &&
            getShortcutItem({
              imgTxt: 'terminateHandle',
              txt: '项目终止',
              fn: () => openProjectAbortModal(),
            })}
        </div>
      ) : (
        //其他页面
        <div className="content">
          {is_XMJL_FXMJL &&
            AUTH.includes('intellectualProperty') &&
            getShortcutItem({
              imgTxt: 'zscq',
              txt: '知识产权',
              fn: () => {},
              content: intelPropertyMenu,
            })}

          {is_XMJL_FXMJL &&
            AUTH.includes('awardsAndHonors') &&
            getShortcutItem({
              imgTxt: 'hjry',
              txt: '获奖荣誉',
              fn: () => {},
              content: awardHonorMenu,
            })}

          {showKQXX &&
            AUTH.includes('attendanceRegistration') &&
            getShortcutItem({
              imgTxt: 'kqdj',
              txt: '考勤登记',
              fn: handleAttendanceRegister,
            })}

          {is_XMJL_FXMJL &&
            showSCDD &&
            AUTH.includes('generateIteration') &&
            getShortcutItem({
              imgTxt: 'scdd',
              txt: '生成迭代',
              fn: createIterationPrj,
            })}

          {is_XMJL_FXMJL &&
            prjBasic.WJZT !== '1' &&
            AUTH.includes('projectFinish') &&
            getShortcutItem({
              imgTxt: 'xmwj',
              txt: '项目完结',
              fn: () => handlePrjFinish(xmid),
            })}

          {is_XMJL_FXMJL &&
          !['4', '5'].includes(prjBasic.WJZT) && // 终止中|4、已终止|5时不显示
            AUTH.includes('projectTermination') &&
            getShortcutItem({
              imgTxt: 'terminateHandle',
              txt: '项目终止',
              fn: () => openProjectAbortModal(),
            })}

          {authorities.RYPJ?.includes('OpenEvaluation') &&
            getShortcutItem({
              imgTxt: 'mutualEvaluation',
              txt: '评价管理',
              fn: () => {
                switchToEmployeePage('manage');
              },
            })}

          {is_XMJL_FXMJL &&
            showZWDD &&
            AUTH.includes('turnIteration') &&
            getShortcutItem({
              imgTxt: 'kqdj',
              txt: '转为迭代',
              fn: handleZWDD,
              popConfirmTxt: '确认转为自研迭代项目？',
            })}
        </div>
      )}

      <canvas
        ref={flowers}
        height={400}
        width={800}
        style={{
          position: 'absolute',
          top: 0,
          right: 310,
          pointerEvents: 'none',
        }}
      ></canvas>
      {/* 考勤登记 */}
      <AttendanceRegister
        xmid={xmid}
        visible={modalVisible.attendanceRegister}
        setVisible={v =>
          setModalVisible(p => ({
            ...p,
            attendanceRegister: v,
          }))
        }
        ZYXMKQLX={ZYXMKQLX}
        handlePromiseAll={handlePromiseAll}
      />

      {/* 知识产权 */}
      {modalVisible.intelProperty && (
        <OprIPModal
          visible={modalVisible.intelProperty}
          setVisible={v =>
            setModalVisible(p => ({
              ...p,
              intelProperty: v,
            }))
          }
          oprType={IPAHData.oprType}
          type={IPAHData.activeKey}
          rowData={IPAHData.rowData}
          refresh={v => handleModalRefresh('IntelProperty', v)}
          fromPrjDetail={{
            xmmc: prjBasic.XMMC,
            xmid: String(xmid),
          }} //入口是否在项目详情
          isGLY={isGLY.zscq}
        />
      )}

      {/* 获奖荣誉 */}
      {modalVisible.awardHonor && (
        <OprAHModal
          setVisible={v =>
            setModalVisible(p => ({
              ...p,
              awardHonor: v,
            }))
          }
          type={IPAHData.activeKey}
          data={{
            ...IPAHData,
            visible: modalVisible.awardHonor,
          }}
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
        maskStyle={{
          backgroundColor: 'rgb(0 0 0 / 30%)',
        }}
        style={{ top: 10 }}
        visible={modalVisible.createIterationPrj}
        okText="保存"
        destroyOnClose
        bodyStyle={{
          padding: 0,
        }}
        onCancel={() =>
          setModalVisible(p => ({
            ...p,
            createIterationPrj: false,
          }))
        }
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
          closeModel={() =>
            setModalVisible(p => ({
              ...p,
              createIterationPrj: false,
            }))
          }
          successCallBack={() => {
            setModalVisible(p => ({
              ...p,
              createIterationPrj: false,
            }));
          }}
          xmid={-1} //新建入-1
          projectType={'1'} //项目类型为软硬件，才有这个按钮
          scddProps={{
            glddxmId: String(xmid),
            prjData: {
              ID: String(xmid),
              XMMC: prjBasic.XMMC,
              XMJL: prjBasic.XMJL,
              XMNF: prjBasic.XMNF,
            },
            routes,
          }} //生成迭代需要用的参数
        />
      </Modal>

      {/* 项目完结 */}
      <PrjFinishModal
        visible={modalVisible.prjFinish}
        setVisible={v => setModalVisible(p => ({ ...p, prjFinish: v }))}
        data={{
          xmid,
          xmjd: prjBasic.XMJD,
          contrastArr,
          refresh: handlePrjFinishRefresh,
        }}
      />

      <OpenValuationModal
        visible={modalVisible.pjztgl}
        setVisible={v => setModalVisible(p => ({ ...p, pjztgl: v }))}
        routes={routes}
        refresh={() => {
          judgeMutualEvaluationShow().catch(err => {
            message.error(`判断是否展示人员互评图标失败${err}`, 2);
          });
        }}
        projectManager={isGLY.rypj ? undefined : Number(LOGIN_USER_INFO.id)}
        projectName={prjBasic.XMMC}
      />

      {modalVisible.projectAbort && (
        <ProjectAbortModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          getPrjDtlData={getPrjDtlData}
          prjBasic={prjBasic}
          xmid={xmid}
        />
      )}
    </div>
  );
});
