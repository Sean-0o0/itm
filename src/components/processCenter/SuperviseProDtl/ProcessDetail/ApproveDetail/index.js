import React, { Fragment } from 'react';
import { Row, Col, Table, Form} from 'antd';

class ApproveDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      originData:[],//初始数据
      stepData:[],//展示数据
    };
  }
  // componentWillMount() {
  //   const { stepDetail= []} = this.props;
  //   console.log('stepDetail',stepDetail);
  //   if (stepDetail) {
  //     this.setState({
  //       originData : stepDetail,
  //       stepData : stepDetail
  //     });
  //   }
  // }
  componentWillReceiveProps(nextProps) {
    if(nextProps.stepDetail !== this.props.stepDetail){
      const showData = [];
      showData.push(nextProps.stepDetail && nextProps.stepDetail.length>0?nextProps.stepDetail[0]:null); 
      this.setState({
        originData: nextProps.stepDetail,
        stepData : showData
      })
    } 
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  onToggle = () =>{
    let {visible} = this.state;
    if(visible){
      const {originData = []} = this.state;
      const showData = [];
      showData.push(originData[0]); 
      this.setState({
        visible : false,
        stepData :showData
      });
    }else{
      const {originData = []} = this.state;
      this.setState({
        visible : true,
        stepData :originData
      });
    }
  };
  fetchData = (stepDetail) =>{
    
  }
  fetchColums = () => {
    const columns = [
      {
        title: '步骤',
        dataIndex: 'stepName',
        key: 'stepName',
        textAlign: 'left',
        width: '10%',
        
      },
      {
        title: '处理人',
        dataIndex: 'caller',
        key: 'caller',
        textAlign: 'left',
        width: '10%',
        
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
        textAlign: 'left',
        width: '15%',
        
      },
      {
        title: '结束时间',
        dataIndex: 'finishDate',
        key: 'finishDate',
        textAlign: 'left',
        width: '20%',
        
      },
      {
        title: '执行动作',
        dataIndex: 'actionName',
        key: 'actionName',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
        
      },
      {
        title: '摘要信息',
        dataIndex: 'summary',
        key: 'summary',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
        
      },
      {
        title: '处理状态',
        dataIndex: 'status',
        key: 'status',
        textAlign: 'left',
        width: '10%',
        
      },
    ];
    return columns;
  }

  render() {
    const {visible = true, stepData = []} = this.state;
    const colums = this.fetchColums();
    const totals = stepData.length;
    
    return (
      <Fragment>
        <Row>
          <div className="factor-content-title"><div className="tip"></div>监管外规收文后评估流程流程审批</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item" style={{'position':'static'}}>
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={stepData}
                pagination={visible ?{
                  showQuickJumper:true,
                  showSizeChanger:true,
                  showTotal: () => `共${totals}条`,
                }:false}
                size="middle "
                bordered={false}               
              />
              <div className={visible?'open':'close'}>
                {
                  stepData && stepData.length>0 ?(visible ?
                  <img src={[require("../../../../../image/close.png")]} alt="" onClick={this.onToggle}/>:
                  <img src={[require("../../../../../image/open.png")]} alt="" onClick={this.onToggle}/>):null
                }
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
      
    );
  }
}
export default Form.create()(ApproveDetail);
