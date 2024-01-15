import React, { Component } from 'react';
import TopConsole from './TopConsole';
import Overview from './Overview';
import InfoTable from './InfoTable';
import { message, Spin, Radio } from 'antd';
import {
  QueryProjectDynamics,
  QueryProjectGeneralInfo,
  QueryUserRole,
} from '../../../services/pmsServices';
import ProjectDynamics from './ProjectDynamics';
import moment from 'moment';
import StatisticYear from '../SupplierSituation/StatisticYear';

class ProjectBuilding extends Component {
  state = {
    role: '',
    orgid: '',
    fxxx: [],
    jrxz: [],
    ryxx: [],
    xmxx: [],
    data: [
      {
        name: '自研项目',
        total: 0,
        add: 0,
      },
      {
        name: '外采项目',
        total: 0,
        add: 0,
      },
      {
        name: '专项项目',
        total: 0,
        add: 0,
      },
      {
        name: '迭代项目',
        total: 0,
        add: 0,
      },
      {
        name: '信创项目',
        total: 0,
        add: 0,
      },
      {
        name: '课题项目',
        total: 0,
        add: 0,
      },
    ],
    tableLoading: false,
    loading: false,
    pageParam: {
      current: 1,
      pageSize: 20,
      paging: 1,
      sort: '',
      total: -1,
    },
    radioKeys: '项目列表',
    //项目动态信息-付款信息
    prjDynamicsFKInfo: [],
    totalrowsFK: 0,
    //项目动态信息-合同信息
    prjDynamicsHTInfo: [],
    totalrowsHT: 0,
    //项目动态信息-立项信息
    prjDynamicsLXInfo: [],
    totalrowsLX: 0,
    //项目动态信息-上线信息
    prjDynamicsSXInfo: [],
    totalrowsSX: 0,
    //项目动态信息-完结信息
    prjDynamicsWJInfo: [],
    totalrowsWJ: 0,
    //项目动态信息-信委会信息
    prjDynamicsXWHInfo: [],
    totalrowsXWH: 0,
    //项目动态信息-总办会信息
    prjDynamicsZBHInfo: [],
    totalrowsZBH: 0,
    statisticYearData: {
      currentYear: undefined,
      dropdown: [],
    },
  };

  componentDidMount() {
    this.state.radioKeys === '项目列表' && this.fetchRole(this.state.statisticYearData.currentYear);
    this.state.radioKeys === '项目动态' &&
      this.queryProjectDynamics(this.state.statisticYearData.currentYear);
    this.setState({
      statisticYearData: {
        ...this.state.statisticYearData,
        currentYear: this.props.defaultYear,
      },
    });
  }

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
        () => this.fetchRole(this.props.defaultYear),
      );
      this.handleRadioChange({ target: { value: '项目列表' } });
      this.setState({
        statisticYearData: {
          ...this.state.statisticYearData,
          currentYear: this.props.defaultYear,
        },
      });
    }
  }

  fetchRole = year => {
    const LOGIN_USERID = JSON.parse(sessionStorage.getItem('user'))?.id;
    this.setState({
      loading: true,
    });
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
                this.queryProjectGeneralInfo('MX_ALL_ONE', '', pageParam, year);
              },
            );
          } else {
            this.setState({
              loading: false,
            });
          }
        })
        .catch(err => {
          message.error('查询人员角色失败');
          this.setState({
            loading: false,
          });
        });
    }
  };

  queryProjectGeneralInfo = (queryType, xmzt, param, year) => {
    const { role, orgid, pageParam, statisticYearData = {} } = this.state;
    this.setState({
      tableLoading: true,
    });
    QueryProjectGeneralInfo({
      xmzt: xmzt,
      org: orgid,
      queryType: queryType,
      role: role,
      ...pageParam,
      ...param,
      year: year ?? statisticYearData.currentYear ?? moment().year(),
      paging: 1,
      total: -1,
    })
      .then(res => {
        const { code = 0, fxxx, jrxz, ryxx, xmxx, note, totalrows: total } = res;
        if (code > 0) {
          if (queryType === 'MX_ALL_ONE') {
            this.handleData(fxxx, ryxx, jrxz);
            this.setState({
              loading: false,
              xmxx: JSON.parse(xmxx),
              tableLoading: false,
              pageParam: {
                ...pageParam,
                ...param,
                total,
              },
            });
          } else {
            this.setState({
              loading: false,
              xmxx: JSON.parse(xmxx),
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
            loading: false,
            tableLoading: false,
          });
        }
      })
      .catch(err => {
        message.error('查询项目列表失败');
        this.setState({
          tableLoading: false,
        });
      });
  };

  queryProjectDynamics = year => {
    this.setState({
      loading: true,
    });
    const payload = {
      current: 1,
      // "manager": 0,
      pageSize: 5,
      paging: 1,
      // "projectID": 0,
      queryType: 'ALL',
      sort: '',
      total: -1,
      totalrowsFK: -1,
      totalrowsHT: -1,
      totalrowsLX: -1,
      totalrowsSX: -1,
      totalrowsWJ: -1,
      totalrowsXWH: -1,
      totalrowsZBH: -1,
      year: year ?? this.state.statisticYearData.currentYear ?? moment().year(),
    };
    QueryProjectDynamics({
      ...payload,
    })
      .then(res => {
        const {
          code = 0,
          resultFK,
          resultHT,
          resultLX,
          resultSX,
          resultWJ,
          resultXWH,
          resultZBH,
          totalrowsFK,
          totalrowsHT,
          totalrowsLX,
          totalrowsSX,
          totalrowsWJ,
          totalrowsXWH,
          totalrowsZBH,
        } = res;
        if (code > 0) {
          this.setState({
            loading: false,
            //项目动态信息-付款信息
            prjDynamicsFKInfo: JSON.parse(resultFK),
            totalrowsFK: totalrowsFK,
            //项目动态信息-合同信息
            prjDynamicsHTInfo: JSON.parse(resultHT),
            totalrowsHT: totalrowsHT,
            //项目动态信息-立项信息
            prjDynamicsLXInfo: JSON.parse(resultLX),
            totalrowsLX: totalrowsLX,
            //项目动态信息-上线信息
            prjDynamicsSXInfo: JSON.parse(resultSX),
            totalrowsSX: totalrowsSX,
            //项目动态信息-完结信息
            prjDynamicsWJInfo: JSON.parse(resultWJ),
            totalrowsWJ: totalrowsWJ,
            //项目动态信息-信委会信息
            prjDynamicsXWHInfo: JSON.parse(resultXWH),
            totalrowsXWH: totalrowsXWH,
            //项目动态信息-总办会信息
            prjDynamicsZBHInfo: JSON.parse(resultZBH),
            totalrowsZBH: totalrowsZBH,
          });
        } else {
          message.error(note);
          this.setState({
            loading: false,
          });
        }
      })
      .catch(err => {
        message.error('查询项目动态失败');
        this.setState({
          loading: false,
        });
      });
  };

  handleData = (fxxx, ryxx, jrxz) => {
    const zy = {
      name: '自研项目',
      total: 0,
      add: 0,
    };
    const wc = {
      name: '外采项目',
      total: 0,
      add: 0,
    };
    const zb = {
      name: '专班项目',
      total: 0,
      add: 0,
    };
    const dd = {
      name: '迭代项目',
      total: 0,
      add: 0,
    };
    const xc = {
      name: '信创项目',
      total: 0,
      add: 0,
    };
    const kt = {
      name: '课题项目',
      total: 0,
      add: 0,
    };
    const fxxxInfo = JSON.parse(fxxx);
    const ryxxInfo = JSON.parse(ryxx);
    const jrxzInfo = JSON.parse(jrxz);
    fxxxInfo.forEach(item => {
      const { BQNAME, XMSL } = item;
      switch (BQNAME) {
        case '迭代项目':
          dd.total = Number.parseInt(XMSL);
          break;
        case '信创项目':
          xc.total = Number.parseInt(XMSL);
          break;
        case '课题项目':
          kt.total = Number.parseInt(XMSL);
          break;
        default:
          zb.total += Number.parseInt(XMSL);
          break;
      }
    });
    ryxxInfo.forEach(item => {
      const { LXNAME, XMSL } = item;
      switch (LXNAME) {
        case '普通自研项目':
          zy.total = Number.parseInt(XMSL);
          break;
        default:
          wc.total += Number.parseInt(XMSL);
          break;
      }
    });
    const [one] = jrxzInfo;
    const keys = Object.keys(one || {});
    keys.forEach(item => {
      const XMSL = one[item];
      switch (item) {
        case 'JRZY':
          zy.add = Number.parseInt(XMSL);
          break;
        case 'JRWC':
          wc.add = Number.parseInt(XMSL);
          break;
        case 'JRZB':
          zb.add = Number.parseInt(XMSL);
          break;
        case 'JBDD':
          dd.add = Number.parseInt(XMSL);
          break;
        case 'JBXC':
          xc.add = Number.parseInt(XMSL);
          break;
        case 'JBKT':
          kt.add = Number.parseInt(XMSL);
          break;
        default:
          break;
      }
    });
    this.setState({
      data: [zy, wc, zb, dd, xc, kt],
    });
  };

  handleRadioChange = e => {
    const radioKeys = e.target.value;
    console.log('radioKeys', radioKeys);
    this.setState({
      radioKeys,
    });
    radioKeys === '项目列表' && this.fetchRole();
    radioKeys === '项目动态' && this.queryProjectDynamics();
  };

  render() {
    const { routes, defaultYear } = this.props;
    const {
      role = '',
      orgid = '',
      tableLoading,
      pageParam,
      data,
      xmxx = [],
      loading,
      radioKeys = '项目列表',
      //项目动态信息-付款信息
      prjDynamicsFKInfo = [],
      totalrowsFK = 0,
      //项目动态信息-合同信息
      prjDynamicsHTInfo = [],
      totalrowsHT = 0,
      //项目动态信息-立项信息
      prjDynamicsLXInfo = [],
      totalrowsLX = 0,
      //项目动态信息-上线信息
      prjDynamicsSXInfo = [],
      totalrowsSX = 0,
      //项目动态信息-完结信息
      prjDynamicsWJInfo = [],
      totalrowsWJ = 0,
      //项目动态信息-信委会信息
      prjDynamicsXWHInfo = [],
      totalrowsXWH = 0,
      //项目动态信息-总办会信息
      prjDynamicsZBHInfo = [],
      totalrowsZBH = 0,
      statisticYearData = {},
    } = this.state;

    return (
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="project-build-box cont-box">
          <TopConsole
            routes={routes}
            getStatisticYear={() => (
              <StatisticYear
                userRole={role}
                defaultYear={defaultYear}
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
                      radioKeys === '项目列表' && this.fetchRole(year);
                      radioKeys === '项目动态' && this.queryProjectDynamics(year);
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
          <div className="overview-box">
            {data.map((item, index) => {
              return (
                <Overview
                  routes={routes}
                  defaultYear={statisticYearData.currentYear}
                  role={role}
                  orgid={orgid}
                  key={index}
                  data={item}
                  order={index}
                />
              );
            })}
          </div>
          {radioKeys === '项目动态' && (
            <div className="top-tabs-boxs">
              <Radio.Group
                defaultValue="项目动态"
                buttonStyle="solid"
                onChange={this.handleRadioChange}
              >
                <Radio.Button value="项目列表">
                  <i className="iconfont icon-xmlb" />
                  项目列表
                </Radio.Button>
                <Radio.Button value="项目动态">
                  <i className="iconfont icon-xmdt" />
                  项目动态
                </Radio.Button>
              </Radio.Group>
            </div>
          )}
          {radioKeys === '项目动态' && (
            <ProjectDynamics
              //项目动态信息-付款信息
              routes={routes}
              prjDynamicsFKInfo={prjDynamicsFKInfo}
              totalrowsFK={totalrowsFK}
              //项目动态信息-合同信息
              prjDynamicsHTInfo={prjDynamicsHTInfo}
              totalrowsHT={totalrowsHT}
              //项目动态信息-立项信息
              prjDynamicsLXInfo={prjDynamicsLXInfo}
              totalrowsLX={totalrowsLX}
              //项目动态信息-上线信息
              prjDynamicsSXInfo={prjDynamicsSXInfo}
              totalrowsSX={totalrowsSX}
              //项目动态信息-完结信息
              prjDynamicsWJInfo={prjDynamicsWJInfo}
              totalrowsWJ={totalrowsWJ}
              //项目动态信息-信委会信息
              prjDynamicsXWHInfo={prjDynamicsXWHInfo}
              totalrowsXWH={totalrowsXWH}
              //项目动态信息-总办会信息
              prjDynamicsZBHInfo={prjDynamicsZBHInfo}
              totalrowsZBH={totalrowsZBH}
              defaultYear={statisticYearData.currentYear}
            />
          )}
          {radioKeys === '项目列表' && (
            <InfoTable
              xmxx={xmxx}
              routes={routes}
              role={role}
              pageParam={pageParam}
              tableLoading={tableLoading}
              defaultYear={statisticYearData.currentYear}
              radioKeys={radioKeys}
              fetchData={this.queryProjectGeneralInfo}
              handleRadioChange={this.handleRadioChange}
            />
          )}
        </div>
      </Spin>
    );
  }
}

export default ProjectBuilding;
