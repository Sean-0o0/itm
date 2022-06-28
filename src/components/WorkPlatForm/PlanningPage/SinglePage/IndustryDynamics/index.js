import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import IndustryDynamicHeader
  from '../../../../../components/WorkPlatForm/PlanningPage/SinglePage/IndustryDynamics/IndustryDynamicHeader';
import IndustryDynamicCont
  from '../../../../../components/WorkPlatForm/PlanningPage/SinglePage/IndustryDynamics/IndustryDynamicCont';
import IndustryDynamicMenu
  from '../../../../../components/WorkPlatForm/PlanningPage/SinglePage/IndustryDynamics/IndustryDynamicMenu';
import IndustryDynamicComents
  from '../../../../../components/WorkPlatForm/PlanningPage/SinglePage/IndustryDynamics/IndustryDynamicComents';

class IntegratedPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      type: '1',
      datas:[],
      id:'',//选中的行业动态
    };
  }

  onHeaderRef = (ref) => {
    this.IndustryDynamicHeader = ref
  };

  onRef = (ref) => {
    this.IndustryDynamicCont = ref
  };

  onComentsRef = (ref) => {
    this.IndustryDynamicComents = ref;
  };

  //有关键字/分类值时,去重新渲染页面数据
  callbackForHead = (keyword) => {
    this.setState({
      keyword: keyword,
    });
  };

  handleMenuChange = (key) => {
    this.setState({
      type: key,
    });
  }

  handleIndustryDynamicCont = () =>{
    this.IndustryDynamicCont.FetchQueryIndustryNews();
  }

  handleIndustryDynamicComents = (id) =>{
    // console.log("回传的id----222",id)
    this.IndustryDynamicComents.FetchQueryNewsComment(id);
    this.IndustryDynamicHeader.handelId(id);
  }

  handleIndustryComents = (id) => {
    this.IndustryDynamicComents.FetchQueryNewsComment(id);
  }


  render() {
    const { keyword, type } = this.state;

    return (
      <div>
        <Row className='ip-body' style={{ height: 'calc(100vh - 8.5rem)',paddingBottom:'0'}}>
          <Col span={24} className='ip-title'>
            <IndustryDynamicHeader callbackForHead={this.callbackForHead} onRef={this.onHeaderRef} refMethod={this.handleIndustryDynamicCont} refMethodComents={this.handleIndustryComents}/>
          </Col>
          <Col span={24} className='ip-cont' style={{ display: 'flex', backgroundColor: 'rgb(245,245,245)',height: 'calc(100vh - 12.5rem)',}}>
            <Col span={16} style={{ padding: '1rem 1rem 1rem 0',height:'100%'}}>
              <Card bodyStyle={{ padding: '1rem', height: '100%', }} style={{height: '100%', }}>
                <Col span={3} style={{height: '100%', }}>
                  <IndustryDynamicMenu handleMenuChange={this.handleMenuChange} />
                </Col>
                <Col span={21} style={{height: '100%', }}>
                  <IndustryDynamicCont keyword={keyword} type={type} onRef={this.onRef} refMethod={this.handleIndustryDynamicComents}/>
                </Col>
              </Card>
            </Col>
            <Col span={8} style={{ padding: '1rem 0 1rem 0'}}>
              <Card style={{ height: 'calc(100vh - 14.5rem)', }} bodyStyle={{ padding: '1rem', height: '100%', }}>
                <IndustryDynamicComents onRef={this.onComentsRef}/>
              </Card>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(IntegratedPlanning);
