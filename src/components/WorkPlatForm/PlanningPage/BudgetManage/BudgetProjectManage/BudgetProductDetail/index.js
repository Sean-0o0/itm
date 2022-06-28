/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { Card, Input, Form, Select, Radio, message, Button, InputNumber } from 'antd';
import { getDictKey } from '../../../../../../utils/dictUtils';
import Profile from './Profile';
import FormulaTab from './FormulaTab';
import BasicModal from '../../../../../Common/BasicModal';
import { FetchOperateBudgetProject } from '../../../../../../services/planning/budgetManagement';

/**
 * 项目信息
 */
const { TextArea } = Input;
const { Option } = Select;
class BudgetProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
  }

  // 点击修改
  onClickModify = () => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        visible: true,
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
        this.props.fetchLeftList(payload, true);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 修改提交
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return '';
      }
      const { jsdx, jsjb, szyjsx, xcdm, xclb, xcmc, xcsm, zt, isExbt, exbtType, qryProc, crspForm } = values;
      const { rightData } = this.props;
      const payload = {
        adpatScope: 0, // 适用范围
        calLvl: Number(jsjb), // 计算级别 1|一级;2|二级;3|三级;4|四级;5|五级;6|六级;7|七级;8|八级;9|九级
        operType: 2, // 操作类型  1|新增;2|修改;3|删除
        payClass: Number(xclb), // 项目类别 1|基本工资;2|提成;3|奖金;4|津贴;5|福利;6|税金;7|扣款
        payCodeId: rightData.id, // 项目项目ID 修改删除需要传入
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

  render() {
    const { getFieldDecorator, setFieldsValue, getFieldsValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    const { visible } = this.state;
    const { rightData, initialOrgid, dictionary, st, version } = this.props;
    const { payCode = '', payName = '', isExbt: isExbt1, exbtType: exbtType1, qryProc = '', crspForm = '' } = rightData;
    const { exbtType = exbtType1, isExbt = isExbt1 } = getFieldsValue();

    // 项目类别列表
    const {
      [getDictKey('YSLB')]: xclbList = [], // 获取项目类别
    } = dictionary;
    const jsjbList = [{ note: '一级', ibm: '1' }, { note: '二级', ibm: '2' }, { note: '三级', ibm: '3' }, { note: '四级', ibm: '4' }, { note: '五级', ibm: '5' }, { note: '六级', ibm: '6' }, { note: '七级', ibm: '7' }, { note: '八级', ibm: '8' }, { note: '九级', ibm: '9' }];
    const statusList = [{ note: '未启用', code: 0 }, { note: '启用', code: 1 }, { note: '作废', code: 2 }];

    // 状态列表
    const status = statusList.filter((item) => {
      return item.note === rightData.status;
    });

    const modalProps = {
      width: '70rem',
      height: '70rem',
      title: '修改',
      visible,
      onCancel: this.handleCancel,
      onOk: this.handleOk,
      // footer: null,
    };
    // 设置最小高度
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    const height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    return (
      <Fragment>
        <Card
          className="m-card m-card-pay"
          style={{ overflow: 'auto', height: 'calc(100% - 5rem)', minHeight: `calc(${height}px - 11rem)` }}
          title={
            <React.Fragment>
              <span className="darkorange">{payCode || '--'}</span>&nbsp;&nbsp;{payName || '--'}
            </React.Fragment>
          }
          extra={st !== '2' && <Button className="ant-btn fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.onClickModify}><i style={{ fontSize: '14px' }} className="iconfont icon-add " />修改</Button>}
        >
          <div className="m-pay-right-box">
            {/* 基本信息 */}
            <div className="m-explain-box orange-box m-gzt-explain">
              <Profile rightData={rightData} />
            </div>
            {/* 公式Tab */}
            <FormulaTab st={st} version={version} initialOrgid={initialOrgid} rightData={rightData} gxyybDatas={this.props.gxyybDatas} ryDatas={this.props.ryDatas} fetchLeftList={this.props.fetchLeftList} />
          </div>

        </Card>

        <BasicModal {...modalProps}>
          <Form className="m-form" {...formItemLayout} >
            <Form.Item label="项目代码" colon>
              {getFieldDecorator('xcdm', {
                initialValue: payCode,
                rules: [{ required: true, message: '请输入项目代码' },
                ],
              })(<Input placeholder="" className="m-input" />)}

            </Form.Item>
            <Form.Item label="项目名称" colon>
              {getFieldDecorator('xcmc', {
                initialValue: payName,
                rules: [{ required: true, message: '请输入项目名称' },
                ],
              })(<Input placeholder="" />)}

            </Form.Item>
            <Form.Item label="项目类别" colon>
              {getFieldDecorator('xclb', {
                initialValue: rightData.payClass,
                rules: [{ required: true, message: '请选择项目类别' },
                ],
              })(<Select placeholder="请选择项目类别" className="esa-xcxmgl-input  " >
                {
                  xclbList.map((item) => {
                    return <Option value={item.ibm} className="esa-xcxmgl-input  ">{item.note}</Option>;
                  })
                }
              </Select>)}

            </Form.Item>
            <Form.Item label="数值预警上限" colon style={{display : 'none'}}>
              {getFieldDecorator('szyjsx', {
                initialValue: rightData.warningVal,
                rules: [{ required: false, message: '请输入数值预警上限' },
                ],
              })(<InputNumber  placeholder="" className="esa-input-number" step={0.01} max={Math.pow(2,53)} style={{ width: '100%' }}/>)}

            </Form.Item>
            <Form.Item label="计算级别" colon>
              {getFieldDecorator('jsjb', {
                initialValue: rightData.calLvl,
                rules: [{ required: true, message: '请选择计算级别' },
                ],
              })(<Select placeholder="请选择计算级别" className="esa-xcxmgl-input  " >
                {
                  jsjbList.map((item) => {
                    return <Option value={item.ibm}>{item.note}</Option>;
                  })
                }
              </Select>)}

            </Form.Item>
            <Form.Item label="状态" colon>
              {getFieldDecorator('zt', {
                initialValue: status.length > 0 ? status[0].code : '',
                rules: [{ required: true, message: '请选择状态' },
                ],
              })(<Radio.Group className="m-radio">
                <Radio value={0}>未启用</Radio>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>作废</Radio>

              </Radio.Group>)}

            </Form.Item>
            <Form.Item label="是否展示" colon style={{ display: 'none' }}>
              {getFieldDecorator('isExbt', {
                initialValue: isExbt1,
                rules: [{ required: true }],
              })(<Radio.Group className="m-radio">
                <Radio value='0'>否</Radio>
                <Radio value='1'>是</Radio>
              </Radio.Group>)}
            </Form.Item>
            {isExbt === '1' && <Form.Item label="展示方式" colon>
              {getFieldDecorator('exbtType', {
                initialValue: exbtType1
              })(<Radio.Group className="m-radio">
                <Radio value='0'>无</Radio>
                <Radio value='1'>查询过程</Radio>
                {/* <Radio value='2'>自定义报表</Radio> */}
              </Radio.Group>)}
            </Form.Item>}
            {(isExbt === '1') && exbtType === '1' && <Form.Item label="查询过程" colon>
              {getFieldDecorator('qryProc', {
                initialValue: qryProc
              })(<Input placeholder="" className="m-input" />)}
            </Form.Item>}
            <Form.Item label="项目说明" colon>
              {getFieldDecorator('xcsm', {
                initialValue: rightData.payRemark,
                rules: [
                ],
              })(<TextArea
                className="m-input"
                onChange={(e) => { setFieldsValue({ xcsm: e.target.value }); }}
                autoSize={{ minRows: 3 }}
              />)}

            </Form.Item>
          </Form>
        </BasicModal>
      </Fragment>
    );
  }
}
// export default BudgetProductDetail;
export default Form.create({})(BudgetProductDetail);

