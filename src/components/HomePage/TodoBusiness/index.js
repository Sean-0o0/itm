import React from 'react';
import { Row, Col, message } from 'antd';
import { Link } from 'dva/router';
// // import OperationItem from './OperationItem';
import { FetchQueryBaseDblcs } from '../../../services/largescreen';

class TodoBusiness extends React.Component {
  state = {
    dblcs: [],
    timer: ''
  };

  componentDidMount() {
    const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
    this.state.timer = setInterval(() => {
      //定时刷新
      // const loginStatus = localStorage.getItem('loginStatus');
      // if (loginStatus !== '1') {
      //     this.props.dispatch({
      //         type: 'global/logout',
      //     });
      // }
      this.fetchQueryBaseDblcs();
    }, Number.parseInt(refreshWebPage, 10) * 1000);
    this.fetchQueryBaseDblcs();
  }

  fetchQueryBaseDblcs = () => {
    FetchQueryBaseDblcs({
    }).then((result = {}) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        this.setState({
          dblcs: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { dblcs: [nums = {}] } = this.state;
    const { dblcs = '-', fqlcs = '-', cylsc = '-', zhxxs = '-', xxfss = '-' } = nums;
    // console.log('dblcs',dblcs);
    return (
      <Row style={{ height: '100%' }}>
        <Col xs={24} sm={24} lg={24} xl={24} style={{
          width: '100%',
          height: '100%'
        }}>
          <div className='lc' style={{ height: '100%' }}>
            <div className='flex1 flex-r lc-body' >
              <Link to='/UIProcessor?Table=WORKFLOW_TOTASKS&taskType=todo' className='flex1 fwb lc-gt' >
                <div style={{ height: '50%', width: '100%' }}>
                  <div className="felx-r" style={{ margin: '4.5rem', alignItems: 'center', fontSize: '2.677rem' }}>
                    <img src={[require("../../../image/HomePage/lc-icon02.png")]} alt="" style={{ height: '3.5rem', marginRight: '2rem' }} />
                    我的待办
                  </div>
                </div>
                <div style={{ height: '50%', width: '100%', position: 'relative', textAlign: 'center' }}>
                  <div style={{ lineHeight: '7.5rem', textAlign: 'center', color: '#4B96F9', fontSize: '5rem' }}> {dblcs} </div>
                  <img src={[require("../../../image/HomePage/lc002.png")]} alt="" style={{ position: 'absolute', bottom: '0', right: '0', height: '100%' }} />
                </div>
              </Link>

              <Link to='/UIProcessor?Table=WORKFLOW_TOTASKS&taskType=initiated' className='flex1 fwb lc-gt' style={{ marginLeft: '2rem' }} >
                <div style={{ height: '50%', width: '100%' }}>
                  <div className="felx-r" style={{ margin: '4.5rem', alignItems: 'center', fontSize: '2.677rem' }}>
                    <img src={[require("../../../image/HomePage/lc-icon03.png")]} alt="" style={{ height: '3.5rem', marginRight: '2rem' }} />
                    我发起的
                  </div>
                </div>
                <div style={{ height: '50%', width: '100%', position: 'relative', textAlign: 'center' }}>
                  <div style={{ lineHeight: '7.5rem', textAlign: 'center', color: '#F7B432', fontSize: '5rem' }}> {fqlcs} </div>
                  <img src={[require("../../../image/HomePage/lc003.png")]} alt="" style={{ position: 'absolute', bottom: '0', right: '0', height: '100%' }} />
                </div>
              </Link>

              <Link to='/UIProcessor?Table=WORKFLOW_TOTASKS&taskType=participate' className='flex1 fwb lc-gt' style={{ marginLeft: '2rem' }} >
                <div style={{ height: '50%', width: '100%' }}>
                  <div className="felx-r" style={{ margin: '4.5rem', alignItems: 'center', fontSize: '2.677rem' }}>
                    <img src={[require("../../../image/HomePage/lc-icon04.png")]} alt="" style={{ height: '3.5rem', marginRight: '2rem' }} />
                    我处理的
                  </div>
                </div>
                <div style={{ height: '50%', width: '100%', position: 'relative', textAlign: 'center' }}>
                  <div style={{ lineHeight: '7.5rem', textAlign: 'center', color: '#E76868', fontSize: '5rem' }}> {cylsc} </div>
                  <img src={[require("../../../image/HomePage/lc004.png")]} alt="" style={{ position: 'absolute', bottom: '0', right: '0', height: '100%' }} />
                </div>
              </Link>

              <Link to='/UIProcessor?Table=WORKFLOW_NOTIFY&hideTitlebar=true' className='flex1 fwb lc-gt' style={{ marginLeft: '2rem' }} >
                <div style={{ height: '50%', width: '100%' }}>
                  <div className="felx-r" style={{ margin: '4.5rem', alignItems: 'center', fontSize: '2.677rem' }}>
                    <img src={[require("../../../image/HomePage/lc-icon01.png")]} alt="" style={{ height: '3.5rem', marginRight: '2rem' }} />
                    我的知会
                  </div>
                </div>
                <div style={{ height: '50%', width: '100%', position: 'relative', textAlign: 'center' }}>
                  <div style={{ lineHeight: '7.5rem', textAlign: 'center', color: '#79D1E2', fontSize: '5rem' }}> {zhxxs} </div>
                  <img src={[require("../../../image/HomePage/lc001.png")]} alt="" style={{ position: 'absolute', bottom: '0', right: '0', height: '100%' }} />
                </div>
              </Link>

              <Link className='flex1 fwb lc-gt' style={{ marginLeft: '2rem' }} >
                <div style={{ height: '50%', width: '100%' }}>
                  <div className="felx-r" style={{ margin: '4.5rem', alignItems: 'center', fontSize: '2.677rem' }}>
                    <img src={[require("../../../image/HomePage/lc-icon05.png")]} alt="" style={{ height: '3.5rem', marginRight: '2rem' }} />
                    我的消息
                  </div>
                </div>
                <div style={{ height: '50%', width: '100%', position: 'relative', textAlign: 'center' }}>
                  <div style={{ lineHeight: '7.5rem', textAlign: 'center', color: '#87A8F9', fontSize: '5rem' }}> {xxfss} </div>
                  <img src={[require("../../../image/HomePage/lc005.png")]} alt="" style={{ position: 'absolute', bottom: '0', right: '0', height: '100%' }} />
                </div>
              </Link>

            </div>

          </div>
        </Col>
      </Row>
    );
  }
}
export default TodoBusiness;
