import { Breadcrumb, Button, message, Modal, Popover, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const { Item } = Breadcrumb;
const { TabPane } = Tabs;

export default function TopConsole(props) {
  const { routes = [], dtlData = {}, xqid, getDtldata, isAuth} = props;
  const [sqModalUrl, setSqModalUrl] = useState('#'); //申请餐券/权限弹窗
  const [sqModalVisible, setSqModalVisible] = useState(false);
  const [sqModaltxt, setSqModaltxt] = useState('');
  const [activeKey, setActiveKey] = useState(xqid); //
  const { XMXX = {}, XQXQ = [] } = dtlData;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (xqid !== -2) {
      setActiveKey(xqid);
    }
    return () => {};
  }, [xqid]);

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

  //申请餐券/权限弹窗
  const handleSqModal = (name = '申请餐券') => {
    // let params = {
    //   attribute: 0,
    //   authFlag: 0,
    //   objectName: 'TLC_LCFQ',
    //   operateName: name === '申请餐券' ? 'TLC_LCFQ_CQSQLC' : 'TLC_LCFQ_VPNSQ',
    //   parameter: [
    //     {
    //       name: 'GLXM',
    //       value: xmid,
    //     },
    //   ],
    //   userId: LOGIN_USER_INFO.loginName,
    // };
    // setSqModaltxt(name);
    // setSqModalVisible(true);
    // CreateOperateHyperLink(params)
    //   .then((ret = {}) => {
    //     const { code, message, url } = ret;
    //     if (code === 1) {
    //       setSqModalUrl(url);
    //     }
    //   })
    //   .catch(error => {
    //     // message.error(!error.success ? error.message : error.note);
    //     message.error(name + '失败', 1);
    //   });
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
    setActiveKey(key);
    getDtldata(key, XQXQ.filter(x => x.XQID === key)[0]?.LRRID);
    // console.log('handleTabsChange', key);
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
        <div className="prj-name">{XMXX.XMMC ?? '--'}</div>
        <div className="tag-row">
          {getTags(XMXX.XMBQ, XMXX.XMBQID)}
          {isAuth && (
            <>
              <Button className="btn-edit" onClick={() => {}}>
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
        {XMXX.XMJL ?? '--'}
        <span className="create-time">创建时间：</span>
        {XMXX.CJSJ ? moment(XMXX.CJSJ).format('YYYY-MM-DD') : '--'}
      </div>
      <div className="demand-tabs">
        <Tabs activeKey={activeKey} onChange={handleTabsChange} size={'large'}>
          {XQXQ.map((x, index) => (
            <TabPane tab={'人力需求' + (index + 1)} key={x.XQID}></TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
