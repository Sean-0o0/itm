import React from 'react';
import { Row, Col } from 'antd';
// import Iframe from 'react-iframe';
import StaffManagementTabButton from './staffManagementTabButton';

class StaffManagementTab extends React.Component {
  handleTitleClick = (e, ljdz, dkfs) => {
    if (ljdz !== '' && ljdz !== '--') {
      switch (dkfs) {
        case '3':
          window.open(`/#${ljdz}`, '_self');
          break;
        default:
          window.open(`${localStorage.getItem('livebos') || 'livebos'}${ljdz}`, '_blank');
      }
    }
  }
  handleRefresh = () => {
    const { onRefresh } = this.props;
    if (onRefresh) {
      onRefresh();
    }
  }
  render() {
    const colors = ['#2daae4', '#ff7676', '#ffc36d', 'violet'];
    const { wfData = [] } = this.props;
    const groupData = [];
    // 把没有子节点的去掉,然后把数据分成5个一组
    wfData.filter(item => item && item.children && item.children.length > 0).forEach((item, index) => {
      const i = Math.floor(index / 5);
      if (!groupData[i]) {
        groupData[i] = [];
      }
      groupData[i].push(item);
    });

    return (
      <div>
        {
          groupData.map((datas, idx) => (
            <Row className="" key={idx} style={{padding: '2rem 4rem 0rem',color:'black',width:'100%'}}>
              {
                datas.map((data, index) => {
                  const border = `1px solid ${colors[index]}`;
                  const { children = [] } = data;
                  return (
                    // <Col xs={24} sm={24} md={12} lg={6} className="ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-8" key={data.id}>
                    //   <div className="m-menu-progress m-menu-blue">
                    //     <div className="m-tabs-menu-head">
                    //       <i className="m-circular ml10" />
                    //       <div
                    //         className="m-tabs-menu-title"
                    //         style={{ background: colors[index], border, cursor: 'pointer' }}
                    //         onClick={(e) => { this.handleTitleClick(e, data.ljdz, data.dkfs); }}
                    //       >
                    //         {data.xsmc === '' ? '--' : data.xsmc}
                    //       </div>
                    //     </div>
                    //     <ul className="m-tabs-menu-body" style={{ paddingLeft: '1.25rem' }}>
                    //       {children.map((item) => {
                    //         return (
                    //           <StaffManagementTabButton onRefresh={this.handleRefresh} item={item} index={index} key={item.id} authorities={this.props.authorities} />
                    //         );
                    //       })}
                    //       {children.length === 0 && (
                    //       <li>
                    //         <span>暂无相关流程</span>
                    //       </li>)
                    //       }
                    //     </ul>
                    //   </div>
                    // </Col>
                    <Col xs={24} sm={24} md={12} lg={6} className="ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-8" key={data.id} style={{width:'20%'}}>
                      <div className="m-menu-progress m-menu-blue">
                        <div className="m-tabs-menu-head">
                          <div
                            onClick={(e) => { this.handleTitleClick(e, data.ljdz, data.dkfs); }}
                            style={{ fontWeight:'600',fontSize:'1.867rem' }}
                          >
                            {data.xsmc === '' ? '--' : data.xsmc}
                          </div>
                        </div>
                        <ul className="m-tabs-menu-body" style={{ paddingLeft: '1.5rem',listStyle:'disc',borderLeft:'0px',fontWeight:'400' }}>
                          {children.map((item) => {
                            return (
                              <StaffManagementTabButton onRefresh={this.handleRefresh} item={item} index={index} key={item.id} authorities={this.props.authorities} />
                            );
                          })}
                          {children.length === 0 && (
                          <li>
                            <span>暂无相关流程</span>
                          </li>)
                          }
                        </ul>
                      </div>
                    </Col>
                  );
                })
              }
            </Row>
          ))
        }
      </div>
    );
  }
}
export default StaffManagementTab;
