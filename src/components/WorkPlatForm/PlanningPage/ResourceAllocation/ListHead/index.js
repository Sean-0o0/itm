import React from 'react';
import { Select, Button } from 'antd';
import { connect } from 'dva';
import {
  FetchQueryResourceAllocation,
} from '../../../../../services/planning/planning';

class ListHead extends React.Component {
  state = {
    year: 2022,
  };


  componentDidMount() {
  }

  handleYearChange = (year) => {
    this.setState({
      year: year,
    });
  };

  componentWillReceiveProps(nextProos) {
    const { reload = false } = nextProos;
    if (reload) {
      this.handleSearch();
    }
  }

  handleSearch = (e) => {
    const { changeTableData} = this.props;
    const { year } = this.state;
    //头部查询条件
    FetchQueryResourceAllocation({
      'viewType': 1,
      "orgId": 1,
      "resType": 1,
      'yr': year,
      'current': 1,
      'pageSize': 5,
      'total':-1,
      'paging':1,
      'sort':''
    }).then((res) => {
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
        changeTableData(res.records,resDetail.records,res.records[0],resDetail.records[0],year,res.totalrows,resDetail.totalrows);
      });
    });
  };

  render() {
    const { year } = this.state;
    const curYear = new Date().getFullYear();
    let yearArray = [];
    for (let i = -5; i < 5; i++) {
      yearArray.push(curYear + i);
    }
    return (
      <div className='clearfix' style={{ display: 'flex' }}>
        <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500',margin:'0 2rem 0 0' }}>年度：
          <Select style={{ width: '8rem' }} onChange={e => this.handleYearChange(e)}
                  defaultValue={year ? year: new Date().getFullYear()}
                  id='year'>
            {
              yearArray.map((item, index) => {
                return <Select.Option key={item} value={item}>{item}</Select.Option>;
              })
            }
          </Select>
        </div>
        <div>
          <Button onClick={e => this.handleSearch(e)}
                  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                  style={{ marginLeft: '10px' }}>查询</Button>
        </div>
      </div>
    );
  }
}

export default connect(({ global = {} }) => ({
  dictionary: global.dictionary,
}))(ListHead);
