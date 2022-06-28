import React, { Component, Fragment } from 'react';
import { Form, Row, Col, message, Input, Table } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
// import FetchDataTable from '../../../../../../../Common/FetchDataTable';
import { fetchObject } from '../../../../../../../../services/sysCommon';
/**
 * 考核年度
 */
class AssessmentYearModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      selectRecord: {},
      isFirst: true
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  handleOk = () => {
    const { selectRecord } = this.state;
    const { handleOk } = this.props;
    if (typeof handleOk === 'function') {
      handleOk(selectRecord);
    }
  }
  handleRowSelect=(record) => {
    this.setState({ selectRecord: record });
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  fetchColumns=() => {
    const columns = [
      {
        title: '年度名称',
        dataIndex: 'YEAR_NAME',
      },
      {
        title: '开始月份',
        dataIndex: 'BEGIN_MON',
      },
      {
        title: '结束月份',
        dataIndex: 'END_MON',
      },
      {
        title: '对应年度',
        dataIndex: 'CRSP_YEAR',
      },
    ];
    return columns;
  }
  fetchData=(value) => {
    const condition = {
      year_name: value,
    }
    fetchObject('KHND', { condition }).then((res) => {
      const { note, code, records, total } = res;
      if (code > 0) {
        const date = new Date();
        const { handleCurrentYear } = this.props;
        this.setState({ dataSource: records, total });
        for (let i = 0; i < records.length && this.state.isFirst; i++) {
          if (records[i].YEAR_NAME === `${date.getFullYear()}${date.getMonth() <= 5 ? '上半年' : '下半年'}`) {
            handleCurrentYear(records[i]);
            this.setState({
              isFirst: false
            })
            break;
          }
        }
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  render() {
    const { dataSource = [], total = 0, selectRecord = {} } = this.state;
    const { visible = false } = this.props;
    const modalProps = {
      title: '选择记录',
      width: '75rem',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: false,
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
              <Table
                rowKey="YEAR_NAME"
                size="small"
                columns={this.fetchColumns()}
                dataSource={dataSource}
                pagination={{
                  total,
                  className: 'm-paging',
                  size: 'small',
                  showLessItems: true,
                  hideOnSinglePage: true,
                }}
                rowClassName={record => (selectRecord.YEAR_NAME === record.YEAR_NAME ? 'ant-table-row-selected' : '')}
                onRow={(record, selected) => {
                  return {
                    onClick: () => this.handleRowSelect(record, selected),
                  };
                }}
              />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(AssessmentYearModal);
