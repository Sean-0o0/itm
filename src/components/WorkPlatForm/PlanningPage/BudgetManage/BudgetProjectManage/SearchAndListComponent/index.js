/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { Card, List, Input, Form, Select, Radio, message, Button, InputNumber } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import { getDictKey } from '../../../../../../utils/dictUtils';
import { FetchOperateBudgetProject } from '../../../../../../services/planning/budgetManagement';

/**
 * 左侧搜索以及项目列表
 */
// const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
class SearchAndListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // deleteVisible: false,
      operateType: 1, // 操作类型，1是新增，0是删除
      onRun: false, // 删除的代码是否在启用中
      deleteItem: '', // 项目代码, 用于删除
    };
  }

  componentDidMount() {
  }

  itemOnclick = (item) => {
    this.props.getRightData(item);
  }


  // 点击新增
  handleClick = () => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        visible: true,
        operateType: 1,
      });
    }
  }

  // 搜索
  handleSearch = (value) => {
    const { updateXCMC } = this.props;
    if (updateXCMC && typeof updateXCMC === 'function') {
      updateXCMC(value);
    }
  }

  // 删除
  handleDetele = (item) => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        visible: true,
        operateType: 0,
        deleteItem: item,
      });
    }
  }


  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 项目项目操作
  operateProject = (payload) => {
    const { version } = this.props;
    FetchOperateBudgetProject({ ...payload, version }).then((res) => {
      const { code = 0, note = '' } = res;
      if (code > 0) {
        message.success(note);
        this.props.fetchLeftList('', true);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 新增確認
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return '';
      }
      const { jsdx, jslb, szyjsx, xcdm, xclb, xcmc, xcsm, zt, isExbt, exbtType, qryProc, crspForm } = values;
      const payload = {
        adpatScope: 0, // 适用范围
        calLvl: Number(jslb), // 计算级别 1|一级;2|二级;3|三级;4|四级;5|五级;6|六级;7|七级;8|八级;9|九级
        operType: 1, // 操作类型  1|新增;2|修改;3|删除
        payClass: Number(xclb), // 项目类别 1|基本工资;2|提成;3|奖金;4|津贴;5|福利;6|税金;7|扣款
        payCodeId: 0, // 项目项目ID 修改删除需要传入
        payCodeNo: xcdm, // 项目代码
        payName: xcmc, // 项目名称
        payRemk: xcsm, // 项目说明
        status: Number(zt), // 0|未启用;1|启用;2|作废
        warningVal: Number(szyjsx), // 数值预警上限
        isExbt,
        exbtType,
        qryProc,
        crspForm,
      };
      this.operateProject(payload);
      this.props.form.resetFields();
      this.setState({ visible: false });
    });
  };

  // 删除确认
  deleteOk = () => {
    const { deleteItem = {} } = this.state;
    const payload = {
      adpatScope: 0, // 适用范围
      calLvl: 0, // 计算级别 1|一级;2|二级;3|三级;4|四级;5|五级;6|六级;7|七级;8|八级;9|九级
      operType: 3, // 操作类型  1|新增;2|修改;3|删除
      payClass: 0, // 项目类别 1|基本工资;2|提成;3|奖金;4|津贴;5|福利;6|税金;7|扣款
      payCodeId: deleteItem.id, // 项目项目ID 修改删除需要传入
      payCodeNo: deleteItem.payCode, // 项目代码
      payName: '', // 项目名称
      payRemk: '', // 项目说明
      status: 0, // 0|未启用;1|启用;2|作废
      warningVal: 0, // 数值预警上限
    };
    this.operateProject(payload);

    this.setState({ visible: false });
  }

  render() {
    const { getFieldDecorator, setFieldsValue, getFieldsValue } = this.props.form;
    const { visible, operateType, onRun = false, deleteItem = {} } = this.state;
    const { leftList = [], rightData, dictionary, st } = this.props;
    const { exbtType, isExbt } = getFieldsValue();
    const { payClass = '', calLvl = '' } = deleteItem;
    const {
      [getDictKey('YSLB')]: xclbList = [], // 获取项目类别
    } = dictionary;
    let xclbNote = '';
    if (xclbList !== null && xclbList.length > 0) {
      xclbList.forEach((element) => {
        const { ibm, note } = element;
        if (ibm === payClass) {
          xclbNote = note;
        }
      });
    }


    const jsjbList = [{ note: '一级', ibm: '1' }, { note: '二级', ibm: '2' }, { note: '三级', ibm: '3' }, { note: '四级', ibm: '4' }, { note: '五级', ibm: '5' }, { note: '六级', ibm: '6' }, { note: '七级', ibm: '7' }, { note: '八级', ibm: '8' }, { note: '九级', ibm: '9' }];
    const jsjbNote = jsjbList[Number(calLvl)].note;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    const modalProps = {
      width: '70rem',
      height: '70rem',
      title: operateType === 1 ? '新增' : '删除',
      visible,
      onCancel: this.handleCancel,
      onOk: operateType === 1 ? this.handleOk : this.deleteOk,
      // footer: null,
    };
    // 设置最小高度
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    const height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    return (
      <Fragment>
        <Card
          className="m-card m-card-right m-card-pay"
          style={{ overflow: 'auto', height: 'calc(100% - 5rem)', minHeight: `calc(${height}px - 10rem)` }}
          title={
            <React.Fragment>
              项目定义<a className="m-pay-icon"><i className="anticon anticon-question-circle" /></a>
            </React.Fragment>
          }
          extra={st !== '2' && <Button className="ant-btn fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.handleClick}><i style={{ fontSize: '14px' }} className="iconfont icon-add " />新增</Button>}
        >
          <div className="dis-fx m-pay-search-box">
            <div className="flex ">
              <Input.Search
                placeholder="搜索项目名称"
                ref={node => this.searchXCMC = node}
                className="m-input-search-white esa-xcxmgl-input "
                onChange={e => this.props.updateSearchValue(e.target.value)}
                onSearch={(value) => { this.handleSearch(value); }}
              />
            </div>
            {/* <a className="m-task-shaix-box"><i className="iconfont icon-shaixuan2" /></a> */}
          </div>
          <List
            className="m-list-tab-info m-taskList m-list-info-pay"
            split
            dataSource={leftList}
            style={{ borderRight: 'none' }}
            pagination={{
              size: 'small',
              simple: true,
              pageSize: 10,
              position: 'bottom',
            }}
            renderItem={(item, index) => (
              <List.Item
                className={rightData.length === 0 ? (index === 0 ? 'active' : '') : (rightData.id === item.id ? 'active' : '')}
              >
                <List.Item.Meta
                  title={
                    <div className="m-pay-list-top">
                      <div className="m-pay-title">
                        <span className="darkorange">{item.payCode}</span>&nbsp;&nbsp;{item.payName}
                      </div>
                      <a style={{ display: st === '2' ? 'none' : '' }} className="m-pay-delete" onClick={() => { this.handleDetele(item); }}><i className="iconfont icon-shanchu" /></a>
                    </div>
                  }
                  // onClick={() => { this.itemOnclick(item); }}
                  onClick={() => { this.itemOnclick(item); }}

                />
              </List.Item>
            )}
          />
        </Card>
        {
          operateType === 1 ? (
            <BasicModal {...modalProps} centered>
              {/* <PayCodeSeting refreshList={refreshList} /> */}

              <Form className="m-form" {...formItemLayout} >
                <Form.Item label="项目代码" colon>
                  {getFieldDecorator('xcdm', {
                    rules: [{ required: true, message: '请输入项目代码' },
                    ],
                  })(<Input placeholder="" className="m-input" />)}

                </Form.Item>
                <Form.Item label="项目名称" colon>
                  {getFieldDecorator('xcmc', {
                    rules: [{ required: true, message: '请输入项目名称' },
                    ],
                  })(<Input placeholder="" />)}

                </Form.Item>
                <Form.Item label="项目类别" colon>
                  {getFieldDecorator('xclb', {
                    initialValue: xclbList[0].ibm,
                    rules: [{ required: true, message: '请选择项目类别' },
                    ],
                  })(<Select placeholder="请选择项目类别" className="esa-xcxmgl-select">
                    {
                      xclbList.map((item) => {
                        return <Option value={item.ibm}>{item.note}</Option>;
                      })
                    }
                  </Select>)}

                </Form.Item>
                <Form.Item label="数值预警上限" colon style={{display : 'none'}}>
                  {getFieldDecorator('szyjsx', {
                    rules: [{ required: false, message: '请输入数值预警上限' },
                    ],
                  })(<InputNumber placeholder="" className="esa-input-number" step={0.01} max={Math.pow(2,53)} style={{ width: '100%' }}/>)}

                </Form.Item>
                <Form.Item label="计算级别" colon>
                  {getFieldDecorator('jslb', {
                    rules: [{ required: true, message: '请选择计算级别' },
                    ],
                  })(<Select placeholder="请选择计算级别" className="esa-xcxmgl-select">
                    {
                      jsjbList.map((item) => {
                        return <Option value={item.ibm}>{item.note}</Option>;
                      })
                    }
                  </Select>)}

                </Form.Item>
                <Form.Item label="状态" colon>
                  {getFieldDecorator('zt', {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择状态' },
                    ],
                  })(<Radio.Group className="m-radio">
                    <Radio value={0}>未启用</Radio>
                    <Radio value={1} checked>启用</Radio>
                    <Radio value={2}>作废</Radio>
                  </Radio.Group>)}
                </Form.Item>
                <Form.Item label="是否展示" colon style={{ display: 'none' }}>
                  {getFieldDecorator('isExbt', {
                    initialValue: '0',
                    rules: [{ required: true }],
                  })(<Radio.Group className="m-radio">
                    <Radio value='0'>否</Radio>
                    <Radio value='1'>是</Radio>
                  </Radio.Group>)}
                </Form.Item>
                {isExbt === '1' && <Form.Item label="展示方式" colon>
                  {getFieldDecorator('exbtType', {
                    initialValue: '0'
                  })(<Radio.Group className="m-radio">
                    <Radio value='0'>无</Radio>
                    <Radio value='1'>查询过程</Radio>
                    {/* <Radio value='2'>自定义报表</Radio> */}
                  </Radio.Group>)}
                </Form.Item>}
                {isExbt === '1' && exbtType === '1' && <Form.Item label="查询过程" colon>
                  {getFieldDecorator('qryProc')(<Input placeholder="" className="m-input" />)}
                </Form.Item>}
                <Form.Item label="项目说明" colon>
                  {getFieldDecorator('xcsm', {
                    rules: [
                    ],
                  })(<TextArea
                    className="m-input"
                    onChange={(e) => { setFieldsValue({ xcsm: e.target.value }); }}
                    autoSize={{ minRows: 3 }}
                  />)}

                </Form.Item>
              </Form>
                )
            </BasicModal>
          )
            : onRun ?
              message.warning('只能删除未启用的代码')
              //  this.showConfirm()
              : (
                <BasicModal {...modalProps}>
                  {/* <PayCodeSeting refreshList={refreshList} /> */}

                  <Form className="m-form" {...formItemLayout} >
                    <Form.Item label="项目代码" colon>
                      <span>{deleteItem.payCode}</span>
                    </Form.Item>
                    <Form.Item label="项目名称" colon>
                      <span>{deleteItem.payName}</span>
                    </Form.Item>
                    <Form.Item label="项目类别" colon>
                      <span>{xclbNote}</span>
                    </Form.Item>
                    {/* <Form.Item label="数值预警上限" colon>
                      <span>{deleteItem.warningVal}</span>

                    </Form.Item> */}
                    <Form.Item label="计算级别" colon>
                      <span>{jsjbNote}</span>
                    </Form.Item>
                    <Form.Item label="状态" colon>
                      <span>{deleteItem.status}</span>

                    </Form.Item>
                    <Form.Item label="项目说明" colon>
                      <span>{deleteItem.payRemark}</span>

                    </Form.Item>
                  </Form>

                </BasicModal>
              )

        }

      </Fragment>
    );
  }
}
// export default SearchAndListComponent;
export default Form.create({})(SearchAndListComponent);
