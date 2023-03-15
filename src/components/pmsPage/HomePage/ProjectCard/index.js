import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';

export default function ProjectCard(props) {
  const {} = props;
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  useEffect(() => {
    return () => {};
  }, []);
  const getProjectItem = () => {
    return (
      <div className="project-item">
        <div className="item-top">
          项目信息管理系统
          {/* <div className="tag">草稿</div> */}
        </div>
        <div className="item-middle">
          <div className="middle-top">
            <span>
              <i className="iconfont icon-fill-flag" />
              「市场及需求分析」阶段
            </span>
            <span className="rate">67%</span>
          </div>
          <Progress
            showInfo={false}
            percent={60}
            strokeColor={{
              from: '#F0F2F5',
              to: '#3361FF',
            }}
            strokeWidth={10}
          />
          {/* <div className="middle-bottom">存在3个未处理风险！</div> */}
        </div>
        {/* <div className="item-bottom-operate">
          <div className="btn-edit">
            <i className="iconfont edit" />
            编辑
          </div>
          <div className="btn-delete">
            <i className="iconfont delete" />
            删除
          </div>
        </div> */}
        <div className="item-bottom-person">
          <div className="avatar-box">
            <div className="avatar">
              <img src={require('../../../../assets/homePage/img_avatar_male.png')} alt="" />
            </div>
            <div className="avatar">
              <img src={require('../../../../assets/homePage/img_avatar_female.png')} alt="" />
            </div>
            <div className="avatar">
              <img src={require('../../../../assets/homePage/img_avatar_male.png')} alt="" />
            </div>
            <div className="avatar">
              <img src={require('../../../../assets/homePage/img_avatar_female.png')} alt="" />
            </div>
          </div>
          朱燕、陈强国等4人参与
        </div>
      </div>
    );
  };
  return (
    <div className="project-card-box">
      <div className="home-card-title-box">
        <div className="txt">
          团队项目
          <i className="iconfont circle-info" />
        </div>
        <span>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <div className="project-box">
        {getProjectItem()}
        {getProjectItem()}
        {getProjectItem()}
        {getProjectItem()}
        {getProjectItem()}
      </div>
      {isUnfold ? (
        <div className="more-item" onClick={() => setIsUnfold(false)}>
          收起
          <i className="iconfont icon-up" />
        </div>
      ) : (
        <div className="more-item" onClick={() => setIsUnfold(true)}>
          更多
          <i className="iconfont icon-down" />
        </div>
      )}
    </div>
  );
}
