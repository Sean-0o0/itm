/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Row, Col, Input, Menu, Modal, Form, Icon } from 'antd';
import BasicModal from '../../../../Common/BasicModal';


/**
 * 左侧查询搜索组件
 */

class LeftSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTips: '',
      clickType: '',
      visibleAdd: false,
    };
  }

  componentDidMount() {
  }


  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;
    this.props.handleOnkeyWord(keyWord);
  }

  onClick = (e) => {
    const { type, clickKeys, addType } = this.props;
    if (clickKeys !== '' && clickKeys !== e.key && !type) {
      this.setState({
        visible: true,
        modalTips: '正在编辑的mot事件未保存,切换将丢失数据,是否确定?',
        clickType: 'change',
      });
      this.props.setData('dxid', e.key);
    } else if (addType !== 'add') {
      this.props.setData('clickKeys', e.key);
      this.props.setCompany(e.key);
    }
  };
  onAdd = () => {
    this.setState({
      visibleAdd: true,
    });
  }
  handleOkAdd = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ visibleAdd: false });
        this.props.handleOkAdd(values);
        this.props.setData('addType', 'add');
      }
    });
  }
  handleCancelAdd = () => {
    this.setState({
      visibleAdd: false,
    });
  }
  onDelete = () => {
    this.setState({
      visible: true,
      modalTips: '确认删除当前对象？',
      clickType: 'delete',
    });
  }
  handleOk = () => {
    const { dxid, addType } = this.props;
    const { clickType } = this.state;
    if (clickType === 'delete') {
      this.props.maintain('3');
    } else if (clickType === 'change') {
      if (addType === 'add') {
        this.props.handleOk();
      }
      this.props.setData('clickKeys', dxid);
      this.props.setCompany(dxid);
      this.props.setType(true);
    }
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onOpenChange = (openKeys) => {
    this.props.setData('openKeys', openKeys);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { Data, clickKeys, openKeys, searchValue, addType, addName } = this.props;
    const { visible, modalTips, visibleAdd } = this.state;
    return (
      <Fragment >
        <Row style={{ height: '100%' }}>
          <Scrollbars autoHide style={{ width: '100%', height: '100%' }} >
            <Col xs={24} sm={24} lg={24} xl={24} style={{ paddingTop: 10 }}>
              {/* 搜索框 */}
              <span style={{ display: 'flex', marginBottom: 8, paddingLeft: 24 }}>
                <Input.Search placeholder="搜索" onChange={this.handleOnkeyWord} className="mot-prod-search-input" />
                <Icon type="plus-circle" className="mot-icon" style={{ margin: '8px 14px 8px 28px' }} title="新增" onClick={() => this.onAdd()} />
              </span>
              <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.onClick}
                selectedKeys={[clickKeys]}
              >
                {
                  Data.map(item => (
                    <Menu.SubMenu className="mot-factor-name"
                      key={item.DIC_CODE}
                      title={
                        <span style={{ color: '#333333', fontWeight: 'bold' }}>{item.DIC_NOTE}</span>
                      }
                    >
                      {item.ziData ? item.ziData.map((Item) => {
                        const index = Item.name.indexOf(searchValue);
                        const beforeStr = Item.name.substr(0, index);
                        const afterStr = Item.name.substr(index + searchValue.length);
                        const title =
                          index > -1 ? (
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '80%' }}>
                              <span style={{ color: Item.strtUseSt === '0' && Item.id !== clickKeys ? '#999999' : '' }}>{beforeStr}</span>
                              <span style={{ color: '#ff2300' }}>{searchValue}</span>
                              <span style={{ color: Item.strtUseSt === '0' && Item.id !== clickKeys ? '#999999' : '' }}>{afterStr}</span>
                            </div>
                          ) : (
                            <div>
                              <span style={{ color: Item.strtUseSt === '0' && Item.id !== clickKeys ? '#999999' : '' }}>{item.name}</span>
                            </div>
                          );
                        const bq =
                          clickKeys === Item.id && item.DIC_CODE !== '0' && addType !== 'add' ? (
                            <span style={{ float: 'right' }}>
                              <Icon type="close-circle" style={{ color: '#F34141', margin: '8px 14px 8px 28px' }} title="删除" onClick={() => this.onDelete()} />
                              {Item.strtUseSt === '0' ?
                                <Icon type="check-circle" style={{ color: '#999999', margin: 0 }} title="启用" onClick={() => this.props.maintain('4')} /> : <Icon type="stop" style={{ color: '#999999', margin: 0 }} title="禁用" onClick={() => this.props.maintain('5')} />}
                            </span>
                          ) : '';
                        return <Menu.Item key={Item.id} style={{ display: 'flex' }}>{title}{bq}</Menu.Item>;
                      }) : ''}
                    </Menu.SubMenu>
                  ))
                }

              </Menu>
            </Col>
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width="500px"
              getContainer={false}
            >
              <p>{modalTips}</p>
            </Modal>
            <BasicModal
              title="新增"
              visible={visibleAdd}
              onOk={this.handleOkAdd}
              onCancel={this.handleCancelAdd}
              width="500px"
            >
              <Form className="factor-form">
                <Form.Item label={(<span>{addName}</span>)} className="factor-item" style={{ marginBottom: '1rem' }} >
                  {getFieldDecorator('YZMC', { rules: [{ required: true, message: '请输入因子名称!' }] })(<Input maxLength={25} className="mot-input" style={{ width: '300px' }} />)}
                </Form.Item>
              </Form>
            </BasicModal>
          </Scrollbars>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(LeftSearchComponent);
