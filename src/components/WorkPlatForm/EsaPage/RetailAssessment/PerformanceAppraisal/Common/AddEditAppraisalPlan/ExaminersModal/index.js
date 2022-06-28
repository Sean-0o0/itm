import React, { Component, Fragment } from 'react';
import { Form, Row, Col, message, Input, Table } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
// import FetchDataTable from '../../../../../../../Common/FetchDataTable';
import { fetchObject } from '../../../../../../../../services/sysCommon';
/**
 * 个人绩效考核 考核人员modal
 */
class ExaminersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      selectRecord: {},
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextprops){
    if(JSON.stringify(nextprops) !== JSON.stringify(this.props)){
        this.fetchData();
  }
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
        title: '人员编号',
        dataIndex: 'EMP_NO',
      },
      {
        title: '人员名称',
        dataIndex: 'EMP_NAME',
      },
    ];
    return columns;
  }
  fetchData=(value) => {
    let condition = {
      emp: value || '',
    }
    const {orgNo, depClass, classId, levelId} = this.props;
    if(orgNo){
      condition.org_id = orgNo;
    }
    if(depClass){
      condition.dep_class = depClass;
    }
    if(classId){
      condition.class_id =classId;
    }
    if(levelId){
      condition.level_id = levelId;
    }
    const payload = {
      condition: condition,
    };
    fetchObject('KHRY', { ...payload }).then((res) => {
      const { note, code, records, total } = res;
      if (code > 0) {
        this.setState({ dataSource: records, total });
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
    // this.fetchData();
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
                rowKey="EMP_NO"
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
                rowClassName={record => (selectRecord.EMP_NO === record.EMP_NO ? 'ant-table-row-selected' : '')}
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

export default Form.create()(ExaminersModal);
