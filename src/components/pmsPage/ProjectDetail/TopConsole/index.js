import { Breadcrumb, Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const { Item } = Breadcrumb;

export default function TopConsole(props) {
  const { routes = [], prjData = {}, xmid = -1, getPrjDtlData } = props;
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState('#'); //项目信息修改弹窗显示
  const { prjBasic = {} } = prjData;
  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);
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
    sessionStorage.setItem("hjxxTableDataFlag", "false");
    //需求信息
    sessionStorage.setItem("xqxxTableDataFlag", "false");
    //课题信息
    sessionStorage.setItem("ktxxTableDataFlag", "false");
    setFileAddVisible(false);

  }

  //获取项目标签
  const getTags = (text = '') => {
    //获取项目标签数据
    const getTagData = tag => {
      let arr = [];
      if (tag !== '' && tag !== null && tag !== undefined) {
        if (tag.includes(',')) {
          arr = tag.split(',');
        } else {
          arr.push(tag);
        }
      }
      return arr;
    };
    return (
      <div className="prj-tags">
        {getTagData(text).length !== 0 && (
          <>
            {getTagData(text)
              ?.slice(0, 4)
              .map((x, i) => (
                <div key={i} className="tag-item">
                  {x}
                </div>
              ))}
            {getTagData(text)?.length > 2 && (
              <Popover
                overlayClassName="tag-more-popover"
                content={
                  <div className="tag-more">
                    {getTagData(text)
                      ?.slice(4)
                      .map((x, i) => (
                        <div key={i} className="tag-item">
                          {x}
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
  const btnMoreContent = (
    <div className="list">
      <div
        className="item"
        onClick={() => {
          // setEditingIndex(id);
          // setDrawerVisible(true);
        }}
      >
        申请餐券
      </div>
      <div className="item">申请权限</div>
    </div>
  );
  //编辑项目弹窗
  const handleEditPrjInfo = () => {
    setFileAddVisible(true);
    setSrc_fileAdd(
      `/#/single/pms/EditProject/${EncryptBase64(
        JSON.stringify({ xmid, type: true, projectStatus: 'SAVE' }),
      )}`,
    );
  };
  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '编辑项目',
    width: '1000px',
    height: '95vh',
    style: { top: '2vh' },
    visible: fileAddVisible,
    footer: null,
  };
  return (
    <div className="top-console-box">
      {/* 编辑项目弹窗 */}
      {fileAddVisible && (
        <BridgeModel isSpining="customize" modalProps={fileAddModalProps} src={src_fileAdd} onCancel={()=>setFileAddVisible(false)}/>
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
          {getTags(prjBasic.XMBQ)}
          <Button className="btn-edit" onClick={handleEditPrjInfo}>
            编辑
          </Button>
          <Popover
            placement="bottomRight"
            title={null}
            content={btnMoreContent}
            overlayClassName="btn-more-content-popover"
          >
            <Button className="btn-more">
              <i className="iconfont icon-more" />
            </Button>
          </Popover>
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
