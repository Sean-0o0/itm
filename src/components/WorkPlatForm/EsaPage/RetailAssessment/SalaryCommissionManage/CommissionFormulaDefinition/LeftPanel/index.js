import React, { Fragment } from 'react';
import { Card, List, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import UpdateFormulaModel from '../UpdateFormulaModel';
import SearchForm from './SearchForm';
import Delete from './delete';

/**
 * 左侧 列表
 */

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
  }

  // 新增公式
  onHandleClick = () => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  // 弹窗取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 弹窗确定
  handleConfirm = () => {
    this.setState({
      visible: false,
    });
  }

  // 点击列表
  itemOnclick = (item) => {
    this.props.getdata(item);
  }

  handlePageChange = (page) => {
    const { handlePageChange } = this.props;
    if (typeof handlePageChange === 'function') {
      handlePageChange(page);
    }
  }

  render() {
    const { visible } = this.state;
    const { dataList, handleSearch, refreshLeftList } = this.props;
    const modalProps = {
      isAllWindow: 1,
      width: '105rem',
      title: '提成公式-新增',
      style: { top: '2rem' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    // 设置最小高度
    const { data = {}, pagination = {}, versionId = '' , st = ''} = this.props;
    return (
      <Fragment>
        <Card
          className="m-card m-card-right m-card-pay h100"
          bodyStyle={{ height: 'calc(100% - 65px)' }}
          title="公式模板"
          extra={st !== '2' && (
            <div style={{ height: '32px', lineHeight: '32px', float: 'right' }}>
              <a className="m-color" onClick={this.onHandleClick}>
                <i className="iconfont icon-add fs-inherit" />&nbsp;新增
              </a>
            </div>)}
        >
          <div className="dis-fx m-pay-search-box">
            <div className="flex m-form ant-form">
              <SearchForm handleSearch={handleSearch} />
            </div>
          </div>
          <div style={{ height: 'calc(100% - 65px)', padding: '1rem 10px 5px 5px' }}>
            <List
              className="m-list-tab-info m-list-info-pay esa-list-first-child h100"
              locale={{ emptyText: '' }}
              style={{ overflow: 'auto' }}
              split
              dataSource={dataList}
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
              renderItem={item => (
                <List.Item
                  className={data.id === item.id ? 'active' : ''}
                >
                  <List.Item.Meta
                    title={
                      <div className="m-pay-list-top">
                        <div className="m-pay-title">{item.tmplName}</div>
                        <Delete refresh={refreshLeftList} gsid={item.id} versionId={versionId} st={st}/>
                      </div>
                    }
                    description={<div>{item.takeClass || '--'}</div>}
                    onClick={() => { this.itemOnclick(item); }}
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>
        <BasicModal {...modalProps}>
          <div style={{ height: '51rem', overflow: 'auto' }}>
            <UpdateFormulaModel versionId={versionId} handleConfirm={this.handleConfirm} handleCancel={this.handleCancel} refreshLeftList={refreshLeftList} />
          </div>
        </BasicModal>
      </Fragment>
    );
  }
}
export default LeftPanel;
