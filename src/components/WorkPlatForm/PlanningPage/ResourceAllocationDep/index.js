import React from 'react';
import ListHead from './ListHead';
import ListButtonDetailGroup from './ListButtonDetailGroup';
import ListTable from './ListTable';
import RightCard from './RightCard';
import { FetchQueryResourceAllocation } from '../../../../services/planning/planning';
import { Col, Row, Card } from 'antd';

class ResourceAllocationDep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      column: [],//表格列名属性
      tableData: [],//表格数据
      tableDataRight:[],//表格数据右边的卡片数据
      newData: '',//选中的数据
      totalRowsDetail:'',//表格详情数据总数
      reload: false,
      page: 1,
      pageSize: 5,
      headState: {},//表格头部查询条件
      year:2022
    };
  }

  componentDidMount() {
    this.FetchQueryResourceAllocation();
  }

  //查询总体资源-部门
  FetchQueryResourceAllocation = (page,pageSize) => {
    const{year = 2022} = this.state
    FetchQueryResourceAllocation({
      'viewType': 2,
      'orgId': 1,
      'resType': 1,
      'yr': year,
      'current': page?page:1,
      'pageSize': pageSize?pageSize:5,
      'total': -1,
      'paging':1,
      'sort':''
    }).then((res) => {
      this.setState({
        totalRowsDetail:res.totalrows,//表格详情数据总数
        tableData: res.records,
        tableDataRight:res.records[0],
      });
    });
  };

  reloadTable = () => {
    this.setState({
      reload: true,
      planIdStr: '',
    });
  };

  changeTableData = (value,datailValue,rightValue,datailRightValue,year,total) => {
    if(value !== ''){
      this.setState({
        tableData: value,
      });
    }if(rightValue !== ''){
      this.setState({
        tableDataRight: rightValue,
      });
    }if(year !== ''){
      this.setState({
        year:year,
      })
    }if(total !== ''){
      this.setState({
        totalRowsDetail:total,
      })
    }
  };

  handlePlanIdStr = (value) => {
    this.setState({
      newData: value,
    });
  };

  handlPageChangeDetail = (page,pageSize) => {
    this.FetchQueryResourceAllocation(page,pageSize)
    this.setState({
      page,
      pageSize,
    })
  }

  render() {
    const { tableData,tableDataRight, reload,totalRowsDetail,newData,year } = this.state;
    return (
      // padding: '0 25px 0 25px ',
      <div style={{ backgroundColor: '#F2F2F2' }}>
        <Row>
          <Col span={24}>
            <Card bodyStyle={{ padding: '1rem 2rem' }}>
              <ListHead reload={reload} changeTableData={this.changeTableData}/>
            </Card>
          </Col>
        </Row>
        <Row style={{ height: '50rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <Col span={17} style={{ height: '100%', paddingRight: '0.5rem' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem 2rem' }}>
              <ListButtonDetailGroup newData={newData?newData:tableData} year={year} />
              <ListTable reload={reload} data={tableData}
                               total = {totalRowsDetail}
                               handlePlanIdStr={this.handlePlanIdStr}
                               changeTableData={this.changeTableData} 
                               handlPageChangeStr={this.handlPageChangeDetail}/>
            </Card>
          </Col>
          <Col span={7} style={{ height: '100%' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem', height: '100%' }}>
              <RightCard data={tableDataRight} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResourceAllocationDep;
