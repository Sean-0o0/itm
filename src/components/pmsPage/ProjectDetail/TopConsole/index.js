import {
  Breadcrumb,
  Button,
  message,
  Modal,
  Popover,
  Menu,
  Dropdown,
  Icon,
  Popconfirm,
  Tooltip,
} from 'antd';
import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink, ProjectCollect } from '../../../../services/pmsServices';
import EditProjectInfoModel from '../../EditProjectInfoModel';
import iconCompleted from '../../../../assets/projectDetail/icon_completed.png';
import iconTerminated from '../../../../assets/projectDetail/icon_terminated.png';
import PaymentModal from './PaymentModal';
import SinglePaymentModal from '../../HomePage/ShortcutCard/SinglePaymentModal';

const { Item } = Breadcrumb;
const { SubMenu } = Menu;

export default function TopConsole(props) {
  const {
    routes = [],
    prjData = {},
    xmid = -1,
    getPrjDtlData,
    isLeader,
    haveSpl = false,
    setIsSpinning,
    getMileStoneData,
    setPrjData,
    getProgressStatisticsData,
    isDDXM,
    grayTest = {},
    isAdmin = false,
    ysspHide = false,
    isSinglePayment = false,
    isEnd = false,
    isHwSltPrj = false, //是否硬件入围
  } = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [sqModalUrl, setSqModalUrl] = useState('#'); //申请餐券/权限弹窗
  const [sqModalVisible, setSqModalVisible] = useState(false);
  const [sqModaltxt, setSqModaltxt] = useState('');
  const [lbmodal, setLbModal] = useState({
    xmlxsq: false,
    rjhtqs: false,
    zbh: false,
    rjfyspyht: false,
    rjfyspwht: false,
    sbcgyht: false,
    sbcgwht: false,
    xwhfj: false,
    qt: false,
    blgys: false, //补录供应商
    fklcbl: false,
    title: '',
    url: '#',
  }); //livebos弹窗、付款流程补录弹窗显隐
  const {
    prjBasic = {},
    member = [],
    payment = [],
    iterationYear = [],
    topic = [],
    award = [],
    contrastArr = [],
  } = prjData;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const history = useHistory();
  const [singlePaymentVisible, setSinglePaymentVisible] = useState(false); //单费用付款弹窗显隐

  //项目经理
  const allowEdit = () => {
    // const arr = [];
    // console.log(prjBasic);
    // member.forEach(x => {
    //   arr.push(x.RYID);
    // });
    // return prjBasic.XMJLID === String(LOGIN_USER_INFO.id) || isLeader;
    return prjBasic.XMJLID === String(LOGIN_USER_INFO.id);
  };

  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //新建项目成功后，刷新数据
  const handleFileAddSuccess = () => {
    closeFileAddModal();
    //刷新数据
    getPrjDtlData();
    getMileStoneData(true); //true 表示将初始化 高亮里程碑 为 当前里程碑
    getProgressStatisticsData();
  };

  //获取项目标签
  const getTags = (text = '', idtxt = '') => {
    //获取项目标签数据
    const getTagData = (tag, idtxt) => {
      let arr = [];
      let arr2 = [];
      if (
        tag !== '' &&
        tag !== null &&
        tag !== undefined &&
        idtxt !== '' &&
        idtxt !== null &&
        idtxt !== undefined
      ) {
        if (tag.includes(',')) {
          arr = tag.split(',');
          arr2 = idtxt.split(',');
        } else {
          arr.push(tag);
          arr2.push(idtxt);
        }
      }
      let arr3 = arr.map((x, i) => {
        return {
          name: x,
          id: arr2[i],
        };
      });
      return arr3;
    };
    return (
      <div className="prj-tags">
        {getTagData(text, idtxt).length !== 0 && (
          <>
            {getTagData(text, idtxt)
              ?.slice(0, 4)
              .map((x, i) => (
                <Link
                  to={{
                    pathname:
                      '/pms/manage/labelDetail/' +
                      EncryptBase64(
                        JSON.stringify({
                          bqid: x.id,
                        }),
                      ),
                    state: { routes },
                  }}
                  key={x.id}
                  className="tag-item"
                >
                  {x.name}
                </Link>
              ))}
            {getTagData(text, idtxt)?.length > 4 && (
              <Popover
                overlayClassName="tag-more-popover"
                content={
                  <div className="tag-more">
                    {getTagData(text, idtxt)
                      ?.slice(4)
                      .map((x, i) => (
                        <div className="tag-item" key={x.id}>
                          <Link
                            to={{
                              pathname:
                                '/pms/manage/labelDetail/' +
                                EncryptBase64(
                                  JSON.stringify({
                                    bqid: x.id,
                                  }),
                                ),
                              state: { routes },
                            }}
                            key={x.id}
                            style={{ color: '#3361ff' }}
                          >
                            {x.name}
                          </Link>
                        </div>
                      ))}
                  </div>
                }
                title={null}
              >
                <div className="tag-item" key="...">
                  ...
                </div>
              </Popover>
            )}
          </>
        )}
      </div>
    );
  };

  //编辑项目弹窗
  const handleEditPrjInfo = () => {
    if (isSinglePayment) {
      setSinglePaymentVisible(true);
    } else {
      setFileAddVisible(true);
      let p = { xmid, type: true, projectStatus: 'SAVE' };
      //当项目状态为5时，编辑项目弹窗，无法修改预算信息，在关联预算的字段后面加一个文字提示“项目审批中，暂时无法修改预算信息”
      String(prjBasic.XMZT) === '5' && (p.notAllowEditBudget = false); //有变动，暂时改成false
      prjBasic.FXMMC && (p.subItemFlag = true);
      //项目编辑，管理员可以编辑所有项目，子项目的项目立项里程碑信息，也对管理员开放编辑
      if (isAdmin) {
        p.subItemFlag = false;
      }
      setSrc_fileAdd(
        p,
        // `/#/single/pms/EditProject/${EncryptBase64(JSON.stringify(p))}`
      );
    }
  };

  //申请餐券/权限弹窗
  const handleSqModal = (name = '申请餐券') => {
    let params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'TLC_LCFQ',
      operateName: name === '申请餐券' ? 'TLC_LCFQ_CQSQLC' : 'TLC_LCFQ_VPNSQ',
      parameter: [
        {
          name: 'GLXM',
          value: xmid,
        },
      ],
      userId: LOGIN_USER_INFO.loginName,
    };
    setSqModaltxt(name);
    setSqModalVisible(true);
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          setSqModalUrl(url);
        }
      })
      .catch(error => {
        // message.error(!error.success ? error.message : error.note);
        message.error(name + '失败', 1);
      });
  };

  const openLbModal = (modalName, attribute) => {
    //Livebos弹窗参数
    const getParams = (objName, oprName, data) => {
      return {
        attribute: 0,
        authFlag: 0,
        objectName: objName,
        operateName: oprName,
        parameter: data,
        userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
      };
    };

    //获取Livebos弹窗链接
    const getLink = params => {
      CreateOperateHyperLink(params)
        .then((ret = {}) => {
          const { code, message, url } = ret;
          if (code === 1) {
            setLbModal(p => ({
              ...p,
              url,
            }));
          }
        })
        .catch(error => {
          console.error(!error.success ? error.message : error.note);
          message.error('链接获取失败', 1);
        });
    };
    let params = {};
    if (attribute === 'xmlxsq') {
      params = getParams('View_BLXX', 'V_BLXX_XMLXSQ', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'rjhtqs') {
      params = getParams('View_BLXX', 'V_BLXX_HTQSLC', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'zbh') {
      params = getParams('View_BLXX', 'V_BLXX_ZBHLC', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'rjfyspyht') {
      params = getParams('View_BLXX', 'V_BLXX_RJGMHT', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'rjfyspwht') {
      params = getParams('View_BLXX', 'V_BLXX_RJGMWHT', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'sbcgyht') {
      params = getParams('View_BLXX', 'V_BLXX_SBCGHT', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'sbcgwht') {
      params = getParams('View_BLXX', 'V_BLXX_SBCGWHT', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'xwhfj') {
      params = getParams('View_BLXX', 'View_BLXX_XWHLCFJ', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'qt') {
      params = getParams('View_BLXX', 'V_BLXX_QTLC', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    } else if (attribute === 'blgys') {
      params = getParams('View_TBXX', 'View_TBXX_BL', [
        {
          name: 'XMMC',
          value: Number(xmid),
        },
      ]);
    }
    getLink(params);
    setLbModal(p => ({
      ...p,
      [attribute]: true,
      title: '补录' + modalName,
    }));
  };

  const btnMoreContent = () => {
    // if (String(LOGIN_USER_INFO.id) === '0')
    return (
      <Menu>
        <SubMenu title={<span style={{ marginLeft: 20 }}>流程补录</span>}>
          <Menu.Item onClick={() => openLbModal('信委会附件', 'xwhfj')}>信委会附件</Menu.Item>
          <Menu.Item onClick={() => openLbModal('总办会流程', 'zbh')}>总办会流程</Menu.Item>
          <Menu.Item onClick={() => openLbModal('项目立项申请', 'xmlxsq')}>项目立项申请</Menu.Item>
          <Menu.Item onClick={() => openLbModal('软件合同签署流程', 'rjhtqs')}>
            软件合同签署流程
          </Menu.Item>
          <Menu.Item onClick={() => openLbModal('软件费用审批流程-有合同', 'rjfyspyht')}>
            软件费用审批流程-有合同
          </Menu.Item>
          <Menu.Item onClick={() => openLbModal('软件费用审批流程-无合同', 'rjfyspwht')}>
            软件费用审批流程-无合同
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              openLbModal(isHwSltPrj ? '设备采购有合同' : '框架外硬件采购流程', 'sbcgyht')
            }
          >
            {isHwSltPrj ? '设备采购有合同' : '框架外硬件采购流程'}
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              openLbModal(isHwSltPrj ? '设备采购无合同' : '框架内硬件采购流程', 'sbcgwht')
            }
          >
            {isHwSltPrj ? '设备采购无合同' : '框架内硬件采购流程'}
          </Menu.Item>
          <Menu.Item onClick={() => openLbModal('其他流程', 'qt')}>其他流程</Menu.Item>
        </SubMenu>
        <Menu.Item onClick={() => setLbModal(p => ({ ...p, fklcbl: true }))}>付款补录</Menu.Item>
        {!haveSpl && (
          <Menu.Item onClick={() => openLbModal('供应商', 'blgys')}>供应商补录</Menu.Item>
        )}
      </Menu>
    );
    return (
      <Menu>
        {/* <Menu.Item onClick={() => setLbModal(p => ({ ...p, fklcbl: true }))}>付款补录</Menu.Item> */}
        {!haveSpl && (
          <Menu.Item onClick={() => openLbModal('供应商', 'blgys')}>供应商补录</Menu.Item>
        )}
        <Menu.Item onClick={() => openLbModal('软件合同签署流程', 'rjhtqs')}>
          补录软件合同签署流程
        </Menu.Item>
        <Menu.Item onClick={() => handleSqModal()}>申请餐券</Menu.Item>
        <Menu.Item onClick={() => handleSqModal('申请权限')}>申请权限</Menu.Item>
      </Menu>
    );
  };

  //收藏、取消收藏
  const handlePrjCollect = operateType => {
    const oprTxt = operateType === 'SCXM' ? '收藏' : '取消收藏';
    setIsSpinning(true);
    ProjectCollect({
      operateType,
      projectId: Number(xmid),
    })
      .then(res => {
        if (res?.success) {
          getPrjDtlData();
        }
      })
      .then(() => {
        // message.success(oprTxt + '成功', 1);
      })
      .catch(e => {
        console.error('🚀' + oprTxt, e);
        message.error(oprTxt + '失败', 1);
        setIsSpinning(false);
      });
  };

  const handlesqModalSuccess = txt => {
    message.success(txt, 1);
    setSqModalVisible(false);
    getPrjDtlData();
  };

  // 迭代年份
  const menu = (
    <Menu>
      {iterationYear.dropdown?.map(x => (
        <Menu.Item
          key={x.ID}
          onClick={() => {
            if (Number(x.ID) !== Number(xmid)) {
              setPrjData(p => ({
                ...p,
                iterationYear: {
                  ...p.iterationYear,
                  currentYear: Number(x.NF),
                },
              }));
              history.push(
                `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    routes,
                    xmid: x.ID,
                  }),
                )}`,
              );
            }
          }}
        >
          {x.NF}
        </Menu.Item>
      ))}
    </Menu>
  );

  //申请餐券/权限弹窗
  const sqModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: sqModaltxt,
    width: '800px',
    height: '600px',
    style: { top: '10px' },
    visible: sqModalVisible,
    footer: null,
  };
  const xmlxsqModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '520px',
    style: { top: '60px' },
    visible: lbmodal.xmlxsq,
    footer: null,
  };
  const rjhtqsModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '400px',
    style: { top: '60px' },
    visible: lbmodal.rjhtqs,
    footer: null,
  };
  const zbhModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '520px',
    style: { top: '60px' },
    visible: lbmodal.zbh,
    footer: null,
  };
  const rjfyspyhtModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '480px',
    style: { top: '60px' },
    visible: lbmodal.rjfyspyht,
    footer: null,
  };
  const rjfyspwhtModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '350px',
    style: { top: '60px' },
    visible: lbmodal.rjfyspwht,
    footer: null,
  };
  const sbcgyhtModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '420px',
    style: { top: '60px' },
    visible: lbmodal.sbcgyht,
    footer: null,
  };
  const sbcgwhtModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '360px',
    style: { top: '60px' },
    visible: lbmodal.sbcgwht,
    footer: null,
  };
  const xwhfjModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '300px',
    style: { top: '60px' },
    visible: lbmodal.xwhfj,
    footer: null,
  };
  const qtModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '800px',
    height: '530px',
    style: { top: '60px' },
    visible: lbmodal.qt,
    footer: null,
  };
  const blgysModalProps = {
    isAllWindow: 1,
    title: lbmodal.title,
    width: '600px',
    height: '500px',
    style: { top: '60px' },
    visible: lbmodal.blgys,
    footer: null,
  };

  return (
    <div className="top-console-box">
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
              <strong>编辑项目</strong>
            </div>
          }
          footer={null}
        >
          <EditProjectInfoModel
            closeModel={closeFileAddModal}
            successCallBack={handleFileAddSuccess}
            xmid={src_fileAdd.xmid}
            type={src_fileAdd.type}
            subItemFlag={src_fileAdd.subItemFlag}
            projectStatus={src_fileAdd.projectStatus}
            notAllowEditBudget={src_fileAdd.notAllowEditBudget}
          />
        </Modal>
      )}
      {/*申请餐券/权限弹窗*/}
      {sqModalVisible && (
        <BridgeModel
          modalProps={sqModalProps}
          onSucess={() => handlesqModalSuccess(sqModaltxt)}
          onCancel={() => setSqModalVisible(false)}
          src={sqModalUrl}
        />
      )}

      {lbmodal.xmlxsq && (
        <BridgeModel
          modalProps={xmlxsqModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              xmlxsq: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              xmlxsq: false,
            }))
          }
          src={lbmodal.url}
        />
      )}

      {lbmodal.rjhtqs && (
        <BridgeModel
          modalProps={rjhtqsModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              rjhtqs: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              rjhtqs: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.zbh && (
        <BridgeModel
          modalProps={zbhModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              zbh: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              zbh: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.rjfyspyht && (
        <BridgeModel
          modalProps={rjfyspyhtModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              rjfyspyht: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              rjfyspyht: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.rjfyspwht && (
        <BridgeModel
          modalProps={rjfyspwhtModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              rjfyspwht: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              rjfyspwht: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.sbcgyht && (
        <BridgeModel
          modalProps={sbcgyhtModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              sbcgyht: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              sbcgyht: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.sbcgwht && (
        <BridgeModel
          modalProps={sbcgwhtModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              sbcgwht: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              sbcgwht: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.xwhfj && (
        <BridgeModel
          modalProps={xwhfjModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              xwhfj: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              xwhfj: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.qt && (
        <BridgeModel
          modalProps={qtModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              qt: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              qt: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      {lbmodal.blgys && (
        <BridgeModel
          modalProps={blgysModalProps}
          onSucess={() => {
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              blgys: false,
            }));
            getPrjDtlData();
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              blgys: false,
            }))
          }
          src={lbmodal.url}
        />
      )}
      <PaymentModal
        dataProps={{ visible: lbmodal.fklcbl, paymentPlan: payment, xmid, dhtData: contrastArr }}
        funcProps={{ setVisible: v => setLbModal(p => ({ ...p, fklcbl: v })) }}
      />
      <Breadcrumb separator=">">
        {routes?.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Item>
          );
        })}
      </Breadcrumb>
      <div className="prj-info-row">
        {isDDXM ? (
          <div className="prj-name">
            {prjBasic.XMMC &&
              prjBasic.XMMC +
              (iterationYear.currentYear && isDDXM ? ` -${iterationYear.currentYear}` : '')}
          </div>
        ) : (
          <div className="prj-name">{prjBasic?.XMMC}</div>
        )}
        <div className="tag-row">
          {prjBasic.SFSC === '0' ? (
            <Popconfirm title="确定收藏吗？" onConfirm={() => handlePrjCollect('SCXM')}>
              <i className="iconfont icon-star" />
            </Popconfirm>
          ) : (
            <Popconfirm title="确定取消收藏吗？" onConfirm={() => handlePrjCollect('QXXM')}>
              <i className="iconfont icon-star-fill" />
            </Popconfirm>
          )}
          {!isSinglePayment && (
            <Fragment>
              {/* 科技奖项 */}
              {award
                .find(x => x.title === '科技奖项')
                ?.data.findIndex(x => String(x.HJQK) === '1') === -1 ? (
                <img
                  src={require(`../../../../assets/projectDetail/trophy_gray.png`)}
                  alt="kjjx"
                  className="img-zscq-hjry"
                />
              ) : (
                <Popover
                  placement="bottom"
                  title={null}
                  content={
                    <div className="list">
                      {award
                        .find(x => x.title === '科技奖项')
                        ?.data.filter(x => String(x.HJQK) === '1')
                        .map((x, i) => (
                          <div className="item" key={x.HJMC + i} style={{ maxWidth: 385 }}>
                            {x.HJMC}
                          </div>
                        ))}
                    </div>
                  }
                  overlayClassName="zscq-hjry-popover-content"
                >
                  <img
                    src={require(`../../../../assets/projectDetail/trophy.png`)}
                    alt="kjjx"
                    className="img-zscq-hjry"
                  />
                </Popover>
              )}
              {/* 研究课题 */}
              {award
                .find(x => x.title === '研究课题')
                ?.data.findIndex(x => String(x.KTZT) === '3') === -1 ? (
                <img
                  src={require(`../../../../assets/projectDetail/medal_gray.png`)}
                  alt="yjkt"
                  className="img-zscq-hjry"
                />
              ) : (
                <Popover
                  placement="bottom"
                  title={null}
                  content={
                    <div className="list">
                      {award
                        .find(x => x.title === '研究课题')
                        ?.data.filter(x => String(x.KTZT) === '3')
                        .map((x, i) => (
                          <div className="item" key={x.HJMC + i} style={{ maxWidth: 385 }}>
                            {x.HJMC}
                          </div>
                        ))}
                    </div>
                  }
                  overlayClassName="zscq-hjry-popover-content"
                >
                  <img
                    src={require(`../../../../assets/projectDetail/medal.png`)}
                    alt="yjkt"
                    className="img-zscq-hjry"
                  />
                </Popover>
              )}
              {/* 知识产权 */}
              {topic.flatMap(x => x.data).length === 0 ? (
                <img
                  src={require(`../../../../assets/projectDetail/book_gray.png`)}
                  alt="zscq"
                  className="img-zscq-hjry"
                />
              ) : (
                <Popover
                  placement="bottom"
                  title={null}
                  content={
                    <div className="list">
                      {topic
                        .flatMap(x => x.data)
                        .map((x, i) => (
                          <div className="item" key={x.CQMC + i} style={{ maxWidth: 385 }}>
                            {x.CQMC}
                          </div>
                        ))}
                    </div>
                  }
                  overlayClassName="zscq-hjry-popover-content"
                >
                  <img
                    src={require(`../../../../assets/projectDetail/book.png`)}
                    alt="zscq"
                    className="img-zscq-hjry"
                  />
                </Popover>
              )}
            </Fragment>
          )}
          {getTags(prjBasic.XMBQ, prjBasic.XMBQID)}
          {/* 1已完结2未完结 5已终止 */}
          {prjBasic.WJZT === '1' && (
            <img src={iconCompleted} className="icon-completed" alt="图片：已完结" />
          )}
          {prjBasic.WJZT === '5' && (
            <img src={iconTerminated} className="icon-completed" alt="图片：已终止" />
          )}
          {!isEnd && !ysspHide && (allowEdit() || String(LOGIN_USER_INFO.id) === '0') && (
            <Button className="btn-edit" onClick={handleEditPrjInfo}>
              编辑
            </Button>
          )}
          {!isEnd &&
            !isSinglePayment &&
            !ysspHide &&
            (allowEdit() || String(LOGIN_USER_INFO.id) === '0') && (
              <Dropdown overlay={btnMoreContent()} overlayClassName="tc-btn-more-content-dropdown">
                <Button className="btn-more">
                  <i className="iconfont icon-more" />
                </Button>
              </Dropdown>
            )}
        </div>
      </div>
      <div className="mnger-time">
        <span>项目经理：</span>
        {prjBasic.XMJL}
        <span className="create-time">创建时间：</span>
        {prjBasic.CJRQ ? moment(prjBasic.CJRQ).format('YYYY-MM-DD') : null}

        {prjBasic.ZZSM && <span className="project-terminationt-statement">项目终止说明：</span>}
        {prjBasic.ZZSM && (
          <Tooltip title={prjBasic.ZZSM} placement="topLeft">
            <span className="project-terminationt-statement-content" style={{ cursor: 'default' }}>
              {prjBasic.ZZSM}
            </span>
          </Tooltip>
        )}
        {isDDXM && iterationYear.dropdown?.length > 0 && (
          <div className="iteration-year">
            迭代年份：
            <Dropdown overlay={menu} trigger={['click']}>
              <span>
                {iterationYear.currentYear}
                <i className="iconfont icon-fill-down" />
              </span>
            </Dropdown>
          </div>
        )}
      </div>
      <SinglePaymentModal
        visible={singlePaymentVisible}
        setVisible={setSinglePaymentVisible}
        type="MOD"
        refresh={() => {
          getPrjDtlData();
          getMileStoneData(true);
          getProgressStatisticsData();
        }}
        xmid={xmid}
      />
    </div>
  );
}
