import React, { Component, Fragment } from 'react';
import { Row, Col, Input, message, Table } from 'antd';
import BasicModal from '../../../../../../../../../../components/Common/BasicModal';
import { fetchObject } from '../../../../../../../../../../services/sysCommon';

/**
 * 手工级别调整子弹出框
 */
class ManualLevelAdjustModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: {},
      adjLvlData: {
        dataSource: [],
        total: 0,
      },
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  // 选中行
  onClickRow = (record) => {
    const { selectData } = this.state;
    if (selectData.ID !== record.ID) {
      this.setState({
        selectData: record,
      });
    }
  }
  setRowClassName = (record) => {
    return record.ID === this.state.selectData.ID ? 'clickRowStyle' : '';
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  // 获取级别调整对象
  fetchData = async (value) => {
    const { origClass } = this.props.selectData;
    let condition = {
      level: value,
    };
    if (origClass) {
      condition.class_id = origClass;
    }
    fetchObject('RYJBDY', { condition }).then((res) => {
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
        dataIndex: 'LEVEL_NO',
        key: 'LEVEL_NO',
      },
      {
        title: '分类名称',
        dataIndex: 'LEVEL_NAME',
        key: 'LEVEL_NAME',
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

  render() {
    const { adjLvlData: { dataSource = [], total = 0 } } = this.state;
    const { visible = false } = this.props;
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
      dataSource,
      rowKey: 'ID',
      size: 'small',
      onRow: (record) => {
        return {
          onClick: () => this.onClickRow(record),
        };
      },
      rowClassName: this.setRowClassName,
      pagination: {
        total,
        className: 'm-paging',
        size: 'small',
        showLessItems: true,
        hideOnSinglePage: true,
        pageSize: 5,
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
export default ManualLevelAdjustModal;
