/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Form, Input, Select, Table } from 'antd';
import { FetchqueryMyCustomer } from '../../../../../../../../../services/motProduction';

const { Option } = Select;
class CommonModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerList: [], // 客户列表
    };
  }


  componentDidMount() {
    // this.fetchStaffList()
    this.getData(this.props.motDetail);
    // this.fetchData(this.props.motDetail);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.motDetail !== this.props.motDetail) {
      // this.fetchStaffList()

      // this.fetchData(nextProps.motDetail);
      this.getData(nextProps.motDetail);
    }
  }


    getData = async (motDetail = {}) => {
      const { staffId = '' } = this.props;
      const payload = {
        gxlx: '',
        keyword: '',
        stfId: staffId,
      };

      // 查询客户列表
      const res = await FetchqueryMyCustomer(payload);
      const { records = [] } = res;
      this.setState({
        customerList: records,
      }, () => {
        this.fetchData(motDetail);
      });
    }

    // te = () => {
    //     return new Promise((resolve, reject) => {

    //         const res = FetchqueryMyCustomer(payload)
    //         resolve(res)
    //     })
    // }


    // 查询客户列表
    // fetchStaffList = () => {
    //     const { staffId = '' } = this.props
    //     const payload = {
    //         gxlx: "",
    //         keyword: "",
    //         stfId: staffId
    //     }
    //     FetchqueryMyCustomer(payload).then(res => {
    //         const { code = 0, records = [] } = res
    //         if (code > 0) {
    //             this.setState({
    //                 customerList: records
    //             })
    //         }
    //     }).catch((error) => {
    //         message.error(!error.success ? error.message : error.note);
    //     });
    // }

    fetchColumns = () => {
      const { form: { getFieldDecorator }, addMode, czType } = this.props;

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
          title: '已配置参数',
          dataIndex: 'ypzcs',
          key: 'ypzcs',
          render: (text, record) => {
            return (
              <Form.Item label={record.mrcs} labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} style={{ marginBottom: '0' }} className="mot-ry-label" colon={false}>
                <span style={{ padding: ' 0 0 0 0.5rem' }} >{text}</span>
              </Form.Item>

            );
          },
        },
        {
          title: '员工参数定义',
          dataIndex: 'ygcsdy',
          key: 'ygcsdy',
          render: (text, record, index) => {
            if (record.edit) {
              if (addMode) {
                return (
                  <Form.Item label={record.mrcs} labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} style={{ marginBottom: '0' }} className="mot-ry-label" colon={false}>
                    {
                                        getFieldDecorator(`params_${index}`, {
                                            initialValue: '',
                                        })(<Input />)
                                    }
                  </Form.Item>

                );
              }
              if (czType) {
                return (
                  <Form.Item label={record.ygcsms || record.mrcs} labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} style={{ marginBottom: '0' }} className="mot-ry-label" colon={false}>
                    {
                                            getFieldDecorator(`params_${index}`, {
                                                initialValue: text,
                                            })(<Input />)
                                        }
                  </Form.Item>

                );
              }
              return (
                <Form.Item label={record.ygcsms || record.mrcs} labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} style={{ marginBottom: '0' }} className="mot-ry-label" colon={false}>
                  <span style={{ padding: ' 0 0 0 0.5rem' }} >{text}</span>
                </Form.Item>
              );
            }
            return (
              <Form.Item label="--" labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} style={{ marginBottom: '0' }} className="mot-ry-label" colon={false}>
                {/* <span style={{ padding: ' 0 0 0 0.5rem' }} >{text}</span> */}
              </Form.Item>
            );
          },
        },
      ];
      return colums;
    }


    // 构造表格数据
    fetchData = (motDetail = {}) => {
      const { addMode, staffData = [], form: { setFieldsValue }, kh = '' } = this.props;
      const { customerList = [] } = this.state;

      const data = [];
      // 已配置参数
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

                mrcs: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '--',
                ypzcs: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '',
                jsyz: fctrItem.FCTR_NM,
                // csdy: yybParamDefine,
                wthrAlowDef: fctrValArr[0] ? fctrValArr[0].WTHR_ALOW_DEF : '', // 因子是否允许修改
                alowDefRng: motDetail.alowDefRng, // 营业部  员工是否允许修改 位与项字典
                FCTR_ID: fctrItem.FCTR_ID, // 因子ID
                FCTR_NO: fctrItem.FCTR_NO, // 因子顺序
                VAR_CODE: fctrValArr[0] ? fctrValArr[0].VAR_CODE : '', // 变量编码
                // csdy: fctrValArr[0].VAR_VAL, //变量值
                VAR_DESC: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '--', // 变量描述
                DATA_TP: fctrValArr[0] ? fctrValArr[0].DATA_TP : '', // 数据类型
                COND_NO: xh,
                VAR_VAL: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '', // 变量值
                edit: !!(fctrValArr[0] && (motDetail.alowDefRng === '2' || motDetail.alowDefRng === '3') && fctrValArr[0].WTHR_ALOW_DEF === '1'), // 是否能输入参数

              };
              data.push(obj);
            });
          }
        });
      }


      // 如果是操作模式。单纯展示，需要合并staffdData
      if (!addMode) {
        staffData.map((item) => {
          data.map((dataItem, dataIndex) => {
            if (item.FCTR_ID === dataItem.FCTR_ID) {
              data[dataIndex].ygcsdy = item.VAR_VAL;// 员工参数定义
              data[dataIndex].ygcsms = item.VAR_DESC; // 员工参数描述
            }
          });
        });

        if (kh !== '') {
          setFieldsValue({ kh });
        }
      } else {
        setFieldsValue({ kh: customerList[0].khh });
      }


      this.setState({
        dataSource: data,
      });
    }


    render() {
      const { form: { getFieldDecorator }, addMode } = this.props;
      const { dataSource = [], customerList = [] } = this.state;
      // const { [getDictKey('CIS_GXLX')]: gxlxDicts = [] } = dictionary;
      return (
        <Fragment>
          <Row>

            <Form>
              <Form.Item label="客户" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} style={{ marginBottom: '0' }}>
                {
                                getFieldDecorator('kh', {
                                    // initialValue: addMode ? customerList[0].khh : kh,
                                })(<Select style={{ width: 120 }} disabled={!addMode} >
                                  {
                                        customerList && customerList.map((item) => {
                                            return (<Option key={item.khh} value={item.khh}>{item.khxm}</Option>);
                                        })
                                    }
                                  {/* <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>

                                    <Option value="Yiminghe">yiminghe</Option> */}
                                   </Select>)
                            }
              </Form.Item>
            </Form>
            <Form.Item label="规则定义" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} style={{ marginBottom: '0' }} />
            <Row style={{ padding: '0 2rem' }}>
              <Table
                dataSource={dataSource}
                columns={this.fetchColumns()}
              />
            </Row>


          </Row>


        </Fragment >
      );
    }
}

// export default CommonModalContent;
export default Form.create()(CommonModalContent);

