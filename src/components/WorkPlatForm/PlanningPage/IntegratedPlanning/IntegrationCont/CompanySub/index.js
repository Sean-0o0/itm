import React from 'react';
import ListHead from './ListHead'
import ListTable from './ListTable'
import { FetchQueryTdepartment } from '../../../../../../services/planning/planning';
import { Col, Row } from 'antd';

class CompanySub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year:'2022',
      title:'',
      tableData: [],//表格数据
    }
  }
  componentDidMount() {
    this.FetchDataList();
  }

  FetchDataList = (year,title) => {
    FetchQueryTdepartment({
      'tyear': year?year:'2022',
      'title': title?title:'',
    }).then((res) => {
      this.setState({
        tableData: res.records
      })
    })
  }


  handleChange = (year,title) => {
    this.FetchDataList(year,title);
    this.setState({
      year,
      title,
    })
  }

  render() {
    const { tableData,year,title} = this.state
    return (
      <div style={{ padding: '0 25px 0 25px ', backgroundColor: 'white' }}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="dp-body dp-title">
              <ListHead handleChange={this.handleChange}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <ListTable data={tableData} handleChange={this.handleChange} year={year} title={title}/>
          </Col>
        </Row>
      </div>
    );
  }
}
export default CompanySub;
