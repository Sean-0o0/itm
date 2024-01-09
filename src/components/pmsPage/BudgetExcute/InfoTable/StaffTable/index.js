import React, { Component } from 'react';
import { Table, Pagination, message, Tooltip, Drawer, Spin } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'moment/locale/zh-cn';
import { EncryptBase64 } from '../../../../Common/Encrypt';
import {
  QueryBudgetOverviewInfo,
  QueryBudgetStatistics,
} from '../../../../../services/pmsServices';

class StaffTable extends Component {
  state = {
    subTabData: {},
    loading: {},
    drawerData: [],
    drawerVisible: false,
    drawerSpinning: false,
  };

  handleChange = (current, pageSize) => {
    const { fetchData, queryType, pageParam } = this.props;
    if (fetchData) {
      fetchData(queryType, {
        ...pageParam,
        current: current,
        pageSize: pageSize,
        total: -1,
      });
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { fetchData, queryType, pageParam } = this.props;
    console.log('sortersorter', sorter);
    const { order = '', field = '' } = sorter;
    if (fetchData) {
      fetchData(queryType, {
        ...pageParam,
        total: -1,
        sort: order
          ? `${field} ${order.slice(0, -3)},${queryType === 'MX_QT' ? 'XMID' : 'YSID'} DESC`
          : '',
      });
    }
  };

  queryBudgetOverviewInfo = ysid => {
    this.setState({
      loading: {
        ...this.state.loading,
        [ysid]: true,
      },
    });
    const { role, orgid, queryType } = this.props;
    QueryBudgetOverviewInfo({
      ysid: ysid,
      org: orgid,
      queryType: queryType,
      role: role,
      year: this.props.defaultYear,
    })
      .then(res => {
        const { code = 0, note = '', zbysxmxx, fzbysxmxx, kyysxmxx } = res;
        if (code > 0) {
          let data = [];
          if (queryType === 'MX_ZB') {
            data = JSON.parse(zbysxmxx);
          } else if (queryType === 'MX_FZB') {
            data = JSON.parse(fzbysxmxx);
          } else if (queryType === 'MX_KY') {
            data = JSON.parse(kyysxmxx);
          }
          this.setState({
            subTabData: {
              ...this.state.subTabData,
              [ysid]: data,
            },
            loading: {
              ...this.state.loading,
              [ysid]: false,
            },
          });
        } else {
          message.error(note);
          this.setState({
            loading: {
              ...this.state.loading,
              [ysid]: false,
            },
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: {
            ...this.state.loading,
            [ysid]: false,
          },
        });
        message.error('查询项目详情失败');
      });
  };

  onExpand = (expanded, record) => {
    const { YSID } = record;
    if (expanded === false) {
      // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
      // 因此在每次合并的时候讲相应键值下的数据清空
      this.setState({
        subTabData: {
          ...this.state.subTabData,
          [YSID]: [],
        },
      });
    } else {
      this.queryBudgetOverviewInfo(YSID);
    }
  };

  expandedRowRender = (record, index, indent, expanded) => {
    const { YSID } = record;
    const { routes } = this.props;
    const { subTabData = {}, loading = {} } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'XMID',
        width: '5%',
        key: 'XMID',
        align: 'center',
        ellipsis: true,
        render: (value, row, index) => {
          return '';
        },
      },
      {
        title: '项目名称',
        dataIndex: 'XMMC',
        width: '25%',
        key: 'XMMC',
        ellipsis: true,
        render: (text, row, index) => {
          const { XMID = '' } = row;
          return (
            <div title={text}>
              <Tooltip title={text} placement="topLeft">
                <Link
                  className="opr-btn"
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: XMID,
                      }),
                    )}`,
                    state: {
                      routes: routes,
                    },
                  }}
                >
                  {text}
                </Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '总预算(万元)',
        dataIndex: 'ZYS',
        width: '17%',
        key: 'ZYS',
        ellipsis: true,
        align: 'right',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '可执行预算(万元)',
        dataIndex: 'KZXYS',
        width: '17%',
        key: 'KZXYS',
        ellipsis: true,
        align: 'right',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        render: (value, row, index) => {
          return value ? getAmountFormat(value) : 0;
        },
      },
      {
        title: '已执行预算(万元)',
        dataIndex: 'YZXYS',
        width: '17%',
        key: 'YZXYS',
        ellipsis: true,
        align: 'right',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        render: (value, row, index) => {
          return value ? getAmountFormat(value) : 0;
        },
      },
      {
        title: '预计执行率',
        dataIndex: 'YJZXL',
        width: '17%',
        key: 'YJZXL',
        align: 'right',
        ellipsis: true,
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        render: (value, row, index) => {
          const { YZXYS, KZXYS } = row;
          let rate = (Number.parseFloat(YZXYS) * 100) / Number.parseFloat(KZXYS);
          rate = rate && !isNaN(rate) ? rate.toFixed(2) : '0';
          return rate ? rate + '%' : '';
        },
      },
    ];

    return (
      <Table
        loading={loading[YSID]}
        showHeader={false}
        columns={columns}
        dataSource={subTabData[YSID]}
        pagination={false}
      />
    );
  };

  //显示付款详情
  openDrawer = budgetId => {
    if (['MX_ZB', 'MX_FZB'].includes(this.props.queryType)) {
      this.setState({
        drawerSpinning: true,
      });
      QueryBudgetStatistics({
        budgetType: this.props.queryType === 'MX_ZB' ? 'ZB' : 'FZB',
        budgetId,
        current: 1,
        pageSize: 9999,
        paging: -1,
        queryType: 'FKXQ',
        sort: '',
        total: -1,
        year: moment().year(),
      })
        .then(res => {
          if (res?.success) {
            this.setState({
              drawerData: JSON.parse(res.payInfo),
              drawerVisible: true,
              drawerSpinning: false,
            });
          }
        })
        .catch(e => {
          console.error('🚀付款详情', e);
          message.error('付款详情信息获取失败', 1);
          this.setState({
            drawerSpinning: false,
          });
        });
    }
  };

  render() {
    const {
      tableLoading = false,
      bgxx: tableData = [],
      pageParam = {},
      routes = [],
      queryType,
      ysglxx = {},
    } = this.props;
    // console.log('🚀 ~ file: index.js:250 ~ StaffTable ~ render ~  tableData:', tableData);
    const { current = 1, pageSize = 10 } = pageParam;
    const { drawerData = [], drawerVisible, drawerSpinning } = this.state;
    //金额格式化
    const getAmountFormat = value => {
      if ([undefined, null, '', ' ', NaN].includes(value)) return '';
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const columns =
      queryType === 'MX_QT'
        ? [
            {
              title: '项目名称',
              dataIndex: 'XMMC',
              // width: '20%',
              key: 'XMMC',
              ellipsis: true,
              render: (txt, row, index) => {
                return (
                  <Tooltip title={txt} placement="topLeft">
                    <Link
                      style={{ color: '#3361ff' }}
                      onClick={() =>
                        this.setState({
                          drawerVisible: false,
                        })
                      }
                      to={{
                        pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                          JSON.stringify({
                            xmid: row.XMID,
                          }),
                        )}`,
                        state: {
                          routes,
                        },
                      }}
                      className="table-link-strong"
                    >
                      {txt}
                    </Link>
                  </Tooltip>
                );
              },
            },
            {
              title: '项目经理',
              dataIndex: 'XMJL',
              width: '8%',
              key: 'XMJL',
              ellipsis: true,
              render: (txt, row) => (
                <Link
                  style={{ color: '#3361ff' }}
                  onClick={() =>
                    this.setState({
                      drawerVisible: false,
                    })
                  }
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: row.XMJLID,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  className="table-link-strong"
                >
                  {txt}
                </Link>
              ),
            },
            {
              title: '合同金额(万元)',
              dataIndex: 'HTJE',
              width: '13%',
              align: 'right',
              key: 'HTJE',
              ellipsis: true,
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: txt => <span>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>,
            },
            {
              title: '已付款金额(万元)',
              dataIndex: 'FKJE',
              width: '14%',
              align: 'right',
              key: 'FKJE',
              ellipsis: true,
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: txt => <span>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>,
            },
            {
              title: '关联预算项目',
              dataIndex: 'YSXM',
              width: '20%',
              key: 'YSXM',
              ellipsis: true,
              render: txt => (
                <Tooltip title={txt} placement="topLeft">
                  <span style={{ cursor: 'default' }}>{txt}</span>
                </Tooltip>
              ),
            },
            {
              title: '预算项目负责人',
              dataIndex: 'YSXMFZR',
              width: '12%',
              key: 'YSXMFZR',
              ellipsis: true,
              render: (txt, row) => (
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: row.YSXMFZRID,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  className="table-link-strong"
                >
                  {txt}
                </Link>
              ),
            },
            {
              title: '可执行预算(万元)',
              dataIndex: 'KZXYS',
              width: '14%',
              key: 'KZXYS',
              ellipsis: true,
              align: 'right',
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: (value, row, index) => {
                return value ? getAmountFormat(value) : 0;
              },
            },
          ]
        : [
            {
              title: '序号',
              dataIndex: 'RYID',
              width: '5%',
              key: 'RYID',
              align: 'center',
              ellipsis: true,
              render: (value, row, index) => {
                return (current - 1) * pageSize + index + 1;
              },
            },
            {
              title: '预算项目名称',
              dataIndex: 'YSXMMC',
              key: 'YSXMMC',
              ellipsis: true,
              render: (txt, row) => (
                <Tooltip title={txt} placement="topLeft">
                  {['MX_ZB', 'MX_FZB'].includes(this.props.queryType) ? (
                    <a
                      style={{ color: '#3361ff' }}
                      onClick={() => this.openDrawer(Number(row.YSID))}
                    >
                      {txt}
                    </a>
                  ) : (
                    txt
                  )}
                </Tooltip>
              ),
            },
            {
              title: '预算类别',
              dataIndex: 'YSLB',
              key: 'YSLB',
              ellipsis: true,
              render: txt => (
                <Tooltip
                  title={txt ? this.props.YSLB?.find(x => x.ibm === txt)?.note : ''}
                  placement="topLeft"
                >
                  <span style={{ cursor: 'default' }}>
                    {txt ? this.props.YSLB?.find(x => x.ibm === txt)?.note : ''}
                  </span>
                </Tooltip>
              ),
            },
            {
              title: queryType === 'MX_KY' ? '预算项目负责部门' : '预算项目负责人',
              dataIndex: 'YSXMFZR',
              width: '12%',
              key: 'YSXMFZR',
              ellipsis: true,
              render: (txt, row) =>
                queryType === 'MX_KY' ? (
                  txt
                ) : (
                  <Link
                    style={{ color: '#3361ff' }}
                    to={{
                      pathname: `/pms/manage/staffDetail/${EncryptBase64(
                        JSON.stringify({
                          ryid: row.YSXMFZRID,
                        }),
                      )}`,
                      state: {
                        routes,
                      },
                    }}
                    className="table-link-strong"
                  >
                    {txt}
                  </Link>
                ),
            },
            {
              title: '总预算(万元)',
              dataIndex: 'ZYS',
              width: '11%',
              key: 'ZYS',
              ellipsis: true,
              align: 'right',
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: (value, row, index) => {
                return value ? getAmountFormat(value) : 0;
              },
            },
            {
              title: '可执行预算(万元)',
              dataIndex: 'KZXYS',
              width: '14%',
              key: 'KZXYS',
              ellipsis: true,
              align: 'right',
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: (value, row, index) => {
                return value ? getAmountFormat(value) : 0;
              },
            },
            {
              title: '已执行预算(万元)',
              dataIndex: 'YZXYS',
              width: '14%',
              key: 'YZXYS',
              ellipsis: true,
              align: 'right',
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: (value, row, index) => {
                return value ? getAmountFormat(value) : 0;
              },
            },
            {
              title: '预算执行率',
              dataIndex: 'YJZXL',
              width: '10%',
              key: 'YJZXL',
              align: 'right',
              ellipsis: true,
              sorter: true,
              sortDirections: ['descend', 'ascend'],
              render: (value, row, index) => {
                return value ? value + '%' : '';
              },
            },
          ];
    const drawerColumns = [
      {
        title: '项目名称',
        dataIndex: 'XMMC',
        // width: '20%',
        key: 'XMMC',
        ellipsis: true,
        render: (txt, row, index) => {
          return (
            <Tooltip title={txt} placement="topLeft">
              <Link
                style={{ color: '#3361ff' }}
                onClick={() =>
                  this.setState({
                    drawerVisible: false,
                  })
                }
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: row.XMID,
                    }),
                  )}`,
                  state: {
                    routes,
                  },
                }}
                className="table-link-strong"
              >
                {txt}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: '项目经理',
        dataIndex: 'XMJL',
        width: '10%',
        key: 'XMJL',
        ellipsis: true,
        render: (txt, row) => (
          <Link
            style={{ color: '#3361ff' }}
            onClick={() =>
              this.setState({
                drawerVisible: false,
              })
            }
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.XMJLID,
                }),
              )}`,
              state: {
                routes,
              },
            }}
            className="table-link-strong"
          >
            {txt}
          </Link>
        ),
      },
      {
        title: '合同金额(元)',
        dataIndex: 'HTJE',
        width: '15%',
        align: 'right',
        key: 'HTJE',
        ellipsis: true,
        sorter: (a, b) => Number(a.HTJE || 0) - Number(b.HTJE || 0),
        sortDirections: ['descend', 'ascend'],
        render: txt => <span>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>,
      },
      {
        title: '已付款金额(元)',
        dataIndex: 'YFKJE',
        width: '17%',
        align: 'right',
        key: 'YFKJE',
        ellipsis: true,
        sorter: (a, b) => Number(a.YFKJE || 0) - Number(b.YFKJE || 0),
        sortDirections: ['descend', 'ascend'],
        render: txt => <span>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>,
      },
      {
        title: '未付款金额(元)',
        dataIndex: 'WFKJE',
        width: '17%',
        align: 'right',
        key: 'WFKJE',
        ellipsis: true,
        sorter: (a, b) => Number(a.WFKJE || 0) - Number(b.WFKJE || 0),
        sortDirections: ['descend', 'ascend'],
        render: txt => <span>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>,
      },
      {
        title: '付款时间',
        dataIndex: 'FKSJ',
        width: '15%',
        key: 'FKSJ',
        ellipsis: true,
        sorter: (a, b) => Number(a.FKSJ || 0) - Number(b.FKSJ || 0),
        sortDirections: ['descend', 'ascend'],
        render: txt =>
          !['', ' ', -1, '-1', undefined, null].includes(txt)
            ? moment(txt).format('YYYY-MM-DD')
            : '',
      },
    ];
    const tableFooter = () => {
      let columnArr = [
        {
          width: '51%',
          key: 'GJ',
          value: '合计：',
          align: 'center',
          style: {
            backgroundColor: '#f5f7fa',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 'bold',
            color: '#606266',
            borderRight: '1px solid #e8e8e8',
          },
        },
        {
          width: '11%',
          key: 'ZYS',
          value:
            tableData.length > 0
              ? queryType === 'MX_FZB'
                ? getAmountFormat(Number(ysglxx.FZBZYS))
                : queryType === 'MX_KY'
                ? getAmountFormat(Number(ysglxx.KYMBZ))
                : getAmountFormat(Number(ysglxx.ZBYSZYS))
              : '',
          align: 'right',
        },
        {
          width: '14%',
          key: 'KZXYS',
          align: 'right',
          value:
            tableData.length > 0
              ? queryType === 'MX_FZB'
                ? getAmountFormat(Number(ysglxx.FZBMBZ))
                : queryType === 'MX_KY'
                ? getAmountFormat(Number(ysglxx.KYYSKZX))
                : getAmountFormat(Number(ysglxx.ZBRJMBZ))
              : '',
        },
        {
          width: '14%',
          key: 'YZXYS',
          align: 'right',
          value:
            tableData.length > 0
              ? queryType === 'MX_FZB'
                ? getAmountFormat(Number(ysglxx.FZBWCZ))
                : queryType === 'MX_KY'
                ? getAmountFormat(Number(ysglxx.KYYSYZX))
                : getAmountFormat(Number(ysglxx.ZBRJWCZ))
              : '',
        },
        {
          width: '10%',
          key: 'YJZXL',
          align: 'right',
          value:
            tableData.length > 0
              ? queryType === 'MX_FZB'
                ? Number(ysglxx.FZBWCL) + '%'
                : queryType === 'MX_KY'
                ? Number(ysglxx.KYYSZXL) + '%'
                : Number(ysglxx.ZBRJWCL) + '%'
              : '',
        },
      ];
      if (queryType === 'MX_QT' && tableData.length > 0)
        columnArr = [
          {
            width: '27%',
            key: 'HTJ',
            value: '合计：',
            align: 'center',
            style: {
              backgroundColor: '#f5f7fa',
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              fontWeight: 'bold',
              color: '#606266',
              borderRight: '1px solid #e8e8e8',
            },
          },
          {
            width: '13%',
            key: 'HTJE',
            value: getAmountFormat(Number(tableData[0].HTJEZJE)),
            align: 'right',
          },
          {
            width: '14%',
            key: 'YFKJE',
            align: 'right',
            value: getAmountFormat(Number(tableData[0].FKZJE)),
          },
          {
            width: '20%',
            key: 'BLANK',
            value: '',
            align: 'right',
          },
          {
            width: '12%',
            key: 'BLANK2',
            value: '',
            align: 'right',
          },
          {
            width: '14%',
            key: 'KZXYS',
            align: 'right',
            value: getAmountFormat(Number(tableData[0].KZXYSZJE)),
          },
        ];
      return (
        <div className="budget-excute-table-footer">
          {columnArr.map(x => (
            <div
              key={x.key}
              style={{
                width: x.width,
                textAlign: x.align,
                ...(x.style ?? {}),
              }}
            >
              {x.value}
            </div>
          ))}
        </div>
      );
    };
    return (
      <div className="table-box">
        <Spin spinning={drawerSpinning}>
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              class="components-table-demo-nested"
              // expandedRowRender={this.expandedRowRender}
              // onExpand={(expanded, record) => this.onExpand(expanded, record)}
              // expandIconColumnIndex={1}
              // expandIconAsCell={false}
              footer={tableFooter}
              rowKey={(row, index) => index + queryType + this.props.defaultYear}
              dataSource={tableData}
              onChange={this.handleTableChange}
              pagination={false}
            />
          </div>
          <div className="page-individual">
            {tableData.length !== 0 && (
              <Pagination
                onChange={this.handleChange}
                onShowSizeChange={this.handleChange}
                pageSize={pageParam.pageSize}
                current={pageParam.current}
                total={pageParam.total}
                pageSizeOptions={['10', '20', '30', '40']}
                showSizeChanger={true}
                // hideOnSinglePage={true}
                showQuickJumper={true}
                showTotal={total => `共 ${total} 条数据`}
              />
            )}
          </div>
          <Drawer
            title="项目付款详情"
            width={850}
            onClose={() =>
              this.setState({
                drawerVisible: false,
                drawerData: [],
              })
            }
            visible={drawerVisible}
            className="budget-payment-drawer"
            maskClosable={true}
            zIndex={101}
            destroyOnClose={true}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
          >
            <Table
              columns={drawerColumns}
              rowKey={'XMMC'}
              dataSource={drawerData}
              pagination={false}
              bordered //记得注释
            />
          </Drawer>
        </Spin>
      </div>
    );
  }
}

export default StaffTable;
