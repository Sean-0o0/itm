/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Input, Form, Row, Col } from 'antd';
import BasicDataTable from '../../../../../../Common/BasicDataTable';

const FormItem = Form.Item;

class RightTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleHeight: 0, // 核心目标展示区域高度
    };
  }

  componentDidUpdate() {
    this.updateDimensions();
  }

  updateDimensions = () => {
    const { titleHeight } = this.state;
    const [title] = document.getElementsByClassName('esaTableTitle');
    let height = title.clientHeight;
    if (titleHeight !== height) {
      this.setState({ titleHeight: height });
    }
  };

  // 清空表单数据
  refleshForm = () => {
    this.props.form.resetFields();
  }

  // 保存草稿
  preservation = () => {
    this.handleSubmit('1');
  }

  // 提交
  submit = () => {
    this.handleSubmit('2');
  }

  // 表单提交
  handleSubmit = (type) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { handleSubmit } = this.props;
        if (handleSubmit) {
          handleSubmit(type);
        }
      }
    });
  };

  // 构造明细表格列
  structColumns = () => {
    const { form: { getFieldDecorator }, falb, xmlb, xmsm, data: { records = [] }, disabled, selectedRow: { examType = '', roleId = '' } } = this.props;
    const columns = [
      {
        title: '考核项目类别',
        dataIndex: 'pgmType',
        colSpan: 2,
        width: '7%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {
              rowSpan: 0,
              style: { borderBottom: '1px solid #C0C0C0', fontWeight: 'bold' },
            },
          };
          falb.map((item, i) => {
            if (index === item) {
              obj.props.rowSpan = falb[i + 1] - item;
              // if (i === falb.length - 2) {
              //   obj.props.style = { borderBottom: 'none', fontWeight: 'bold' };
              // }
            }
          });
          return obj
        },
      },
      {
        title: '项目类别',
        dataIndex: 'itmClass',
        colSpan: 0,
        width: '7%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {
              rowSpan: 0,
              style: { borderBottom: '1px solid #C0C0C0', fontWeight: 'bold' },
            },
          };
          xmlb.map((item, i) => {
            if (index === item) {
              obj.props.rowSpan = xmlb[i + 1] - item;
              // if (i === xmlb.length - 2) {
              //   obj.props.style = { borderBottom: 'none', fontWeight: 'bold' };
              // }
            }
          });
          return obj
        },
      },
      {
        title: '考核项目',
        dataIndex: 'examItm',
        width: '18%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }}></div>,
            props: {},
          };
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        },
      },
      {
        title: '考核项目说明',
        dataIndex: 'examItmRemk',
        width: '30%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }}></div>,
            props: {
              rowSpan: 0,
            },
          };
          xmsm.map((item, i) => {
            if (index === item) {
              obj.props.rowSpan = xmsm[i + 1] - item;
              if (xmsm[i + 1] - item !== 1) {
                obj.props.style = { borderBottom: '1px solid #C0C0C0' };
              }
            }
          });
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        },
      },
      {
        title: '权重',
        dataIndex: 'examItmWt',
        width: '5%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: <span>{value !== '' ? `${parseFloat(Number(value) * 100).toFixed(1)}%` : ''}</span>,
            props: {},
          };
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        },
      },
      {
        title: '上一轮分数',
        dataIndex: 'aheadScor',
        width: '9%',
        ellipsis: true,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        },
      },
      {
        title: '打分',
        dataIndex: 'scor',
        width: '10%',
        ellipsis: true,
        render: (value, row, index) => {
          let pattern = new RegExp(/^([8-9][0-9](\.\d+)?|100)$/, "g");
          let message = '打分在80到100之间!';
          if (row.clgVal !== '' && examType === '1') {
            pattern = new RegExp(/^(([8-9][0-9]|1[0-1][0-9])(\.\d+)?|120)$/, "g");
            message = '打分在80到120之间!';
          }
          if (row.examItmWt === '') {
            pattern = new RegExp(/^([0-9](\.\d+)?|10)$/, "g");
            message = '打分在0到10之间!';
          }
          let cwDisabled = false;
          if (row.itmClass === '财务类' && roleId === '3') {
            cwDisabled = true;
          }
          const obj = {
            children: (
              <FormItem style={{ marginBottom: 0 }} >
                {getFieldDecorator(`df${index}`, {
                  initialValue: value,
                  rules: [{
                    required: true,
                    pattern,
                    message,
                  }],
                })(<Input
                  allowClear
                  disabled={row.flag ==="0" || cwDisabled}
                  // disabled={disabled || cwDisabled}
                  // autocomplete="off"
                  onChange={(e) => { records[index].scor = e.target.value }}
                />)}
              </FormItem>
            ),
            props: {},
          };
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        }
      },
      {
        title: '打分说明',
        dataIndex: 'scorRemk',
        width: '14%',
        ellipsis: true,
        render: (value, row, index) => {
          const dfsm = Number(this.props.form.getFieldValue(`dfsm${index}`));
          const reg = /^(.|\n){0,200}$/;
          const obj = {
            children: (
              <FormItem style={{ marginBottom: 0 }} >
                {getFieldDecorator(`dfsm${index}`, {
                  initialValue: value,
                  rules: [{ required: !reg.test(dfsm), pattern: new RegExp(/^(.|\n){0,200}$/, "g"), message: '字数在200字以内！' }],
                })(<Input
                  allowClear
                  disabled={row.flag ==="0"}
                  // disabled={disabled}
                  onChange={(e) => { records[index].scorRemk = e.target.value }}
                  placeholder='字数在200字以内！'
                />)}
              </FormItem>
            ),
            props: {},
          };
          xmlb.map((item, i) => {
            if (index === xmlb[i + 1] - 1) {
              obj.props.style = { borderBottom: '1px solid #C0C0C0' };
            }
          });
          return obj
        }
      },
    ];
    return columns;
  }

  render() {
    const { height, data: { records = [] }, yr = '', selectedRow: { orgName = '', examType = '', target = '', effTotal = '', qltyTotal = '', columnsMinStatus = false, scorTotal = '', shuji = false } } = this.props;
    const { titleHeight } = this.state;
    return (
      <Row style={{ minWidth: !columnsMinStatus && 1150 }}>
        <Row style={{ height: height - 46 }}>
          <div className='esaTableTitle'>
            <div className='esa-evaluate-table-title'>{`${yr}${orgName}年度考核`}</div>
            <div className='esa-evaluate-table-describe'>
              <div className='esa-describe-title dis-fx alc'>{examType === '2' ? '核心目标' : '打分说明' }</div>
              <div className='esa-describe-content' style={{ lineHeight: examType === '1' && '30px' }}>
                <p style={{ marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: examType === '2' ? target.replace(/\n/g, '<br/>') : '达成目标值得100分，达成挑战值得120分，低于门槛值最高80分。' }}></p>
              </div>
            </div>
          </div>
        {/* <Scrollbars
          autoHide
          style={{ height: height - 46 - Number(titleHeight), minHeight: 270 }}
          renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
        > */}
          <BasicDataTable
            className="esa-evaluate-lender-right-table"
            columns={this.structColumns()}
            dataSource={records}
            pagination={false}
            bordered
            scroll={{ y: height - 46 - 40 - Number(titleHeight) }}
          />
        {/* </Scrollbars> */}
        </Row>
        <Row className="esa-evaluate-table-fix dis-fx alc">
          <Col xs={6} sm={6} lg={6} xl={6}>
            <span className='esa-evaluate-tableMx-total'>总计</span>
          </Col>
          <Col xs={6} sm={6} lg={6} xl={6}>
            <span >效率得分</span>
            <Input style={{ color: "#F73A00" }} className="m-input" value={effTotal} disabled={true}></Input>
          </Col>
          {/*  判断当前用户是否是书记 */}
          {!shuji && <Col xs={6} sm={6} lg={6} xl={6}>
            <span >质量得分</span>
            <Input style={{ color: "#F73A00" }} className="m-input" value={qltyTotal} disabled={true}></Input>
          </Col>}
          <Col xs={6} sm={6} lg={6} xl={6}>
            <span >总分</span>
            <Input style={{ color: "#F73A00" }} className="m-input" value={scorTotal} disabled={true}></Input>
          </Col>


        </Row>
      </Row>
    );
  }
}

// export default BusEvaluate;
export default Form.create()(RightTable);
