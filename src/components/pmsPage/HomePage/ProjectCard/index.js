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
    if (prjInfo.length !== 0) {
      setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth) * 2)]);
      setIsUnfold(false);
      // console.log('location', location);
      // console.log("🚀 ~ file: index.js ~ line 14 ~ useEffect ~ prjInfo?.slice(0, getColNum(itemWidth) * 2)", prjInfo?.slice(0, getColNum(itemWidth) * 2))
      // console.log('🚀 ~ file: index.js ~ line 14 ~ useEffect ~ prjInfo', prjInfo);
    }
    return () => {};
  }, [props]);

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
    else setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth) * 2)]);
  };

  //草稿编辑
  const handleDraftModify = xmid => {
    setFileAddVisible(true);
    setSrc_fileAdd(
      `/#/single/pms/EditProject/${EncryptBase64(
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
    xmid = '',
  }) => {
    let bgImg =
      'background: linear-gradient(270deg,rgba(51, 97, 255, 0) 0%,rgba(51, 97, 255, 0.1) 100%)';
    let fontColor = '#3361FF';
    if (isDraft) {
      fontColor = '#C0C4CCFF';
      bgImg = 'linear-gradient(270deg, rgba(144,147,153,0) 0%, rgba(144,147,153,0.1) 100%)';
    } else if (isLate) {
      fontColor = '#D70E19FF';
      bgImg = 'linear-gradient(270deg, rgba(215,14,25,0) 0%, rgba(215,14,25,0.1) 100%)';
    }
    const participantContent = data => {
      return (
        <div>
          <div className="list">
            {data?.map(x => (
              <Link
                to={{
                  pathname: '/pms/manage/staffDetail',
                  state: {
                    routes: [{ name: '首页', pathname: location.pathname }],
                    ryid: x.USERID,
                  },
                }}
                key={x.USERID}
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
              <div className="title">{x.BT}</div>
              {getItem('风险', x.NR || '')}
              {getItem('处理', x.CLNR || '')}
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
        }}
        key={key}
      >
        <div className="item-top" style={{ backgroundImage: bgImg }}>
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
        {isDraft !== true && (
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
                from: '#F0F2F5',
                to: fontColor,
              }}
              strokeWidth={10}
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
        {isDraft !== true &&
          (participantData?.length === 0 ? (
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
          ))}
        {isDraft && (
          <div className="item-middle">
            <img src={require('../../../../assets/homePage/img_no data@2x.png')} alt="" />
          </div>
        )}
        {isDraft && (
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
        )}
      </div>
    );
  };

  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '新建项目',
    width: '70%',
    height: '95vh',
    style: { top: '2rem' },
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
      {prjInfo?.length > getColNum(itemWidth) * 2 &&
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
