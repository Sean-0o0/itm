import {Table, Input, Button, Popconfirm, Form, message} from 'antd';
import {Component} from "react";
import RequirementInfo from "./RequirementInfo";
import PrizeInfo from "./PrizeInfo";
import TopicInfo from "./TopicInfo";
import {FetchQueryProjectInfoAll, FetchQuerySoftwareList} from "../../../../services/projectManage";
import Xxxx from "./PrizeInfo";

class OthersInfos extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //获奖信息回调
  hjxxRecordCallback = (record, flag) => {
    const {prizeInfoCallback} = this.props;
    prizeInfoCallback(record, flag);
  }

  //课题信息回调
  ktxxRecordCallback = (record, flag) => {
    const {topicInfoCallback} = this.props;
    topicInfoCallback(record, flag);
  }

  //需求信息回调
  xqxxRecordCallback = (record, flag) => {
    const {requirementInfoCallback} = this.props;
    requirementInfoCallback(record, flag);
  }

  render() {
    const {xmid} = this.props;
    return (
      <div>
        <RequirementInfo xmid={xmid} xqxxRecordCallback={this.xqxxRecordCallback}/>
        <PrizeInfo xmid={xmid} hjxxRecordCallback={this.hjxxRecordCallback}/>
        <TopicInfo xmid={xmid} ktxxRecordCallback={this.ktxxRecordCallback}/>
      </div>
    );
  }
}

export default OthersInfos;
