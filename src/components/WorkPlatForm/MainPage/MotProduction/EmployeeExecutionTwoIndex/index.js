import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DatePicker, Button, Radio} from 'antd';
import { getDictKey } from '../../../../../utils/dictUtils';
import { Link } from 'dva/router';
import MonthTaskSituation from '../EmployeeExecutionTwoIndex/MonthTaskSituation'
import MonthTaskListDetail from '../EmployeeExecutionTwoIndex/MonthTaskListDetail'
//引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
const { RangePicker,MonthPicker } = DatePicker;
class EmployeeExecutionTwoIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMonth: moment(),
      width: '170px'
    };
  }
  componentDidMount() {
  }
  handleMonthAndMonthChange = (value) => {
    this.setState({
      selectMonth : null,
      width: '200px',
    });
  };
  handleMonthChange = (value) => {
    this.setState({
      selectMonth : value,
      width: '170px',
    });
  };
  prevMonth = () =>{
    const { selectMonth } = this.state;
    selectMonth.subtract(6,"months")
    this.setState({
      selectMonth,
      width: '170px',
    });
  }
  nextMonth = () =>{
    const { selectMonth } = this.state;
    selectMonth.add(6,"months")
    this.setState({
      selectMonth,
      width: '170px',
    });
  }
  changeMainOrg = (value) => {
    this.setState({
      mainOrgId: value,
    })
  }
  changeOrg = (value) => {
    this.setState({
      orgId: value,
    })
  }
  changeDdzt = (e) => {
    this.setState({
      ddzt: e.target.value,
    })
  }
  render() {
    const { mainOrgId, orgId, ddzt = '' } = this.state;
    const { dictionary } = this.props;
    const { [getDictKey('ddzt')]: ddztDict = []} = dictionary;
    const { selectMonth, width } = this.state;
    let startMonth = null;
    if(selectMonth != null){
      startMonth = moment(selectMonth,'YYYYMM');
      startMonth.subtract(5,"months")
    }
    let ddztDictTemp = [];
    ddztDict.forEach(( item, index ) => {
      if(item.ibm === '2' || item.ibm === '3'){
        ddztDictTemp.push(item);
      }
    });
    return (
      <Fragment>
        <div className="mot-empexc-main">
        <div className="mot-empexc-left" style={{width:'100%'}}>
        <div className="mot-empexc-top" style={{position:'relative'}}>
            <MonthPicker style={{position:'absolute',zIndex:'2',width:width,opacity:'0'}} allowClear={false}  onChange={this.handleMonthChange}></MonthPicker>
            <RangePicker dropdownClassName="mot-empexc-RangePicker" format="YYYY-MM"  value={[startMonth, selectMonth]} onChange={this.handleMonthAndMonthChange} mode={['month', 'month']} bordered={false} style={{position:'absolute',float:'left',width:'200px'}}/>
            <style>
              {
                `
                  .mot-empexc-RangePicker {
                    display:none;
                    }
                `
              }
            </style>
            <Link to={`/employeeExecutionOneIndex`}>
              <Button style={{float:'right'}} icon="swap">
              </Button>
            </Link>
          </div>
          <MonthTaskSituation selectMonth = {selectMonth}></MonthTaskSituation>
          <div style={{paddingLeft:'2rem'}}>
            <span>督导状态:</span>
            <Radio.Group onChange={ this.changeDdzt } defaultValue='' className="mot-empexc-list-radio-group" style={{ marginLeft:'1rem' }}>
            <Radio.Button value=''>全部</Radio.Button>
            {
              ddztDictTemp.map(item => (
                  <Radio.Button value={ item.ibm }>{ item.note }</Radio.Button>
              ))  
            }
            </Radio.Group>
          </div>
          <MonthTaskListDetail ddzt={ ddzt } selectMonth = {selectMonth} mainOrgId={mainOrgId} orgId={orgId}></MonthTaskListDetail>
        </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(EmployeeExecutionTwoIndex);
