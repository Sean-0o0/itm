import React, { Fragment } from 'react';
import { Row, Col, Table, Form,message} from 'antd';
import {FetchIncomdispAssess } from '../../../../../services/processCenter';

class FeedbackTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      expandedKey:[],
      childList : [],
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

  onExpand = (expanded,records) => {
    if(expanded){
      this.setState({expandedKey : [records.missionid]});
      FetchIncomdispAssess({
        instId : records.missionid,
        type : 6
      })
          .then((ret = {}) => {
              const { code = 0, records = [] } = ret;
              if (code > 0) {
                this.setState({childList : records});
              }
          })
          .catch(error => {
              message.error(!error.success ? error.message : error.note);
          }); 
    }
  };

  fetchColums = () => {
    const columns = [
      {
        title: '外规发文流程ID',
        dataIndex: 'flcTitle',
        key: 'flcTitle',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '制度修订流程ID',
        dataIndex: 'lcTitle',
        key: 'lcTitle',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '主办处室',
        dataIndex: 'orgid',
        key: 'orgid',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '涉及制度',
        dataIndex: 'involvingSystem',
        key: 'involvingSystem',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '整改计划',
        dataIndex: 'reformPlan',
        key: 'reformPlan',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '预计完成时间',
        dataIndex: 'etcDate',
        key: 'etcDate',
        textAlign: 'left',
        width: '20%',
      },{
        title: '实际完成日期',
        dataIndex: 'actDate',
        key: 'actDate',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '备注',
        dataIndex: 'compremark',
        key: 'compremark',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '生成时间',
        dataIndex: 'createDate',
        key: 'createDate',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        textAlign: 'left',
        width: '20%',
      },
    ];
    return columns;
  }

  render() {
    const { feedbackTask= []} = this.props;
    const colums = this.fetchColums();
    const totals = feedbackTask.length;
    const expandedRowRender = (expanded,record) => {
      const childColumns = [
        { 
          title: '反馈说明',
          dataIndex: 'feedbacknote', 
          key: 'feedbacknote',
          textAlign: 'left', 
        },
        {
          title: '反馈说明文件',
          dataIndex: 'feedbackfile',
          key: 'feedbackfile',
          textAlign: 'left',
        },
        {
          title: '反馈人员',
          dataIndex: 'feedbackemp',
          key: 'feedbackemp',
          textAlign: 'left',
        },
        { 
          title: '反馈时间', 
          dataIndex: 'feedbackdate', 
          key: 'feedbackdate',
          textAlign: 'left',
        },
  
      ];
      let records = this.state.childList;
      return <Table columns={childColumns} dataSource={records} pagination={false} />;       
    };
    return (
      
      <Fragment>
        <Row>
          <div className="factor-content-title"><div className="tip"></div>制度执行整改情况反馈任务</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={feedbackTask}
                onExpand={this.onExpand}
                //expandedRowKeys={this.state.expandedKey}
                expandedRowRender={expandedRowRender}
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
export default Form.create()(FeedbackTask);
