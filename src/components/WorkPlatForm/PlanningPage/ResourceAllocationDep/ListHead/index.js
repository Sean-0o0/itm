import React from 'react';
import { Select, Button, message, TreeSelect, Form } from 'antd';
import { connect } from 'dva';
import {
  FetchQueryResourceAllocation,
} from '../../../../../services/planning/planning';
import { FetchSysCommonTable } from '../../../../../services/sysCommon';
import TreeUtils from '../../../../../utils/treeUtils';

class ListHead extends React.Component {
  state = {
    year: 2022,
    org: 1,
    orgData: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
      selected: this.props.value && this.props.value.gxyyb ? this.props.value.gxyyb : [],
    },
  };


  componentDidMount() {
    this.fetchOrganization();
  }

  //获取组织机构
  fetchOrganization = (orgData = this.state.orgData) => {
    const gxyybCurrent = orgData;
    FetchSysCommonTable({ objectName: 'TPRFM_ORG' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'ID', pKeyName: 'FID', titleName: 'Name', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ orgData: gxyybCurrent });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
    FetchSysCommonTable({ objectName: 'TPRFM_PGM' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        const pgmList = [];
        records.forEach((item) => {
          const list = {
            ibm: item.PGM_NO,
            note: item.PGM_NAME,
          }
          pgmList.push(list);
        })
        this.setState({ pgmList });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }

  handleYearChange = (year) => {
    this.setState({
      year: year,
    });
  };

  handleOrgChange = (org) =>{
    this.setState({
      org: org,
    });
  }

  componentWillReceiveProps(nextProos) {
    const { reload = false } = nextProos;
    if (reload) {
      this.handleSearch();
    }
  }

  handleSearch = (e) => {
    const { changeTableData} = this.props;
    const { year,org } = this.state;
    //头部查询条件
    FetchQueryResourceAllocation({
      'viewType': 2,
      "orgId": Number(org),
      "resType": 1,
      'yr': Number(year),
      'current': 1,
      'pageSize': 5,
      'total': -1,
      'paging':1,
      'sort':''
    }).then((res) => {
      changeTableData(res.records,"",res.records[0],"",year,res.totalrows);
    });
  };

  render() {
    const { year,org,orgData } = this.state;
    const curYear = new Date().getFullYear();
    let yearArray = [];
    for (let i = -5; i < 5; i++) {
      yearArray.push(curYear + i);
    }
    return (
      <div className='clearfix' style={{ display: 'flex' }}>
        <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }}>年度：
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
        <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500',margin:'0 2rem'}}>
          <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }}>组织机构：
            <TreeSelect
              showSearch
              value={org}
              treeData={orgData.datas}
              dropdownMatchSelectWidth={false}
              dropdownClassName='esa-evaluate-treeSelect'
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
              treeNodeFilterProp="title"
              placeholder="请选择组织机构"
              // allowClear
              treeDefaultExpandAll
              onChange={this.handleOrgChange}
            />
          </div>
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
