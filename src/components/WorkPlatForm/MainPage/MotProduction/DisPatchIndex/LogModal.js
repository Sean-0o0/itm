import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, message } from 'antd';
import { FetchGetLog } from '../../../../../services/motProduction';

class LogModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logDetail: '',
    };
  }


  componentWillMount() {

  }

  componentDidMount() {
    // this.scrollbars.scrollToBottom();
    this.fetchData();
  }

  fetchData = () => {
    const { scheduleitem } = this.props;
    const { grpId = '', taskId = '' } = scheduleitem;
    const payload = {
      groupId: grpId,
      taskId,
    };
    FetchGetLog(payload).then((response) => {
      const { note = [], code } = response;
      if (code > 0) {
        this.setState({
          logDetail: note,
        }, () => { this.scrollbars.scrollToBottom(); });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onRefresh = () => {
    this.fetchData();
  }

  render() {
    const { logDetail = '' } = this.state;
    return (
      <React.Fragment>
        <Scrollbars autoHide style={{ height: '46rem' }} ref={(c) => { this.scrollbars = c; }}>
          <div className="mot-logContent" dangerouslySetInnerHTML={{ __html: logDetail }} />
        </Scrollbars>
        <div className="tc" style={{ padding: '.5rem' }}>
          <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={() => this.onRefresh()} >刷新</Button>
        </div>
      </React.Fragment >
    );
  }
}
export default LogModal;
