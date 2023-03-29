import { Breadcrumb, Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'dva/router';
import moment from 'moment';

export default function TopConsole(props) {
  const { routes, prjData } = props;
  const { prjBasic = {} } = prjData;
  useEffect(() => {
    return () => {};
  }, []);
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
  return (
    <div className="top-console-box">
      <Breadcrumb separator=">">
        {routes.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Breadcrumb.Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <div className="prj-info-row">
        <div className="prj-name">{prjBasic?.XMMC}</div>
        <div className="tag-row">
          {getTags(prjBasic.XMBQ)}
          <Button className="btn-edit">编辑</Button>
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
