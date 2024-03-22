import React, { Component, useCallback } from 'react';
import TopConsole from './TopConsole';
import Overview from './Overview';
import InfoTable from './InfoTable';
import { message, Spin, Radio } from 'antd';
import {
  QueryProjectDynamicSection,
  QueryProjectGeneralInfo,
  QueryUserRole,
} from '../../../services/pmsServices';
import ProjectDynamics from './ProjectDynamics';
import moment from 'moment';
import StatisticYear from '../SupplierSituation/StatisticYear';
import { connect } from 'dva';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
import TreeUtils from '../../../utils/treeUtils';
import {
  FetchQueryProjectLabel,
  FetchQueryOrganizationInfo,
} from '../../../services/projectManage';
import { get, debounce } from 'lodash';

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
    statisticYearData: {
      currentYear: undefined,
      dropdown: [],
    },
    dynamicData: [],
    labelData: [],
    orgData: [],
  };

  componentDidMount() {
    this.state.radioKeys === '项目列表' && this.fetchRole(this.state.statisticYearData.currentYear);
    if (this.state.radioKeys === '项目动态') {
      this.getSltData();
      this.getPrjDynamicData({
        startYear: moment(String(this.state.statisticYearData.currentYear)),
        endYear: moment(String(this.state.statisticYearData.currentYear)),
      });
    }
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

  getSltData = async () => {
    try {
      this.setState({ loading: true });
      //标签
      const labelPromise = FetchQueryProjectLabel({ type: undefined });
      //部门
      const orgPromise = FetchQueryOrganizationInfo({
        type: 'ZZJG',
      });
      const [labelRes, orgRes] = await Promise.all([labelPromise, orgPromise]);
      if (labelRes.success) {
        let labelTree = TreeUtils.toTreeData(JSON.parse(labelRes.record), {
          keyName: 'ID',
          pKeyName: 'FID',
          titleName: 'BQMC',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        });
        labelTree = get(labelTree, '[0].children[0].children', []);
        labelTree.forEach(x => setParentSelectableFalse(x));
        this.setState({
          labelData: labelTree,
        });
      }
      if (orgRes.success) {
        let orgTree = TreeUtils.toTreeData(orgRes.record, {
          keyName: 'orgId',
          pKeyName: 'orgFid',
          titleName: 'orgName',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        });
        orgTree = get(orgTree, '[0].children', []);
        this.setState({
          orgData: orgTree,
        });
      }
      // this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
      });
      console.error('下拉框数据获取失败', error);
      message.error('下拉框数据获取失败', 1);
    }
  };

  getPrjDynamicData = debounce(
    ({ stage, org, tag, projectManager, projectName, projectStatus, startYear, endYear }) => {
      this.setState({
        loading: true,
      });
      QueryProjectDynamicSection({
        stage: stage === undefined ? undefined : stage.map(x => x.id).join(',') || undefined,
        org: org === undefined ? undefined : org.map(x => x.id).join(',') || undefined,
        tag: tag === undefined ? undefined : tag.map(x => x.id).join(';') || undefined,
        projectManager: projectManager === '' ? undefined : projectManager,
        projectName: projectName === '' ? undefined : projectName,
        projectStatus: projectStatus === undefined ? undefined : projectStatus,
        startYear: startYear === undefined ? undefined : startYear?.year(),
        endYear: startYear === undefined ? undefined : endYear?.year(),
        role: this.props.roleData.role,
        queryType: 'ALL',
        current: 1,
        pageSize: 9,
        paging: -1,
        sort: '',
        total: -1,
      })
        .then(res => {
          if (res.success) {
            let result = JSON.parse(res.result);
            // console.log('🚀 ~ ProjectBuilding ~ result:', result, this.props.dictionary?.XMJZ);
            const xmjzData = this.props.dictionary?.XMJZ?.filter(
              x => !['7', '10'].includes(x.ibm),
            ).sort((a, b) => Number(a.ibm) - Number(b.ibm)); //项目阶段数据（设备采购、包件信息录入不查）
            const data = xmjzData.map(x => ({
              value: x.ibm,
              title: x.note,
              children: result.filter(r => String(r.XMJZ) === String(x.ibm)),
            }));
            // console.log('🚀 ~ ProjectBuilding ~ data ~ data:', data);
            this.setState({
              loading: false,
              dynamicData: data,
            });
          }
        })
        .catch(e => {
          this.setState({
            loading: false,
          });
          console.error('项目动态数据获取失败', e);
          message.error('项目动态数据获取失败', 1);
        });
    },
    800,
  );

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
    if (radioKeys === '项目动态') {
      this.getSltData();
      this.getPrjDynamicData({
        startYear: moment(String(this.state.statisticYearData.currentYear)),
        endYear: moment(String(this.state.statisticYearData.currentYear)),
      });
    }
  };

  render() {
    const { routes, defaultYear, dictionary } = this.props;

    const {
      role = '',
      orgid = '',
      tableLoading,
      pageParam,
      data,
      xmxx = [],
      loading,
      radioKeys = '项目列表',
      statisticYearData = {},
      dynamicData = [],
      labelData = [],
      orgData = [],
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
                      if (radioKeys === '项目动态') {
                        this.getSltData();
                        this.getPrjDynamicData({
                          startYear: moment(String(year)),
                          endYear: moment(String(year)),
                        });
                      }
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
              defaultYear={statisticYearData.currentYear}
              dataList={dynamicData}
              getPrjDynamicData={this.getPrjDynamicData}
              sltorData={{ label: labelData, org: orgData }}
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

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(ProjectBuilding);
