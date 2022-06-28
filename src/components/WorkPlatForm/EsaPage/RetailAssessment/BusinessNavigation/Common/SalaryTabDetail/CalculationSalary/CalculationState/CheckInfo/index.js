import React, { Fragment } from 'react';
import { message, Progress, Table } from 'antd';
import { FetchqueryPaymentSettlementAuditProgress, FetchqueryPaymentSettlementAuditStepDetail } from '../../../../../../../../../../services/EsaServices/navigation';
/**
 *  考核导航-计算薪酬-计算状态-结算审批中页面组件
 */
class CheckInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailTableData: [],
      approveSchedule: 0,
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
      this.queryPaymentSettlementAuditProgress(params);
      this.queryPaymentSettlementAuditStepDetail(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, step, depClass } = nextProps;
    if (orgNo !== this.props.orgNo || mon !== this.props.mon || step === 3) {
      const params = {
        mon,
        depClass,
        orgNo,
      };
      this.queryPaymentSettlementAuditProgress(params);
      this.queryPaymentSettlementAuditStepDetail(params);
    }
  }
  // 薪酬计算结算审批进度查询
  queryPaymentSettlementAuditProgress = (params) => {
    FetchqueryPaymentSettlementAuditProgress({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        approveSchedule: Number(records[0] && records[0].approveSchedule ? records[0].approveSchedule : 0),
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 薪酬计算结算审批步骤明细查询
  queryPaymentSettlementAuditStepDetail = (params) => {
    FetchqueryPaymentSettlementAuditStepDetail({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        detailTableData: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  fetchColumns = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'rowNum',
        key: 'rowNum',
      },
      {
        title: '步骤',
        dataIndex: 'stepName',
        key: 'stepName',
      },
      {
        title: '处理人',
        dataIndex: 'caller',
        key: 'caller',
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '结束时间',
        dataIndex: 'finishDate',
        key: 'finishDate',
      },
      {
        title: '执行动作',
        dataIndex: 'execAction',
        key: 'execAction',
      },
      {
        title: '摘要信息',
        dataIndex: 'summary',
        key: 'summary',
      },
      {
        title: '处理状态',
        dataIndex: 'status',
        key: 'status',
      },
    ];
    return columns;
  }
  render() {
    const { approveSchedule = 0, detailTableData = [] } = this.state;
    const tableProps = {
      style: { marginTop: '17px' },
      rowKey: 'sswc',
      columns: this.fetchColumns(),
      locale: { emptyText: '暂无数据' },
      dataSource: detailTableData,
      pagination: false,
    };
    return (
      <Fragment>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div>
            <Progress
              type="circle"
              percent={approveSchedule}
              width={80}
              format={() => <span style={{ color: 'black' }}>{approveSchedule}%</span>}
              className="esa-salaryNavigation-progress"
            />
          </div>
          <div>
            <span className="esa-salaryNavigation-trial-status">审批中</span>
          </div>
        </div>
        <div style={{ margin: ' 10px auto', width: '80%' }}>
          <Table {...tableProps} />
        </div>
      </Fragment >
    );
  }
}
export default CheckInfo;
