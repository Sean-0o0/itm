import React, {Component} from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import {message} from 'antd'
import {QueryLabelDetailInfo} from '../../../services/pmsServices'

class LabelDetail extends Component {
  state = {
    bqmc: '-', //标签名称
    bqsm: '-',//标签说明
    bqfz: '-',//标签分组id
    attachList: [],
    tableLoading: false,
    pageParams: {
      current: 1,
      pageSize: 10,
      paging: 1,
      total: -1,
      sort: '',
    },
  }

  componentDidMount() {
    this.handleSearch()
  }

  componentWillReceiveProps(nextProps) {
    const {bqid} = nextProps
    this.setState({
      bqmc: '-', //标签名称
      bqsm: '-',//标签说明
      bqfz: '-',//标签分组id
      attachList: [],
      tableLoading: false,
      pageParams: {
        current: 1,
        pageSize: 10,
        paging: 1,
        total: -1,
        sort: '',
        bqid
      }
    }, () => {
      this.handleSearch({}, bqid)
    })
  }

  handleSearch = (params = {}, bqid) => {
    const {pageParams = {}} = this.state
    let param = {
      ...pageParams,
      ...params,
      total: -1
    }
    if (bqid) {
      param = {
        ...param,
        bqid
      }
    }
    this.setState({
      tableLoading: true,
    })
    QueryLabelDetailInfo(param).then((res = {}) => {
      const {
        code = 0,
        bqmc, //标签名称
        bqsm,//标签说明
        bqfz,//标签分组id
        xmxx,//项目信息
        totalrows = 0
      } = res;
      if (code > 0) {
        this.setState({
          attachList: [...JSON.parse(xmxx)],
          bqmc, //标签名称
          bqsm,//标签说明
          bqfz,//标签分组id
          tableLoading: false,
          pageParams: {
            ...pageParams,
            ...params,
            total: totalrows,
          }
        })
      } else {
        this.setState({
          tableLoading: false,
        })
      }
    }).catch((e) => {
      this.setState({
        tableLoading: false,
      })
      message.error(!e.success ? e.message : e.note);
    });
  }

  render() {
    const {
      bqmc = '-', //标签名称
      bqsm = '-',//标签说明
      bqfz = '-',//标签分组id
      tableLoading = false,
      attachList = [],
      pageParams = {}
    } = this.state
    const {routes} = this.props

    return (<div className="staff-detail-box">
      <TopConsole
        routes={routes}
        data={{
          bqmc, //标签名称
          bqsm,//标签说明
          bqfz,//标签分组id
        }}
      />
      <InfoTable bqid={bqid} tableData={attachList} pageParams={pageParams} tableLoading={tableLoading} routes={routes}
                 handleSearch={this.handleSearch}/>
    </div>);
  }
}

export default LabelDetail;
