import React, {Component} from 'react';
import {Link} from 'dva/router';
import {Breadcrumb, Button, Tooltip} from 'antd';
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';

class ToConsole extends Component {
  state = {};

  handleEditMemberInfo = () => {
    console.log("------编辑外包人员信息----")
  }

  render() {
    const {
      routes = [],
      data: {
        XB = "",
        GYSMC = "",
        RYMC = "",
        RYGW = "",
        DJ = "G3"
      },
    } = this.props;
    console.log('routesroutes-ccc-staf', routes);
    return (
      <div className="top-console">
        <div className="back-img">
          <Breadcrumb separator=">">
            {routes.map((item, index) => {
              const {name = item, pathname = ''} = item;
              const historyRoutes = routes.slice(0, index + 1);
              return (
                <Breadcrumb.Item key={index}>
                  {index === routes.length - 1 ? (
                    <>{name}</>
                  ) : (
                    <Link to={{pathname: pathname, state: {routes: historyRoutes}}}>
                      {name}
                    </Link>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div className="member-detail-header flex-r">
            <div className="header-left flex-r">
              <img src={XB === '1' ? boyImg : XB === '2' ? girlImg : boyImg} className="staff-img"/>
              <div className="member-detail-cont flex-c">
                <div className="member-detail-line-import">
                  <span className="member-detail-name">{RYMC}</span>
                  {/*<span className="staff-experience">&nbsp;已加入浙商证券{jrts}天</span>*/}
                </div>
                <div className="member-detail-line flex1 flex-r">
                  <span className="member-detail-label">公司：</span>
                  <span className="member-detail-value">{GYSMC}</span>
                </div>
                <div className="member-detail-line flex1 flex-r">
                  <span className="member-detail-label">岗位：</span>
                  <span className="member-detail-value">{DJ}</span>
                  <span className="member-detail-label">&nbsp;</span>
                  <span style={{color: '#C0C4CC'}}>|</span>
                  <span className="member-detail-label">&nbsp;</span>
                  <Tooltip title={RYGW}>
                  <span
                    className="member-detail-value"
                    style={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: '2',
                    }}
                  >
                    {RYGW}&nbsp;&nbsp;&nbsp;
                  </span>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="header-right flex-r flex1">
              <Button className="btn-edit" onClick={this.handleEditMemberInfo}>
                编辑
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ToConsole;
