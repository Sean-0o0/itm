import React, { Component } from 'react';
import TopConsole from './TopConsole';
import Overview from './Overview';
import BudgetType from './BudgetType';
import InfoTable from './InfoTable';
import { message, Progress, Spin } from 'antd';
import { QueryBudgetOverviewInfo, QueryUserRole } from '../../../services/pmsServices';

class BudgetExcute extends Component {
  state = {
    role: '',
    orgid: '',
    ysglxx: {},
    tableLoading: false,
    ysqs: [],
    loading: false,
    pageParam: {
      current: 1,
      pageSize: 10,
      paging: 1,
      sort: '',
      total: -1,
    },
  };

  componentDidMount() {
    this.fetchRole();
  }

  fetchRole = () => {
    this.setState({
      loading: true,
    });
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
                this.queryHeaderInfo('MX');
                this.queryBudgetOverviewInfo('MX_ZB', pageParam);
              },
            );
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

  queryHeaderInfo = queryType => {
    const { role, orgid } = this.state;
    QueryBudgetOverviewInfo({
      org: orgid,
      queryType: queryType,
      role: role,
    }).then(res => {
      const { code = 0, note, ysglxx, ysqs } = res;
      if (code > 0) {
        const [one] = JSON.parse(ysglxx);
        this.setState({
          ysglxx: one,
          ysqs: JSON.parse(ysqs),
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        message.error(note);
      }
    });
  };

  queryBudgetOverviewInfo = (queryType, param) => {
    this.setState({
      tableLoading: true,
    });
    const { role, orgid, pageParam } = this.state;
    QueryBudgetOverviewInfo({
      org: orgid,
      queryType: queryType,
      role: role,
      ...param,
    })
      .then(res => {
        const { code = 0, note = '', total, zbysxm, fzbysxm, kyysxm } = res;
        if (code > 0) {
          let data = [];
          if (queryType === 'MX_ZB') {
            data = JSON.parse(zbysxm);
          } else if (queryType === 'MX_FZB') {
            data = JSON.parse(fzbysxm);
          } else if (queryType === 'MX_KY') {
            data = JSON.parse(kyysxm);
          } else if (queryType === 'MX_QT') {
            data = JSON.parse(zbysxm);
          }
          this.setState({
            data: data,
            tableLoading: false,
            pageParam: {
              ...pageParam,
              ...param,
              total,
            },
          });
        } else {
          message.error(note);
          this.setState({
            tableLoading: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          tableLoading: false,
        });
        message.error('查询预算概览失败');
      });
  };

  render() {
    const { routes } = this.props;
    const {
      role = '',
      orgid = '',
      ysglxx = {},
      ysqs = [],
      data = [],
      tableLoading,
      pageParam,
      loading,
    } = this.state;

    const {
      ZBRJWCZ = 0,
      ZBRJWCL = 0,
      ZBRJMBZ = 0,
      ZBRJSYZ = 0,
      ZBYJWCZ = 0,
      ZBYJWCL = 0,
      ZBYJMBZ = 0,
      ZBYJSYZ = 0,
      FZBWCZ = 0,
      FZBWCL = 0,
      FZBMBZ = 0,
      FZBSYZ = 0,
      KYWCZ = 0,
      KYWCL = 0,
      KYMBZ = 0,
      KYSYZ = 0,
      ZBRJZYS = '',
      ZBRJKZX = 0,
    } = ysglxx;
    console.log('🚀 ~ file: index.js:170 ~ BudgetExcute ~ render ~ ysglxx:', ysglxx);

    let zyswcz = Number.parseFloat(ZBRJZYS) - Number.parseFloat(ZBRJSYZ);
    let zyswcl = (Number.parseFloat(zyswcz) * 100) / Number.parseFloat(ZBRJZYS);
    zyswcz = !isNaN(zyswcz) ? zyswcz.toFixed(2) : 0;
    zyswcl = !isNaN(zyswcl) ? zyswcl.toFixed(2) : 0;

    let kzxsyz = Number.parseFloat(ZBRJKZX) - Number.parseFloat(ZBRJWCZ);
    let kzxwcl = (Number.parseFloat(ZBRJWCZ) * 100) / Number.parseFloat(ZBRJKZX);
    kzxsyz = !isNaN(kzxsyz) ? kzxsyz.toFixed(2) : 0;
    kzxwcl = !isNaN(kzxwcl) ? kzxwcl.toFixed(2) : 0;

    //金额格式化
    const getAmountFormat = value => {
      if ([undefined, null, '', ' ', NaN].includes(value)) return '';
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const getNewBgItem = (title = '--', update = '--', top = {}, bottom = {}) => {
      const getProgress = (
        rateLabel,
        executedLabel,
        executableLabel,
        { rate, executed, executable },
      ) => {
        return (
          <div className="progress-item">
            <div className="top-row">
              <div className="left-info">
                <div className="rate-label">{rateLabel}</div>
                <div className="rate">
                  {Number(rate)}
                  <span>%</span>
                </div>
              </div>
              <div className="right-info">
                <div className="executed-box">
                  <div className="left-divider"></div>
                  <div className="executed-label">{executedLabel}</div>
                  <div className="executed">
                    {getAmountFormat(Number(executed))}
                    <span>万元</span>
                  </div>
                </div>
                <div className="executable-box">
                  <div className="left-divider"></div>
                  <div className="executable-label">{executableLabel}</div>
                  <div className="executable">
                    {getAmountFormat(Number(executable))}
                    <span>万元</span>
                  </div>
                </div>
              </div>
            </div>
            <Progress
              showInfo={false}
              percent={Number(rate)}
              strokeColor={{
                from: '#BDD3FE',
                to: '#6985F7',
              }}
              strokeWidth={10}
              className="normal-process"
            />
          </div>
        );
      };
      return (
        <div className="new-bgt-item cptbudget-card-box">
          <div className="title-row">
            {title}
            {/* <div className="update">截至{update}</div> */}
          </div>
          {getProgress('执行率', '已执行预算', '可执行预算', top)}
          {getProgress('立项率', '已立项预算', '总预算', bottom)}
        </div>
      );
    };

    return (
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="buget-excute-box cont-box" style={{ height: 'auto' }}>
          <TopConsole routes={routes} />
          <div className="overview-box">
            {/* <div className='cont-block staff-overview' style={{ width: 'calc(50% - 24px)', marginRight: '24px' }}>
                    <div className='title'>资本性预算</div>
                    <div style={{display: 'flex'}}>
                        <BudgetType title='总预算(万元)' wcz={!isNaN(zyswcz)?zyswcz:0} wcl={zyswcl} mbz={ZBRJZYS} syz={ZBRJSYZ} type='left'/>
                        <BudgetType title='可执行总预算(万元)' wcz={ZBRJWCZ} wcl={kzxwcl} mbz={ZBRJKZX} syz={kzxsyz} type='left' remainLabel='未付款'/>
                    </div>
                </div>
                <div className='cont-block staff-overview' style={{ width: 'calc(25% - 12px)', marginRight: '24px' }}>
                    <div className='title'>非资本性预算</div>
                    <BudgetType title='已执行预算(万元)' wcz={FZBWCZ} wcl={FZBWCL} mbz={FZBMBZ} syz={FZBSYZ} />
                </div>
                <div className='cont-block staff-overview' style={{ width: 'calc(25% - 12px)' }}>
                    <div className='title'>科研预算</div>
                    <BudgetType title='已执行预算(万元)' wcz={KYWCZ} wcl={KYWCL} mbz={KYMBZ} syz={KYSYZ} />
                </div> */}
            {getNewBgItem(
              '资本性预算',
              'time',
              { rate: ysglxx.ZBRJWCL, executed: ysglxx.ZBRJWCZ, executable: ysglxx.ZBRJMBZ },
              { rate: ysglxx.ZBYSLXL, executed: ysglxx.ZBYSLXZ, executable: ysglxx.ZBYSZYS },
            )}
            {getNewBgItem(
              '非资本性预算',
              'time',
              { rate: ysglxx.FZBWCL, executed: ysglxx.FZBWCZ, executable: ysglxx.FZBMBZ },
              { rate: ysglxx.FZBLXL, executed: ysglxx.FZBLXZ, executable: ysglxx.FZBZYS },
            )}
            {getNewBgItem(
              '科研预算',
              'time',
              { rate: ysglxx.KYYSZXL, executed: ysglxx.KYYSYZX, executable: ysglxx.KYYSKZX },
              { rate: ysglxx.KYWCL, executed: ysglxx.KYWCZ, executable: ysglxx.KYMBZ },
            )}
          </div>
          <Overview title="项目研发投入情况" ysqs={ysqs} />
          <InfoTable
            orgid={orgid}
            routes={routes}
            role={role}
            pageParam={pageParam}
            tableLoading={tableLoading}
            data={data}
            fetchData={this.queryBudgetOverviewInfo}
            ysglxx={ysglxx}
          />
        </div>
      </Spin>
    );
  }
}

export default BudgetExcute;
