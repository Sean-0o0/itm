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
  hjxxRecordCallback = (record) => {
    const {prizeInfoCallback} = this.props;
    prizeInfoCallback(record);
  }

  //课题信息回调
  ktxxRecordCallback = (record) => {
    const {topicInfoCallback} = this.props;
    topicInfoCallback(record);
  }

  //需求信息回调
  xqxxRecordCallback = (record) => {
    const {requirementInfoCallback} = this.props;
    requirementInfoCallback(record);
  }

  render() {
    return (
      <div>
        <RequirementInfo xqxxRecordCallback={this.xqxxRecordCallback}/>
        <PrizeInfo hjxxRecordCallback={this.hjxxRecordCallback}/>
        <TopicInfo ktxxRecordCallback={this.ktxxRecordCallback}/>
      </div>
    );
  }
}

export default OthersInfos;
