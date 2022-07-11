import React, { Fragment } from 'react';
import { Row, Col, Table, Form} from 'antd';

class RevisePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      data: '',
      blx: '1',
      lsjbList: [],
      lsjb: 0,
    };
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  fetchColums = () => {
    const columns = [
      {
        title: '涉及部门',
        dataIndex: 'orgid',
        key: 'orgid',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '涉及制度',
        dataIndex: 'involvingSystem',
        key: 'involvingSystem',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '拟修订内容',
        dataIndex: 'reviseNote',
        key: 'reviseNote',
        textAlign: 'left',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '拟修订时间',
        dataIndex: 'reviseDate',
        key: 'reviseDate',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '操作人',
        dataIndex: 'opremp',
        key: 'opremp',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '操作时间',
        dataIndex: 'oprtime',
        key: 'oprtime',
        textAlign: 'left',
        width: '20%',
      },
    ];
    return columns;
  }

  render() {
    const { revisePlan= []} = this.props;
    const colums = this.fetchColums();
    const totals = revisePlan.length;
    return (
      <Fragment>
        <Row>
          <div className="factor-content-title"><div className="tip"></div>修订计划</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={revisePlan}
                pagination={{
                  showQuickJumper:true,
                  showSizeChanger:true,
                  showTotal: () => `共${totals}条`,
                }}
                size="middle "
                bordered={false}
              />
            </div>
          </Col>
        </Row>
      </Fragment>
      
    );
  }
}
export default Form.create()(RevisePlan);
