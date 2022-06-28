import React, { Fragment, Component } from 'react';
import { List } from 'antd';
import AppraisalPlanListItem from './AppraisalPlanListItem';

/**
 * 绩效考核方案列表
 */
class AppraisalPlanList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handlePageChange=(page) => {
    const { handlePageChange } = this.props;
    if (typeof handlePageChange === 'function') {
      handlePageChange(page);
    }
  }
  render() {
    const { handleDelete, handelListItemClick, selectedId, pagination = {}, planList = [],pageType='' } = this.props;
    const newDataSource = [...planList];
    return (
      <Fragment>
        <List
          className="esa-appraisal-list h100"
          style={{ overflow: 'auto', paddingBottom: '1rem' }}
          dataSource={newDataSource}
          locale={{ emptyText: '' }}
          renderItem={
            (item) => {
              return (
                <AppraisalPlanListItem
                  pageType={pageType}
                  item={item}
                  handleDelete={handleDelete}
                  handelListItemClick={handelListItemClick}
                  selectedId={selectedId}
                />
              );
            }
          }
          pagination={
            {
              className: 'm-paging',
              size: 'small',
              showLessItems: true,
              onChange: page => this.handlePageChange(page),
              hideOnSinglePage: true,
              ...pagination,
            }
          }
        />
      </Fragment>
    );
  }
}

export default AppraisalPlanList;
