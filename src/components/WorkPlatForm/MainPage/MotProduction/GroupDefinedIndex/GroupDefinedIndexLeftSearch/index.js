/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Row, Col, Input, Menu, message, Modal, Form, Icon } from 'antd';
import { FetchQueryScheduleGroupTree, FetchScheduleGroupMaintenance } from '../../../../../../services/motProduction';
import BasicModal from '../../../../../Common/BasicModal';

/**
 * 左侧查询搜索组件
 */

class GroupDefinedIndexLeftSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      dicfactorData: [],
      factorData: [],
      openKeys: [],
      clickKeys: '',
      searchValue: '',
      visible: false,
      modalTips: '',
      clickType: '',
      yzId: '',
      visibleAdd: false,
      addType: '',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    const { tgtTp } = this.props;
    this.fetchCompanyName(tgtTp, '');
  }
  componentWillReceiveProps(newData){

    if(this.props.tgtTp !== newData.tgtTp){
      this.fetchCompanyName(newData.tgtTp, '');
    }
  }

  fetchCompanyName = (tgtTp, id, preSelect) => {
    const { jsms = [] } = this.props;

    const openKeys = [];

    let ziData = [];
    const Data = jsms;
    let factorData = [];
    FetchQueryScheduleGroupTree({ tgtTp }).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        factorData = records;
        Data.forEach((item) => {
          ziData = factorData.filter((Item) => {
            if (item.ibm === Item.cmptMode) {
              return true;
            }
            return false;
          });
          item.ziData = ziData;
          if (ziData.length > 0) {
            openKeys.push(item.ibm);
          }
        });
        this.setState({ factorData, openKeys, Data, clickKeys: id === '' ? factorData[0].grpId : id });
        // 获取上一次选中的项目
        if (preSelect) {
          const selectItem = factorData.filter((item) => {
            return item.grpId === preSelect.grpId;
          });
          this.setState({
            clickKeys: preSelect.grpId,
          });
          this.props.setCompany(selectItem[0]);
        } else {
          this.props.setCompany(factorData[0]);
        }
      } else {
        Data.forEach((item) => {
          item.ziData = [];
        });
        this.setState({
          Data,
        });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }

  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;
    const { jsms = [] } = this.props;
    // 筛选数据
    const { factorData } = this.state;
    const newTreeList = factorData.filter((item) => {
      if (item.grpNm.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });
    let ziData = [];
    const openKeys = [];
    const Data = jsms;
    Data.forEach((item) => {
      ziData = newTreeList.filter((Item) => {
        if (item.ibm === Item.cmptMode) {
          return true;
        }
        return false;
      });
      item.ziData = ziData;
      if (ziData.length > 0) {
        openKeys.push(item.ibm);
      }
    });

    this.setState({
      openKeys,
      Data,
      searchValue: keyWord,
    });
  }

  onClick = (item) => {
    this.setState({
      clickKeys: item.grpId,
    });
    this.props.setCompany(item);
  };
  onAdd = (e, cmptMode) => {
    e.stopPropagation();
    this.setState({
      visibleAdd: true,
      cmptMode,
    });
  }
  handleOkAdd = () => {
    const { tgtTp } = this.props; // 目标类型
    const { factorData, clickKeys, cmptMode } = this.state;
    // let cmptMode = "";    //分组类型,

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // factorData.forEach(item => {
        //   if (item.grpId === clickKeys) {
        //     cmptMode = item.cmptMode;
        //   }
        // })
        const payload = {
          cmptMode,
          grpId: '',
          grpNm: `${values.FZMC}`,
          grpTp: '1',
          oprTp: '1',
          tgtTp,
        };
        FetchScheduleGroupMaintenance(payload).then((response) => {
          const { note, code } = response;
          if (code > 0) {
            this.setState({
              visibleAdd: false,
            });
          }
          this.fetchCompanyName(tgtTp, note, {grpId: note});
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
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
      modalTips: '确认删除当前分组？',
      clickType: 'delete',
    });
  }
  handleOk = () => {
    const { clickType } = this.state;
    if (clickType === 'delete') {
      this.maintain('3');
    } else if (clickType === 'change') {

    }


    this.setState({
      visible: false,
      modalTips: '',
      clickType: '',
    });
  }
  maintain = (oprTp) => {
    const { clickKeys } = this.state;
    const { tgtTp } = this.props;
    const payload = {
      cmptMode: '',
      grpId: clickKeys,
      grpNm: '',
      grpTp: '',
      oprTp,
      tgtTp: '',
    };

    FetchScheduleGroupMaintenance(payload).then((response) => {
      const { note, code } = response;
      if (code > 0) {
        this.setState({
          visibleAdd: false,
        });
      }
      message.info('操作成功');
      this.fetchCompanyName(tgtTp, oprTp === '3' ? '' : note);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  };
  render() {
    const { form: { getFieldDecorator }, tgtTp, dictionary } = this.props;
    const { Data, clickKeys, searchValue, visible, modalTips, visibleAdd } = this.state;
    // 根据tgtTp 显示不同分类数据
    let finalData = [];
    if (tgtTp === '3') {
      finalData = Data.filter((item) => { return item.note === '定时'; });
    } else {
      finalData = Data.filter((item) => { return item.note === '定时' || item.note === '实时'; });
    }
    return (
      <Fragment >
        <Row style={{ height: '100%' }}>
          <Col xs={24} sm={24} lg={24} xl={24} style={{ paddingTop: 10 }}>
            {/* 搜索框 */}
            <span style={{ display: 'flex', marginBottom: 8, padding: '0 1rem' }}>
              <Input.Search placeholder="搜索" onChange={this.handleOnkeyWord} className="mot-prod-search-input" />
            </span>
            <Menu
              mode="inline"
              openKeys={this.state.openKeys}
              onOpenChange={this.onOpenChange}

              selectedKeys={[clickKeys]}
            >
              {
                finalData.map(item => (
                  <Menu.SubMenu
                    key={item.ibm}
                    className="mot-factor-name"
                    title={
                      <div>
                        <span style={{ color: '#333333', fontWeight: 'bold' }}>{item.note}</span>
                        <Icon type="plus-circle" className="mot-icon" style={{ margin: '8px 14px 8px 28px' }} title="新增" onClick={e => this.onAdd(e, item.ibm)} />
                      </div>

                    }
                  >
                    {item.ziData ? item.ziData.map((Item) => {
                      const index = Item.grpNm.indexOf(searchValue);
                      const beforeStr = Item.grpNm.substr(0, index);
                      const afterStr = Item.grpNm.substr(index + searchValue.length);
                      const title =
                        index > -1 ? (
                          <span>
                            {beforeStr}
                            <span style={{ color: '#ff2300' }}>{searchValue}</span>
                            {afterStr}
                          </span>
                        ) : (
                          <span>
                            {item.grpNm}
                          </span>
                          );
                      const bq =
                        clickKeys === Item.grpId && item.cmptMode !== '0' ? (
                          <span style={{ float: 'right' }}>
                            <Icon type="close-circle" style={{ color: '#F34141', margin: '8px 14px 8px 28px' }} title="删除" onClick={() => this.onDelete()} />
                            {Item.strtUseSt === '0' ?
                              <Icon type="check-circle" style={{ color: '#999999', margin: 0 }} title="启用" onClick={() => this.maintain('4')} /> : <Icon type="stop" style={{ color: '#999999', margin: 0 }} title="禁用" onClick={() => this.maintain('5')} />}
                          </span>
                        ) : '';
                      return <Menu.Item onClick={this.onClick.bind(this, Item)} key={Item.grpId}><span style={{ color: Item.strtUseSt === '0' ? 'gray' : 'black' }}>{title}</span>{bq}</Menu.Item>;
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
            <Form >
              <Form.Item label={(<span>分组任务名称</span>)} style={{ marginBottom: '1rem' }} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('FZMC', { rules: [{ required: true, message: '请输入分组任务名称!' }] })(<Input className="mot-input"/>)}
              </Form.Item>
            </Form>
          </BasicModal>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(GroupDefinedIndexLeftSearch);
