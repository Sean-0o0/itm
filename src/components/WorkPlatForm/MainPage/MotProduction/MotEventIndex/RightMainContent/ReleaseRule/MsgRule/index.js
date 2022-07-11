/* eslint-disable react/jsx-indent */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable import/first */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, message, Form, Select, Radio, Input, Card, Tree, Dropdown, Menu, TimePicker, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchqueryMessageStrategy, FetchqueryMessageStrategyDisplayChannel, FetchqueryMessageColumn, FetchqueryMessageStrategySelectionChannel } from '../../../../../../../../services/motProduction';
import { FetchqueryShortMessageChannel } from '../../../../../../../../services/motProduction';
import { getDictKey } from '../../../../../../../../utils/dictUtils';
// 引入请求路径的示例
import moment from 'moment';

const { Option } = Select;
// 右边内容模块-发布规则-消息推送
class MsgRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xxclList: [], // 表格消息策略
      xxlmList: [], // 消息栏目
      channel: '', // 模板
      displayChannel: [], // 默认渠道
      selectionChannel: [], // 可选渠道
      xxlmDefault: '',
      xxclDefault: '',
    };
  }


  componentWillMount() {
    const { data, msgKey } = this.props;
    // 策略ID
    // 表格消息策略
    this.fetchData();
    //获取短信通道
    this.fetchDxtd();
    // 消息栏目
    this.fetchXxlmData();
    // 模板
    if (data.msgSttg !== '' && data.msgSttg !== undefined) {
      this.fetchXxclData(data.msgSttg, 'one', msgKey);
    }
  }


  componentWillReceiveProps(nextProps) {
    const { msgKey } = nextProps;
    // 模板
    if (nextProps.data !== this.props.data) {
      // 表格消息策略
      this.fetchData();
      // 消息栏目
      this.fetchXxlmData();
      const { data } = nextProps;
      if (data.msgSttg !== '' && data.msgSttg !== undefined) {
        this.fetchXxclData(data.msgSttg, 'one', msgKey);
      }
    }
    if (nextProps.inputTreeType === true) {
      this.setPositionForTextArea(nextProps.position, nextProps.inputTreeLength);
    }
  }


  // 查询顶部表格发送渠道
  fetchData = () => {
    const { data } = this.props;
    FetchqueryMessageStrategy({}).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0 && records.length > 0) {
        this.setState({ xxclList: records, xxclDefault: records[0].id });
        if (data.msgSttg === '' || data.msgSttg === undefined) {
          this.fetchXxclData(records[0].id, 'change');
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //获取短信通道
  fetchDxtd = () => {
    // FetchqueryShortMessageChannel({}).then((res) => {
    //   const { code = 0, records = [] } = res;
    //   if (code > 0) {
    //     this.setState({
    //       dxtd: records,
    //     });
    //   }
    // }).catch((error) => {
    //   message.error(!error.success ? error.message : error.note);
    // });
  }

  // 查询模板消息策略
  fetchXxclData = (sttg, type, msgKey) => {
    const payload = {
      sttg,
    };
    FetchqueryMessageStrategyDisplayChannel(payload).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0 && records.length > 0) {
        const Data = [];
        records.forEach((item) => {
          const data = { type: 'display', ...item };
          Data.push(data);
        });
        this.setState({
          displayChannel: Data,
        });

        if (type === 'change') {
          const jsonMsg = [];
          records.forEach((item) => {
            const jsonMsgItem = {
              MSG_CHNL: item.msgChnl,
              TMPL_CNTNT: '',
              TMPL_SBJ: '',
              EXTD_PARA: { smsChnl: '' },
            };
            jsonMsg.push(jsonMsgItem);
          });
          this.props.setJsonMsgData(jsonMsg);
        }
        if (msgKey === '' || msgKey === undefined) {
          this.props.setRuleData('msgKey', records[0].msgChnl);
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    FetchqueryMessageStrategySelectionChannel(payload).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0 && records.length > 0) {
        const Data = [];
        records.forEach((item) => {
          const data = { type: 'selection', ...item };
          Data.push(data);
        });
        this.setState({
          selectionChannel: Data,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询消息栏目

  fetchXxlmData = () => {
    FetchqueryMessageColumn({}).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0 && records.length > 0) {
        this.setState({ xxlmList: records, xxlmDefault: records[0].id });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 消息审核改变
  onMsgChange = (value) => {
    const { onSavaEditData } = this.props;
    onSavaEditData(value, 'wthrRvwMsg');
  }
  getPositionForTextArea = (ctrl) => {
    // 获取光标位置
    const CaretPos = {
      start: 0,
      end: 0,
    };
    if (ctrl?.selectionStart) { // Firefox support
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl?.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    return (CaretPos);
  };
  setPositionForTextArea = (position, inputTreeLength) => {
    const props = this.contentProp.textAreaRef; // 获取dom节点实例
    setTimeout(() => {
      this.setCursorPosition(props, position.start + inputTreeLength);
    }, 20);
    this.props.setRuleData('inputTreeType', false);
  };
  setCursorPosition = (ctrl, pos) => {
    if (ctrl) {
      ctrl.focus();
    }
    if (ctrl) {
      ctrl.setSelectionRange(pos, pos);
    }
  };
  onSelect = (selectedKeys, e) => {
    const { setJsonMsgData, jsonMsg, msgKey, setRuleData } = this.props;
    const props = this.contentProp.textAreaRef; // 获取dom节点实例
    const position = this.getPositionForTextArea(props); // 光标的位置
    if (e.node.props.children.length === 0) {
      const str = `\${${e.node.props.title}}`;
      const data = jsonMsg.filter(item => item.MSG_CHNL === msgKey);
      if (data.length > 0) {
        jsonMsg.forEach((item) => {
          if (item.MSG_CHNL === msgKey) {
            let newData = item.TMPL_CNTNT;
            if (newData === '' || newData === undefined) {
              newData = str;
            } else if (position.start === position.end) {
              newData = newData.slice(0, position.start) + str + newData.slice(position.start);
            } else {
              newData = newData.slice(0, position.start) + str + newData.slice(position.end);
            }
            item.TMPL_CNTNT = newData;
          }
        });
      } else {
        const jsonMsgItem = {
          MSG_CHNL: msgKey,
          TMPL_CNTNT: str,
          TMPL_SBJ: '',
        };
        jsonMsg.push(jsonMsgItem);
      }
      if (setJsonMsgData) {
        setJsonMsgData(jsonMsg);
      }
      if (setRuleData) {
        setRuleData('inputTreeType', true);
        setRuleData('inputTreeLength', str.length);
        setRuleData('position', position);
      }
    }
  }
  onChange = (e) => {
    this.fetchXxclData(e, 'change');
  }
  onChangeBT = (e) => {
    const { setJsonMsgData, jsonMsg, msgKey } = this.props;
    const data = jsonMsg.filter(item => item.MSG_CHNL === msgKey);
    if (data.length > 0) {
      jsonMsg.forEach((item) => {
        if (item.MSG_CHNL === msgKey) {
          item.TMPL_SBJ = e.target.value;
        }
      });
    } else {
      const jsonMsgItem = {
        MSG_CHNL: msgKey,
        TMPL_CNTNT: '',
        TMPL_SBJ: e.target.value,
      };
      jsonMsg.push(jsonMsgItem);
    }
    if (setJsonMsgData) {
      setJsonMsgData(jsonMsg);
    }
  }
  onChangeNR = (e) => {
    const { setJsonMsgData, jsonMsg, msgKey } = this.props;
    const data = jsonMsg.filter(item => item.MSG_CHNL === msgKey);
    if (data.length > 0) {
      jsonMsg.forEach((item) => {
        if (item.MSG_CHNL === msgKey) {
          item.TMPL_CNTNT = e.target.value;
        }
      });
    } else {
      const jsonMsgItem = {
        MSG_CHNL: msgKey,
        TMPL_CNTNT: e.target.value,
        TMPL_SBJ: '',
      };
      jsonMsg.push(jsonMsgItem);
    }
    if (setJsonMsgData) {
      setJsonMsgData(jsonMsg);
    }
  }
  onChangeTabs = (value) => {
    const { setRuleData } = this.props;
    if (setRuleData) {
      setRuleData('msgKey', value);
    }
  }
  //修改短信通道
  onChangePassageway = (e) => {
    const { setJsonMsgData, jsonMsg, msgKey } = this.props;
    jsonMsg.forEach((item) => {
      if (item.MSG_CHNL === msgKey) {
        item.EXTD_PARA = { smsChnl: e.target.value };
      }
    });
    if (setJsonMsgData) {
      setJsonMsgData(jsonMsg);
    }
  }
  onClickItem = (e) => {
    const { displayChannel, selectionChannel } = this.state;
    const displayItem = selectionChannel.filter(item => item.msgChnl === e.key);
    const selectionItem = selectionChannel.filter(item => item.msgChnl !== e.key);
    displayChannel.push(displayItem[0]);
    const { setRuleData } = this.props;
    this.setState({ displayChannel, selectionChannel: selectionItem });
    if (setRuleData) {
      setRuleData('msgKey', e.key);
    }
  }
  onDelect = (value) => {
    const { displayChannel, selectionChannel } = this.state;
    const selectionItem = displayChannel.filter(item => item.msgChnl === value);
    const displayItem = displayChannel.filter(item => item.msgChnl !== value);
    selectionChannel.push(selectionItem[0]);
    const { setRuleData } = this.props;
    this.setState({ displayChannel: displayItem, selectionChannel });
    if (setRuleData) {
      setRuleData('msgKey', displayItem[0].msgChnl);
    }
  }
  getItemsValue = () => {
    const valus = this.props.form.getFieldsValue();
    return valus;
  }
  fethHtml1 = () => {
    const { getFieldDecorator } = this.props.form;
    const { type, msgKey, jsonMsg, variableRecord } = this.props;
    const { dxtd = [] } = this.state; // MOT任务要求字典

    let content = '';
    let passageway = '';
    if (jsonMsg.length > 0) {
      jsonMsg.forEach((item) => {
        if (item.MSG_CHNL === msgKey) {
          content = item.TMPL_CNTNT;
          if (item.EXTD_PARA != null) {
            passageway = item.EXTD_PARA.smsChnl;
          }
        }
      });
    }
    for (const item of variableRecord) {
      const re = new RegExp(`\\\${${item.varCode}}`, 'g');
      content = content.replace(re, `\${${item.varDesc}}`);
    }
    const html1 = (
      <div className="mot-yyb-mobannr_box" style={{ height: dxtd.length !== 0 && msgKey === '8' ? '299px' : '275px' }} >
        <div className="mot-yyb-moban-box mouldbox" style={{ padding: '0px' }} >
          <div>
            <div>{
              dxtd.length !== 0 && msgKey === '8' ? (
                <Form.Item label={(<span>短信通道</span>)}>
                  {getFieldDecorator('DXTD', { initialValue: passageway !== undefined ? passageway : '', rules: [{ required: true, message: '短信通道不允许为空!' }] })(<Radio.Group disabled={type} onChange={this.onChangePassageway}>{dxtd.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                </Form.Item>
              ) : ''
            }
            </div>
            <Input.TextArea ref={input => this.contentProp = input} autosize={{ minRows: 12, maxRows: 12 }} value={content} disabled={type} onChange={this.onChangeNR} />
          </div>
        </div>
      </div>
    );
    return html1;
  }
  fethHtml2 = () => {
    const { type, msgKey, jsonMsg, variableRecord } = this.props;
    let content = '';
    let title = '';
    if (jsonMsg.length > 0) {
      jsonMsg.forEach((item) => {
        if (item.MSG_CHNL === msgKey) {
          content = item.TMPL_CNTNT;
          title = item.TMPL_SBJ;
        }
      });
    }
    for (const item of variableRecord) {
      const re = new RegExp(`\\\${${item.varCode}}`, 'g');
      content = content.replace(re, `\${${item.varDesc}}`);
    }
    const html2 = (
      <div className="mot-yyb-mobannr_box" style={{ height: '275px' }}>
        <div className="mot-yyb-moban-box mouldbox" >
          <div className="mot-yyb-moban-title">标题：&nbsp;<Input type="text" value={title} disabled={type} style={{ width: '90%', height: '25px' }} onChange={this.onChangeBT} />
          </div>
          <div><Input.TextArea ref={input => this.contentProp = input} autosize={{ minRows: 9, maxRows: 9 }} value={content} disabled={type} onChange={this.onChangeNR} />
          </div>
        </div>
      </div>
    );
    return html2;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { type, data, treeData, msgKey } = this.props;
    const { xxlmList, xxclList, displayChannel, selectionChannel, xxlmDefault, xxclDefault } = this.state;
    // 模板
    const sfDicts = [{ ibm: '0', note: '否' }, { ibm: '1', note: '是' }];
    let xxlm = '';
    let xxcl = '';
    let xxsfsh = '';
    if (data.wthrRvwMsg !== undefined) {
      sfDicts.forEach((item) => {
        if (item.ibm === data.wthrRvwMsg) {
          xxsfsh = item.note;
        }
      });
    }
    if (data.msgCol !== undefined) {
      xxlmList.forEach((item) => {
        if (item.id === data.msgCol) {
          xxlm = item.name;
        }
      });
    }
    if (data.msgSttg !== undefined) {
      xxclList.forEach((item) => {
        if (item.id === data.msgSttg) {
          xxcl = item.sttgNm;
        }
      });
    }
    const menu = (
      <Menu onClick={this.onClickItem}>
        {selectionChannel.map(item => <Menu.Item key={item.msgChnl}>{item.chnlNm}</Menu.Item>)}
      </Menu>
    );
    return (
      <Fragment>
        <Form className="event-releaseRule-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={24} sm={6} md={6} lg={6}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>消息栏目：{xxlm}</span>
                  : (
                    <Form.Item label={(<span>消息栏目</span>)}>
                      {getFieldDecorator('XXLM', { initialValue: data.msgCol !== undefined && data.msgCol !== '' ? data.msgCol : xxlmDefault, rules: [{ required: true, message: '消息推送规则的消息栏目不允许为空!' }] })(<Select
                        style={{ minWidth: '140px' }}
                      >
                        {xxlmList.map(item => <Option value={item.id}>{item.name}</Option>)}
                      </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={5} md={5} lg={5}>
              <div className={type ? 'factor-item' : 'useful-time'} style={{ display: 'flex' }}>
                {type ? <span>有效时间：{data.msgVldTmLgth}</span>
                  : (
                    <Form.Item label={(<span>有效时间</span>)}>
                      {getFieldDecorator('YXSJ', { initialValue: data.msgVldTmLgth !== '' ? data.msgVldTmLgth : 0, rules: [{ required: true, message: '消息推送规则的有效时间不允许为空!' }] })(<Input style={{ width: '50px', color: '#333333', border: type ? 0 : '' }} />)}
                    </Form.Item>
                  )}
                <span style={{ marginTop: type ? '' : '19px' }}>小时</span>
              </div>
            </Col>
            <Col xs={24} sm={5} md={5} lg={5}>
              <div className={type ? 'factor-item' : 'plan-time'} style={{ display: 'flex' }} >
                {type ? <span>预发送时间：{data.msgPreSndTm}</span>
                  : (
                    <Form.Item label={(<span>预发送时间</span>)}>
                      {getFieldDecorator('YFSSJ', { initialValue: data.msgPreSndTm !== '' ? moment(data.msgPreSndTm, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss'), rules: [{ required: true, message: '消息推送规则的预发送时间不允许为空!' }] })(<TimePicker format="HH:mm:ss" style={{ color: '#333333', lineHight: 2.5, width: '100px' }} />)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={7} md={7} lg={7}>
              <div className={type ? 'factor-item' : ''} style={{ display: 'flex' }}>
                {type ? <span>消息是否审核：{xxsfsh}</span>
                  : (
                    <Form.Item label={(<span>消息是否审核</span>)}>
                      {getFieldDecorator('XXSFSH', { initialValue: data.wthrRvwMsg !== undefined ? data.wthrRvwMsg : '0', rules: [{ required: true, message: '消息推送规则的是否审核不允许为空!' }] })(<Radio.Group >{sfDicts.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                    </Form.Item>
                  )}
              </div>

            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={6} md={6} lg={6}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>消息策略：{xxcl}</span>
                  : (
                    <Form.Item label={(<span>消息策略</span>)}>
                      {getFieldDecorator('XXCL', { initialValue: data.msgSttg !== undefined && data.msgSttg !== '' ? data.msgSttg : xxclDefault, rules: [{ required: true, message: '消息推送规则的消息策略不允许为空!' }] })(<Select
                        style={{ minWidth: '140px' }}
                        onChange={this.onChange}
                      >
                        {xxclList.map(item => <Option value={item.id}>{item.sttgNm}</Option>)}
                      </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
          </Row>
        </Form>

        <Row>
          <div>
            <Col xs={24} sm={17} md={17} lg={17}>
              <div className="factor-item" >
                <div>
                  <table border="0" cellSpacing="0" cellPadding="0" className="mot-yyb-mobantable">
                    <tbody>
                      <tr className="mouldTabs">
                        {displayChannel.map(item => (
                          <td className={item.msgChnl === msgKey ? 'sel' : ''} onClick={() => this.onChangeTabs(item.msgChnl)}>
                            {item.type === 'selection' ? <Icon type="close" style={{ color: '#CCCCCC', marginRight: '20px' }} onClick={() => this.onDelect(item.msgChnl)} /> : ''}
                            <span>{item.chnlNm}</span>
                          </td>
                        ))
                        }
                        {type ? '' : <td style={{ width: '5%' }}><Dropdown overlay={menu} trigger={['click']} placement="bottomRight" disabled={!(selectionChannel.length > 0)}><Icon type="plus" style={{ color: '#CCCCCC' }} /></Dropdown></td>}
                      </tr>
                    </tbody>
                  </table>
                  {displayChannel.map(item => (item.msgChnl === msgKey ? item.form === '2' ? this.fethHtml2(msgKey) : this.fethHtml1(msgKey) : ''))}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={7} md={7} lg={7}>
              <div className="factor-item" style={{ margin: '1rem 2rem 0 1rem' }}>
                <Card >
                  <Scrollbars autoHide style={{ width: '100%', height: '24.2rem' }} >
                    {treeData.length !== 0 ? (
                      <Tree
                        defaultExpandAll
                        onSelect={this.onSelect}
                        treeData={treeData}
                        className="factor-tree"
                        disabled={type}
                      />
                    ) : ''}
                  </Scrollbars>
                </Card >
              </div>
            </Col>
          </div>

        </Row>
      </Fragment>
    );
  }
}

export default Form.create()(MsgRule);
