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
      <div style={{ display: 'flex', marginRight: '100px' }}>
        <div style={{
          height: '40px',
          width: '40px',
          borderRadius: '20px',
          backgroundColor: '#3361FF',
          textAlign: 'center',
          lineHeight: '40px',
          color: 'white',
          fontSize: '18px'
        }}>
          <Icon type={iconType} /></div>
        <div style={{
          height: '40px',
          marginLeft: '16px',
          lineHeight: '20px',
          fontFamily: 'PingFangSC-Regular',
        }}>
          <div style={{
            height: '20px',
            fontSize: '12px',
            fontWeight: '400',
            color: '#606266',
          }}>{title}</div>
          <div style={{
            height: '20px',
            fontSize: '14px',
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
        fontSize: '12px',
        fontWeight: '400',
        color: '#3361FF',
        height: '20px',
        lineHeight: '14px',
        padding: '2px 8px',
        borderRadius: '4px',
        border: '1px solid rgba(51,97,255,0.3)',
        marginRight: '8px',
        cursor: 'pointer'
      }}>
        {text}
      </div>
    );
  };

  render() {
    const { open, currentPageNum, listData } = this.state;
    const { defaultValue, data, fetchQueryOwnerProjectList, projectInfo, totalRows } = this.props;
    return (
      <div style={{ height: '100%', padding: '2.381rem 3.571rem', backgroundColor: 'white', borderRadius: '8px', fontSize: '2.083rem' }}>
        <Input.Group compact>
          <div onMouseDown={(e) => { e.preventDefault() }} style={{ position: 'relative' }} className="operationListSelectBox">
            <span
              style={{ backgroundColor: '#c0c4cc', width:'5px', height:'18px', borderRadius: '4px', display:'inline-block', verticalAlign: 'text-top' }}
            ></span>
            <Select
              style={{ width: '34rem', borderRadius: '8px !important' }}
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
              open={open}
              onDropdownVisibleChange={(visible) => { this.setState({ open: visible }); }}
              // dropdownStyle={{ height: '355px' }}
              // dropdownRender={(options) => {
              //   return (<>
              //     {options}
              //     <div style={{ display: 'flex', height: '4.46rem', lineHeight: '4.46rem', position: 'absolute', bottom: '0' }}>
              //       <span style={{ padding: '0 2.381rem', lineHeight: '4.46rem' }}>共 {totalRows} 条</span>
              //       <Pagination size="small" simple current={currentPageNum} defaultCurrent={DEFAULT_CURRENT} total={totalRows} pageSize={PASE_SIZE} onChange={(pageNum) => {
              //         this.setState({
              //           currentPageNum: pageNum,
              //         });
              //         fetchQueryOwnerProjectList(pageNum, PASE_SIZE);
              //       }} />
              //     </div>
              //   </>);
              // }}
            >
              {
                data?.map((item = {}, ind) => {
                  return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                })
              }
            </Select></div>
        </Input.Group>
        {/*<Col span={4}*/}
        {/*     style={{height: '100%', display: 'flex', alignItems: 'center', textAlign: 'end', fontSize: '2.083rem'}}>*/}
        {/*  <img src={icon_flag} alt="" style={{width: '2rem', height: '2rem'}}/>*/}
        {/*  &nbsp;<span style={{color: 'rgba(144, 147, 153, 1)'}}>当前处于：<span*/}
        {/*  style={{color: 'rgba(48, 49, 51, 1)'}}>项目立项阶段</span></span>*/}
        {/*</Col>*/}
        <div style={{ display: 'flex', marginTop: '16px' }}>
          {this.getReactNode('项目经理', projectInfo?.xmjl, 'user',)}
          {this.getReactNode('项目进度',
            <div style={{ display: 'flex', minWidth: '170px' }}>
              {projectInfo?.xmjd}%
              <Progress style={{ marginLeft: '8px' }} percent={Number(projectInfo?.xmjd)} strokeColor='#3361FF' showInfo={false} />
            </div>, 'pie-chart')}
          {this.getReactNode('项目标签',
            <div style={{ display: 'flex'}}>
              {(projectInfo?.zdxm === '1') && this.getTag('重点项目')}
              {(projectInfo?.zyxm === '1') && this.getTag('自研项目')}
              {(projectInfo?.ddxm === '1') && this.getTag('迭代项目')}
              {(projectInfo?.zdxm === '0' && projectInfo?.ddxm === '0' && projectInfo?.zyxm === '0') && this.getTag('暂无')}
            </div>, 'tag')}
        </div>
      </div>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
