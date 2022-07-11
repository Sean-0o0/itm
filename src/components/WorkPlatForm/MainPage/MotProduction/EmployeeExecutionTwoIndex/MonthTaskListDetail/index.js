import React, { Fragment } from 'react';
import { Button, message, Table, Input } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import moment from 'moment';
//引入请求路径的示例
import { FetchQueryStaffSuperviseTaskListDetail } from '../../../../../../services/motProduction';
import { FetchStaffSuperviseTaskComplete } from '../../../../../../services/motProduction';
const { TextArea } = Input;
class MonthTaskListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      visible: false,
    };
  }
  componentDidMount() {
    this.fetchData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };
  fetchData(nextProps) {
    const { mainOrgId = '', orgId = '', selectMonth, ddzt } = nextProps;
    const { current } = this.state;
    if (selectMonth != null) {
      FetchQueryStaffSuperviseTaskListDetail({
        current: current,
        spvsMo: moment(selectMonth).format("YYYYMM"),
        mainOrgId: mainOrgId,
        orgId: orgId,
        spvsSt: ddzt,
        total: -1,
        pageSize: 10,
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
  }


  handlePagerChange = (current) => {
    this.setState({
      current,
    }, () => this.fetchData(this.props));
  }

  submit = () => {
    const { respCntnt, selectedRowKeys = [], note } = this.state;
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
        this.fetchData(this.props);
        this.handleCancel();
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
  submitModal = () => {
    const { selectedRowKeys = [] } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录');
    } else {
      this.setState({
        visible: true,
      })
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { selectedRowKeys, current, records = [], total, visible } = this.state;
    const columns = this.getColumns();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      paging: 1,
      current: current,
      pageSize: 10,
      total: total,
      onChange: this.handlePagerChange,
      showTotal: () => `共${pagination.total}条`,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const modalProps = {
      width: '500px',
      title: '填写回复内容',
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    return (
      <Fragment>
        <Button onClick={this.submitModal} className="factor-bottom m-btn-table-headColor" style={{ margin: '2rem 0 2rem 2rem' }}>办结</Button>
        <Table className="factor-table mot-empexc-table" rowKey="lstId" rowSelection={rowSelection} columns={columns} dataSource={records} pagination={pagination} />
        <BasicModal {...modalProps}>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <span style={{ display: 'inline-block', height: '93px' }}>内容:</span><TextArea rows={4} onChange={this.setContent} style={{ width: '400px', height: '93px', marginLeft: '1rem', resize: 'none' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '1rem' }}>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </BasicModal>
      </Fragment>
    );
  }
}

export default MonthTaskListDetail;
