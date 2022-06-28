/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { Card, List, Input, Form, Select, Radio, message, Button } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import { getDictKey } from '../../../../../../../utils/dictUtils';
import { FetchoperateProject } from '../../../../../../../services/EsaServices/salaryManagement';
// import { fetchObject } from '../../../../../../../services/sysCommon';

/**
 * 左侧搜索以及薪酬列表
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
      deleteItem: '', // 薪酬代码, 用于删除
      // crspFormData: [], // 自定义报表数据
    };
  }

  componentDidMount() {
    // this.fetchCrspFormData();
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

  // 薪酬项目操作
  operateProject = (payload) => {
    const { version } = this.props;
    FetchoperateProject({ ...payload, version }).then((res) => {
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
        payClass: Number(xclb), // 薪酬类别 1|基本工资;2|提成;3|奖金;4|津贴;5|福利;6|税金;7|扣款
        payCodeId: 0, // 薪酬项目ID 修改删除需要传入
        payCodeNo: xcdm, // 薪酬代码
        payName: xcmc, // 薪酬名称
        payRemk: xcsm, // 薪酬说明
        settObj: Number(jsdx), // 结算对象 1|结算帐户;2|人员
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
      payClass: 0, // 薪酬类别 1|基本工资;2|提成;3|奖金;4|津贴;5|福利;6|税金;7|扣款
      payCodeId: deleteItem.id, // 薪酬项目ID 修改删除需要传入
      payCodeNo: deleteItem.payCode, // 薪酬代码
      payName: '', // 薪酬名称
      payRemk: '', // 薪酬说明
      settObj: 0, // 结算对象 1|结算帐户;2|人员
      status: 0, // 0|未启用;1|启用;2|作废
      warningVal: 0, // 数值预警上限
    };
    this.operateProject(payload);

    this.setState({ visible: false });
  }
//  // 自定义报表
//  fetchCrspFormData = () => {
//   fetchObject('TC_REPO_CENT_CUSTRPT_NEW', {
//     queryOption: {
//       "batchNo": 1,
//       "batchSize": 9999
//     }
//   }).then((res) => {
//     const { note, code, records = [] } = res;
//     if (code > 0) {
//       this.setState({ crspFormData: records ? records : [] });
//     } else {
//       message.error(note);
//     }
//   }).catch((e) => {
//     message.error(!e.success ? e.message : e.note);
//   });
// }

  render() {
    const { getFieldDecorator, setFieldsValue, getFieldsValue } = this.props.form;
    const { visible, operateType, onRun = false, deleteItem = {}, /*crspFormData = []*/ } = this.state;
    const { leftList = [], rightData, dictionary, st } = this.props;
    const { exbtType, isExbt } = getFieldsValue();
    const { payClass = '', calLvl = '' } = deleteItem;
    const {
      [getDictKey('YSLB')]: xclbList = [], // 获取薪酬类别
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
      title: operateType === 1 ? '薪酬代码新增' : '薪酬代码删除',
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
              薪酬名称<a className="m-pay-icon"><i className="anticon anticon-question-circle" /></a>
            </React.Fragment>
          }
          extra={st!=='2' && <Button className="ant-btn fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.handleClick}><i style={{ fontSize: '14px' }} className="iconfont icon-add " />新增</Button>}
        >
          <div className="dis-fx m-pay-search-box">
            <div className="flex ">
              <Input.Search
                placeholder="搜索薪酬名称"
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
                <Form.Item label="薪酬代码" colon>
                  {getFieldDecorator('xcdm', {
                    rules: [{ required: true, message: '请输入薪酬代码' },
                    ],
                  })(<Input placeholder="" className="m-input" />)}

                </Form.Item>
                <Form.Item label="薪酬名称" colon>
                  {getFieldDecorator('xcmc', {
                    rules: [{ required: true, message: '请输入薪酬名称' },
                    ],
                  })(<Input placeholder="" />)}

                </Form.Item>
                <Form.Item label="薪酬类别" colon>
                  {getFieldDecorator('xclb', {
                    rules: [{ required: true, message: '请选择薪酬类别' },
                    ],
                  })(<Select placeholder="请选择薪酬类别" className="esa-xcxmgl-select">
                    {
                      xclbList.map((item) => {
                        return <Option value={item.ibm}>{item.note}</Option>;
                      })
                    }
                     </Select>)}

                </Form.Item>
                <Form.Item label="数值预警上限" colon>
                  {getFieldDecorator('szyjsx', {
                    rules: [{ required: true, message: '请输入数值预警上限' },
                    ],
                  })(<Input placeholder="" className="m-input" />)}

                </Form.Item>
                <Form.Item label="计算类别" colon>
                  {getFieldDecorator('jslb', {
                    rules: [{ required: true, message: '请选择计算类别' },
                    ],
                  })(<Select placeholder="请选择计算类别" className="esa-xcxmgl-select">
                    {
                      jsjbList.map((item) => {
                        return <Option value={item.ibm}>{item.note}</Option>;
                      })
                    }
                     </Select>)}

                </Form.Item>
                <Form.Item label="结算对象" colon>
                  {getFieldDecorator('jsdx', {
                    rules: [{ required: true, message: '请选择结算对象' },
                    ],
                  })(<Select placeholder="请选择结算对象" className="esa-xcxmgl-select" >
                    <Option value="1">结算账户</Option>
                    <Option value="2">人员</Option>
                     </Select>)}
                </Form.Item>
                <Form.Item label="状态" colon>
                  {getFieldDecorator('zt', {
                    rules: [{ required: true, message: '请选择状态' },
                    ],
                  })(<Radio.Group className="m-radio">
                    <Radio value={0}>未启用</Radio>
                    <Radio value={1}>启用</Radio>
                    <Radio value={2}>作废</Radio>
                     </Radio.Group>)}
                </Form.Item>
                <Form.Item label="是否展示" colon>
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
                {/* {isExbt === '1' && exbtType === '2' && <Form.Item label="自定义报表" colon>
                  {getFieldDecorator('crspForm')(
                    <Select placeholder="请选择自定义报表" className="esa-xcxmgl-select">
                      {
                        crspFormData.map((item) => {
                          return <Option value={item.ibm}>{item.note}</Option>;
                        })
                      }
                    </Select>)}
                </Form.Item>} */}
                <Form.Item label="薪酬说明" colon>
                  {getFieldDecorator('xcsm', {
                    rules: [
                    ],
                  })(<TextArea
                    className="m-input"
                    // value={xcsmValue}
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
                    <Form.Item label="薪酬代码" colon>
                      <span>{deleteItem.payCode}</span>
                    </Form.Item>
                    <Form.Item label="薪酬名称" colon>
                      <span>{deleteItem.payName}</span>
                    </Form.Item>
                    <Form.Item label="薪酬类别" colon>
                      <span>{xclbNote}</span>
                    </Form.Item>
                    <Form.Item label="数值预警上限" colon>
                      <span>{deleteItem.warningVal}</span>

                    </Form.Item>
                    <Form.Item label="计算类别" colon>
                      <span>{jsjbNote}</span>
                    </Form.Item>
                    <Form.Item label="结算对象" colon>
                      <span>{deleteItem.settObj}</span>
                    </Form.Item>
                    <Form.Item label="状态" colon>
                      <span>{deleteItem.status}</span>

                    </Form.Item>
                    <Form.Item label="薪酬说明" colon>
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
