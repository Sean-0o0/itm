import React, { Component, Fragment } from 'react';
import { Row, Col, Input, message, Table } from 'antd';
import BasicModal from '../../../../../../../../../../components/Common/BasicModal';
import { fetchObject } from '../../../../../../../../../../services/sysCommon';

/**
 * 考核人员类别多选弹出框
 */
class EmpClassSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: [],
      adjLvlData: {
        dataSource: [],
        total: 0,
      },
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  // 获取级别调整对象
  fetchData = async (value) => {
    fetchObject('RYLBDY', {
      condition: { class: value },
    }).then((res) => {
      const { note, code, records, total } = res;
      if (code > 0) {
        this.setState({ adjLvlData: { dataSource: records, total } });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  fetchColumns = () => {
    const columns = [
      {
        title: '分类编码',
        dataIndex: 'CLASS_NO',
        key: 'CLASS_NO',
      },
      {
        title: '分类名称',
        dataIndex: 'CLASS_NAME',
        key: 'CLASS_NAME',
      },
    ];
    return columns;
  }
  handleOk = () => {
    const { handleOk } = this.props;
    const { selectData } = this.state;
    if (typeof handleOk === 'function') {
      handleOk(selectData);
    }
    this.handleCancel();
  }
  selectedRows = (records) => {
    this.setState({
      selectData: records,
    });
  }

  render() {
    const { adjLvlData: { dataSource = [], total = 0 } } = this.state;
    const { visible = false } = this.props;
    const modalProps = {
      title: '选择记录',
      width: '60rem',
      visible,
      centered: true,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: false,
    };
    const tableProps = {
      columns: this.fetchColumns(),
      dataSource,
      rowKey: 'ID',
      size: 'small',
      rowSelection: {
        onChange: (key, records) => this.selectedRows(records),
      },
      pagination: {
        total,
        className: 'm-paging',
        size: 'small',
        showLessItems: true,
        hideOnSinglePage: true,
        pageSize: 10,
      },
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
                onSearch={value => this.fetchData(value)}
              />
            </Col>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} >
              <Table {...tableProps} />
            </Col>
          </Row>
        </BasicModal>
      </Fragment >
    );
  }
}
export default EmpClassSelectModal;
