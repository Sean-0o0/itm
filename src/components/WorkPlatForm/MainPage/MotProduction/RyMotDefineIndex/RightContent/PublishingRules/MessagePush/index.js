/* eslint-disable react/no-unused-state */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, message, Form, Select, Input, Radio } from 'antd';
import { FetchqueryMessageStrategy, FetchqueryMessageStrategyDisplayChannel, FetchqueryMessageColumn } from '../../../../../../../../services/motProduction';
import { FetchqueryShortMessageChannel } from '../../../../../../../../services/basicservices';
// 引入请求路径的示例


// 右边内容模块-发布规则-消息推送
class MessagePush extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xxcl: '', // 表格消息策略
      xxlm: '', // 消息栏目
      channel: '', // 模板
    };
  }


  componentWillMount() {
    const { motDetail = {} } = this.props;
    // 策略ID
    const clid = motDetail.msgSttg;
    // 表格消息策略
    const xxcl = this.fetchData(clid);
    // 消息栏目
    const xxlm = this.fetchXxlmData(motDetail.msgCol);
    // 模板

    this.fetchXxclData(clid);
    //获取短信通道
    this.fetchDxtd();
    this.setState({
      xxcl,
      xxlm,
    });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.motDetail !== this.props.motDetail) {
      const { motDetail = {} } = nextProps;
      // 策略ID
      const clid = motDetail.msgSttg;
      // 表格消息策略
      const xxcl = this.fetchData(clid);
      // 消息栏目
      const xxlm = this.fetchXxlmData(motDetail.msgCol);
      // 模板

      this.fetchXxclData(clid);
      this.setState({
        xxcl,
        xxlm,
      });
    }
  }


    // 查询顶部表格发送渠道
    fetchData = (id = '') => {
      let channel = '';
      if (id !== '') {
        FetchqueryMessageStrategy({}).then((res) => {
          const { code = 0, records = [] } = res;
          if (code > 0) {
            records.map((item) => {
              if (Number(id) === Number(item.id)) {
                channel = item.sttgNm;
                this.setState({
                  xxcl: channel,
                });
              }
            });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    }

    // 查询模板消息策略
    fetchXxclData = (sttg = '') => {
      let title = '';
      if (sttg !== '') {
        const payload = {
          sttg,
        };
        FetchqueryMessageStrategyDisplayChannel(payload).then((res) => {
          const { code = 0, records = [] } = res;
          if (code > 0 && records.length > 0) {
            title = records[0].chnlNm;
            const Data = [];
            records.forEach((item) => {
              const data = { ...item };
              Data.push(data);
            });
            this.setState({
              channel: title,
              displayChannel: Data,
              defaultActiveKey: records[0].msgChnl,
            });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    }

    // 查询消息栏目

    fetchXxlmData = (msgCol = '') => {
      let xxlm = '';
      FetchqueryMessageColumn({}).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          records.map((item) => {
            if (Number(msgCol) === Number(item.id)) {
              xxlm = item.name;
              this.setState({
                xxlm,
              });
            }
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });


      // return xxlm;
    }

    // 替换模板中的变量
    structTmplData = (codeArrList = [], cntntTmpl) => {
      let temp = cntntTmpl;

      codeArrList.forEach((item) => {
        if (temp.indexOf(item.varCodeUse) !== -1) {
          temp = temp.replace(item.varCodeUse, item.varDescUse);
        }
      });

      return temp;
    }
  onChangeTabs = (value) => {
    const { motDetail = {} } = this.props;
    let content = '';
    let title = '';

    if (motDetail.jsonMsgSndRule) {
      const jsonMsg = JSON.parse(motDetail.jsonMsgSndRule);
      if (jsonMsg.length > 0) {
        jsonMsg.forEach((item) => {
          if (item.MSG_CHNL === value) {
            content = item.TMPL_CNTNT;
            title = item.TMPL_SBJ;
          }
        });
      }
    }
    this.setState({ defaultActiveKey: value, content, title });
  }

 //获取短信通道
 fetchDxtd = () =>{
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
  render() {
    const { motDetail = {}, codeArrList } = this.props;
    const { xxlm = '', xxcl = '', displayChannel, defaultActiveKey, dxtd = [] } = this.state;
    const sendTime = motDetail.msgPreSndTm || '';
    const yxsj = motDetail.msgVldTmLgth || '';
    // 策略ID
    // const clid = motDetail.msgSttg;
    // 表格消息策略
    // const xxcl = this.fetchData(clid);
    // 消息栏目
    // const xxlm = this.fetchXxlmData(motDetail.msgCol);
    // 模板
    let content = '';
    let title = '';
    let passageway = '';
    // let channel = ''
    if (motDetail.jsonMsgSndRule) {
      const jsonMsg = JSON.parse(motDetail.jsonMsgSndRule);
      content = this.structTmplData(codeArrList, jsonMsg[0].TMPL_CNTNT);
      title = jsonMsg[0].TMPL_SBJ;
      if(jsonMsg[0].EXTD_PARA != null){
        passageway = jsonMsg[0].EXTD_PARA.smsChnl;
      }
      // channel = this.fetchXxclData(jsonMsg[0].MSG_CHNL);
    }
    const html1 = (
      <div className="mot-yyb-mobannr_box" style={{ height: '275px' }} >
        <div className="mot-yyb-moban-box mouldbox" style={{ padding: '0px' }} >
          <div>
          {
                dxtd.length !== 0 && passageway !== '' ?(
                  <div style={{background:'#F5F5F5',padding:'10px 15px'}}>
                  <span style={{marginRight:'10px'}}>短信通道:</span>
                  <Radio.Group disabled value={passageway}>{dxtd.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>
                  </div>
                  ):''
            }
            <Input.TextArea autosize={{ minRows: 12, maxRows: 12 }} value={content} disabled />
          </div>
        </div>
      </div>
    );
    const html2 = (
      <div className="mot-yyb-mobannr_box" style={{ height: '275px' }}>
        <div className="mot-yyb-moban-box mouldbox" >
          <div className="mot-yyb-moban-title">标题：&nbsp;<Input type="text" value={title} disabled style={{ width: '90%', height: '25px' }} />
          </div>
          <div><Input.TextArea autosize={{ minRows: 9, maxRows: 9 }} value={content} disabled />
          </div>
        </div>
      </div>
    );


    return (
      <Fragment>
        <Row>
          <Form className="mot-yyb-form">
            <Form.Item>
              <Col span={6}>
                <Form.Item label="消息栏目" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  <Select disabled value={xxlm} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="消息策略" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  <Select disabled value={xxcl} />
                </Form.Item>
              </Col>
              <Col span={4}>

                <Form.Item label="有效时间" labelCol={{ span: 13 }} wrapperCol={{ span: 10 }}>
                  <span>{yxsj}</span>小时
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="预发送时间" labelCol={{ span: 13 }} wrapperCol={{ span: 11 }}>
                  <span>{sendTime}</span>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item label="消息是否审核" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }}>
                  <span>{Number(motDetail.wthrRvwMsg) === 0 ? '否' : '是'}</span>

                </Form.Item>
              </Col>


            </Form.Item>
          </Form>


          <div>
            <table border="0" cellSpacing="0" cellPadding="0" className="mot-yyb-mobantable">
              <tbody>
                <tr className="mouldTabs">
                  { displayChannel !== undefined ? displayChannel.map(item => (
                    <td
                      className={item.msgChnl === defaultActiveKey ? 'sel' : ''}
                      onClick={() => this.onChangeTabs(item.msgChnl)}
                    >
                      <span>{item.chnlNm}</span>
                    </td>
)) : ''
                                    }
                </tr>
              </tbody>
            </table>
            {displayChannel !== undefined ? displayChannel.map(item => (item.msgChnl === defaultActiveKey ? item.form === '2' ? html2 : html1 : '')) : ''}
          </div>
        </Row>
      </Fragment>
    );
  }
}

export default MessagePush;
