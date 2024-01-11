import React, { Component } from 'react';
import TopConsole from './TopConsole';
import Overview from './Overview';
import InfoTable from './InfoTable';
import { message } from 'antd';
import { QueryMemberOverviewInfo, QueryUserRole } from '../../../services/pmsServices';
import ProjectMemberStatisticsInfo from '../ProjectMemberStatisticsInfo';
import StatisticYear from '../SupplierSituation/StatisticYear';

class DepartmentOverview extends Component {
  state = {
    role: '',
    orgid: '',
    bmry: [],
    wbry: [],
    gwfb: [],
    bgxx: [],
    tableLoading: false,
    pageParam: {
      current: 1,
      pageSize: 20,
      paging: -1,
      sort: '',
      total: -1,
    },
    radioKey: '项目列表',
    statisticYearData: {
      currentYear: undefined,
      dropdown: [],
    },
    defYearForComponent: undefined,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.defaultYear !== prevProps.defaultYear) {
      this.setState(
        {
          pageParam: {
            current: 1,
            pageSize: 20,
            paging: 1,
            sort: '',
            total: -1,
          },
        },
        () => {
          this.fetchRole(this.props.defaultYear);
        },
      );
      this.setState({
        statisticYearData: {
          ...this.state.statisticYearData,
          currentYear: this.props.defaultYear,
        },
        defYearForComponent: this.props.defaultYear,
      });
    }
  }

  componentDidMount() {
    this.fetchRole();
    this.setState({
      statisticYearData: {
        ...this.state.statisticYearData,
        currentYear: this.props.defaultYear,
      },
      defYearForComponent: this.props.defaultYear,
    });
    console.log('🚀 ~ ProjectMemberStatisticsInfo ~ defaultYear:', this.props.defaultYear);
  }

  handleRadioChange = (e, curDefYear) => {
    console.log('keykey', e.target.value, curDefYear);
    this.setState({
      radioKey: e.target.value,
      statisticYearData: {
        ...this.state.statisticYearData,
        currentYear: curDefYear,
      },
      defYearForComponent: curDefYear,
    });
    if (e.target.value === '项目列表') {
      this.queryMemberOverviewInfo('MX_ALL_ONE', '', this.state.pageParam, curDefYear);
    }
  };

  fetchRole = year => {
    const LOGIN_USERID = JSON.parse(sessionStorage.getItem('user'))?.id;
    if (LOGIN_USERID !== undefined) {
      QueryUserRole({
        userId: Number(LOGIN_USERID),
      })
        .then(res => {
          const { code = 0, role } = res;
          if (code > 0) {
            this.setState(
              {
                role: role,
                orgid: JSON.parse(sessionStorage.getItem('user'))?.org,
              },
              () => {
                const { pageParam = {} } = this.state;
                this.queryMemberOverviewInfo('MX_ALL_ONE', '', pageParam, year);
              },
            );
          }
        })
        .catch(err => {
          message.error('查询人员角色失败');
        });
    }
  };

  queryMemberOverviewInfo = (queryType, gwbm, param, year) => {
    const { role, orgid, pageParam, statisticYearData = {}, defYearForComponent } = this.state;
    this.setState({
      tableLoading: true,
    });
    QueryMemberOverviewInfo({
      org: orgid,
      orgStation: gwbm,
      queryType: queryType,
      role: role,
      year: year ?? statisticYearData.currentYear ?? defYearForComponent,
    })
      .then(res => {
        const { code = 0, bmry, wbry, gwfb, bgxx, note, total } = res;
        if (code > 0) {
          if (queryType === 'MX_ALL_ONE') {
            this.setState({
              bmry: JSON.parse(bmry),
              wbry: JSON.parse(wbry),
              gwfb: JSON.parse(gwfb),
              bgxx: JSON.parse(bgxx),
              tableLoading: false,
              pageParam: {
                ...pageParam,
                ...param,
                total,
              },
            });
          } else {
            this.setState({
              bgxx: JSON.parse(bgxx),
              tableLoading: false,
              pageParam: {
                ...pageParam,
                ...param,
                total,
              },
            });
          }
        } else {
          message.error(note);
          this.setState({
            tableLoading: false,
          });
        }
      })
      .catch(err => {
        message.error('查询人员列表失败');
        this.setState({
          tableLoading: false,
        });
      });
  };

  render() {
    const { routes, defaultYear } = this.props;
    const {
      role = '',
      bmry = [],
      wbry = [],
      gwfb = [],
      bgxx = [],
      tableLoading,
      pageParam,
      radioKey,
      statisticYearData = {},
      defYearForComponent,
    } = this.state;

    console.log('radioKeyradioKey', this.state);

    return (
      <div className="department-staff-box cont-box">
        {radioKey === '项目列表' ? (
          <TopConsole
            routes={routes}
            handleRadioChange={this.handleRadioChange}
            statisticYearData={statisticYearData}
            getStatisticYear={() => (
              <StatisticYear
                userRole={role}
                defaultYear={defYearForComponent}
                refresh={year =>
                  this.setState(
                    {
                      pageParam: {
                        current: 1,
                        pageSize: 20,
                        paging: 1,
                        sort: '',
                        total: -1,
                      },
                    },
                    () => {
                      this.fetchRole(year);
                    },
                  )
                }
                setIsSpinning={v =>
                  this.setState({
                    loading: v,
                  })
                }
                statisticYearData={statisticYearData}
                setStatisticYearData={v =>
                  this.setState({
                    statisticYearData: v,
                  })
                }
              />
            )}
          />
        ) : (
          ''
        )}
        {(role === '信息技术事业部领导' || role === '一级部门领导') && radioKey === '项目列表' && (
          <>
            <div className="overview-box" style={{ height: 'unset' }}>
              <Overview order={1} key="自研团队建设" title="自研团队建设" dataSource={bmry} />
              <Overview order={2} key="外部团队建设" title="外部团队建设" dataSource={wbry} />
            </div>
          </>
        )}
        {radioKey === '项目列表' ? (
          <InfoTable
            routes={routes}
            role={role}
            pageParam={pageParam}
            tableLoading={tableLoading}
            gwfb={gwfb}
            bgxx={bgxx}
            fetchData={this.queryMemberOverviewInfo}
            bmry={bmry}
            wbry={wbry}
            defaultYear={statisticYearData.currentYear}
          />
        ) : (
          <ProjectMemberStatisticsInfo
            handleRadioChange={this.handleRadioChange}
            defaultYear={statisticYearData.currentYear}
          />
        )}
      </div>
    );
  }
}

export default DepartmentOverview;
