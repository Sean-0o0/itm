import React from 'react';
import { Form,message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import ApproveDetail from './ApproveDetail';
import AssessmentResult from './AssessmentResult';
import RevisePlan from './RevisePlan';
import RevisionTask from './RevisionTask';
import FeedbackTask from './FeedbackTask';
import ProcessInfo from './ProcessInfo';
import { FetchProcessStepDeatil,FetchIncomdispAssess,FetchIncomdispProgress } from '../../../../services/processCenter';
import ProgressBar from './ProgressBar';

class ProcessDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proInfo:[],//流程详情
      stepDetail:[],//流程步骤详情
      assResult:[],//评估结果
      revisePlan:[],//修订计划
      revisionTask:[],//内部制度修订任务 
      feedbackTask:[],//制度执行整改情况反馈任务
      feedbacDesp:[],//制度执行整改情况反馈说明
      proProgress:[],//流程进度详情
    };
  }
  componentDidMount() {
    const {instid = ''} = this.props;
    //console.log('instid',instid);
    this.fetchProcessStepDeatil(instid);
    this.fetchIncomdispAssess(instid,1);
    this.fetchIncomdispAssess(instid,2);
    this.fetchIncomdispAssess(instid,3);
    this.fetchIncomdispAssess(instid,4);
    this.fetchIncomdispAssess(instid,5);
    this.fetchIncomdispProgress(instid);
  }

  fetchProcessStepDeatil = ( instId ) => {
    FetchProcessStepDeatil({
      instId : instId
    })
        .then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) { 
                this.setState({ stepDetail: records });
            }
        })
        .catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
  };

  fetchIncomdispAssess = ( instId,type ) => {
    FetchIncomdispAssess({
      instId : instId,
      type : type
    })
        .then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                if(type === 1){
                  this.setState({ proInfo: records });
                }else if(type === 2){
                  this.setState({ assResult: records });
                }else if(type === 3){
                  this.setState({ revisePlan: records });
                }else if(type === 4){
                  this.setState({ revisionTask: records });
                }else if(type === 5){
                  this.setState({ feedbackTask: records });
                }else if(type === 6){
                  this.setState({ feedbackDesp: records });
                }
            }
        })
        .catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
  };
  fetchIncomdispProgress = ( instId ) => {
    FetchIncomdispProgress({
      instId : instId
    })
        .then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) { 
                this.setState({ proProgress: records });
            }
        })
        .catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
  };
  render() {
    const {proInfo = [], stepDetail = [], assResult = [], revisePlan = [], revisionTask = [], feedbackTask = [], feedbacDesp = [], proProgress = []} = this.state;
    return (
      <Form className="factor-form" style={{height: '100%'}}>
        <Scrollbars autoHide style={{ width: '100%', height: '100%' }} >
          <div className='flex-r' style={{'backgroundColor':'#F6F6F6'}}>
            <div className='bar bgw'>
              <ProgressBar proProgress = {proProgress}/>
            </div>
            <div className='flex-c bgw' style={{'width':"84%",margin:'1%'}}>
              <ProcessInfo proInfo = {proInfo}/>
              <ApproveDetail stepDetail = {stepDetail}/>
               <AssessmentResult assResult = {assResult}/>
              <RevisePlan revisePlan = {revisePlan}/>
              <RevisionTask revisioTask = {revisionTask}/> 
              {/* <FeedbackTask feedbackTask = {feedbackTask} fetchIncomdispAssess = {this.fetchIncomdispAssess} feedbacDesp = {feedbacDesp}/> */}
            </div>
          </div>
          
        </Scrollbars>
      </Form>
    );
  }
}

export default Form.create()(ProcessDetail);
