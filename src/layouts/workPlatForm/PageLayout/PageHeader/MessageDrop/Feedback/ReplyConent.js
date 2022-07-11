import React, { Component } from 'react';
import { Row, Col, Form, Switch, Button, Input } from 'antd';
import lodash from 'lodash';
import touxiang from '../../../../../../assets/schemedigital/touxiang.png';
import styles from './index.less';

class ReplyConent extends Component {
    state={
      anoKey: 0, // 是否匿名 1|是 0|否
    }
  /** 获取匿名参数 */
  handelSwith = (e) => {
    this.setState({
      anoKey: e ? 1 : 0,
    });
  }
 handleClick=(item) => {
   const { handleSubmit, idea_Id } = this.props;
   const { anoKey } = this.state;
   const { allFbId = '', fbId = '' } = item;
   let replymes = '';
   this.props.form.validateFields((err, values) => {
     if (err) { return; }
     replymes = lodash.get(values, 'replymes', '');
   });
   if (handleSubmit) {
     handleSubmit({ anoKey, replyid: allFbId, towho: fbId, replymes, ideaid: idea_Id });
   }
 }
 render() {
   const { getFieldDecorator } = this.props.form;
   const { item, formatTimer } = this.props;
   return (
     <React.Fragment>
       {Object.keys(item).length !== 0 && (
         <Row style={{ background: '#ecedee', padding: '1rem 1rem 0' }}>
           <Col span={2} style={{ padding: '0 1rem' }}>
             <img src={touxiang} alt="头像" width="80%" />
           </Col>
           <Col span={22}>
             <div>{item.fbCont}</div>
             <div style={{ width: '100%' }}>
               <span style={{ padding: '0 1rem', color: '#32A2D5' }}> {item.fbStf} </span>
               {item.post && <span className={styles.lebal}>{item.post}</span>}
               <span style={{ padding: '0 1rem' }}> {formatTimer && formatTimer(item.fbTm)}</span>
             </div>
           </Col>
           <Col span={24} style={{ padding: '1rem' }}>
             <Form.Item style={{ margin: '0' }}>
               {getFieldDecorator('replymes', { initialValue: '' })(<Input.TextArea placeholder={`回复:${item.fbStf}`} autosize={{ minRows: 2 }} />)}
             </Form.Item>
           </Col>
           <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem 1rem' }}>
             <span> <Switch size="small" defaultChecked={false} onChange={this.handelSwith} />&nbsp;&nbsp;匿名</span>
             <span><Button type="primary" onClick={() => this.handleClick(item)}>回复</Button></span>
           </Col>
         </Row>
       )}
     </React.Fragment>
   );
 }
}
export default Form.create()(ReplyConent);
