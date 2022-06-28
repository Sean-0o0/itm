import React from 'react';
import { Row, Col, Modal, Form } from 'antd';
import OperationList from './OperationList';
import config from '../../../../../../utils/config';
import BasicIndexTable from '../../../Common/BasicIndexTable';
import { FetchQueryCompanyProfitBudget } from '../../../../../../services/planning/planning';
import BasicModal from '../../../../../Common/BasicModal';

const { api } = config;
const { planning: { exportCompanyProfitBudget } } = api;

class CompanyProfitBudget extends React.Component {
  state = {
    data: [],
    total: 0,
    visible: false,
  };

  componentDidMount() {
    this.fetchQueryCompanyProfitBudget();

  }

  fetchQueryCompanyProfitBudget = () => {
    FetchQueryCompanyProfitBudget({
      'yr': new Date().getFullYear(),
    }).then((ret) => {
      const { code = 0, records = [] } = ret;
      this.setState({
        data: records,
        total: records.length,
      });
    });
  };

  refresh = () => {
    this.fetchQueryCompanyProfitBudget();
  };

  // 导出全部数据
  export = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 导出全部数据
  handleOK = () => {
    const { total } = this.state;
    const iframe = this.ifile; // iframe的dom
    if (total === 0) {
      this.setState({
        visible: false,
      });
      return;
    }
    const _this = this;
    const tableHeaderNames = _this.renderColumns().map(item => item.columnName);
    tableHeaderNames.unshift();
    const tableHeaderCodes = _this.renderColumns().map(item => item.dataIndex);
    tableHeaderCodes.unshift();
    const exportPayload = JSON.stringify({
      isAllSel: 1,
      unSelectRowKey: '',
      queryCompanyProfitBudgetModel: {
        yr: new Date().getFullYear(),
      },
      tableHeaderNames: tableHeaderNames.join(','),
      tableHeaderCodes: tableHeaderCodes.join(','),
      tableName: '公司当年利润预算规划',
    });
    ////console.log(exportPayload)
    const actionUrl = exportCompanyProfitBudget;
    // 创建一个表单
    const downloadForm = document.createElement('form');
    downloadForm.id = 'downloadForm';
    downloadForm.name = 'downloadForm';
    // 创建一个输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'exportPayload';
    input.value = exportPayload;
    // 将该输入框插入到 form 中
    downloadForm.appendChild(input);
    // form 的提交方式
    downloadForm.method = 'POST';
    // form 提交路径
    downloadForm.action = actionUrl;
    // 添加到 body 中
    iframe.appendChild(downloadForm);
    // 对该 form 执行提交
    downloadForm.submit();
    // 删除该 form
    iframe.removeChild(downloadForm);
    this.setState({
      visible: false,
    });
  };

  // 表格当前的列
  renderColumns = () => {
    const columns = [
      {
        columnName: '项目',
        colSpan: 1,
        dataIndex: 'idxName',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '条线',
        colSpan: 1,
        dataIndex: 'orgName',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '预算数',
        colSpan: 1,
        dataIndex: 'budgetNum',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '当年数',
        colSpan: 1,
        dataIndex: 'nowNum',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '增减数',
        colSpan: 1,
        dataIndex: 'diffNum',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '同比变化',
        colSpan: 1,
        label: '1',
        dataIndex: 'change',
        type: '1',
        columnAlign: 'center',
      },
    ];
    return columns;
  };

  render() {
    const { data, total } = this.state;

    return (
      <Row>
        <Col span={24}>
          <OperationList refresh={this.refresh} export={this.export} />
        </Col>
        <Col span={24} style={{ padding: '0 2rem' }}>
          <BasicIndexTable
            data={data}
            column={this.renderColumns()}
            sortColumn={1}
            bordered={true}
            onRef={(ref) => this.child1 = ref} />
        </Col>
        <iframe title='下载' id='m_iframe' ref={(c) => {
          this.ifile = c;
        }} style={{ display: 'none' }} />
        <BasicModal title={'导出'}
                    width='50rem'
                    style={{ overflowY: 'auto', height: '70rem', margin: '0 auto', top: '10rem' }}
                    maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    visible={this.state.visible}
                    onOk={this.handleOK}
                    onCancel={this.handleCancel}>
          <Form.Item style={{ margin: '1rem', padding: '1rem' }} label='提示' labelCol={{ span: 4 }}
                     wrapperCol={{ span: 20 }}>
            <div><span>{total === 0 ? '暂无可导出的数据' : '是否导出数据？'}</span></div>
          </Form.Item>
        </BasicModal>
      </Row>
    );
  }
}

export default CompanyProfitBudget;
