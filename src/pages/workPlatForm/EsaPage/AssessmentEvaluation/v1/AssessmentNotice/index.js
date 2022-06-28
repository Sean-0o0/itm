/*
 * @Description: 考核须知
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import AssessmentNoticeComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentNotice';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

class AssessmentNotice extends Component {
  constructor(props) {
    // const { userBasicInfo: { orgid = '', orgname = '' } } = props;
    super(props);
    this.state = {
      // orgNo: Number(orgid),
      // orgName: orgname,
      height: 0
    };
  }
  onClick = () => {
    const { match: { params: { params = '' } } } = this.props;
    window.location.href = `/#/esa/evaluation/v1/assessmentTable/${params}`;
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 109;
    this.setState({ height });
  }
  render() {
    const { height } = this.state;
    const { match: { params: { params = '' } } } = this.props;
    try {
      const { adpatScoreType } = JSON.parse(DecryptBase64(params));
      return (
       <Fragment>
        <div style={{ height, overflow: 'hidden' }}>
        <AssessmentNoticeComponent height={height} id={adpatScoreType} params = {params} onClick={this.onClick} />
        </div>
        </Fragment>
      );
    } catch (e) { return null; }
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AssessmentNotice);