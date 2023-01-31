import React from 'react';
import { Input, Select, Pagination, Icon, Progress } from 'antd';
import { FetchQueryOwnerProjectList } from '../../../../services/pmsServices'
import { connect } from 'dva';
const { Option } = Select;
const PASE_SIZE = 2;
const DEFAULT_CURRENT = 1;

class OperationList extends React.Component {
  state = {
    open: false,
    currentPageNum: 1,
    listData: [],
  };

  componentDidMount() {
    this.setState({
      listData: [...this.props.data],
      currentPageNum: 1,
    });
  }

  onChange = (value) => {
    const { fetchQueryLiftcycleMilestone, fetchQueryLifecycleStuff, getCurrentXmid, fetchQueryOwnerProjectList, fetchQueryProjectInfoInCycle } = this.props;
    fetchQueryLiftcycleMilestone(value);
    fetchQueryLifecycleStuff(value);
    fetchQueryProjectInfoInCycle(value);
    getCurrentXmid(value);//生命周期页取得最新xmid
    //选择后不会回到第一页
    // fetchQueryOwnerProjectList(1, PASE_SIZE);
    // this.setState({
    //   currentPageNum: 1,
    // });
  };
  handleSelectFocus = () => {
    FetchQueryOwnerProjectList(
      {
        paging: -1,
        current: 1,
        pageSize: 10,
        total: -1,
        sort: '',
        cxlx: 'ALL',
      }
    ).then((ret = {}) => {
      const { record, code, totalrows } = ret;
      if (code === 1) {
        this.setState({
          listData: [...record],
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // onSearch = (value) => {
  //   if (value === '') {
  //     this.props.fetchQueryOwnerProjectList(1, PASE_SIZE);
  //   } else {
  //     const throttle = (fn, wait = 50) => {
  //       let previous = 0
  //       return function (...args) {
  //         let now = +new Date()
  //         if (now - previous > wait) {
  //           previous = now
  //           fn.apply(this, args)
  //         }
  //       }
  //     }
  //     const fn = () => {
  //       FetchQueryOwnerProjectList(
  //         {
  //           paging: -1,
  //           total: -1,
  //           sort: '',
  //           cxlx: 'ALL',
  //         }
  //       ).then(res => {
  //         let allData = res.record;
  //         let newData = allData.filter(item=>item.xmmc === value)
  //         console.log('kkkkkkk',newData);
  //         // this.setState({
  //         //   listData:[...allData.filter(item=>item.xmmc === value)]
  //         // });
  //       });
  //     }
  //     throttle(fn, 600)();
  //   }
  // };

  //获取html节点
  getReactNode = (title, content, iconType) => {
    return (
      <div style={{ display: 'flex', marginRight: '14.88rem' }}>
        <div style={{
          height: '6.2496rem',
          width: '6.2496rem',
          borderRadius: '50%',
          backgroundColor: '#3361FF',
          textAlign: 'center',
          lineHeight: '6.2496rem',
          color: 'white',
          fontSize: '2.976rem'
        }}>
          <Icon type={iconType} /></div>
        <div style={{
          height: '6.2496rem',
          marginLeft: '2.3808rem',
          lineHeight: '3.1248rem',
          fontFamily: 'PingFangSC-Regular',
        }}>
          <div style={{
            height: '3.1248rem',
            fontSize: '2.0832rem',
            fontWeight: '400',
            color: '#606266',
          }}>{title}</div>
          <div style={{
            height: '3.1248rem',
            fontSize: '2.3808rem',
            fontWeight: '600',
            color: '#303133',
          }}>{content}</div>
        </div>
      </div>
    );
  };
  //获取html节点
  getTag = (text) => {
    return (
      <div style={{
        backgroundColor: 'rgba(51,97,255,0.05)',
        fontSize: '1.7856rem',
        fontWeight: '400',
        color: '#3361FF',
        height: '2.976rem',
        lineHeight: '2.0832rem',
        padding: '0.2976rem 1.1904rem',
        borderRadius: '0.5952rem',
        border: '0.1488rem solid rgba(51,97,255,0.3)',
        marginRight: '1.1904rem',
        cursor: 'pointer'
      }}>
        {text}
      </div>
    );
  };

  render() {
    const {open, currentPageNum, listData} = this.state;
    const {defaultValue, data, fetchQueryOwnerProjectList, projectInfo, totalRows} = this.props;
    let bqmc = projectInfo?.bqmc ? projectInfo?.bqmc : "";
    // let bqmc = "{\"个人重点关注\":\"38\",\"个人重点关注22\":\"38\",}";
    let obj;
    if (bqmc !== "") {
      bqmc = bqmc?.slice(0, bqmc?.lastIndexOf(",")) + bqmc?.slice(bqmc?.lastIndexOf(",") + 1, bqmc.length);
    } else {
      bqmc = '{"暂无":"0"}';
    }
    obj = eval(' (' + bqmc + ')')
    return (
      <div style={{height: '100%', padding: '2.381rem 3.571rem', backgroundColor: 'white', borderRadius: '1.1904rem'}}>
        <Input.Group compact>
          <div onMouseDown={(e) => {
            e.preventDefault()
          }} style={{position: 'relative'}} className="operationListSelectBox">
            <img src={require('../../../../image/pms/LifeCycleManagement/search.png')}
                 alt='' style={{marginBottom: '0.5952rem', height: '2.976rem'}}
            />
            <Select
              ref={this.selectRef}
              style={{width: '34rem', borderRadius: '1.1904rem !important'}}
              showSearch
              placeholder="请选择项目名称"
              optionFilterProp="children"
              key={defaultValue ? defaultValue : data[0]?.xmmc}
              defaultValue={defaultValue ? defaultValue : data[0]?.xmmc}
              onChange={this.onChange}
              // onSearch={this.onSearch}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onFocus={this.handleSelectFocus}
              open={open}
              onDropdownVisibleChange={(visible) => { this.setState({ open: visible }) }}
            >
              {
                data?.map((item = {}, ind) => {
                  return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                })
              }
            </Select></div>
        </Input.Group>
        <div style={{ display: 'flex', marginTop: '2.3808rem' }}>
          {this.getReactNode('项目经理', projectInfo?.xmjl, 'user',)}
          {this.getReactNode('项目进度',
            <div style={{ display: 'flex', minWidth: '25.296rem' }}>
              {projectInfo?.xmjd}%
              <Progress style={{ marginLeft: '1.1904rem' }} percent={Number(projectInfo?.xmjd)} strokeColor='#3361FF' showInfo={false} />
            </div>, 'pie-chart')}
          {this.getReactNode('项目标签',
            <div style={{display: 'flex'}}>
              {Object.keys(obj ? obj : "").map(key => {
                return this.getTag(key.toString());
              })}
              {/*{JSON.parse("{\"个人重点关注\":\"38\"}").map((item = {}, ind) => {*/}
              {/*  return this.getTag(item);*/}
              {/*})}*/}
              {/*{(projectInfo?.zdxm === '1') && this.getTag('重点项目')}*/}
              {/*{(projectInfo?.zyxm === '1') && this.getTag('自研项目')}*/}
              {/*{(projectInfo?.ddxm === '1') && this.getTag('迭代项目')}*/}
              {/*{(projectInfo?.zdxm === '0' && projectInfo?.ddxm === '0' && projectInfo?.zyxm === '0') && this.getTag('暂无')}*/}
            </div>, 'tag')}
        </div>
      </div>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
