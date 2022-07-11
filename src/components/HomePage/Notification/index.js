import React from 'react';
import { Row, Col, message } from 'antd';
import { Link } from 'dva/router';
import NewsItem from './NewsItem';
import { FetchQuerySyTzgg } from '../../../services/largescreen';

class Notification extends React.Component {
  state = {
  };

  componentDidMount() {
    this.fetchQuerySyTzgg(1);
    this.fetchQuerySyTzgg(2);
  }

  fetchQuerySyTzgg = (key) => {
    FetchQuerySyTzgg({
      category: key,
      current: 1,
      keyword: '',
      pageSize: 5,
      paging: 1,
      sort: '',
      total: -1
    }).then((result = {}) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        this.setState({
          [`userNoticeList${key}`]: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  changePage = (page) => {
    this.fetchQuerySyTzgg(page, this.state.ActiveKey);
  }

  handleTabsChange = (key) => {
    this.fetchQuerySyTzgg(1, key);
  }
  render() {
    const { userNoticeList1 = [], userNoticeList2 = [], } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: '50%' ,marginBottom:'1rem'}} >
          <Row style={{ height: '100%', backgroundColor: '#fff', borderRadius: '2rem' }}>
            <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '20%' }}>
              <div className='lc'>
                <div className='lc-header flex-r'>通知公告</div>
                <Link to='/UIProcessor?Table=tBlog&ObjDescribe=sX1v9tPQ-hZpMJmbSybgawL7gohIxxR4&hideTitlebar=true'>
                  <div className='lc-gd'>更多</div>
                </Link>
              </div>
            </Col>
            <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '80%' }}>
              <div className='m-container-box flex-c' style={{ height: '100%' }}>
                {userNoticeList1.map((item, index) => (
                  <NewsItem userNotice={item} key={index} index={index} />
                ))
                }
              </div>
            </Col>
          </Row>
        </div>
        {/*<Row style={{ height: '2rem', width: '100%' }} />*/}
        <div style={{ height: '50%', borderRadius: '2rem' ,marginTop:'1rem'}}>
          <Row style={{ height: '100%', backgroundColor: '#fff', borderRadius: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '20%' }}>
              <div className='lc'>
                <div className='lc-header flex-r'>运营新闻动态</div>
                <Link to='/UIProcessor?Table=tBlog&ObjDescribe=sX1v9tPQ-hZpMJmbSybgawL7gohIxxR4&hideTitlebar=true'>
                  <div className='lc-gd'>更多</div>
                </Link>
              </div>
            </Col>
            <Col style={{ height: '1rem' }} />
            <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box' style={{ height: '80%' }}>
              <div className='m-container-box flex-c' style={{ height: '100%' }}>
                {userNoticeList2.map((item, index) => (
                  <NewsItem userNotice={item} key={index} index={index} />
                ))
                }
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Notification;
