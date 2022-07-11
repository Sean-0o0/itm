/* eslint-disable prefer-destructuring */
import React, { Fragment } from 'react';
import { Row, Checkbox, Tabs } from 'antd';
import MessagePush from './MessagePush';
import TaskAssignment from './TaskAssignment';


// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';


// 右边内容模块-发布规则
const { TabPane } = Tabs;

class PublishingRules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillReceiveProps() {

  }


  render() {
    const { dictionary = {}, motDetail = {}, edit, onSavaEditData, codeArrList } = this.props;
    // 多选框勾选
    // const { [getDictKey('MOT_CUST_RNG')]: allowDicts = [] } = dictionary;
    let allowArr = [];
    if (motDetail) {
      const dstrRng = motDetail.dstrRng;
      switch (Number(dstrRng)) {
        case 1: allowArr = ['1']; break;
        case 2: allowArr = ['2']; break;
        case 3: allowArr = ['1', '2']; break;
        case 4: allowArr = ['4']; break;
        case 5: allowArr = ['1', '4']; break;
        default: allowArr = [];
      }
    }

    return (
      <Fragment>
        <Row>
          <Row style={{ padding: '0 0 1rem 0' }}>
            <div style={{ float: 'left', color: '#333333', fontWeight: 'bold' }}>发布规则 </div>
            <div style={{ float: 'right' }}>
              {
                Number(motDetail.tgtTp) === 2 ? (
                  <Checkbox.Group value={allowArr} disabled className="mot-yyb-check">
                    <Checkbox value="1">员工任务</Checkbox>
                    <Checkbox value="4">员工提醒</Checkbox>
                  </Checkbox.Group>
                ) : (
                  <Checkbox.Group value={allowArr} disabled className="mot-yyb-check">
                    <Checkbox value="1">员工任务</Checkbox>
                    <Checkbox value="2">客户提醒</Checkbox>
                  </Checkbox.Group>
                  )
              }

            </div>

          </Row>
          <Row>
            <Tabs
              defaultActiveKey="1"
              className="mot-tabs"
            >
              {
                    (Number(motDetail.dstrRng) === 1 || Number(motDetail.dstrRng) === 3 || Number(motDetail.dstrRng) === 5) ? (
                      <TabPane tab="任务分配规则" key="1">
                        <TaskAssignment
                          dictionary={dictionary}
                          motDetail={motDetail}
                          edit={edit}
                          onSavaEditData={onSavaEditData}
                        />
                      </TabPane>
                    ) : (
                        ''
                    )
                }
              {
                    (Number(motDetail.dstrRng) === 2 || Number(motDetail.dstrRng) === 3 || Number(motDetail.dstrRng) === 4 || Number(motDetail.dstrRng) === 5) ? (
                      <TabPane tab="消息推送规则" key="2">
                        <MessagePush
                          dictionary={dictionary}
                          motDetail={motDetail}
                          edit={edit}
                          onSavaEditData={onSavaEditData}
                          codeArrList={codeArrList}
                        />
                      </TabPane>
                    ) : (
                        ''
                    )
                }
            </Tabs>
          </Row>
        </Row>
      </Fragment>
    );
  }
}

export default PublishingRules;
