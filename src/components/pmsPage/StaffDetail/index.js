import React, { Component } from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message, Tabs, Checkbox, Dropdown, Menu } from 'antd';
import {
  QueryBudgetOverviewInfo,
  QueryMemberDetailInfo,
  QueryUserRole,
  QueryWeekday,
} from '../../../services/pmsServices';
import EvaluationTable from './EvaluationTable'
import { connect } from 'dva';
import moment from 'moment';

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
    curTab: 'projectSituation',
    role: '',
    sortInfo: {
      sort: undefined,
      columnKey: '',
    },
    statisticYearData: {
      dropdown: [], //下拉菜单数据
      currentYear: moment().year(), //当前年份
    },
    limitValue: [],
  }

  componentDidMount() {
    this.getDefaultYear();
  }

  componentWillReceiveProps(nextProps) {
    const { ryid, isOneself } = nextProps
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
        ...(this.state.pageParams || {}),
        current: 1,
        pageSize: 20,
        paging: 1,
        total: -1,
        ryid
      },
      limitValue: isOneself ? ['1', '2'] : []
    }, () => {
      this.getDefaultYear();
      // this.handleSearch({}, ryid)
    })
  }

  handleSearch = (params = {}, ryid) => {
    const { pageParams = {}, limitValue = [], statisticYearData } = this.state
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
        ryid,
        year: statisticYearData.currentYear,
        launchProject: limitValue.includes('1') ? 1: 2, //是否筛选项目经理是自己的项目 1|是；2|否
        participateProject: limitValue.includes('2') ? 1: 2, //是否筛选参与了的项目 1|是；2|否
      }
    }
    QueryMemberDetailInfo(param)
      .then(async (res = {}) => {
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
          const roleRes = await QueryUserRole({
            userId: Number(this.props.userBasicInfo.id),
          });
          const { role = '', testRole = '{}' } = roleRes;
          const roleTxt = role + JSON.parse(testRole).ALLROLE;
          if(roleRes.success){
            // console.log("🚀 ~ StaffDetailComponent ~ .then ~ roleRes:", roleRes)
            this.setState({
              attachList: [...JSON.parse(xmxx)],
              xmxx, //项目列表
              bm, //部门
              cyxm, //参与项目
              dh, //电话
              fqxm, //发起项目
              gw, //岗位
              jrts, //加入天数
              ktxm, //课题项目
              rymc, //人员名称
              xb, //性别
              zbxm, //专班项目
              tableLoading: false,
              pageParams: {
                ...pageParams,
                ...params,
                total: totalrows,
              },
              role: roleTxt,
            });
          }
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

  //获取默认年份
  getDefaultYear = async () => {
    await QueryWeekday({
      begin: 20600101,
      days: 31,
      queryType: 'YSCKNF',
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.result);
          if (data.length > 0) {
            const year = data[0].YSCKNF ? moment(String(data[0].YSCKNF), 'YYYY') : moment();

            const { statisticYearData } = this.state;
            this.setState({
              statisticYearData: {
                ...statisticYearData,
                currentYear: year.year()
              }
            }, () => {
              const { ryid } = this.props;
              this.handleSearch({}, ryid)
            })
            this.getBudgetOverviewInfo(year.year())
          }
        }
      })
      .catch(e => {
        console.error('🚀默认年份', e);
        message.error('默认年份获取失败', 1);
      });
  };

   getBudgetOverviewInfo = async (year) => {
     let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
     const { statisticYearData } = this.state;
     const roleData =
       (await QueryUserRole({
         userId: String(LOGIN_USER_INFO.id),
       })) || {};
     if (roleData.code === 1) {
       const ROLE = roleData.role;


       const res = await QueryBudgetOverviewInfo({
         org: Number(LOGIN_USER_INFO.org),
         queryType: 'SY',
         role: ROLE,
         year,
       });
       if (res.code === 1) {
         this.setState({
           statisticYearData: {
             ...statisticYearData,
             dropdown: JSON.parse(res.ysqs)
           }
         })
       }
     }
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

  onChange = (checkedValues) => {
    const { pageParams } = this.state;
    this.setState({
      limitValue: checkedValues,
      pageParams: {
        ...pageParams,
        current: 1,
      }
    }, () => {
      this.handleSearch({}, this.props.ryid)
    });
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
      role = '',
      statisticYearData,
      limitValue = [],
    } = this.state
    const { routes, ryid, userBasicInfo } = this.props

    // 统计年份
    const menu = (
      <Menu>
        {statisticYearData.dropdown?.map(x => (
          <Menu.Item
            key={x.NF}
            onClick={() => {
              if (Number(x.NF) !== statisticYearData.currentYear) {
                this.setState({
                  statisticYearData: {
                    ...statisticYearData,
                    currentYear: Number(x.NF),
                  },
                  pageParams: {
                    ...pageParams,
                    current: 1,
                  }
                }, () => {
                  this.handleSearch({}, this.props.ryid)
                });
              }
            }}
          >
            {x.NF}
          </Menu.Item>
        ))}
      </Menu>
    );

    const plainOptions = [
      { label: '发起项目', value: '1' },
      { label: '参与项目', value: '2' },
    ];

    const operations =
      (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <Checkbox.Group options={plainOptions} value={limitValue} onChange={this.onChange} />
          </div>
          <div style={{ borderRight: '1px solid', height: '15px', marginRight: '8px' }}></div>
          <div className="statistic-year">
            统计年份：
            <Dropdown overlay={menu} trigger={['click']}>
                    <span>
                      {statisticYearData.currentYear}
                      <i className="iconfont icon-fill-down" />
                    </span>
            </Dropdown>
          </div>
        </div>
      )

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
          role={role}
        />

        <div className='StaffDetailTabs'>
          <Tabs type='card' activeKey={curTab} onChange={this.tabChangeHandle} tabBarExtraContent={operations}>
            <TabPane tab="项目情况" key="projectSituation">
              <div style={{width: '100%'}} className='staff-detail-box'>
                <InfoTable ryid={ryid} tableData={attachList} pageParams={pageParams} tableLoading={tableLoading} routes={routes} handleSearch={this.handleSearch} />
              </div>
            </TabPane>

            {/* 人员评价列表 */}
            {/* 朱校均 1703 陈燕萍1781 黄玉锋 1852 童卫 1604 */}
            {['1703', '1781', '1852', '1604'].includes(String(this.props.userBasicInfo?.id)) && (
                <TabPane tab="评价情况" key="evaluationSituation">
                    <EvaluationTable
                      userBasicInfo={userBasicInfo}
                      curTab={this.state.curTab}
                      ryid={ryid}
                    >
                    </EvaluationTable>
                </TabPane>
            )}
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
