import React, { Component, Fragment } from 'react';
import { List,} from 'antd';
import { connect } from 'dva';
/**
 * 绩效考核列表项
 */
class AppraisalPlanListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handelListItemClick=(item) => {
    const { handelListItemClick } = this.props;
    if (typeof handelListItemClick === 'function') {
      handelListItemClick(item);
    }
  }
  handleDelete=(e, item) => {
    e.stopPropagation();
    const { handleDelete } = this.props;
    if (typeof handleDelete === 'function') {
      handleDelete(item);
    }
  }
  render() {
    const { item = {}, selectedId, pageType='' } = this.props;
    const { authorities: { PrfmProgram = [],PrfmProgramEmp=[] } } = this.props;
   
    return (
      <Fragment>
        <List.Item
          onClick={() => this.handelListItemClick(item)}
          className={selectedId === item.id ? 'active' : ''}
          key={item.id}
        >
          <List.Item.Meta
            title={(
              <div className="dis-fx">
                <a className="flex ml10" href="#" onClick={(e) => { e.preventDefault(); }}>
                  {item.tmplName}
                </a>
{     (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'dlt'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'dlt')))&&(
    <a className="ml10 mr10 delete-icon" onClick={e => this.handleDelete(e, item)}><i className="iconfont icon-shanchu fs-inherit" /></a>
    )}
             </div>)}
            description={<div className="ml10">{item.orgName}</div>}
          />
        </List.Item>
      </Fragment>
    );
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(AppraisalPlanListItem) ;

