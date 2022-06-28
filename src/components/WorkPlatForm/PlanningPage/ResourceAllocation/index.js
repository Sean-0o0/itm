import React from 'react';
import ListHead from './ListHead';
import ListButtonGroup from './ListButtonGroup';
import ListTable from './ListTable';
import RightCard from './RightCard';
import ListButtonDetailGroup from './ListButtonDetailGroup';
import ListTableDetail from './ListTableDetail';
import RightCardDetail from './RightCardDetail';
import { FetchQueryResourceAllocation } from '../../../../services/planning/planning';
import { Col, Row, Card } from 'antd';

class ResourceAllocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      column: [],//表格列名属性
      tableData: [],//表格数据
      totalRows:'',//表格数据总数
      tableDataDetail: [],//表格详情数据
      tableDataRight:[],//表格数据右边的卡片数据
      totalRowsDetail:'',//表格详情数据总数
      tableDataDetailRight:[],//表格详情右边的卡片数据
      newData: '',//选中的数据
      newDataDetail: '',//选中的数据
      year:2022,
      reload: false,
      page: 1,
      pageSize: 5,
      headState: {},//表格头部查询条件
    };
  }

  componentDidMount() {
    this.FetchQueryResourceAllocation();
    this.FetchQueryResourceAllocationDetail();
  }

  //查询总体资源
  FetchQueryResourceAllocation = (page,pageSize) => {
    const{year = 2022} = this.state
    FetchQueryResourceAllocation({
      'viewType': 1,
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
        totalRows: res.totalrows,
        tableData: res.records,
        tableDataRight:res.records[0],
      });
      if(page||pageSize){
        FetchQueryResourceAllocation({
          'viewType': 3,
          "orgId": 1,
          "resType": Number(res.records[0]?.resClass)?Number(res.records[0]?.resClass):1,
          'yr': Number(res.records[0]?.yr)?Number(res.records[0]?.yr):2022,
          'current': 1,
          'pageSize': 5,
          'total':-1,
          'paging':1,
          'sort':''
        }).then((resDetail) => {
          this.setState({
            totalRowsDetail: resDetail.totalrows,
            tableDataDetail: resDetail.records,
            tableDataDetailRight:resDetail.records[0],
          });
        });
      }
    });
  };

  //查询资源明细情况 部门资源得时候传orgid=1
  FetchQueryResourceAllocationDetail = (page,pageSize) => {
    const{year = 2022} = this.state
    FetchQueryResourceAllocation({
      //VIEWTYPE入参为3时，查询资源明细情况。
      'viewType': 3,
      'orgId': 1,
      //查询资源明细 Restype= 点击的父列表里返回的 resClass
      'resType': 1,
      //查询资源明细 yr= 点击的父列表里返回的 yr
      'yr': year,
      'current': page?page:1,
      'pageSize': pageSize?pageSize:5,
      'total': -1,
      'paging':1,
      'sort':''
    }).then((res) => {
      this.setState({
        totalRowsDetail: res.totalrows,
        tableDataDetail: res.records,
        tableDataDetailRight:res.records[0],
      });
    });
  };


  reloadTable = () => {
    this.setState({
      reload: true,
      planIdStr: '',
    });
  };

  changeTableData = (value,datailValue,rightValue,datailRightValue,year,total,datailTotal) => {
    if(value !== ''){
      this.setState({
        tableData: value,
      });
    }if(datailValue !== ''){
      this.setState({
        tableDataDetail: datailValue,
      });
    }if(rightValue !== ''){
      this.setState({
        tableDataRight: rightValue,
      });
    }
    if(datailRightValue !== ''){
      this.setState({
        tableDataDetailRight: datailRightValue,
      });
    }if(year !== ''){
      this.setState({
        year:year,
      })
    }if(total !== ''){
      this.setState({
        totalRows:total,
      })
    }if(datailTotal !== ''){
      this.setState({
        totalRowsDetail:datailTotal,
      })
    }
  };

  handlePlanIdStr = (value) => {
    this.setState({
      newData: value,
    });
  };

  handlePlanIdStrDetail = (value) => {
    this.setState({
      newDataDetail: value,
    });
  };

  handlPageChange = (page,pageSize) => {
    this.FetchQueryResourceAllocation(page,pageSize)
  }

  handlPageChangeDetail = (page,pageSize) => {
    this.FetchQueryResourceAllocationDetail(page,pageSize)
    this.setState({
      page,
      pageSize,
    })
  }

  render() {
    const { tableData, tableDataDetail,tableDataRight,tableDataDetailRight, reload,newData,newDataDetail,year,totalRows,totalRowsDetail,page,pageSize } = this.state;
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
        <Row style={{ height: '40rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <Col span={17} style={{ height: '100%', paddingRight: '0.5rem' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem 2rem' }}>
              <ListButtonGroup newData={newData?newData:tableData} year={year}/>
              <ListTable reload={reload} data={tableData}
                         total = {totalRows}
                         handlePlanIdStr={this.handlePlanIdStr}
                         changeTableData={this.changeTableData}
                         handlPageChangeStr={this.handlPageChange}
                         page={page} pageSize={pageSize}/>
            </Card>
          </Col>
          <Col span={7} style={{ height: '100%' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem', height: '100%' }}>
              <RightCard data={tableDataRight} />
            </Card>
          </Col>
        </Row>
        <Row style={{ height: '40rem', paddingBottom: '0.5rem' }}>
          <Col span={17} style={{ height: '100%', paddingRight: '0.5rem' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem 2rem' }}>
              <ListButtonDetailGroup newData={newDataDetail?newDataDetail:tableDataDetail} year={year}/>
              <ListTableDetail reload={reload} data={tableDataDetail}
                               total = {totalRowsDetail}
                               handlePlanIdStrDetail={this.handlePlanIdStrDetail}
                               changeTableData={this.changeTableData} 
                               handlPageChangeStr={this.handlPageChangeDetail}/>
            </Card>
          </Col>
          <Col span={7} style={{ height: '100%' }}>
            <Card style={{ height: '100%' }} bodyStyle={{ padding: '1rem', height: '100%' }}>
              <RightCardDetail data={tableDataDetailRight} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResourceAllocationList;
