import {Table, Input, Button, Popconfirm, Form} from 'antd';
import {Component} from "react";
import RequirementInfo from "./RequirementInfo";
import PrizeInfo from "./PrizeInfo";
import TopicInfo from "./TopicInfo";

class OthersInfos extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {} = this.state;
    return (
      <div>
        <RequirementInfo/>
        <PrizeInfo/>
        <TopicInfo/>
      </div>
    );
  }
}

export default OthersInfos;
