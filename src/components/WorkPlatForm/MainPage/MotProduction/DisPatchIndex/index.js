/* eslint-disable prefer-destructuring */
import React from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import DisPatchHead from './DisPatchHead';
import TaskItem from './TaskItem';
import { FetchQueryScheduleGroupList } from '../../../../../services/motProduction';

class DisPatchIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ScheduleGroup: [], // 股票代码选择的下拉框
      groupPayload: {
        cmptMode: 7,
        grpTp: 1,
        schdSt: '',
        tgtTp: '1;2;3',
        timer: ''
      },
    };
  }
  componentDidMount() {
    // this.addTimer();
    const refreshWebPage = localStorage.getItem('refreshWebPage');
    this.state.timer = setInterval(() => {
      //定时刷新
      this.queryScheduleGroupList(this.state.groupPayload);
    }, Number.parseInt(refreshWebPage, 10) * 1000);
    this.queryScheduleGroupList(this.state.groupPayload);
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }

  // 查询mot引擎数据
  queryScheduleGroupList = (payload) => {
    FetchQueryScheduleGroupList(payload).then((response) => {
      const { records } = response;
      this.setState({
        ScheduleGroup: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

  }

  // 获取mot引擎数据
  taskChange = () => {
    this.queryScheduleGroupList(this.state.groupPayload);
  }

  getFormChange = (values) => {
    let cmptModeValue = '';
    let tgtTpValue = '';
    let schdStValue = '';
    const { cmptMode = [], tgtTp = [], schdSt = [] } = values;
    for (let i = 0; i < cmptMode.length; i++) {
      cmptModeValue = Number(cmptModeValue) + Number(cmptMode[i]);
    }
    for (let i = 0; i < tgtTp.length; i++) {
      if (i === tgtTp.length - 1) {
        tgtTpValue += tgtTp[i];
      } else {
        tgtTpValue = `${tgtTpValue + tgtTp[i]};`;
      }
    }
    if (schdSt.length > 0) {
      schdStValue = schdSt[0];
    }
    const scheduleGroupPayload = {
      cmptMode: cmptModeValue,
      grpTp: 1,
      schdSt: schdStValue,
      tgtTp: tgtTpValue,
    };
    this.setState({
      groupPayload: scheduleGroupPayload,
    });
    this.queryScheduleGroupList(scheduleGroupPayload);
  }
  render() {
    const { dictionary = {} } = this.props;
    const { ScheduleGroup } = this.state;

    return (
      <React.Fragment>
        <Row className="m-row" style={{ marginBottom: '0' }}>
          <Col xs={24} sm={24} lg={24} xl={24}>
            <DisPatchHead getFormChange={this.getFormChange.bind(this)} taskChange={this.taskChange} dictionary={dictionary} />
          </Col>
        </Row>
        <Row className="m-row">
          <Col xs={24} sm={24} lg={24} xl={24}>
            <div className="site-card-wrapper">
              <Row gutter={16}>
                {
                  ScheduleGroup.map(item => <TaskItem scheduleitem={item} taskChange={this.taskChange} key={item.grpId} />)
                }
              </Row>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(DisPatchIndex);

