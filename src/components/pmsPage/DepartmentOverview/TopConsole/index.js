import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Breadcrumb, Radio, Tabs } from 'antd';
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';

class ToConsole extends Component {
  state = {};

  render() {
    const { routes = [], handleRadioChange, getStatisticYear, statisticYearData = {} } = this.props;
    // console.log('routesroutes-ccc-staf', routes);
    return (
      <div
        className="header-bread"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Breadcrumb separator=">" style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
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
        <div className="top-tabs-boxs">
          {getStatisticYear()}
          <Radio.Group
            defaultValue="项目列表"
            buttonStyle="solid"
            onChange={e => {
              // e.persist();
              handleRadioChange(e, statisticYearData.currentYear);
            }}
          >
            <Radio.Button value="项目列表">
              <i className="iconfont icon-xmlb" />
              项目列表
            </Radio.Button>
            <Radio.Button value="项目统计">
              <i className="iconfont icon-xmtj" />
              项目统计
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

export default ToConsole;
