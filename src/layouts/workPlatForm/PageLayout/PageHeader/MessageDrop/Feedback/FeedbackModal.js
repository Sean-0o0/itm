import React, { Component } from 'react';
import Moment from 'moment';
import lodash from 'lodash';
import { Row, Card, Col, Form, Switch, Button, Input, message, Spin } from 'antd';
import { FetchLabelFeedbackList, FetchlabelFeedbackReply, FetchlabelFeedbackOperate } from '../../../../../../services/label';
import ReplyConent from './ReplyConent';

class FeedbackModal extends Component {
    state = {
      lebalData: {},
      replyData: {},
      anoKey: 0, // 是否匿名 1|是 0|否
      loading: true,
    }
    componentDidMount() {
      const { objTp, objId } = this.props.record;
      if (objTp === '8') {
        this.fetchLalelData(objId);
      } else if (objTp === '10') {
        this.fetchlabelFeedbackReply(objId);
      }
    }
    /** 获取匿名参数 */
  handelSwith = (e) => {
    this.setState({
      anoKey: e ? 1 : 0,
    });
  }
  /** 查询反馈列表 */
  fetchLalelData=(objId) => {
    FetchLabelFeedbackList({
      idea_id: objId || '',
      current: 1,
      lbl_nm: '',
      lbl_tp: '',
      pageSize: 5,
      pagelength: 5, // 每页条数
      pageno: 1, // 当前页
      paging: 1, // 是否分页 0|否 1|是
      sort: '',
      suit_rg: '',
      total: -1,
      totalrows: 0,
      ver_ed: '',
      ver_st: '',
    }).then((res) => {
      const { records = [], code = '' } = res || {};
      if (code > 0) {
        this.setState({
          lebalData: lodash.get(records, '[0]', {}),
          loading: false,
        });
      }
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }
  /** 查询回复 */
  fetchlabelFeedbackReply =(objId) => {
    FetchlabelFeedbackReply({
      replyid: objId,
    }).then((res) => {
      const { records = [], code = 1 } = res || {};
      const ideaid = lodash.get(records, '[0].ideaId', {});
      if (code > 0) {
        this.setState({
          replyData: lodash.get(records, '[0]', {}),
        });
        this.fetchLalelData(ideaid);
      }
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }
  /** 回复操作 */
  handleSubmit = (parmas) => {
    const { ideaid, replyid, anoKey: replyAnoKey, replymes: secondsReply, towho } = parmas;
    const { handleCancel, onRefresh, record = {} } = this.props;
    const { rmndId = '' } = record;
    const { anoKey } = this.state;
    let replymes = '';
    this.props.form.validateFields((err, values) => {
      if (err) { return; }
      replymes = lodash.get(values, `${ideaid}`, '');
    });
    if (replymes !== '' || secondsReply !== '') {
      FetchlabelFeedbackOperate({
        ano: anoKey || replyAnoKey,
        idea_id: ideaid,
        oprt_tp: 4, // 操作类型 1|新增 2|修改 3|删除 4|回复
        replymes: replymes || secondsReply,
        replyid,
        towho,
      }).then((res) => {
        const { code, note } = res;
        if (code > 0) {
          if (handleCancel) handleCancel(); // 关闭弹窗
          if (onRefresh) onRefresh(); // 刷新页面
          message.success(note);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      message.warning('回复信息为空，不能提交！');
    }
  }
  /** 格式化时间 */
   formatTimer=(timer) => {
     const Now = Moment().format('YYYY-MM-DD HH:mm:ss'); // 当前时间
     const EOTs = Moment(Now).diff(timer, 'seconds', true); // 时差--秒
     const EOTm = Moment(Now).diff(timer, 'minutes', true); // 时差--分钟
     const EOTd = Moment(Now).diff(timer, 'days', true); // 时差--天
     const EOTy = Moment(Now).diff(timer, 'years', true); // 时差--年
     let timeDiff = '--';
     if (timer) {
       if (EOTs <= 5) {
         timeDiff = '刚刚';
       } else if (EOTs > 5 && EOTs < 30) {
         timeDiff = `${Math.round(EOTs)}秒前`;
       } else if (EOTs >= 30 && EOTm < 1) {
         timeDiff = '半分钟前';
       } else if (EOTm >= 1 && EOTm < 60) {
         timeDiff = `${Math.round(EOTm)}分钟前`;
       } else if (EOTm >= 60 && EOTm < 180) {
         timeDiff = `${Math.round(EOTm / 60)}小时前`;
       } else if (EOTm >= 180 && EOTd < 1) {
         if (Moment(Now).format('HH') <= Moment(timer).format('HH')) {
           timeDiff = `昨天${Moment(timer).format('HH:mm')}`;
         } else {
           timeDiff = `今天${Moment(timer).format('HH:mm')}`;
         }
       } else if (EOTd >= 1 && EOTd <= 2) {
         timeDiff = `昨天${Moment(timer).format('HH:mm')}`;
       } else if (EOTd > 2 && EOTd <= 7) {
         timeDiff = `${Math.round(EOTd)}天前`;
       } else if (EOTd > 7 && EOTy <= 1) {
         if (Moment(Now).format('YYYY') < Moment(timer).format('YYYY')) {
           timeDiff = `${Moment(timer).format('YYYY-MM-DD HH:mm')}`;
         } else {
           timeDiff = `${Moment(timer).format('MM-DD HH:mm')}`;
         }
       } else {
         timeDiff = `${Moment(timer).format('YYYY-MM-DD HH:mm')}`;
       }
     }
     return timeDiff;
   }
   render() {
     const { getFieldDecorator } = this.props.form;
     const { lebalData: item = {}, loading = true, replyData = {} } = this.state;
     return (
       <React.Fragment>
         <Spin spinning={loading}>
           <Row>
             <Col span={24}>
               <Card
                 className="m-card default"
                 style={{ position: 'relative' }}
                 title={<p>【{item.lblNm || '--'}】{item.ideaNm || '--'} </p>}
                 bordered
               >
                 <div style={{ padding: '0 2rem' }}>
                   <div style={{ width: '100%', padding: '1rem 0' }}>
                     {item.ideaCont || '--'}
                   </div>
                   <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: '2rem' }}>
                     <div style={{ color: '#00000073' }}>
                       <span style={{ paddingRight: '1rem' }}> {this.formatTimer(item.fdTm)} </span>
                       <span style={{ paddingRight: '1rem' }}> {item.crePers} </span>
                       <span> { item.eva === '1' ? '赞' : '踩' }</span>
                     </div>
                   </div>
                 </div>
               </Card>
             </Col>
           </Row>
           {Object.keys(replyData).length === 0 && (
             <Row>
               <Col span={24} style={{ padding: '0 1rem' }}>
                 <Form.Item style={{ marginBottom: '5px' }} >
                   {getFieldDecorator(`${item.ideaId}`, { initialValue: '' })(<Input.TextArea id="inputBox" autosize={{ minRows: 2 }} />)}
                 </Form.Item>
               </Col>
               <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem 1rem' }}>
                 <span> <Switch size="small" defaultChecked={false} onChange={this.handelSwith} />&nbsp;&nbsp;匿名</span>
                 <span><Button type="primary" onClick={() => this.handleSubmit({ ideaid: item.ideaId })}>评论</Button></span>
               </Col>
             </Row>
           )}
           <ReplyConent item={replyData} formatTimer={this.formatTimer} idea_Id={item.ideaId} handleSubmit={this.handleSubmit} />
         </Spin>
       </React.Fragment>
     );
   }
}
export default Form.create()(FeedbackModal);
