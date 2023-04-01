import React, {Component} from 'react'
import {Link} from 'dva/router';
import {Breadcrumb} from 'antd'

import bqImg from '../../../../assets/labelDetail/label.png';

class ToConsole extends Component {
  state = {}

  render() {
    const {
      routes = [],
      data: {
        bqmc = '-',//标签名称
        bqsm = '-',//标签说明
      }
    } = this.props;

    return (<div className="top-console">
      <div className="back-img">
        <Breadcrumb separator=">">
          {routes.map((item, index) => {
            const {name = item, pathname = ''} = item
            const historyRoutes = routes.slice(0, index + 1)
            return <Breadcrumb.Item>
              {index === routes.length - 1 ? <Breadcrumb.Item>{name}</Breadcrumb.Item> :
                <Link to={{pathname: pathname, state: {routes: historyRoutes}}}>
                  {name}
                </Link>}
            </Breadcrumb.Item>
          })

          }
        </Breadcrumb>
        <div className='staff-info-header flex-r'>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(51,97,255,0.1)',
            boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.08)',
            borderRadius: '8px'
          }}>
            <img src={bqImg} alt="" style={{margin: '8px', border: '1px dashed rgba(0, 0, 0, 0.08)'}}/>
          </div>
          <div style={{display: 'grid', paddingLeft: '16px'}}>
            <div style={{
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: '36px',
              color: '#303133',
              textShadow: '0px 0px 8px rgba(0,0,0,0.08)'
            }}>{bqmc}</div>
            <div style={{
              width: '462px',
              height: '24px',
              fontSize: '14px',
              fontWeight: 400,
              color: '#606266',
              lineHeight: '24px',
              textShadow: '0px 0px 8px rgba(0,0,0,0.08)'
            }}>{bqsm}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

export default ToConsole;
