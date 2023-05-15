import { Breadcrumb, Button, message, Modal, Popover, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import EditProjectInfoModel from '../../EditProjectInfoModel';

const { Item } = Breadcrumb;
const { TabPane } = Tabs;

export default function TopConsole(props) {
  const { routes = [], dtlData = {}, xmid = -1, getDtlData, isLeader } = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [sqModalUrl, setSqModalUrl] = useState('#'); //申请餐券/权限弹窗
  const [sqModalVisible, setSqModalVisible] = useState(false);
  const [sqModaltxt, setSqModaltxt] = useState('');
  const [activeKey, setActiveKey] = useState('1'); //
  const { XMXX = {}, XQ = [] } = dtlData;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    return () => {};
  }, []);

  //是否为项目成员或领导
  const isMember = () => {
    // const arr = [];
    // console.log(XMXX);
    // member.forEach(x => {
    //   arr.push(x.RYID);
    // });
    return XMXX.XMJLID === String(LOGIN_USER_INFO.id) || isLeader;
  };

  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //新建项目成功后，刷新数据
  const handleFileAddSuccess = () => {
    closeFileAddModal();
    //刷新数据
    getPrjDtlData();
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
      // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
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
    setFileAddVisible(true);
    let p = { xmid, type: true, projectStatus: 'SAVE' };
    XMXX.FXMMC && (p.subItemFlag = true);
    setSrc_fileAdd(p);
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

  const btnMoreContent = (
    <div className="list">
      <div className="item" onClick={() => handleSqModal()}>
        申请餐券
      </div>
      <div className="item" onClick={() => handleSqModal('申请权限')}>
        申请权限
      </div>
    </div>
  );

  const handlesqModalSuccess = txt => {
    message.success(txt, 1);
    setSqModalVisible(false);
    // getPrjDtlData();
  };

  const handleTabsChange = key => {
    console.log('handleTabsChange', key);
  };

  //申请餐券/权限弹窗
  const sqModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: sqModaltxt,
    width: '600px',
    height: '400px',
    style: { top: '60px' },
    visible: sqModalVisible,
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
            projectStatus={src_fileAdd.projectStatus}
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
        <div className="prj-name">{XMXX?.XMMC}</div>
        <div className="tag-row">
          {getTags(XMXX.XMBQ, XMXX.XMBQID)}
          {isMember() && (
            <>
              <Button className="btn-edit" onClick={handleEditPrjInfo}>
                编辑
              </Button>
              <Popover
                placement="bottomRight"
                title={null}
                content={btnMoreContent}
                overlayClassName="tc-btn-more-content-popover"
              >
                <Button className="btn-more">
                  <i className="iconfont icon-more" />
                </Button>
              </Popover>
            </>
          )}
        </div>
      </div>
      <div className="mnger-time">
        <span>项目经理：</span>
        {XMXX.XMJL}
        <span className="create-time">创建时间：</span>
        {XMXX.CJSJ ? moment(XMXX.CJSJ).format('YYYY-MM-DD') : null}
      </div>
      <div className="demand-tabs">
        <Tabs defaultActiveKey="1" activeKe={activeKey} onChange={handleTabsChange} size={'large'}>
          {XQ.map((x, index) => (
            <TabPane tab={'人力需求' + (index + 1)} key={index + 1}></TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
