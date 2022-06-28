import React from 'react';
import { Row, Card, Col } from 'antd';

class CustomerNorm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Card className="m-card" title={<div style={{ fontWeight: '900' }}>高端客户情况简报</div>}>
            <Row>
              <Col span={8} style={{ padding: '2rem 1.5rem', border: '1px solid rgba(240,240,240,0.8 )', height: '20rem' }}>
                <div style={{margin: '3rem 0'}}><i className="iconfont icon-assetsLine1" style={{ color: 'rgb(102, 203, 247)' }} />&nbsp;当年客户收入贡献(万元)<span style={{ float: 'right', fontWeight: '900' }}>803846.37</span></div>
                <div style={{margin: '3rem 0'}}><i className="iconfont icon-stock" style={{ color: 'rgb(102, 203, 247)' }} />&nbsp;当年客户收入比<span style={{ float: 'right', fontWeight: '900' }}>69%</span></div>
                <div style={{margin: '3rem 0'}}><i className="iconfont icon-InflowAssets" style={{ color: 'rgb(102, 203, 247)' }} />&nbsp;股基交易量(万元)<span style={{ float: 'right', fontWeight: '900' }}>132459221.43</span></div>
              </Col>
              <Col span={8} style={{ padding: '1rem', border: '1px solid rgba(240,240,240,0.8 )', height: '20rem' }}>
                <Card className="m-card" title={<div><i className="iconfont icon-customerAll" style={{ color: 'rgb(102, 203, 247)' }} />&nbsp;客户数(人)</div>} extra={<span style={{ fontWeight: '900' }}>13425</span>}>
                  <div style={{margin: '1.5rem 0'}}>新增客户数<span style={{ float: 'right', fontWeight: '900' }}>683</span></div>
                  <div style={{margin: '1.5rem 0'}}>流失客户数<span style={{ float: 'right', fontWeight: '900' }}>399</span></div>
                  <div style={{margin: '1.5rem 0'}}>净新增客户数<span style={{ float: 'right', fontWeight: '900' }}>284</span></div>
                </Card>
              </Col>
              <Col span={8} style={{ padding: '1rem', border: '1px solid rgba(240,240,240,0.8 )', height: '20rem' }}>
                <Card className="m-card" title={<div><i className="iconfont icon-assInflow" style={{ color: 'rgb(102, 203, 247)' }} />&nbsp;客户资产(亿元)</div>} extra={<span style={{ fontWeight: '900' }}>12712.67</span>}>
                  <div style={{margin: '1.5rem 0'}}>新增资产<span style={{ float: 'right', fontWeight: '900' }}>1401.01</span></div>
                  <div style={{margin: '1.5rem 0'}}>流失资产<span style={{ float: 'right', fontWeight: '900' }}>1251.58</span></div>
                  <div style={{margin: '1.5rem 0'}}>净新增资产<span style={{ float: 'right', fontWeight: '900' }}>149.43</span></div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Row>
      </React.Fragment>
    )
  }
}
export default CustomerNorm;