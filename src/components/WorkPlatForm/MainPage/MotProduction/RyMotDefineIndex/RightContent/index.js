/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Card, Row, message } from 'antd';
import { FetchqueryMotEventInfo, FetchqueryAvailableIndex } from '../../../../../../services/motProduction';
import BasicInfo from './BasicInfo';
import PublishingRules from './PublishingRules';
import ContentTemplate from './ContentTemplate';
import RuleDefinition from './RuleDefinition';

// 员工定义-右边模块
class RightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      motDetail: {}, // mot事件详情

    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMotId !== this.props.selectedMotId && nextProps.selectedMotId !== '') {
      this.setState({
        edit: false,
      });
      this.fetchMotDetail(nextProps.selectedMotId);
    }
  }

    // 查询mot事件具体信息
    fetchMotDetail = (evntId) => {
      const { userInfo = {} } = this.props;
      FetchqueryMotEventInfo({ evntId, orgId: userInfo.orgid }).then((res) => {
        const { code = 0, records = [] } = res;
        if (code > 0) {
          this.setState({
            motDetail: records[0],

          }, () => [
            this.fetchCodeData(records[0]),
          ]);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 获取指标编码 进行替换
    fetchCodeData = (motDetail = {}) => {
      const { tgtTp = '' } = this.props;
      const payload = {
        evntCmptRule: motDetail.jsonCalcRule, // 计算规则
        tgtTp: Number(tgtTp), // 目标类型
      };
      FetchqueryAvailableIndex(payload).then((res) => {
        const { code = 0, variableRecord = [] } = res;
        if (code > 0) {
          this.setState({
            codeArrList: variableRecord,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    render() {
      const { motDetail = {}, codeArrList = [] } = this.state;
      const { dictionary = {}, leftPanelList, yybList = [], tgtTp = '', userInfo, selectedMotId } = this.props;
      return (
        <Fragment >
          <Card
            title={<div style={{ fontSize: '18px' }}>{motDetail.evntNm}</div>}
            style={{ overflow: 'auto', height: '700px' }}
          >
            <Row>
              {/* 基本信息 */}
              <BasicInfo motDetail={motDetail} yybList={yybList} dictionary={dictionary} tgtTp={tgtTp} leftPanelList={leftPanelList} userInfo={userInfo} />
            </Row>
            {/* <Divider></Divider> */}
            <Row>
              {/* 规则定义 */}
              <RuleDefinition motDetail={motDetail} fetchMotDetail={this.fetchMotDetail} dictionary={dictionary} tgtTp={tgtTp} selectedMotId={selectedMotId} userInfo={userInfo} />
            </Row>
            {/* <Divider></Divider> */}
            <Row>
              {/* 内容模板 */}
              <ContentTemplate motDetail={motDetail} codeArrList={codeArrList} />
            </Row>
            {/* <Divider></Divider> */}
            <Row>
              {/* 发布规则 */}
              <PublishingRules motDetail={motDetail} dictionary={dictionary} codeArrList={codeArrList} />
            </Row>

          </Card>


        </Fragment >
      );
    }
}

// export default connect(({ motEvent, global }) => ({
//     dictionary: global.dictionary,
//     authorities: global.authorities,
// }))(RyMotDefineIndex);
export default RightContent;
