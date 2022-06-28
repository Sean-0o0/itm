import React, { Fragment } from 'react';
import { message, Progress } from 'antd';
import { FetchqueryPayTrailExec } from '../../../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-计算薪酬-计算状态-试算中页面
 */
class CalculatingInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payTrailExecData: {},
    };
  }
  componentDidMount() {
    const { depClass, mon, orgNo } = this.props;
    const params = {
      mon,
      depClass,
      orgNo,
    };
    if (orgNo && mon) {
      this.queryPayTrailExec(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, step, depClass } = nextProps;
    const params = {
      mon,
      depClass,
      orgNo,
    };
    if (orgNo !== this.props.orgNo || mon !== this.props.mon || step === 1) {
      this.queryPayTrailExec(params);
    }
  }
  // 薪酬计算试算中信息查询
  queryPayTrailExec = (params) => {
    FetchqueryPayTrailExec({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        payTrailExecData: records[0] ? records[0] : {},
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { payTrailExecData } = this.state;
    return (
      <Fragment>
        <div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div>
              <Progress
                type="circle"
                percent={Number(payTrailExecData.trailSchedule ? payTrailExecData.trailSchedule : 0)}
                width={80}
                format={() => <span style={{ color: 'black' }}>{payTrailExecData.trailSchedule ? payTrailExecData.trailSchedule : 0}%</span>}
                className="esa-salaryNavigation-progress"
              />
            </div>
            <div>
              <span className="esa-salaryNavigation-trial-status">试算中</span>
            </div>
          </div>
          <div className="esa-salaryNavigation-calculation-situation">
            <div className="dis-fx">指标计算进度 ：
              <span style={{ color: 'red' }}>{payTrailExecData.indiCalExecNum ? payTrailExecData.indiCalExecNum : 0}</span>
              /{payTrailExecData.indiCalNum ? payTrailExecData.indiCalNum : 0}
              <Progress
                percent={Number(payTrailExecData.indiCalSchedule ? payTrailExecData.indiCalSchedule : 0)}
                className="esa-salaryNavigation-progress"
                style={{ paddingLeft: '20px', width: '65%' }}
              />
            </div>
            <div style={{ paddingTop: '20px' }} className="dis-fx">人员计算进度 ：
              <span style={{ color: 'red' }}>{payTrailExecData.empCalExecNum ? payTrailExecData.empCalExecNum : 0}</span>
              /{payTrailExecData.empCalNum ? payTrailExecData.empCalNum : 0}
              <Progress
                percent={Number(payTrailExecData.empCalSchedule ? payTrailExecData.empCalSchedule : 0)}
                className="esa-salaryNavigation-progress"
                style={{ paddingLeft: '20px', width: '65%' }}
              />
            </div>
          </div>
        </div >
      </Fragment >
    );
  }
}
export default CalculatingInfo;
