import React from 'react';
import { Row, Col, Card } from 'antd';
import headerImgPath from '../../../../../assets/show/img10.png';

class MessageDropDetail extends React.Component {
  /* componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    const { match: { params: { id = '' } } } = this.props;
  } */
  render() {
    const title = '';
    const content = '';
    const user = '';
    const time = '';
    return (
      <Row className="m-row" style={{ marginTop: '1.5rem' }}>
        <Col>
          <Row>
            <Col>
              <div className="m-mot-head-bg">
                <img src={headerImgPath} alt="" />
              </div>
            </Col>
          </Row>
          <Row className="m-row">
            <Col>
              <Card className="m-card default m-background m-card-padding-bottom">
                <div className="m-info-box">
                  <div className="m-info-head">
                    <h2 className="title">{title || '--'}</h2>
                    <div className="info">
                      <span><i>创建人：</i>{user || '--'}</span>
                      <span><i>时间：</i>{time || '--'}</span>
                    </div>
                  </div>
                  <div className="m-info-content">{content || '--'}</div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default MessageDropDetail;
