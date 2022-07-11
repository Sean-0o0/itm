/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, Checkbox, Table, Input } from 'antd';
import { getDictKey } from '../../../../../../../utils/dictUtils';

// 引入请求路径的示例


// 右边内容模块-规则定义
class RuleDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillMount() {
    this.fetchData(this.props.motDetail);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.motDetail !== this.props.motDetail) {
      this.fetchData(nextProps.motDetail);
    }
  }

    // 参数输入改变
    onInputChange = (value, record, index) => {
      const { onSavaEditData, tempMotDetail: { params = [] } } = this.props;

      if (params.length > 0) {
        params[index].FCTR_VAR[0].VAR_VAL = value;
        onSavaEditData(params, 'params');
      }
    }

    // 只有进入编辑模式 并且允许营业部修改。允许因子自定义，才允许修改
    fetchColumn = () => {
      const { edit = false } = this.props;

      const colums = [

        {
          title: '序号',
          dataIndex: 'xh',
          key: 'xh',
        },
        {
          title: '计算因子',
          dataIndex: 'jsyz',
          key: 'jsyz',
        },
        {
          title: '默认参数',
          dataIndex: 'mrcs',
          key: 'mrcs',
          render: (text, record) => {
            return (
              <Row >
                <Col span={12}><span>{record.VAR_DESC}</span></Col>
                <Col span={12}><span>{text}</span></Col>

              </Row>

            );
          },
        },
        {
          title: '营业部参数定义',
          dataIndex: 'yybcsdy',
          key: 'yybcsdy',
          render: (text, record, index) => {
            if (edit && record.wthrAlowDef === '1' && (record.alowDefRng === '1' || record.alowDefRng === '3')) {
              return (
                <Row >
                  <Col span={8}><span>{record.yybcsms}</span></Col>
                  <Col span={16}><Input defaultValue={text} onChange={(e) => { this.onInputChange(e.target.value, record, index); }} /></Col>

                </Row>

              );
            }
            return (
              <Row >
                <Col span={8}><span>{record.yybcsms}</span></Col>
                <Col span={16}><span>{text}</span></Col>

              </Row>
            );
          },
        },
      ];
      return colums;
    }

    // 构造表格数据
    fetchData = (motDetail = {}) => {
      const data = [];
      // 构造默认参数
      const calcRule = motDetail.jsonCalcRule;
      if (calcRule) {
        const jsonRule = JSON.parse(calcRule);

        jsonRule.map((item) => {
          const xh = item.COND_NO;
          const fctrArr = item.FCTR;
          if (fctrArr !== '') {
            fctrArr.map((fctrItem, fctrIndex) => {
              const fctrValArr = fctrItem.FCTR_VAR;
              const obj = {
                xh: fctrIndex === 0 ? xh : '', // 条件展示顺序
                // xh: xh, //条件展示顺序

                mrcs: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '',
                jsyz: fctrItem.FCTR_NM ? fctrItem.FCTR_NM : '--',
                // csdy: yybParamDefine,
                wthrAlowDef: fctrValArr[0] ? fctrValArr[0].WTHR_ALOW_DEF : '', // 因子是否允许修改
                alowDefRng: motDetail.alowDefRng, // 营业部  员工是否允许修改 位与项字典
                FCTR_ID: fctrItem.FCTR_ID, // 因子ID
                FCTR_NO: fctrItem.FCTR_NO, // 因子顺序
                VAR_CODE: fctrValArr[0] ? fctrValArr[0].VAR_CODE : '', // 变量编码
                // csdy: fctrValArr[0].VAR_VAL, //营业部变量值
                VAR_DESC: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '--', // 变量描述
                DATA_TP: fctrValArr[0] ? fctrValArr[0].DATA_TP : '', // 数据类型
                COND_NO: xh,
                VAR_VAL: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '', // 变量值
              };
              data.push(obj);
            });
          }
        });
      }


      // 构造营业部参数定义
      const yybCalcRule = motDetail.jsonCalcRuleOrg;
      if (yybCalcRule) {
        const yybjsonRule = JSON.parse(yybCalcRule);

        yybjsonRule.map((item) => {
          data.map((dataItem, dataIndex) => {
            if (item.COND_NO === dataItem.COND_NO) {
              const fctrArr = item.FCTR;
              fctrArr.map((fctrItem) => {
                if (fctrItem.FCTR_NO === dataItem.FCTR_NO) {
                  const fctrValArr = fctrItem.FCTR_VAR;
                  data[dataIndex].yybcsdy = fctrValArr[0] ? fctrValArr[0].VAR_VAL : ''; // 营业部参数定义的值
                  data[dataIndex].yybcsms = fctrValArr[0] ? fctrValArr[0].VAR_DESC : '--'; // 营业部参数定义的描述
                }
              });
            }
          });
        });
      }


      this.setState({
        data,
      });
    }


    render() {
      const { dictionary = {}, motDetail = {}, tgtTp } = this.props;


      // 多选框勾选
      const { [getDictKey('MOT_CUST_RNG')]: allowDicts = [] } = dictionary;
      const allowArr = [];
      if (motDetail) {
        const alowDefRng = motDetail.alowDefRng;
        let total = 0;
        allowDicts.map((item) => {
          total += Number(item.ibm);
          if (Number(item.ibm) === Number(alowDefRng)) {
            allowArr.push(item.ibm);
          }
        });
        if (Number(total) === Number(alowDefRng)) {
          allowDicts.map((item) => {
            allowArr.push(item.ibm);
          });
        }
      }

      const { data = [] } = this.state;

      return (
        <Fragment>
          <Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <div style={{ float: 'left', color: '#333333', fontWeight: 'bold' }}>规则定义 </div>
              {
                            (tgtTp === '1' || tgtTp === '2') && (
                            <div style={{ float: 'right' }}>
                              <Checkbox.Group value={allowArr} disabled className="mot-yyb-check">
                                {
                                            allowDicts && allowDicts.map((item) => {
                                                return (
                                                  <Checkbox value={`${item.ibm}`}>{`允许${item.note}修改`}</Checkbox>
                                                );
                                            })
                                        }
                                {/* <Checkbox value='1'>允许营业部修改</Checkbox>
                                    <Checkbox value='2'>允许员工修改</Checkbox> */}
                              </Checkbox.Group>
                            </div>
                            )
                        }

            </Row>
            <Table
              className="mot-prod-td-no-border-table"
              dataSource={data}
              columns={this.fetchColumn()}
                        // size='small'
                        // style={{padding:'0 1rem 0 0'}}
              pagination={false}
            />
          </Row>
        </Fragment>
      );
    }
}

export default RuleDefinition;
