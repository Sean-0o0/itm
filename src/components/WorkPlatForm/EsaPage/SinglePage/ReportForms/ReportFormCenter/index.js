import React from 'react';
import { Row, message, Pagination, Spin } from 'antd';
import DataCard from './DataCard';
import { FetchReportInformation } from '../../../../../services/reportcenter';

class ReportFormCenter extends React.Component {
  state = {
    loading: true, // 页面请求数据时显示加载
    current: 1, // 当前页码
    reports: [], // 所有报表信息
    total: 0, // 总条数
  }

  // 页面加载查询数据
  componentDidMount() {
    this.fetchDatas();
  }

  // 换页
  onChange = (current) => {
    this.setState({
      current,
    });
  }

  // 接口查询,total,reports装入state
  fetchDatas = () => {
    // 页面加载显示loading
    this.setState({
      loading: true,
    });
    // 调用接口
    FetchReportInformation().then((response) => {
      const { records = [] } = response;
      this.setState({
        reports: records,
        total: records.length,
        loading: false,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { reports, total, current, loading } = this.state;
    return (
      <React.Fragment>
        <Row className=" m-row-gzt ant-row" >
          { loading && <Spin style={{ display: 'block', height: '21.333rem', margin: '0 auto', padding: '8rem 0' }} /> }
          { (!loading && reports.length === 0) && <div style={{ textAlign: 'center', height: '15rem', lineHeight: '15rem' }}>暂无数据</div>}
          {
            !loading && reports.map((item, index) => {
                const { repoNm = '', idxNum = 0, idxName = '', id = '', dataGran = '' } = item;
                // 分页判断
                if ((current - 1) * 8 <= index && index < current * 8) {
                return (<DataCard key={index} repoNm={repoNm} idxNum={idxNum} idxName={idxName} id={id} dataGran={dataGran} fetchDatas={this.fetchDatas} />);
                }
                return null;
              })
        }
        </Row>
        {
          !loading && (
          <Pagination current={current} total={total} onChange={this.onChange} defaultPageSize={8} style={{ float: 'right' }} />)
        }
      </React.Fragment>
    );
  }
}
export default ReportFormCenter;
