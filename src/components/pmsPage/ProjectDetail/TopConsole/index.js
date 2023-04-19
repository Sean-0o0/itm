import { Breadcrumb, Button, message, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';

const { Item } = Breadcrumb;

export default function TopConsole(props) {
  const { routes = [], prjData = {}, xmid = -1, getPrjDtlData, isLeader } = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState('#'); //项目信息修改弹窗显示
  const [sqModalUrl, setSqModalUrl] = useState('#'); //申请餐券/权限弹窗
  const [sqModalVisible, setSqModalVisible] = useState(false);
  const [sqModaltxt, setSqModaltxt] = useState('');
  const { prjBasic = {}, member = [] } = prjData;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  //是否为项目成员或领导
  const isMember = () => {
    const arr = [];
    member.forEach(x => {
      arr.push(x.RYID);
    });
    return arr.includes(String(LOGIN_USER_INFO.id)) || isLeader;
  };

  //监听新建项目弹窗状态
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
      //刷新数据
      getPrjDtlData();
      // message.success('保存成功');
    }
  };

  const closeFileAddModal = () => {
    //其他信息tab表格内数据清空
    //获奖信息
    sessionStorage.setItem('hjxxTableDataFlag', 'false');
    //需求信息
    sessionStorage.setItem('xqxxTableDataFlag', 'false');
    //课题信息
    sessionStorage.setItem('ktxxTableDataFlag', 'false');
    setFileAddVisible(false);
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
                        <div className="tag-item">
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
                <div className="tag-item">...</div>
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
    setSrc_fileAdd(
      `/#/single/pms/EditProject/${EncryptBase64(
        JSON.stringify({ xmid, type: true, projectStatus: 'SAVE' }),
      )}`,
    );
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
        message.error(!error.success ? error.message : error.note);
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
    getPrjDtlData();
  };

  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '编辑项目',
    width: '1000px',
    height: '780px',
    style: {top: '60px'},
    visible: fileAddVisible,
    footer: null,
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
      {/* 编辑项目弹窗 */}
      {fileAddVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={fileAddModalProps}
          src={src_fileAdd}
          onCancel={() => {
            setFileAddVisible(false);
          }}
        />
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
        <div className="prj-name">{prjBasic?.XMMC}</div>
        <div className="tag-row">
          {getTags(prjBasic.XMBQ, prjBasic.XMBQID)}
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
        {prjBasic.XMJL}
        <span className="create-time">创建时间：</span>
        {prjBasic.CJRQ ? moment(prjBasic.CJRQ).format('YYYY-MM-DD') : null}
      </div>
    </div>
  );
}
