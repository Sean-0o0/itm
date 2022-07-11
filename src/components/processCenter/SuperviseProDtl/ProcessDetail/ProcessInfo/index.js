import React, { Fragment } from 'react';
import { Row, Col, Table, Form} from 'antd';

class ProcessInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  getStatus =(STATUS) =>{
    if(STATUS === '1'){
      return '运营合规流程发起';
    }else if(STATUS === '2'){
      return '各处室评估';
    }else if(STATUS === '3'){
      return '合规复核';
    }else if(STATUS === '4'){
      return '内部制度修订中';
    }else if(STATUS === '5'){
      return '合规复核';
    }else if(STATUS === '6'){
      return '各处室评估新制度';
    }else if(STATUS === '7') {
      return '合规确认';
    }else{
      return '完成';
    }

  }


  render() {
    const { proInfo= []} = this.props;
    const detailData = proInfo[0]?proInfo[0]:{};
    const issuingDate = detailData.issuingDate?detailData.issuingDate.substr(0,10):'';
    return (
      <Fragment>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item card flex-c" style={{'padding':'4rem'}}>
                <div className='flex-r'>
                  <img src={[require("../../../../../image/head_pic.png")]} alt=""/>
                  <div className='flex-c flex1' style={{'paddingLeft':'3rem','paddingTop':'1rem'}}>
                    <div className='title'>{detailData.title}</div>
                    <div className='name'>{detailData.initiator}</div>
                  </div>
                  <div className='title flex1' style={{'paddingTop':'1rem','fontSize':'medium','textAlign':'right',paddingRight:'8rem'}}>{this.getStatus(detailData.status)}</div>
                </div>
                <div className='flex-r info' style={{'padding':'1.5rem 0'}}>
                  <div className='w25'>发起机构：{detailData.initiatdept}</div>
                  <div className='w25'>发起日期：{detailData.initiatdate}</div>
                  <div>发文机构：{detailData.issuingAgency}</div>
                </div>
                <div className='flex-r info'>
                  <div className='w25'>发文机构：{detailData.issuingAgency}</div>
                  <div className='w25'>发文时间：{issuingDate}</div>
                </div>
                <div className='flex-r info' style={{'padding':'1.5rem 0'}}>
                  <div>发文说明：{detailData.issuingNote}</div>
                </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(ProcessInfo);
