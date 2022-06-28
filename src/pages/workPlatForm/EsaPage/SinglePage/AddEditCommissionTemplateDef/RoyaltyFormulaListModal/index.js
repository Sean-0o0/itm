import React, { Component, Fragment } from 'react';
import { Row, Col, Input } from 'antd';
import BasicModal from '../../../../../../components/Common/BasicModal';
import FetchDataTable from '../../../../../../components/Common/FetchDataTable';
import { FetchQueryListRoyaltyFormula } from '../../../../../../services/EsaServices/commissionManagement';


/**
 * 提成公式定义弹出框
 */
class RoyaltyFormulaListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tmplName: '',
      selectData: {},
    };
  }
  // 选中行
  onClickRow = (record) => {
    const { selectData } = this.state;
    if (selectData.id !== record.id) {
      this.setState({
        selectData: record,
      });
    }
  }
  setRowClassName = (record) => {
    return record.id === this.state.selectData.id ? 'clickRowStyle' : '';
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }

  handleOk = () => {
    const { handleOk } = this.props;
    const { selectData } = this.state;
    if (typeof handleOk === 'function') {
      handleOk(selectData);
    }
    this.handleCancel();
  }

  handleListSearch = (value) => {
    this.setState({ tmplName: value });
  }

  fetchColumns = () => {
    const columns = [
      {
        title: '模板名称',
        dataIndex: 'tmplName',
        key: 'tmplName',
        ellipsis: true,
      },
      {
        title: '说明',
        dataIndex: 'remk',
        key: 'remk',
        ellipsis: true,
      },
      {
        title: '结算类型',
        dataIndex: 'settType',
        key: 'settType',
        // eslint-disable-next-line no-nested-ternary
        render: value => (value === '1' ? '按单户计算' : value === '2' ? '按营业部汇总' : value === '3' ? '按人员汇总' : value),
      },
      {
        title: '分段取值方式',
        dataIndex: 'segValMode',
        key: 'segValMode',
        // eslint-disable-next-line no-nested-ternary
        render: value => (value === '1' ? '分段选一' : value === '2' ? '分段累加' : value === '3' ? '单项' : value),
      },
    ];
    return columns;
  }
  render() {
    const { tmplName } = this.state;
    const { visible = false, versionId = '' } = this.props;
    
    const modalProps = {
      title: '选择记录',
      width: '60rem',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    const tableProps = {
      className: 'mb20',
      columns: this.fetchColumns(),
      onRow: (record) => {
        return {
          onClick: () => this.onClickRow(record),
        };
      },
      rowClassName: this.setRowClassName,
      fetch: {
        service: FetchQueryListRoyaltyFormula,
        params: {
          tmplName,
          versionId,
        },
      },
      pagination: {
        pageSize: 5,
      },
      isPagination: true,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Row className="m-row-form mt10">
            <Col sm={24} md={8} lg={8} xl={8} xxl={8} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <Input.Search
                placeholder="请输入关键字进行搜索"
                onSearch={value => this.handleListSearch(value)}
              />
            </Col>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} >
              <FetchDataTable {...tableProps} />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}
export default RoyaltyFormulaListModal;
