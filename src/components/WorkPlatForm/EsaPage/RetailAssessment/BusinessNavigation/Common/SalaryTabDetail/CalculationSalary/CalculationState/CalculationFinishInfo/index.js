import React, { Fragment } from 'react';
import { message, Progress, Icon } from 'antd';
import { Link } from 'dva/router';
import { ESAprefix } from '../../../../../../../../../../utils/config';
import { EncryptBase64 } from '../../../../../../../../../Common/Encrypt';
import { FetchqueryTrailFinish } from '../../../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-计算薪酬-计算状态-试算完成页面组件
 */
class CalculationFinishInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trailFinishData: {},
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
      this.queryTrailFinish(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, depClass } = nextProps;
    const params = {
      mon,
      depClass,
      orgNo,
    };
    if (orgNo !== this.props.orgNo || mon !== this.props.mon) {
      this.queryTrailFinish(params);
    }
  }
  // 薪酬计算试算完成信息查询
  queryTrailFinish = (params) => {
    FetchqueryTrailFinish({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        trailFinishData: records[0] ? records[0] : {},
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { trailFinishData } = this.state;
    const { mon, orgNo, depClass, orgName } = this.props;
    const params = {
      mon,
      depClass,
      orgNo,
      orgName,
    };
    return (
      <Fragment>
        <div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div>
              <Progress
                type="circle"
                percent={100}
                width={80}
                format={() => <span style={{ color: 'black' }}>100%</span>}
                className="esa-salaryNavigation-progress"
              />
            </div>
            <div>
              <span className="esa-salaryNavigation-trial-status">试算完成</span>
            </div>
          </div>
          <div className="esa-salaryNavigation-calculation-situation">
            <div className="esa-salaryNavigation-result-cont">
              <p>当前共计算
                <span style={{ color: 'red' }}>{trailFinishData.empCalNum ? trailFinishData.empCalNum : 0}</span>名员工，累计工资
                <span style={{ color: 'red' }}>{trailFinishData.aggrWage ? trailFinishData.aggrWage : 0}</span>元
                {/* <a className="ml10 m-color" href="#">查看详情</a> */}
              </p>
              <p style={{ marginTop: '20px' }}>
                其中异常
                <span style={{ color: 'red' }}>{trailFinishData.abnorEmpNum ? trailFinishData.abnorEmpNum : 0}</span>人，正常
                <span style={{ color: 'red' }}>{trailFinishData.normEmpNum ? trailFinishData.normEmpNum : 0}</span>人
              </p>
              <div className="esa-salaryNavigation-result-right">
                <span className="esa-salaryNavigation-result-arrow"><Icon type="swap-right" /></span>
                <div className="fl" style={{ position: 'relative' }}>
                  <Link className="m-color" to={`${ESAprefix}/checkSalary/${EncryptBase64(JSON.stringify(params))}`}>
                    <i className="iconfont icon-kyc" style={{ fontSize: '1.3rem' }} />核对数据
                  </Link>
                  <div className="esa-salaryNavigation-result-linkarrow"><i className="iconfont icon-down-arrow" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }
}
export default CalculationFinishInfo;
