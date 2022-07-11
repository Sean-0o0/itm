import React, { Fragment } from 'react';
import { Button, message, Table, Input, Tabs } from 'antd';
//引入请求路径的示例
import { FetchQueryStaffSuperviseTaskListDetail } from '../../../../../../services/motProduction';
import { FetchStaffSuperviseTaskComplete } from '../../../../../../services/motProduction';

const { TabPane } = Tabs;
const { TextArea } = Input;
class MonthTaskListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      disabled: true,
    };
  }
  componentDidMount() {
    this.fetchData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  onSelectChange = selectedRowKeys => {
    if (selectedRowKeys.length === 0) {
      this.setState({
        selectedRowKeys,
        disabled: true,
      });
    } else {
      this.setState({
        selectedRowKeys,
        disabled: false,
      });
    }
  };
  fetchData(nextProps) {
    const { evntId = '', ddyf = '' } = nextProps;
    const { current } = this.state;
    FetchQueryStaffSuperviseTaskListDetail({
      current: current,
      evntId: evntId,
      spvsMo: ddyf,
      spvsSt: 2,
      total: -1,
      pageSize: 5,
      paging: 1,
    }).then((res) => {
      if (res.code === 1) {
        const { records = [], note = '', total } = res;
        this.setState({
          records,
          note,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handlePagerChange = (current) => {
    this.setState({
      current,
    }, () => this.fetchData(this.props));
  }

  submit = () => {
    const { respCntnt, selectedRowKeys = [], note } = this.state;
    const { handleCancel } = this.props;
    let checkId = selectedRowKeys.join(',');
    FetchStaffSuperviseTaskComplete({
      respCntnt: respCntnt,
      lstDtl: JSON.stringify({
        WTHR_ALL: 0,
        CHC_ID: checkId,
        QRY_SQL_ID: note,
      })
    }).then((res) => {
      if (res.code === 1) {
        message.success('操作成功');
        handleCancel();
        this.setState({
          selectedRowKeys: [],
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  setContent = (e) => {
    this.setState({
      respCntnt: e.target.value,
    });
  }
  getColumns = () => {
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskNm',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '督导事件',
        dataIndex: 'evntNm',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '员工',
        dataIndex: 'stfNm',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '重要程度',
        dataIndex: 'imptNm',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '督导月份',
        dataIndex: 'spvsMo',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '下发日期',
        dataIndex: 'relDt',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '状态',
        dataIndex: 'spvsStNm',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
      {
        title: '回复内容',
        dataIndex: 'rplyCntnt',
        render: text => <span style={{ fontSize: '12px' }}>{text}</span>,
      },
    ];
    return columns;
  }

  render() {
    const { selectedRowKeys, current, disabled, records = [], total } = this.state;
    const columns = this.getColumns();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      paging: 1,
      current: current,
      pageSize: 5,
      total: total,
      onChange: this.handlePagerChange,
    };
    return (
      <Fragment>
        <Table className="factor-table mot-empexc-table" rowKey="lstId" rowSelection={rowSelection} columns={columns} dataSource={records} pagination={pagination} />
        <div style={{ width: '100%', height: '1rem', backgroundColor: '#EDF1F4' }}></div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="填写回复内容" key="1">
          </TabPane>
        </Tabs>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', height: '93px' }}>内容:</span><TextArea rows={4} onChange={this.setContent} style={{ width: '400px', height: '93px', marginLeft: '1rem', resize: 'none' }} disabled={disabled} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '1rem' }}>
          <Button type="primary" className="mot-empexc-submit" onClick={this.submit}>提交</Button>
        </div>
      </Fragment>
    );
  }
}

export default MonthTaskListDetail;
