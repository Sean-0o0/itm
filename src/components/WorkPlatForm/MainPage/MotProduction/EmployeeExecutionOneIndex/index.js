import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import MonthTaskSituation from '../EmployeeExecutionOneIndex/MonthTaskSituation'
import MonthTaskList from '../EmployeeExecutionOneIndex/MonthTaskList'
import MonthTaskCompletion from '../EmployeeExecutionOneIndex/MonthTaskCompletion'
import MonthTaskListSearch from '../EmployeeExecutionOneIndex/MonthTaskListSearch'
//引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';

class EmployeeExecutionOneIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMonth: moment().subtract(5,"months").format("YYYYMM"),
      lastMonth: moment(), //结束月份
      ddzt: '',//督导状态
      ddsj: '',//督导事件
      zycd: '',//重要程度
      type: 1,
    };
  }
  componentDidMount() {
  }
  changeParam=(data)=>{
    data.forEach(item => {
        this.setState({
          type: 2,
          [item.name]: item.value,
        })
    });
  }
  changeSelectMonth=(month)=>{
    this.setState({
      selectMonth: month,
      type:1,
    });
  }
  changeLastMonth=(month)=>{
    this.setState({
      lastMonth: month,
    });
  }
  refreshData = () => {
    const { refresh = true } = this.state;
    this.setState({
      refresh: !refresh,
    });
  }
  render() {
    const { selectMonth,lastMonth,ddzt,ddsj,zycd,type,refresh } = this.state;
    const { ddztDict = [],zycdDict  = [], ddsjList  = [],dictionary = {} } = this.props;
    return (
      <Fragment>
        <div className="mot-empexc-main">
        <div className="mot-empexc-left">
          <MonthTaskSituation refresh={refresh}  selectMonth = {selectMonth} lastMonth={lastMonth} type={type} changeLastMonth={this.changeLastMonth} changeSelectMonth = {this.changeSelectMonth}></MonthTaskSituation>
          <MonthTaskList refresh={refresh} refreshData={this.refreshData} ddzt={ddzt} ddsj={ddsj} zycd={zycd} zycdDict={zycdDict} ddyf={selectMonth} type={type}></MonthTaskList>
        </div>
        <div className="mot-empexc-right">
          <MonthTaskCompletion lastMonth = {lastMonth==null?null:lastMonth.format("YYYYMM")}></MonthTaskCompletion>
          <MonthTaskListSearch  dictionary={dictionary} ddsjList={ddsjList} ddztDict={ddztDict} zycdDict={zycdDict} changeParam={this.changeParam} ddzt={ddzt} ddsj={ddsj} zycd={zycd} ></MonthTaskListSearch>
        </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(EmployeeExecutionOneIndex);
