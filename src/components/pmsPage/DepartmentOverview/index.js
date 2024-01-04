import React, { Component } from 'react';
import TopConsole from './TopConsole';
import Overview from './Overview';
import InfoTable from './InfoTable';
import { message } from 'antd';
import { QueryMemberOverviewInfo, QueryUserRole } from '../../../services/pmsServices';
import ProjectMemberStatisticsInfo from '../ProjectMemberStatisticsInfo';

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
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.defaultYear !== prevProps.defaultYear) {
      this.fetchRole();
    }
  }

  componentDidMount() {
    this.fetchRole();
  }

  handleRadioChange = e => {
    console.log('keykey', e.target.value);
    this.setState({
      radioKey: e.target.value,
    });
  };

  fetchRole = () => {
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
                this.queryMemberOverviewInfo('MX_ALL_ONE', '', pageParam);
              },
            );
          }
        })
        .catch(err => {
          message.error('查询人员角色失败');
        });
    }
  };

  queryMemberOverviewInfo = (queryType, gwbm, param) => {
    const { role, orgid, pageParam } = this.state;
    this.setState({
      tableLoading: true,
    });
    QueryMemberOverviewInfo({
      org: orgid,
      orgStation: gwbm,
      queryType: queryType,
      role: role,
      year: this.props.defaultYear,
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
    const { routes } = this.props;
    const {
      role = '',
      bmry = [],
      wbry = [],
      gwfb = [],
      bgxx = [],
      tableLoading,
      pageParam,
      radioKey,
    } = this.state;

    console.log('radioKeyradioKey', this.state);

    return (
      <div className="department-staff-box cont-box">
        {radioKey === '项目列表' ? (
          <TopConsole routes={routes} handleRadioChange={this.handleRadioChange} />
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
            defaultYear={this.props.defaultYear}
          />
        ) : (
          <ProjectMemberStatisticsInfo handleRadioChange={this.handleRadioChange} defaultYear={this.props.defaultYear} />
        )}
      </div>
    );
  }
}

export default DepartmentOverview;
