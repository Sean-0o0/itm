import React, { Fragment } from 'react';
import { message, Spin, Icon } from 'antd';
import { FetchqueryPayLineUpQry } from '../../../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-计算薪酬-计算状态-排队中页面组件
 */
class QueueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payLineUpQryData: {},
    };
  }
  componentDidMount() {
    const { depClass, mon, orgNo } = this.props;
    const params = {
      mon,
      depClass,
      orgNo,
    };
    if (mon && orgNo) {
      this.queryPayLineUpQry(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, step, depClass } = nextProps;
    if (orgNo !== this.props.orgNo || mon !== this.props.mon || step === 0) {
      const params = {
        mon,
        depClass,
        orgNo,
      };
      this.queryPayLineUpQry(params);
    }
  }
  // 薪酬计算排队中信息查询
  queryPayLineUpQry = (params) => {
    FetchqueryPayLineUpQry({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        payLineUpQryData: records[0] ? records[0] : {},
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: '6rem' }} spin />;
    const { payLineUpQryData } = this.state;
    return (
      <Fragment>
        <div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div>
              <Spin indicator={antIcon} className="m-color" />
            </div>
            <div>
              <span className="esa-salaryNavigation-trial-status">排队中</span>
            </div>
          </div>
          <div className="esa-salaryNavigation-calculation-situation">
            <div>当前有
              <span style={{ color: 'red' }}>{payLineUpQryData.lineUpNum ? payLineUpQryData.lineUpNum : 0}</span>人正在排队，您排在第
              <span style={{ color: 'red' }}>{payLineUpQryData.lineUpSeq ? payLineUpQryData.lineUpSeq : 0}</span>名，请耐心等待
            </div>
          </div>
        </div>
      </Fragment >
    );
  }
}
export default QueueInfo;
