import React, { Fragment } from 'react';
import { Row, Col, Table, Form} from 'antd';

class AssessmentResult extends React.Component {
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
        title: '是否需要修订',
        dataIndex: 'isupdate',
        key: 'isupdate',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '无需修订原因',
        dataIndex: 'notupreason',
        key: 'notupreason',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '无需修订说明',
        dataIndex: 'notupremark',
        key: 'notupremark',
        textAlign: 'left',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '操作人',
        dataIndex: 'opremp',
        key: 'opremp',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '所属机构',
        dataIndex: 'oprorgid',
        key: 'oprorgid',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
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
    const { assResult= []} = this.props;
    const colums = this.fetchColums();
    const totals = assResult.length;
    return (
      <Fragment>
        <Row>
          <div className="factor-content-title"><div className="tip"></div>评估结果</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={assResult}
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
export default Form.create()(AssessmentResult);
