import React, { Component, Fragment } from 'react';
import { Card, List, Icon, message, Modal } from 'antd';
import {  FetchOperateSubjectDataDetail } from '../../../../../../../../services/EsaServices/commissionManagement'

class LeftPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleAdd = () => {

  }

  commitForm = (payload) => {
    const { fetchData, sbjDataId } = this.props;
    FetchOperateSubjectDataDetail({ ...payload }).then((response) => {
      const {code, note} =response;
      if (code < 0) {
        message.error(note);
      } else {
        fetchData(sbjDataId);
        message.success("删除成功！");
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    
  }

  // eslint-disable-next-line no-unused-vars
  handleDelete = (sbjDataDtlId) => {
    // id不为空时调用 删除接口
    const { sbjDataId } = this.props;
    const payload={
      sbjDataDtlId: sbjDataDtlId,
      sbjDataId: sbjDataId,
      oprType: 3
    }
    return new Promise((resolve) => {
      Modal.confirm({
        title: '提示',
        content: '是否删除本条数据？',
        onOk: () => {
          resolve(true);
          this.commitForm(payload);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
    

  }

  itemOnclick = (sbjDataDtlItem) => {
    // 选择列表项
    const { itemOnclick } = this.props;
    if (itemOnclick) {
      itemOnclick(sbjDataDtlItem);
    }
  }
  handleClick = () => {
    const { addColumn } = this.props;
    if (addColumn) {
      addColumn();
    }
  }
  render() {
    const { basicDataCol = [], selectedSbjDataDtlItem: { sbjDataDtlId = '' } } = this.props;
    return (
      <Fragment>
        <Card
          className="m-card m-card-right m-card-pay esa-card-extra-small"
          title={<div><span>基础数据列</span><Icon onClick={this.handleClick} type="plus-circle" style={{ fontSize: '17px', paddingLeft: '17px', cursor: 'pointer' }} className="m-color" /></div>}
        >
          <List
            className="m-list-tab-info m-list-info-pay esa-list-tab-info-margintop"
            split={false}
            dataSource={basicDataCol}
            style={{ borderRight: 'none' }}
            renderItem={item => (
              <List.Item className={(sbjDataDtlId === item.sbjDataDtlId ? 'active' : '')} key={item.sbjDataDtlId}>
                <List.Item.Meta
                  title={
                    <div className="m-pay-list-top">
                      <div className="m-pay-title" style={{ paddingLeft: '30px' }}>
                        {item.sbjDataDtlName}
                      </div>
                      {item.colType !== '1'?<div className="m-pay-delete" onClick={() => { this.handleDelete(item.sbjDataDtlId); }}><i className="iconfont icon-shanchu" /></div>:null}
                    </div>
                  }
                  onClick={() => { this.itemOnclick(item); }}
                />
              </List.Item>

            )}
          />
        </Card>
      </Fragment >
    );
  }
}
export default LeftPanel;
