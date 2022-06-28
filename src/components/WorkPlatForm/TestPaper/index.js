import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { message, Spin, Icon, Row, Col, Radio } from 'antd';
import { DecryptBase64 } from '../../Common/Encrypt';
import { fetchCusApprQuestionnaire } from '../../../services/customerbase/adequacy';

class TestPaper extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  componentDidMount() {
    if (this.props.location) {
      const { pathname } = this.props.location;
      const match = pathToRegexp('/testPaper/:mx').exec(pathname);
      if (match && Array.isArray(match)) {
        const mx = match[1];
        const pcjgid = DecryptBase64(mx);
        this.fetchData(pcjgid);
      }
    }
  }

  fetchData = (pcjgid) => {
    this.setState({
      loading: true,
    });
    fetchCusApprQuestionnaire({ pcjgid }).then((result) => {
      const { code = -1, records = [] } = result;
      if (code > 0 && Array.isArray(records)) {
        this.setState({
          data: records,
          loading: false,
        });
      }
    }).catch((error) => {
      this.setState({
        loading: false,
      });
      message.error(!error.success ? error.message : error.note);
    });
  }

  renderTest = (item) => {
    const { tm, tmxh, dyxxinfo = [] } = item;
    return (
      <div key={tmxh} >
        <Row>
          <Row>
            <Col span={1}><h2 style={{ fontWeight: 'bold', margin: '2rem 0rem 1rem 0rem', lineHeight: '2.5rem' }}>{`${tmxh}.`}</h2></Col>
            <Col span={23} style={{ marginLeft: '-1rem' }}><h2 style={{ fontWeight: 'bold', margin: '2rem 0rem 1rem 0rem', lineHeight: '2.5rem' }}>{tm}</h2></Col>
          </Row>
          {
            dyxxinfo.map((it, index) => (
              <Row>
                <Col span={1}><h2 style={{ fontWeight: 'bold', visibility: 'hidden' }}>{`${tmxh}.`}</h2></Col>
                <Col span={23} style={{ marginLeft: '-1rem' }}><Radio key={index} value={`${tmxh}_${index}`} checked={it.sxda === '1'} ><span style={{ fontSize: '1.4rem' }}>{it.dyxx}</span></Radio></Col>
              </Row>
            ))
          }
        </Row>
      </div>
    );
  }
  render() {
    const { data } = this.state;
    const { wjmc = '暂无评测数据……', pcjgdf = '0' } = data[0] || {};
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#edf1f4' }}>
        <div style={{ display: 'inline-block', width: '60%', padding: '2rem', margin: '2rem', backgroundColor: '#fff', height: `${this.state.loading ? '100%' : ''}` }}>
          <div style={{ textAlign: 'left' }}>
            <Spin size="large" indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} spinning={this.state.loading} >
              <h1 style={{ textAlign: 'center', margin: '0.5rem 0' }}>{wjmc}</h1>
              <h1 style={{ textAlign: 'right', margin: '0.5rem 0' }}>得分:{pcjgdf}</h1>
              {
                data.map((item) => {
                  return this.renderTest(item);
                })
              }
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default TestPaper;
