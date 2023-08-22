import { Progress, Popover, Empty, Popconfirm, message, Icon, Modal } from 'antd';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { OperateCreatProject } from '../../../../services/projectManage';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { QueryProjectGeneralInfo } from '../../../../services/pmsServices';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';

export default function ProjectCard(props) {
  const {
    itemWidth,
    getAfterItem,
    userRole,
    prjInfo,
    getPrjInfo,
    total,
    placement,
    setPlacement,
  } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [infoList, setInfoList] = useState([]); //项目信息 - 展示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState('#'); //项目信息修改弹窗显示
  const [allPrj, setAllPrj] = useState([]); //全部项目
  const [isLoading, setIsLoading] = useState(false); //查询全部数据时加载状态
  const location = useLocation();

  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  useEffect(() => {
    if (prjInfo.length !== 0) {
      setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth) * 3)]);
      setIsUnfold(false);
    }
    return () => {};
  }, [props]);

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

  //获取目前每行几个
  const getColNum = w => {
    switch (w) {
      case '32%':
        return 3;
      case '24%':
        return 4;
      case '19%':
        return 5;
      case '15.6%':
        return 6;
      case '13.2%':
        return 7;
      case '11.5%':
        return 8;
      default:
        return 3;
    }
  };

  //展开、收起
  const handleUnfold = bool => {
    if (bool) {
      // if (allPrj.length === 0) {
      setIsLoading(true);
      QueryProjectGeneralInfo({
        queryType: 'SY',
        role: userRole,
        org: Number(LOGIN_USER_INFO.org),
        paging: -1,
        current: 1,
        pageSize: 9999,
        total: -1,
        sort: '',
      })
        .then(res => {
          if (res?.success) {
            let arr = JSON.parse(res?.xmxx); //项目信息
            arr?.forEach(item => {
              let riskArr = []; //风险信息
              let participantArr = []; //人员信息
              JSON.parse(res?.fxxx).forEach(x => {
                if (x.XMID === item.XMID) {
                  riskArr.push(x);
                }
              });
              JSON.parse(res?.ryxx).forEach(x => {
                if (x.XMID === item.XMID) {
                  participantArr.push(x);
                }
              });
              item.riskData = [...riskArr];
              item.participantData = [...participantArr];
            });
            setAllPrj(p => [...arr]);
            setInfoList(p => [...arr]);
            setIsLoading(false);
            setIsUnfold(bool);
          }
        })
        .catch(e => {
          console.error('QueryProjectGeneralInfo', e);
          message.error('项目信息查询失败', 1);
        });
      // } else {
      //   setInfoList(p => [...allPrj]);
      //   setIsUnfold(bool);
      // }
    } else {
      setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth) * 3)]);
      setIsUnfold(bool);
    }
  };

  //草稿编辑
  const handleDraftModify = xmid => {
    setFileAddVisible(true);
    setSrc_fileAdd(
      // `/#/single/pms/SaveProject/${EncryptBase64(
      //   JSON.stringify({ xmid, type: true, projectStatus: 'SAVE' }),
      // )}`,
      { xmid: xmid, type: true, projectStatus: 'SAVE' },
    );
  };

  //草稿删除
  const handleDraftDelete = xmid => {
    OperateCreatProject({
      czr: 0,
      projectName: '',
      projectType: 0,
      projectLabel: '',
      org: '',
      software: 0,
      biddingMethod: 0,
      year: 0,
      budgetProject: 0,
      projectBudget: 0,
      mileposts: [
        {
          lcb: '0',
          kssj: '0',
          jssj: '0',
        },
      ],
      matters: [
        {
          lcb: '0',
          sxmc: '0',
        },
      ],
      projectManager: 0,
      members: [
        {
          rymc: '无',
          gw: '0',
        },
      ],
      projectId: Number(xmid),
      type: 'DELETE',
      budgetType: 'budgetType',
    })
      .then(res => {
        if (res.code === 1) {
          getPrjInfo(userRole);
          message.success('草稿删除成功', 1);
        }
      })
      .catch(error => {
        console.error(!error.success ? error.message : error.note);
        message.error('草稿删除失败', 1);
      });
  };

  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //新建项目成功后，刷新数据
  const handleFileAddSuccess = () => {
    closeFileAddModal();
    getPrjInfo(userRole); //刷新数据
  };

  //获取项目块
  const getProjectItem = ({
    title = '--',
    content = '--',
    rate = 0,
    key,
    participantData = [],
    riskData = [],
    isLate = false,
    isDraft = false,
    xmid = -1,
  }) => {
    if (isDraft)
      return (
        <div
          className="project-item"
          style={{
            width: itemWidth,
            background: '#fbfbfb',
            cursor: 'pointer',
          }}
          key={key}
        >
          <div className="item-top" onClick={() => handleDraftModify(xmid)}>
            <span>{title}</span>
            <div className="tag" style={{ backgroundColor: fontColor }}>
              草稿
            </div>
          </div>
          <div className="item-middle" onClick={() => handleDraftModify(xmid)}>
            <img src={require('../../../../assets/homePage/img_no data@2x.png')} alt="" />
          </div>
          <div className="item-bottom-operate">
            <div className="btn-edit" onClick={() => handleDraftModify(xmid)}>
              <div className="btn-edit-wrapper">
                <i className="iconfont edit" />
                编辑
              </div>
            </div>
            <div className="divider"></div>
            <Popconfirm title="确定要删除吗？" onConfirm={() => handleDraftDelete(xmid)}>
              <div className="btn-delete">
                <i className="iconfont delete" />
                删除
              </div>
            </Popconfirm>
          </div>
        </div>
      );
    let bgImg =
      'background: linear-gradient(270deg,rgba(51, 97, 255, 0) 0%,rgba(51, 97, 255, 0.1) 100%)';
    let fontColor = '#3361FF';
    if (isDraft) {
      fontColor = '#C0C4CCFF';
      bgImg = 'linear-gradient(270deg, rgba(144,147,153,0) 0%, rgba(144,147,153,0.1) 100%)';
    } else if (isLate) {
      fontColor = '#ff3030';
      bgImg = 'linear-gradient(270deg, rgba(215,14,25,0) 0%, rgba(215,14,25,0.1) 100%)';
    }
    const participantContent = data => {
      return (
        <div>
          <div className="list">
            {data?.map(x => (
              <Link
                to={{
                  pathname:
                    '/pms/manage/staffDetail/' +
                    EncryptBase64(
                      JSON.stringify({
                        ryid: x.USERID,
                      }),
                    ),
                  state: {
                    routes: [{ name: '个人工作台', pathname: location.pathname }],
                  },
                }}
                key={x.USERID}
                onClick={() => setPlacement(undefined)}
              >
                <div className="item">
                  <div className="img-box">
                    <img
                      src={require(`../../../../assets/homePage/img_avatar_${
                        x.XB === '男' ? 'male' : 'female'
                      }.png`)}
                      alt=""
                    />
                  </div>
                  {x.RYMC}
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    };
    const getParticipantName = () => {
      let arr = [];
      participantData?.forEach(x => {
        arr.push(x.RYMC);
      });
      if (participantData?.length > 4)
        return arr.slice(0, 4).join('、') + '等' + participantData?.length + '人参与';
      return arr.join('、') + participantData?.length + '人参与';
    };
    const riskContent = () => {
      const getItem = (label, content) => {
        return (
          <p>
            <span className="label">{label}内容：</span>
            <span>{content}</span>
          </p>
        );
      };
      return (
        <div className="list">
          {riskData?.map(x => (
            <div className="item" key={x.FXID}>
              <div className="top">
                <div className="title">{x.BT}</div>
                {x.ZT === '2' && (
                  <div className="handled-tag">
                    <div className="dot"></div>
                    已处理
                  </div>
                )}
                {x.ZT === '1' && (
                  <div className="unhandled-tag">
                    <div className="dot"></div>
                    未处理
                  </div>
                )}
              </div>

              {getItem('风险', x.NR || '')}
              {x.ZT !== '1' && getItem('处理', x.CLNR || '')}
            </div>
          ))}
        </div>
      );
    };
    return (
      <div
        className="project-item"
        style={{
          width: itemWidth,
          background: isDraft
            ? '#fbfbfb'
            : isLate
            ? 'conic-gradient(from 214.88deg at 75.98% 18.6%, rgba(255, 48, 48, 0.08) 0deg, rgba(255, 48, 48, 0.05) 360deg)'
            : 'conic-gradient(from 214.88deg at 75.98% 18.6%, #EFF3FF 0deg, #F4F7FF 360deg)',
        }}
        key={key}
      >
        <Link
          to={{
            pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
              JSON.stringify({
                xmid,
              }),
            )}`,
            state: {
              routes: [{ name: '个人工作台', pathname: location.pathname }],
            },
          }}
        >
          <div className="item-top">
            <span>{title}</span>
            {isDraft && (
              <div className="tag" style={{ backgroundColor: fontColor }}>
                草稿
              </div>
            )}
            {isLate && (
              <div className="tag" style={{ backgroundColor: fontColor }}>
                延期
              </div>
            )}
          </div>
          {isDraft ? (
            <div className="item-middle">
              <img src={require('../../../../assets/homePage/img_no data@2x.png')} alt="" />
            </div>
          ) : (
            <div className="item-middle">
              <div className="middle-top">
                <span>
                  <i className="iconfont icon-fill-flag" style={{ color: fontColor }} />「{content}
                  」阶段
                </span>
                <span className="rate" style={{ color: fontColor }}>
                  {rate}%
                </span>
              </div>
              <Progress
                showInfo={false}
                percent={Number(rate)}
                strokeColor={{
                  from: isLate ? 'rgba(255, 85, 95, 0)' : '#9EC4FE',
                  to: isLate ? '#FF3030' : '#7191FF',
                }}
                strokeWidth={10}
                className={isLate ? 'late-process' : 'normal-process'}
              />
              <div className="middle-bottom">
                <Popover
                  title={null}
                  placement="rightTop"
                  content={riskContent()}
                  overlayClassName="risk-content-popover"
                >
                  {riskData?.length !== 0 && `存在${riskData?.length}个未处理风险！`}
                </Popover>
              </div>
            </div>
          )}
        </Link>
        {isDraft ? (
          <div className="item-bottom-operate">
            <div className="btn-edit" onClick={() => handleDraftModify(xmid)}>
              <div className="btn-edit-wrapper">
                <i className="iconfont edit" />
                编辑
              </div>
            </div>
            <div className="divider"></div>
            <Popconfirm title="确定要删除吗？" onConfirm={() => handleDraftDelete(xmid)}>
              <div className="btn-delete">
                <i className="iconfont delete" />
                删除
              </div>
            </Popconfirm>
          </div>
        ) : participantData?.length === 0 ? (
          <div className="item-bottom-person">
            <div className="avatar-box">
              {participantData?.slice(0, 4).map(x => (
                <div className="avatar" key={x.USERID}>
                  <img
                    src={require(`../../../../assets/homePage/img_avatar_${
                      x.XB === '男' ? 'male' : 'female'
                    }.png`)}
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className="txt">{getParticipantName()}</div>
          </div>
        ) : (
          <Popover
            title={null}
            placement={placement}
            autoAdjustOverflow={true}
            content={participantContent(participantData)}
            overlayClassName="participant-content-popover"
          >
            <div className="item-bottom-person">
              <div className="avatar-box">
                {participantData?.slice(0, 8).map(x => (
                  <div className="avatar" key={x.USERID}>
                    <img
                      src={require(`../../../../assets/homePage/img_avatar_${
                        x.XB === '男' ? 'male' : 'female'
                      }.png`)}
                      alt=""
                    />
                  </div>
                ))}
              </div>
              <div
                className="txt"
                style={{
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '2',
                }}
              >
                {getParticipantName()}
              </div>
            </div>
          </Popover>
        )}
      </div>
    );
  };

  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '编辑草稿',
    width: '1000px',
    height: '780px',
    style: { top: '10px' },
    visible: fileAddVisible,
    footer: null,
  };
  if (total === 0) return null;
  return (
    <div className="project-card-box">
      {/* 修改项目弹窗 */}
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
              <strong>编辑草稿</strong>
            </div>
          }
          footer={null}
        >
          <NewProjectModelV2
            closeModel={closeFileAddModal}
            successCallBack={handleFileAddSuccess}
            xmid={src_fileAdd.xmid}
            type={src_fileAdd.type}
            projectStatus={src_fileAdd.projectStatus}
          />
        </Modal>
      )}
      <div className="home-card-title-box">
        <div className="txt">项目草稿</div>
      </div>
      {
        // userRole === '普通人员' ? (
        //   <div className="home-card-title-box">
        //     <div className="txt">我的项目</div>
        //   </div>
        // ) : (
        //   <div className="home-card-title-box">
        //     <div className="txt">
        //       团队项目
        //       {/* <i className="iconfont circle-info" /> */}
        //     </div>
        //     {userRole !== '普通人员' && (
        //       <span
        //         onClick={() =>
        //           (window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
        //             JSON.stringify({}),
        //           )}`)
        //         }
        //       >
        //         全部
        //         <i className="iconfont icon-right" />
        //       </span>
        //     )}
        //   </div>
        // )
      }
      <div className="project-box">
        {infoList?.map(item => {
          return getProjectItem({
            title: item.XMMC,
            content: item.DQLCB,
            rate: item.XMJD,
            isDraft: item.ZT === '2',
            key: item.XMID,
            participantData: item.participantData,
            riskData: item.riskData,
            isLate: item.LCBZT === '4',
            xmid: item.XMID,
          });
        })}
        {total === 0 && (
          <div style={{ width: '100%', margin: '122px auto' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
        {getAfterItem(itemWidth)}
      </div>
      {total > getColNum(itemWidth) * 3 &&
        (isUnfold ? (
          <div className="more-item" onClick={() => handleUnfold(false)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        ) : (
          <div className="more-item" onClick={() => handleUnfold(true)}>
            更多
            {isLoading ? <Icon type="loading" /> : <i className="iconfont icon-down" />}
          </div>
        ))}
    </div>
  );
}
