/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, Select, Form, Divider, Radio } from 'antd';
import { getDictKey } from '../../../../../../../../utils/dictUtils';
import {FetchqueryData} from "../../../../../../../../services/motProduction";

// 引入请求路径的示例


// 右边内容模块-发布规则-任务分配

class TaskAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleData: [], //角色数据
      teamData: [], //团队数据
      employeeClassData: [], //人员分类数据
    };
  }

  componentDidMount() {
    this.queryData('roleData', 'SELECT ID, ROLECODE CODE, NAME FROM LIVEBOS.LBROLE');
    this.queryData('teamData', 'SELECT ID, ID CODE, TDMC NAME FROM CIS.TTDBM');
    this.queryData('employeeClassData', 'SELECT ID, FLBM CODE, FLMC NAME FROM CIS.TRYFLBM');
  }

  queryData = (dataName, tableSql) => {
    FetchqueryData({
      current: 1,
      keyword: '',
      owner: 'CRMII',
      paging: 0,
      pageSize: '',
      tablesql: tableSql,
      sort: '',
      total: -1
    }).then(ret => {
      const {records = []} = ret;
      if (records && records.length > 0) {
        const obj = {};
        obj[dataName] = records;
        this.setState(obj);
      }
    });
  }

  getFieldLabel = (data, values) => {
    const label = [];
    for (let i = 0; i < data.length; i++) {
      if (values.indexOf(data[i].id) > -1) {
        label.push(data[i].name);
      }
    }
    return label.join(', ');
  }

  // 任务要求改变
  onTaskChange = (value) => {
    const { onSavaEditData } = this.props;
    onSavaEditData(value, 'taskRqmt');
  }

  // 任务审核改变
  onTaskCheckChange = (value) => {
    const { onSavaEditData } = this.props;
    onSavaEditData(value, 'wthrRvwTask');
  }


  render() {
    const {roleData, teamData, employeeClassData} = this.state;
    const { dictionary = {}, motDetail = {}, edit = false } = this.props;

    // 时间要求
    const { [getDictKey('MOT_EXEC_TM_RQMT')]: timeDicts = [] } = dictionary;

    let time = '';
    if (timeDicts) {
      timeDicts.map((item) => {
        if (motDetail.execTmRqmt === item.ibm) {
          time = item.note;
        }
      });
    }

    // 任务要求
    const { [getDictKey('MOT_TASK_RQMT')]: taskDicts = [] } = dictionary;
    let task = '';
    taskDicts.some((item) => {
      if (Number(item.ibm) === Number(motDetail.taskRqmt)) {
        task = item.note;
      }
    });


    // 服务类别
    const { [getDictKey('FWLB')]: fwlbDicts = [] } = dictionary;
    let fwlb = '';
    fwlbDicts.some((item) => {
      if (Number(item.ibm) === Number(motDetail.srvcTp)) {
        fwlb = item.note;
      }
    });

    // 已选关系
    const { [getDictKey('CIS_GXLX')]: yxgxDicts = [], [getDictKey('rwfpgz')]: fpgzDicts = [], } = dictionary;
    const yxgx = [];
    const dxgx = [];
    motDetail.fpgz = [];
    motDetail.fpgzLabel = [];
    if (motDetail.jsonTaskAlotRule) {
      const {ALOT_TP: alotTp, ALOT_RULE: alotRule} = JSON.parse(motDetail.jsonTaskAlotRule);
      if (alotTp.SEC_ALOT_TP !== '0') {
        motDetail.fpgz = [alotTp.ALOT_RULE_TP, alotTp.SEC_ALOT_TP];
      } else {
        motDetail.fpgz = [alotTp.ALOT_RULE_TP];
      }
      fpgzDicts.map((item, index) => {
        if (motDetail.fpgz[0] === item.ibm) {
          fpgzDicts[index].suffix = '(默认分配)';
          motDetail.fpgzLabel[0] = fpgzDicts[index].note + fpgzDicts[index].suffix;
        } else if (motDetail.fpgz[1] === item.ibm) {
          fpgzDicts[index].suffix = '(兜底分配)';
          motDetail.fpgzLabel[1] = fpgzDicts[index].note + fpgzDicts[index].suffix;
        }
      });
      motDetail.jspjfp = [];
      motDetail.tdpjfp = [];
      motDetail.rylbpjfp = [];
      alotRule.forEach((item) => {
        const ruleTp = item.ALOT_TP === '1' ? motDetail.fpgz[0] : motDetail.fpgz[1];
        if (ruleTp === '1') {
          yxgxDicts.forEach((childItem) => {
            if (item.RLT_TP === childItem.ibm) {
              item.note = childItem.note;
              item.ibm = childItem.ibm;
              yxgx.push(item);
            }
          });
        } else if (ruleTp === '2') {
          motDetail.jspjfp.push(item.ROLE_ID);
        } else if (ruleTp === '3') {
          motDetail.tdpjfp.push(item.TEAM_ID);
        } else if (ruleTp === '4') {
          motDetail.rylbpjfp.push(item.EMPE_CL);
        }
      });
      yxgxDicts.map((item) => {
        let count = 0;
        yxgx.map((yxgxItem) => {
          if (item.ibm !== yxgxItem.ibm) {
            count++;
          }
          if (count === yxgx.length) {
            dxgx.push(item);
          }
        });
      });
    }

    const layout11 = {labelCol: { span: 12 }, wapperCol: { span: 12 }}; // 1:1
    const layout12 = {labelCol: { span: 8 }, wapperCol: { span: 16 }}; // 1:2
    const margins = {marginTop: '1rem', marginLeft: '3.6rem'};
    return (
      <Fragment>
        <Row>
          <Form className="mot-yyb-form">
            <Row>
              <Col xs={24} sm={6} md={6} lg={6}>
                <Form.Item label="时间要求" style={margins} {...layout12} >
                {
                  edit ? (
                    <Select value={time} disabled>
                    {/* <Select.Option value="其他">其他</Select.Option> */}
                    </Select>
                  ) : (
                    <span>{time}</span>
                  )
                }
                </Form.Item>
              </Col>

              <Col xs={24} sm={3} md={3} lg={3}>
                <Form.Item label="天数" style={margins} {...layout11} >
                  <span>{motDetail.execTmRqmtDays}</span>
                </Form.Item>
              </Col>

              <Col xs={24} sm={6} md={6} lg={6}>
                <Form.Item label="服务类别" style={margins} {...layout12} >
                  {/* <Select value={fwlb} disabled> */}
                  {/* <Select.Option value="资讯服务">资讯服务</Select.Option> */}
                  {/* </Select> */}
                  {
                    edit ? (
                      <Select value={fwlb} disabled>
                      {/* <Select.Option value="其他">其他</Select.Option> */}
                      </Select>
                    ) : (
                      <span>{fwlb}</span>
                    )
                  }
                </Form.Item>
              </Col>

              <Col xs={24} sm={6} md={6} lg={6}>
                <Form.Item label="任务是否审核" style={margins} {...layout11}>
                {
                  edit && (motDetail.taskRqmt === '1' || motDetail.taskRqmt === '3') ? (
                    <Radio.Group onChange={e => this.onTaskCheckChange(e.target.value)} defaultValue={Number(motDetail.wthrRvwTask)}>
                      <Radio className="mot-radio" value={0}>否</Radio>
                      <Radio className="mot-radio" value={1}>是</Radio>
                    </Radio.Group>
                  ) : (
                    <span>{Number(motDetail.wthrRvwTask) === 0 ? '否' : '是'}</span>
                  )
                }
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={6} md={6} lg={6} >
                <Form.Item label="任务要求" style={margins} {...layout12}>
                {
                  edit && (motDetail.taskRqmt === '1' || motDetail.taskRqmt === '3') ? (
                    <Radio.Group onChange={e => this.onTaskChange(e.target.value)} defaultValue={motDetail.taskRqmt}>
                    {
                      taskDicts.map((item) => {
                        return (
                          <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>
                        );
                      })
                    }
                    </Radio.Group>
                  ) : (
                    <span>{task}</span>
                  )
                }
                </Form.Item>
              </Col>
              <Col offset={3} xs={24} sm={6} md={6} lg={6} >
                <Form.Item label="分配规则" style={margins} {...layout12}  >
                  <div style={{whiteSpace: 'nowrap'}}>{motDetail.fpgzLabel.join(', ')}</div>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            {
              motDetail.fpgz.indexOf('1') > -1 && (
                <Row style={{order: motDetail.fpgz.indexOf('1')}}>
                  <div style={{ height: 'auto', margin: '20px 0' }}>
                    <div className="factor-item" style={{margin: '0 0 0.5rem 3.6rem'}}>服务关系</div>
                    <div style={{ width: '42%', float: 'left' }}>
                      <div className="mot-fbgz-color" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
                        <span style={{ marginLeft: '40px', color: '#FFF' }}>待选关系</span>
                      </div>
                      <div className="mot-yyb-transfer-list" style={{ paddingLeft: '40px' }}>
                        {
                          dxgx.map((item) => {
                            return (
                              <div style={{ padding: '5px 0' }}>{item.note}</div>
                            );
                          })
                        }
                      </div>
                    </div>

                    <div style={{ float: 'left', margin: '70px 0 0 6%' }}>
                      <div className="mot-yyb-transfer-arrow mot-fbgz-color">
                        <i className="iconfont icon-left-line-arrow" />
                      </div>
                      <div className="mot-yyb-transfer-arrow mot-fbgz-color">
                        <i className="iconfont icon-right-line-arrow" />
                      </div>
                    </div>

                    <div style={{ width: '42%', float: 'right' }}>
                      <div className="mot-fbgz-color" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
                        <span style={{ marginLeft: '10px', color: '#FFF' }}>优先级</span>
                        <span style={{ marginLeft: '10px', color: '#FFF' }}>已选关系</span>
                      </div>
                      <div className="mot-yyb-transfer-list">
                        {
                          yxgx.length > 0 && yxgx.map((item, index) => {
                            if (index === 0) {
                              return (
                                <div style={{ padding: '5px 0' }}>
                                  <span style={{ marginLeft: '10px' }}>{item.PRI}</span>
                                  <span style={{ marginLeft: '22px' }}>{item.note}</span>
                                </div>
                              );
                            } else if (yxgx[index - 1].PRI !== item.PRI) {
                              return (
                                <div style={{ padding: '5px 0' }}>
                                  <Divider style={{ margin: '0 0 5px 0' }}/>
                                  <span style={{ marginLeft: '10px' }}>{item.PRI}</span>
                                  <span style={{ marginLeft: '22px' }}>{item.note}</span>
                                </div>
                              );
                            } else if (yxgx[index - 1].PRI === item.PRI) {
                              return (
                                <div style={{ padding: '5px 0' }}>
                                  <span style={{ marginLeft: '40px' }}>{item.note}</span>
                                </div>
                              );
                            }
                          })
                        }
                      </div>
                    </div>

                  </div>
                </Row>
              )
            }
            {
              motDetail.fpgz.indexOf('2') > -1 && (
                <Row style={{order: motDetail.fpgz.indexOf('2')}}>
                  <div style={{margin: '10px 0 10px 3.6rem'}}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>角色平均分配：</span>{this.getFieldLabel(roleData, motDetail.jspjfp)}</div>
                </Row>
              )
            }
            {
              motDetail.fpgz.indexOf('3') > -1 && (
                <Row style={{order: motDetail.fpgz.indexOf('3')}}>
                  <div style={{margin: '10px 0 10px 3.6rem'}}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>团队平均分配：</span>{this.getFieldLabel(teamData, motDetail.tdpjfp)}</div>
                </Row>
              )
            }
            {
              motDetail.fpgz.indexOf('4') > -1 && (
                <Row style={{order: motDetail.fpgz.indexOf('4')}}>
                  <div style={{margin: '10px 0 10px 3.6rem'}}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>人员类别平均分配：</span>{this.getFieldLabel(employeeClassData, motDetail.rylbpjfp)}</div>
                </Row>
              )
            }
          </div>
        </Row>
      </Fragment>
    );
  }
}

export default TaskAssignment;
