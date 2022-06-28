import React from 'react';
import { Row, Col, Modal, Form } from 'antd';
import OperationList from './OperationList';
import config from '../../../../../../utils/config';
import BasicIndexTable from '../../../Common/BasicIndexTable';
import { FetchQueryDepartmentPlanZFZB } from '../../../../../../services/planning/planning';
import BasicModal from '../../../../../Common/BasicModal';
import LBFrame from 'livebos-frame';

const { api } = config;
const { planning: { exportCompanyPlanYear } } = api;

class CompanySubPlan extends React.Component {
  state = {
    data: [],
    total: 0,
    dataDetail: [],
    visible: false,
  };

  componentDidMount() {

    this.fetchQueryDepartmentPlanZFZB();
  }

  fetchQueryDepartmentPlanZFZB = () => {
    const { params } = this.props;
    FetchQueryDepartmentPlanZFZB(params,).then((ret) => {
      const { code = 0, result = {} } = ret;
      if (code > 0) {
        const resultList = JSON.parse(result);
        this.setState({
          data: resultList.result1,
          total: resultList.result1.length,
          dataDetail: resultList.result2,
        });
      }

    });
  };

  refresh = () => {
    this.fetchQueryDepartmentPlanZFZB();
  };


  // 导出全部数据
  export = () => {
    this.setState({
      visible: true,
    });
  };

  // 导出全部数据
  handleOK = () => {
    const { total } = this.state;
    const iframe = this.ifile; // iframe的dom
    if (total === 0) {
      //Modal.info({ content: '暂无可导出数据!' });
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
      queryCompanyPlanYearModel: {},
      tableHeaderNames: tableHeaderNames.join(','),
      tableHeaderCodes: tableHeaderCodes.join(','),
      tableName: '当年公司规划',
    });
    //console.log("导出当年规划的参数",exportPayload)
    const actionUrl = exportCompanyPlanYear;
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


  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 表格当前的列
  renderColumns = () => {
    const columns = [
      {
        columnName: '指标类别',
        colSpan: 1,
        dataIndex: 'IDX_TYPENAME',
        type: '1',
        width:'12.5%',
        columnAlign: 'center',
      },
      {
        columnName: '指标名称',
        colSpan: 1,
        dataIndex: 'IDX_NAME',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '2021',
        colSpan: 1,
        dataIndex: 'FIRSTYEAR',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '2022',
        colSpan: 1,
        dataIndex: 'SECONDYEAR',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '2023',
        colSpan: 1,
        dataIndex: 'THIRDYEAR',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '2024',
        colSpan: 1,
        dataIndex: 'FOURTHYEAR',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '2025',
        colSpan: 1,
        dataIndex: 'FIFTHYEAR',
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: 'CARG',
        colSpan: 1,
        dataIndex: 'CARG',
        type: '1',
        columnAlign: 'center',
      },
    ];
    return columns;
  };

  renderDetailColumns = () => {
    const columns = [
      {
        columnName: '说明类型',
        colSpan: 1,
        dataIndex: 'TITLE',
        type: '1',
        width: '12.5%',
        columnAlign: 'center',
      },
      {
        columnName: '说明内容',
        colSpan: 1,
        dataIndex: 'REMARK',
        type: '1',
        width: '87.5%',
        columnAlign: 'center',
      },
    ];
    return columns;
  }

  render() {
    const { data, total, dataDetail } = this.state;
    return (
      <Row>
        <Col span={24}>
          <OperationList refresh={this.refresh} export={this.export}  data={dataDetail}/>
        </Col>
        <Col span={24} style={{ padding: '0 2rem' }}>
          <div style={{ display: 'flex', padding: '1rem', fontSize: '1.6rem', fontWeight: '500', color: '#1F1F1F', lineHeight: '2rem' }}><div style={{ width: '6px', height: '20px', background: '#30AAE4', }}></div><div style={{ paddingLeft: '0.5rem' }}>子分指标</div></div>
          <BasicIndexTable
            data={data}
            column={this.renderColumns()}
            sortColumn={1}
            bordered={true}
            onRef={(ref) => this.child1 = ref} />
        </Col>
        <Col span={24} style={{ padding: '0 2rem' }}>
          <div style={{ display: 'flex', padding: '1rem', fontSize: '1.6rem', fontWeight: '500', color: '#1F1F1F', lineHeight: '2rem' }}><div style={{ width: '6px', height: '20px', background: '#30AAE4', }}></div><div style={{ paddingLeft: '0.5rem' }}>子分说明</div></div>
          <BasicIndexTable
            data={dataDetail}
            column={this.renderDetailColumns()}
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

export default CompanySubPlan;
