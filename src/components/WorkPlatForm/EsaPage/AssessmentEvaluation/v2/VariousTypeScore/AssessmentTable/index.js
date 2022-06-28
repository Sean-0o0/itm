/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Table, Row, Col, Form, Input, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const FormItem = Form.Item;

class AssessmentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  // 构造 互评 专评 督办 表格的列名
  renderThreeTypeColumns = () => {
    const { form: { getFieldDecorator }, data: { records = [] }, params: { disabled = false,  examType = '', adpatScoreType = '' } } = this.props;
    const columns = [
      {
        title: examType === '1' ? '业务条线' :'职能部门',
        dataIndex: 'orgNameObj',
        key: 'orgNameObj',
        width: '33%',
      },
      {
        title: '打分',
        dataIndex: 'examScore',
        key: 'examScore',
        width: '33%',
        render: (value, row, index) => {
          let pattern = new RegExp(/^([8-9][0-9](\.\d+)?|100)$/, "g");
          let message = '打分在80到100之间!';
          if (row.clgVal !== '' && examType === '1' && adpatScoreType === '28') {
            pattern = new RegExp(/^(([8-9][0-9]|1[0-1][0-9])(\.\d+)?|120)$/, "g");
            message = '打分在80到120之间!';
          }
          return (
            <FormItem style={{ marginBottom: 0 }} >
              {getFieldDecorator(`df${index}`, {
                initialValue: value,
                rules: [{
                  required: true,
                  pattern,
                  message,
                }],
              })(<Input placeholder={message} allowClear onChange={(e) => { records[index].examScore = e.target.value }} disabled={disabled} />)}
            </FormItem>
          )
        }
      },
      {
        title: '打分说明',
        dataIndex: 'remk',
        key: 'remk',
        width: '34%',
        render: (value, row, index) => {
          const df = Number(this.props.form.getFieldValue(`df${index}`));
          const dfsm = Number(this.props.form.getFieldValue(`dfsm${index}`));
          const reg = /^(.|\n){0,200}$/;
          let required = !reg.test(dfsm);
          let message = '字数在200字以内！';
          //每条协同问卷分在85以下，95及95以上时，原因必填；
          if (adpatScoreType === '26' && examType === '2' && reg.test(dfsm)) {
            required = df < 85 || df >= 95;
            message = '打分85分以下和95分及以上必填!'
          }
          //每条质量考核分数非满分的情况下，原因必填；
          if (adpatScoreType === '27' && examType === '2' && reg.test(dfsm)) {
            required = df !== 100;
            message = '打分非满分必填!'
          }
          return (
            <FormItem style={{ marginBottom: 0 }} >
              {getFieldDecorator(`dfsm${index}`, {
                initialValue: value,
                rules: [{ required, pattern: new RegExp(/^(.|\n){0,200}$/, "g"), message }],
              })(<Input allowClear placeholder='字数在200字以内！' onChange={(e) => { records[index].remk = e.target.value }} disabled={disabled} />)}
            </FormItem>
          )
        }
      },
    ]
    return columns;
  }

  //构造自评 表格的列名
  renderSelfEvaluation = () => {
    const { form: { getFieldDecorator }, xmlb, xmgz, data: { records = [] }, params: { disabled = false, examType = '' } } = this.props;
    const columns = [
      {
        title: '考核项目类别',
        dataIndex: 'examPgmName',
        key: 'examPgmName',
        width: '15%',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {
              rowSpan: 0,
            },
          };
          xmlb.map((item, i) => {
            if (index === item) {
              obj.props.rowSpan = xmlb[i + 1] - item;
            }
            // if (index > item && index < xmlb[i + 1] - item) {
            //   obj.props.rowSpan = 0;
            // }
          });
          return obj
        }
      },
      {
        title: '考核项目',
        dataIndex: 'examItmName',
        key: 'examItmName',
        width: '25%',
        render: (value, row, index) => {
          const obj = {
            children: <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }}></div>,
          };
          return obj
        }
      },
      {
        title: '考核项目的规则',
        dataIndex: 'examStd',
        key: 'examStd',
        width: '20%',
        render: (value, row, index) => {
          const obj = {
            children: <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }}></div>,
            props: {
              rowSpan: 0,
            },
          };
          xmgz.map((item, i) => {
            if (index === item) {
              obj.props.rowSpan = xmgz[i + 1] - item;
            }
          });
          return obj
        }
      },
      {
        title: '权重',
        dataIndex: 'itmWt',
        key: 'itmWt',
        width: '10%',
        render: (value, row, index) => {
          return <span>{isNaN(value) ? value : `${parseFloat(Number(value) * 100).toFixed(1)}%`}</span>
        }
      },
      {
        title: '打分',
        dataIndex: 'examScore',
        key: 'examScore',
        width: '10%',
        render: (value, row, index) => {
          let pattern = new RegExp(/^([8-9][0-9](\.\d+)?|100)$/, "g");
          let message = '打分在80到100之间!';
          if (row.clgVal !== '' && examType === '1') {
            pattern = new RegExp(/^(([8-9][0-9]|1[0-1][0-9])(\.\d+)?|120)$/, "g");
            message = '打分在80到120之间!';
          }
          if (isNaN(row.itmWt)) {
            pattern = new RegExp(/^([0-9](\.\d+)?|10)$/, "g");
            message = '打分在0到10之间!';
          }
          return (
            <FormItem style={{ marginBottom: 0 }} >
              {getFieldDecorator(`df${index}`, {
                initialValue: value,
                rules: [{
                  required: true,
                  pattern,
                  message,
                }],
              })(<Input
                placeholder={message}
                allowClear
                onChange={(e) => { records[index].examScore = e.target.value }}
                disabled={disabled}
              />)}
            </FormItem>
          )
        }
      },
      {
        title: '打分说明',
        dataIndex: 'remk',
        key: 'remk',
        // width: '20%',
        render: (value, row, index) => {
          const dfsm = Number(this.props.form.getFieldValue(`dfsm${index}`));
          const reg = /^(.|\n){0,200}$/;
          return (
            <FormItem style={{ marginBottom: 0 }} >
              {getFieldDecorator(`dfsm${index}`, {
                initialValue: value,
                rules: [{ required: !reg.test(dfsm), pattern: new RegExp(/^(.|\n){0,200}$/, "g"), message: '字数在200字以内！' }],
              })(<Input
                allowClear
                onChange={(e) => { records[index].remk = e.target.value }}
                disabled={disabled}
                placeholder='字数在200字以内！'
              />)}
            </FormItem>
          )
        }
      },
    ]
    return columns;
  }

  // 表单提交
  handleSubmit = (e, type) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { handleSubmit } = this.props;
        if (handleSubmit) {
          handleSubmit(type);
        }
      }
    });
  };

  render() {
    const { height, params: { adpatScoreType = '', disabled = false }, data: { records = [] } } = this.props;
    return (
      <Row className="m-row" style={{ margin: adpatScoreType === '25' ? "1.5rem 0" : "0" }}>
        <Col xs={24} sm={24} lg={24} xl={24}>
          <Scrollbars
            autoHide
            style={{ height: adpatScoreType === '25' ? height - 270 : height - 320, minHeight: 270 }}
            renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
          >
            <Table
              className="esa-evaluate-notice-table"
              size="middle"
              bordered
              columns={adpatScoreType === '25' ? this.renderSelfEvaluation() : this.renderThreeTypeColumns()}
              dataSource={records}
              pagination={false}
            // scroll={{ y: records.length > 6 ? 390 : '' }}
            />

          </Scrollbars>
        </Col>
        <Col xs={24} sm={24} lg={24} xl={24} className="tc" style={{ /* margin: '5rem 0' */ }}>
          <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" disabled={disabled} onClick={(e) => this.handleSubmit(e, '1')}>保存草稿</Button>
          <Button style={{ marginLeft: '0.6rem' }} className="m-btn-radius m-btn-headColor" disabled={disabled} onClick={(e) => this.handleSubmit(e, '2')}> 提交 </Button>
        </Col>
      </Row>
    );
  }
}

// export default AssessmentTable;
export default Form.create()(AssessmentTable);
