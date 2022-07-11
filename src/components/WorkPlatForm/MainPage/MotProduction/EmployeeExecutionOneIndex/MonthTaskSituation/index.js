import React, { Fragment } from 'react';
import { Link } from 'dva/router';
import { Row,Col, DatePicker,Button,message, Empty} from 'antd';
import moment from 'moment';
//引入请求路径的示例
import { FetchQueryStaffSuperviseTaskSituationStatistics } from '../../../../../../services/motProduction';

const { RangePicker,MonthPicker } = DatePicker;
class MonthTaskSituation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  fetchData=(props)=>{
    const { lastMonth } = props;
    const monthData = [];
    if(lastMonth!=null){
      const tempMonth = moment(lastMonth,'YYYYMM');
    tempMonth.subtract(6,"months");
    for(let i=0; i<6; i++){
      tempMonth.add(1,"months");
      monthData[i] = {};
      monthData[i]['formatDate'] = tempMonth.format("YYYY年MM月");
      monthData[i]['date'] = tempMonth.format("YYYYMM");
      monthData[i]['taskNum'] = '--';
    }
    FetchQueryStaffSuperviseTaskSituationStatistics({
      spvsMo: lastMonth.format("YYYYMM"),
    }).then((res) => {
      if (res.code === 1) {
        const { records = [] } = res;
        records.forEach((item) => {
          monthData.forEach((childItem) => {
            if(item.spvsMo === childItem.date){
              childItem['taskNum'] = item.taskNum;
            }
          });
        });
        this.setState({
          monthData,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    }
  }
  handleMonthAndMonthChange = (value) => {
    const { changeLastMonth } = this.props;
    changeLastMonth(null);
  };
  handleMonthChange = (value) => {
    const { changeLastMonth } = this.props;
    changeLastMonth(value);
  };
  prevMonth = () =>{
    const { lastMonth,changeLastMonth,changeSelectMonth } = this.props;
    lastMonth.subtract(6,"months")
    changeLastMonth(lastMonth);
    changeSelectMonth(moment(lastMonth,'YYYYMM').subtract(5,"months").format("YYYYMM"));
  }
  nextMonth = () =>{
    const { lastMonth,changeLastMonth,changeSelectMonth } = this.props;
    lastMonth.add(6,"months")
    changeLastMonth(lastMonth);
    changeSelectMonth(moment(lastMonth,'YYYYMM').subtract(5,"months").format("YYYYMM"));
  }
  changeMonth = (month) =>{
    const { changeSelectMonth } = this.props;
    changeSelectMonth(month);
  }
  render() {
    const {  monthData = [] } = this.state;
    const { lastMonth,type } = this.props;
    let { selectMonth } = this.props;
    let startMonth = null;
    if(lastMonth != null){
      startMonth = moment(lastMonth,'YYYYMM');
      startMonth.subtract(5,"months")
    }
    if(type===2){
      selectMonth = null;
    }
    return (
      <Fragment>
        <div className="mot-empexc-top" style={{position:'relative'}}>
            <Button style={{width:'30px',marginRight:'10px',float:'left'}} icon="left" onClick={this.prevMonth}>
            </Button>
            <div style={{position:'absolute',zIndex:'2',opacity:'0',marginLeft:'40px'}} >
              <MonthPicker style={{width:lastMonth==null?'200px':'170px'}} onChange={this.handleMonthChange}></MonthPicker>
            </div>
            <RangePicker dropdownClassName="mot-empexc-RangePicker" onOpenChange={this.onOpenChange} format="YYYY-MM" value={[startMonth, lastMonth]} onChange={this.handleMonthAndMonthChange} mode={['month', 'month']} bordered={false} style={{float:'left',width:'200px'}}/>
            <style>
              {
                `
                  .mot-empexc-RangePicker {
                    display:none;
                    }
                `
              }
            </style>
            <Button style={{marginLeft:'10px',float:'left'}} icon="right" onClick={this.nextMonth}>
            </Button>
            <Link to={`/employeeExecutionTwoIndex`}>
              <Button style={{float:'right'}} icon="swap">
              </Button>
            </Link>
          </div>
          <div className="mot-empexc-card-content">
            <Row>
              {
                monthData.length===0?<Empty></Empty>:''
              }
              {
                monthData.map(item => (
                  selectMonth === item.date ? (
                    <Col span={4}>
                      <div className="mot-empexc-card-main-active" onClick={this.changeMonth.bind(this, item.date)}>
                        <div className="mot-empexc-card-month">{item.formatDate}</div>
                        <div className="mot-empexc-card-count">{item.taskNum}</div>
                      </div>
                    </Col>
                  ):(
                    <Col span={4}>
                      <div className="mot-empexc-card-main" onClick={this.changeMonth.bind(this, item.date)}>
                        <div className="mot-empexc-card-month">{item.formatDate}</div>
                        <div className="mot-empexc-card-count">{item.taskNum}</div>
                      </div>
                    </Col>
                  )
                ))
              }
            </Row>
          </div>
      </Fragment>
    );
  }
}

export default MonthTaskSituation;
