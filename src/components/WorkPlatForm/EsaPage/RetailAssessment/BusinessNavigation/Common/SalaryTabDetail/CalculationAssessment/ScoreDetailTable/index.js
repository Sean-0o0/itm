import React, { Fragment } from 'react';
import FetchDataTable from '../../../../../../../../Common/FetchDataTable';
import { FetchqueryExamIndiDetl } from '../../../../../../../../../services/EsaServices/navigation';

/**
 *  客户经理薪酬考核导航-计算考核-得分详细表格组件
 */

class ScoreDetailTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  fetchColumns = () => {
    const livebosPrefix = localStorage.getItem('livebos');
    const detailColumns = [
      {
        title: '营业部',
        dataIndex: 'orgName',
        key: 'orgName',
        align: 'center',
      },
      {
        title: '部门类别',
        dataIndex: 'depClassName',
        key: 'depClassName',
        align: 'center',
      },
      {
        title: '月份',
        dataIndex: 'mon',
        key: 'mon',
        align: 'center',
      },
      {
        title: '人员编号',
        dataIndex: 'empNo',
        key: 'empNo',
        align: 'center',
      },
      {
        title: '人员姓名',
        dataIndex: 'empName',
        key: 'empName',
        align: 'center',
      },
      {
        title: '考核指标代码',
        dataIndex: 'indiCode',
        key: 'indiCode',
        align: 'center',
      },
      {
        title: '考核指标名称',
        dataIndex: 'indiName',
        key: 'indiName',
        align: 'center',
      },
      {
        title: '考核指标值',
        dataIndex: 'indiVal',
        key: 'indiVal',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (value, row) => (
          <a
            className="m-color"
            href={`${livebosPrefix}/UIProcessor?Table=cxEXAM_CUST_INDI_DETL_TAB&ORG_ID=${row.orgId}&MON=${row.mon}&empNo=${row.empNo}&INDI_ID=${row.indiCode}&depClass=${row.depClass}&ParamAction=true`}
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
          >
            查看明细
          </a>
        ),
      },
    ];
    return detailColumns;
  }
  render() {
    const { mon, orgNo, depClass, refreshNum, empNo } = this.props;
    const tableProps = {
      columns: this.fetchColumns(),
      locale: { emptyText: '暂无数据' },
      fetch: {
        service: orgNo ? FetchqueryExamIndiDetl : null,
        params: {
          mon,
          orgNo,
          depClass,
          paging: 0,
          empNo,
          refreshNum,
        },
      },
      isPagination: true,
    };
    return (
      <Fragment>
        <div className="esa-salaryNavigation-title" style={{ marginTop: '30px', fontSize: '15px' }}>得分详细</div>
        <FetchDataTable {...tableProps} />
      </Fragment >
    );
  }
}
export default ScoreDetailTable;
