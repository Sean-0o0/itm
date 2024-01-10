import React, { Component } from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message, Tabs } from 'antd'
import { QueryMemberDetailInfo } from '../../../services/pmsServices'
import EvaluationTable from './EvaluationTable'
import { connect } from 'dva';

const { TabPane } = Tabs

class StaffDetailComponent extends Component {
  state = {
    xmxx: '-', //项目列表
    bm: '-',//部门
    cyxm: '-',//参与项目
    dh: '-',//电话
    fqxm: '-',//发起项目
    gw: '-',//岗位
    jrts: '-',//加入天数
    ktxm: '-',//课题项目
    rymc: '-',//人员名称
    xb: '-',//性别
    zbxm: '-',//专班项目
    attachList: [],
    tableLoading: false,
    pageParams: {
      current: 1,
      pageSize: 20,
      paging: 1,
      total: -1,
      sort: '',
    },
    curTab: 'projectSituation'
  }

  componentDidMount() {

    const { ryid } = this.props;
    this.handleSearch({}, ryid)
  }

  componentWillReceiveProps(nextProps) {
    const { ryid } = nextProps
    this.setState({
      xmxx: '-', //项目列表
      bm: '-',//部门
      cyxm: '-',//参与项目
      dh: '-',//电话
      fqxm: '-',//发起项目
      gw: '-',//岗位
      jrts: '-',//加入天数
      ktxm: '-',//课题项目
      rymc: '-',//人员名称
      xb: '-',//性别
      zbxm: '-',//专班项目
      pageParams: {
        current: 1,
        pageSize: 20,
        paging: 1,
        total: -1,
        sort: '',
        ryid
      }
    }, () => {
      this.handleSearch({}, ryid)
    })
  }

  handleSearch = (params = {}, ryid) => {
    const { pageParams = {} } = this.state
    this.setState({
      tableLoading: true,
    })
    let param = {
      ...pageParams,
      ...params,
      total: -1
    }
    if (ryid) {
      param = {
        ...param,
        ryid
      }
    }
    QueryMemberDetailInfo(param)
      .then((res = {}) => {
        const { code = 0,
          xmxx, //项目列表
          bm,//部门
          cyxm,//参与项目
          dh,//电话
          fqxm,//发起项目
          gw,//岗位
          jrts,//加入天数
          ktxm,//课题项目
          rymc,//人员名称
          xb,//性别
          zbxm,//专班项目
          totalrows = 0
        } = res;
        if (code > 0) {
          this.setState({
            attachList: [...JSON.parse(xmxx)],
            xmxx, //项目列表
            bm,//部门
            cyxm,//参与项目
            dh,//电话
            fqxm,//发起项目
            gw,//岗位
            jrts,//加入天数
            ktxm,//课题项目
            rymc,//人员名称
            xb,//性别
            zbxm,//专班项目
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

  /** tab改变 */
  tabChangeHandle = (activeKey) => {
    this.setState({ curTab: activeKey })
    if (activeKey === 'projectSituation') {
      this.handleSearch({}, this.props.ryid)
    } else if (activeKey === 'evaluationSituation') {
      //子组件已配置刷新
    }
  }



  render() {
    const { xmxx = '-', //项目列表
      bm = '-',//部门
      cyxm = '-',//参与项目
      dh = '-',//电话
      fqxm = '-',//发起项目
      gw = '-',//岗位
      jrts = '-',//加入天数
      ktxm = '-',//课题项目
      rymc = '-',//人员名称
      xb = '-',//性别
      zbxm = '-',//专班项目
      tableLoading = false,
      attachList = [],
      pageParams = {},
      curTab = 'projectSituation',
    } = this.state
    const { routes, ryid, userBasicInfo } = this.props


    return (
      <div className="staff-detail-box" >
        <TopConsole
          routes={routes}
          data={{
            xmxx, //项目列表
            bm,//部门
            cyxm,//参与项目
            dh,//电话
            fqxm,//发起项目
            gw,//岗位
            jrts,//加入天数
            ktxm,//课题项目
            rymc,//人员名称
            xb,//性别
            zbxm,//专班项目
          }}
        />

        <div className='StaffDetailTabs'>
          <Tabs type='card' activeKey={curTab} onChange={this.tabChangeHandle}>
            <TabPane tab="项目情况" key="projectSituation">
              <div className='staff-detail-box'>
                <InfoTable ryid={ryid} tableData={attachList} pageParams={pageParams} tableLoading={tableLoading} routes={routes} handleSearch={this.handleSearch} />
              </div>
            </TabPane>

            {/*人员评价列表 */}
            <TabPane tab="评价情况" key="evaluationSituation">
              <EvaluationTable
                userBasicInfo={userBasicInfo}
                curTab={this.state.curTab}
                ryid={ryid}
              >
              </EvaluationTable>
            </TabPane>
          </Tabs>
        </div>

      </div>
    );
  }
}

// 使用 connect 包装 StaffDetailComponent
const StaffDetail = connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(StaffDetailComponent);

export default StaffDetail;
