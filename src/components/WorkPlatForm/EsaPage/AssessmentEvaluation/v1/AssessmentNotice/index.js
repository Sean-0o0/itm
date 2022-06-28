/*
 * @Description: 考核须知
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */

import AssessmentNoticeTop from './AssessmentNoticeTop'
import AssessmentNoticeBottom from './AssessmentNoticeBottom'
import React, { Component, Fragment } from 'react';
import { FetchQueryScorType } from '../../../../../../services/EsaServices/assessmentEvaluation'
import { Button, message, Card } from 'antd';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
class AssessmentNotice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      khList: [],

    };
  }
  componentDidMount() {
    const { id } = this.props;

    const params = {
      id
    };
    this.queryScorType(params);

  }
  queryScorType = (params) => {
    FetchQueryScorType({ ...params }).then((res) => {
      const { records = [] } = res;

      this.setState({
        khList: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const par = {
      khList: this.state.khList
    }
    const control = {
      display: ''
    }
    const { examPgmName = '', height, noMargin = false } = this.props;
    //  const examPgmName = JSON.parse(DecryptBase64(examPgmName));
    return (
      <Fragment>
        <Card bodyStyle={{ margin: noMargin ? '0' : '1.5rem 2rem -2rem 2rem', height }}>
          <div>
            <div >
              <span style={{ color: '#333', fontSize: '1.666rem', fontWeight: 'bold' }}>{JSON.parse(DecryptBase64(this.props.params)).examPgmName}</span>
            </div>
            <br></br>
            <AssessmentNoticeTop {...par}></AssessmentNoticeTop>
            <AssessmentNoticeBottom {...par}></AssessmentNoticeBottom>
            <br></br>
            {
              !this.props.buttonHidden &&
              <div style={{ marginLeft: "50%" }}>
                <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" style={control} onClick={this.props.onClick}>已同意开始考核</Button>
              </div>
            }
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default AssessmentNotice;