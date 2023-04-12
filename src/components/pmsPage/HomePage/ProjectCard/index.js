import { Progress, Popover, Empty, Popconfirm } from 'antd';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { OperateCreatProject } from '../../../../services/projectManage';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export default function ProjectCard(props) {
  const { itemWidth, getAfterItem, userRole, prjInfo, getPrjInfo } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [infoList, setInfoList] = useState([]); //项目信息 - 展示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState('#'); //项目信息修改弹窗显示
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
    setIsUnfold(bool);
    if (bool) setInfoList(p => [...prjInfo]);
    else setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth) * 3)]);
  };

  //草稿编辑
  const handleDraftModify = xmid => {
    setFileAddVisible(true);
    setSrc_fileAdd(
      `/#/single/pms/SaveProject/${EncryptBase64(
        JSON.stringify({ xmid, type: true, projectStatus: 'SAVE' }),
      )}`,
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
          console.log('触发删除');
        }
      })
      .catch(error => {
        console.error(!error.success ? error.message : error.note);
      });
  };

  const closeFileAddModal = () => {
    //其他信息tab表格内数据清空
    //获奖信息
    sessionStorage.setItem('hjxxTableDataFlag', 'false');
    //需求信息
    sessionStorage.setItem('xqxxTableDataFlag', 'false');
    //课题信息
    sessionStorage.setItem('ktxxTableDataFlag', 'false');
    getPrjInfo(userRole);
    setFileAddVisible(false);
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
                    routes: [{ name: '首页', pathname: location.pathname }],
                  },
                }}
                key={x.USERID}
                // onClick={() => {
                //   window.location.href = `/#/pms/manage/staffDetail/${EncryptBase64(
                //     JSON.stringify({
                //       ryid: x.USERID,
                //       routes: [{ name: '首页', pathname: location.pathname }],
                //     }),
                //   )}`;
                // }}
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
      if (participantData?.length > 2)
        return arr.slice(0, 2).join('、') + participantData?.length + '等人参与';
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
    const jumpToDetail = id => {
      window.location.href = `/#/pms/manage/ProjectDetail/${EncryptBase64(
        JSON.stringify({
          routes: [{ name: '首页', pathname: location.pathname }],
          xmid: id,
        }),
      )}`;
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
              routes: [{ name: '首页', pathname: location.pathname }],
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
            placement="rightTop"
            content={participantContent(participantData)}
            overlayClassName="participant-content-popover"
          >
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

  return (
    <div className="project-card-box">
      {/* 修改项目弹窗 */}
      {fileAddVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={fileAddModalProps}
          onCancel={closeFileAddModal}
          src={src_fileAdd}
        />
      )}
      {userRole === '普通人员' ? (
        <div className="home-card-title-box">
          <div className="txt">我的项目</div>
        </div>
      ) : (
        <div className="home-card-title-box">
          <div className="txt">
            团队项目
            {/* <i className="iconfont circle-info" /> */}
          </div>
          {userRole !== '普通人员' && (
            <span>
              全部
              <i className="iconfont icon-right" />
            </span>
          )}
        </div>
      )}
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
        {prjInfo?.length === 0 && (
          <div style={{ width: '100%', margin: '0 auto' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
        {getAfterItem(itemWidth)}
      </div>
      {prjInfo?.length > getColNum(itemWidth) * 3 &&
        (isUnfold ? (
          <div className="more-item" onClick={() => handleUnfold(false)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        ) : (
          <div className="more-item" onClick={() => handleUnfold(true)}>
            更多
            <i className="iconfont icon-down" />
          </div>
        ))}
    </div>
  );
}
