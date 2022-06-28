import React, { Fragment, Component } from 'react';
import { Card, } from 'antd';
import { connect } from 'dva';
import SearchComponent from './SearchComponent';
import AppraisalPlanList from './AppraisalPlanList';
import AddPlanDropdwon from './AddPlanDropdwon';

/**
 * 左侧搜索以及考核列表
 */
class SearchAndListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { authorities: { PrfmProgram = [],PrfmProgramEmp=[] } } = this.props;
    const {
      handlePageChange,
      handleDelete,
      handelListItemClick,
      handleListSearch,
      handlePlanAdd,
      selectedId,
      pagination,
      planList,
      pageType,
    } = this.props;
 return (
      <Fragment>
        <Card
          className="m-card h100"
          bodyStyle={{ height: 'calc(100% - 65px)' }}
          title={
            <div className="dis-fx">
              <div className="dis-fx alc fwb">{pageType === '1' ? '绩效考核方案' : '个人绩效考核方案'}</div>
            </div>
          }
          extra={
           (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'add'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'add')))&&(
            <div id="appraisal-add-plan-dropdown">
              <AddPlanDropdwon handlePlanAdd={handlePlanAdd} />
            </div>
           )
          }
        >
          <div className="h100">
            <div style={{ padding: '1rem 16px 0' }}>
              <SearchComponent handleListSearch={handleListSearch} />
            </div>
            <div style={{ height: 'calc(100% - 45px)', padding: '1rem 16px 0' }}>
              <AppraisalPlanList
                pageType={pageType}
                planList={planList}
                handlePageChange={handlePageChange}
                handleDelete={handleDelete}
                handelListItemClick={handelListItemClick}
                selectedId={selectedId}
                pagination={pagination}
              />
            </div>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(SearchAndListComponent) ;
