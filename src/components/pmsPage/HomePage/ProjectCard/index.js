import { Progress, Popover, Empty, Popconfirm, message, Icon, Modal } from 'antd';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { OperateCreatProject } from '../../../../services/projectManage';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { QueryProjectGeneralInfo } from '../../../../services/pmsServices';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import emptyImg from '../../../../assets/homePage/img_no data@2x.png';
import EditProjectInfoModel from '../../EditProjectInfoModel';

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
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [infoList, setInfoList] = useState([]); //项目信息 - 展示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [allPrj, setAllPrj] = useState([]); //全部项目
  const [isLoading, setIsLoading] = useState(false); //查询全部数据时加载状态
  const location = useLocation();

  useEffect(() => {
    if (prjInfo.length !== 0) {
      setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth))]);
      setIsUnfold(false);
    }
    return () => {};
  }, [JSON.stringify(prjInfo), itemWidth]);

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
      setInfoList(p => [...prjInfo]);
    } else {
      setInfoList(p => [...prjInfo?.slice(0, getColNum(itemWidth))]);
    }
    setIsUnfold(bool);
  };

  //草稿编辑
  const handleDraftModify = (xmid, isDraft = false) => {
    console.log('🚀 ~ handleDraftModify ~  isDraft:', isDraft);
    setFileAddVisible(true);
    setSrc_fileAdd({
      xmid,
      type: true,
      projectStatus: 'SAVE',
      isDraft,
      notAllowEditBudget: isDraft ? false : true,
    });
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
    state = '2',
    xmid = -1,
    YSLCZT,
  }) => {
    const isDraft = state === '2'; //草稿
    const isBack = YSLCZT === '退回'; //被退回
    const isStop = YSLCZT === '终止'; //被终止
    const noPass = state === '5' && YSLCZT === undefined; //不通过
    const isPending = !isBack && !isStop && !noPass && state === '5'; //审批中
    let fontColor = '#C0C4CCFF';
    let titleTag = '草稿';
    if (isBack) {
      titleTag = '审批被退回';
    } else if (isPending) {
      titleTag = '审批中';
    } else if (isStop) {
      titleTag = '审批被终止';
    } else if (noPass) {
      titleTag = '审批不通过';
    }
    if (isDraft || isBack || isStop || isPending || noPass)
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
          <div
            className="item-top"
            onClick={() => (isPending ? {} : handleDraftModify(xmid, isDraft))}
          >
            <span>{title}</span>
            <div className="tag" style={{ backgroundColor: fontColor }}>
              {titleTag}
            </div>
          </div>
          <div
            className="item-middle"
            onClick={() => (isPending ? {} : handleDraftModify(xmid, isDraft))}
          >
            <img src={emptyImg} alt="" />
          </div>
          <div className="item-bottom-operate">
            {!isPending && (
              <div className="btn-edit" onClick={() => handleDraftModify(xmid, isDraft)}>
                <div className="btn-edit-wrapper">
                  <i className="iconfont edit" />
                  编辑
                </div>
              </div>
            )}
            <div className="divider" style={isDraft ? {} : { visibility: 'hidden' }}></div>
            <Popconfirm title="确定要删除吗？" onConfirm={() => handleDraftDelete(xmid)}>
              <div className="btn-delete" style={isDraft ? {} : { visibility: 'hidden' }}>
                <i className="iconfont delete" />
                删除
              </div>
            </Popconfirm>
          </div>
        </div>
      );
    return '';
  };
  if (total === 0) return null;
  return (
    <div className="project-card-box">
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
              <strong>编辑{src_fileAdd.isDraft ? '草稿' : '项目'}</strong>
            </div>
          }
          footer={null}
        >
          {src_fileAdd.isDraft ? (
            <NewProjectModelV2
              closeModel={closeFileAddModal}
              successCallBack={handleFileAddSuccess}
              xmid={src_fileAdd.xmid}
              type={src_fileAdd.type}
              projectStatus={src_fileAdd.projectStatus}
              notAllowEditBudget={src_fileAdd.notAllowEditBudget}
            />
          ) : (
            <EditProjectInfoModel
              closeModel={closeFileAddModal}
              successCallBack={handleFileAddSuccess}
              xmid={src_fileAdd.xmid}
              type={src_fileAdd.type}
              subItemFlag={false}
              projectStatus={src_fileAdd.projectStatus}
              notAllowEditBudget={src_fileAdd.notAllowEditBudget}
            />
          )}
        </Modal>
      )}
      <div className="home-card-title-box">
        <div className="txt">创建中项目</div>
      </div>
      <div className="project-box">
        {infoList?.map(item => {
          return getProjectItem({
            ...item,
            title: item.XMMC,
            content: item.DQLCB,
            rate: item.XMJD,
            state: item.ZT,
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
      {total > getColNum(itemWidth) &&
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
