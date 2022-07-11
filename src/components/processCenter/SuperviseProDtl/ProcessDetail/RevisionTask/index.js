import React, { Fragment } from 'react';
import { Row, Col, Table, Form} from 'antd';

class RevisioTask extends React.Component {
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
        title: '流程',
        dataIndex: 'lcTitle',
        key: 'lcTitle',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '发文时间',
        dataIndex: 'issuingDate',
        key: 'issuingDate',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '涉及部门',
        dataIndex: 'orgid',
        key: 'orgid',
        textAlign: 'left',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '涉及制度',
        dataIndex: 'involvingSystem',
        key: 'involvingSystem',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '修订部门',
        dataIndex: 'oprorgid',
        key: 'oprorgid',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '对应的旧制度',
        dataIndex: 'oldfile',
        key: 'oldfile',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
      },{
        title: '修订后的新制度文件',
        dataIndex: 'newfile',
        key: 'newfile',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '修订说明',
        dataIndex: 'dispatchnote',
        key: 'dispatchnote',
        textAlign: 'left',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '备注',
        dataIndex: 'compremark',
        key: 'compremark',
        textAlign: 'left',
        width: '20%',
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
        title: '操作时间',
        dataIndex: 'oprtime',
        key: 'oprtime',
        textAlign: 'left',
        width: '20%',
        ellipsis: true,
      },
    ];
    return columns;
  }

  render() {
    const { revisioTask= []} = this.props;
    const colums = this.fetchColums();
    const totals = revisioTask.length;
    return (
      <Fragment>
        <Row>
          <div className="factor-content-title"><div className="tip"></div>内部制度修订任务</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={revisioTask}
                pagination={{
                  showQuickJumper:true,
                  showSizeChanger:true,
                  showTotal: () => `共${totals}条`,
                }}
                size="middle "
                bordered={false}
                scroll={{  x: true }}
              />
            </div>
          </Col>
        </Row>
      </Fragment>
      
    );
  }
}
export default Form.create()(RevisioTask);
