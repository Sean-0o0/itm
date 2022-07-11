import React, {Fragment} from 'react';
import { Row, Col, Empty } from 'antd';
import { connect } from 'dva';

import SupervisorTaskLeftSearch from './SupervisorTaskLeftSearch';
import SupervisorTaskRightMainContent from './SupervisorTaskRightMainContent';

class SupervisorTaskIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: undefined
    };
  }

  componentDidMount() {
  }

  handleClickTask = task => {
    this.setState({ task });
  };

  handleRefreshLeft = () => {
    this._supervisorTaskLeftSearch && this._supervisorTaskLeftSearch.refreshSuperviseTaskList();
  };

  render() {
    const {dictionary} = this.props;
    const { task } = this.state;
    return (
      <Fragment>
        <Row style={{height: '700px', backgroundColor: '#fff'}} className='mot-prod-scrollbar'>
          <Col span={6} style={{height: '95%', borderRight: '1px solid #e3e3e3', overflow: 'auto'}}>
            <SupervisorTaskLeftSearch onRef={(ref)=>{this._supervisorTaskLeftSearch = ref;}} dictionary={dictionary} onClickTask={this.handleClickTask}/>
          </Col>
          <Col span={18} style={{height: '95%', overflow: 'auto'}}>
            { !task ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>) : (
              <SupervisorTaskRightMainContent task={task} onRefreshLeft={this.handleRefreshLeft}/>
            )}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(SupervisorTaskIndex);
