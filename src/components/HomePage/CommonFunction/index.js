import React from 'react';
import { Row, Col, message } from 'antd';
import { FetchQuerySyCycz } from '../../../services/largescreen';
import { Link } from 'dva/router';

class CommonFunction extends React.Component {
  state = {
    syCycz: [],
  };

  componentDidMount() {
    this.fetchQuerySyCycz();
  }

  fetchQuerySyCycz = () => {
    FetchQuerySyCycz({
    }).then((result = {}) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        this.setState({
          syCycz: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    let { syCycz } = this.state;
    if (syCycz.length > 9) {
      syCycz = syCycz.slice(0, 9)
    }
    return (
      <Row style={{ height: '100%' }}>
        <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '10%', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <div className="flex-r"
              style={{
                fontSize: '2.6rem',
                alignItems: 'center',
                height: '100%',
                marginLeft: '1.833rem',
                fontWeight: 'bold',
                color: ' #333'
              }}>
              常用功能
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '90%', padding: '3rem' }}>
          {syCycz.map((item = {}, index) => {
            index = index + 1;
            let url = '';
            const { czsm = '', czdy = '-' } = item;
            const tmpl = czsm.split("|");
            if (tmpl.length > 0) {
              url = tmpl[1];
            }
            return <div style={{ width: '33%', height: '33%', float: 'left', textAlign: 'center' }}>
              <div style={{ height: '80%', marginTop: '20%' }}>
                <div style={{height: '55%'}}>
                  <Link to={url}>
                    <img className="cf-img" src={[require(`../../../image/HomePage/cz0${index}.png`)]} alt="" style={{ height: '100%' }} />
                  </Link>
                </div>
                <div style={{ height: '45%', lineHeight:'1.2', color: '#000', marginTop: '2rem', fontSize: '1.867rem', width: '60%', marginLeft: '20%' }}><Link to={url}>{czdy}</Link></div>
              </div>
            </div>
          })
          }
        </Col>
      </Row>
    );
  }
}
export default CommonFunction
