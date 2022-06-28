/*
 * @Description: 考核须知
 * @Autor:
 * @Date: 2020-11-11 11:07:27
 */

import React, { Component, Fragment } from 'react';
import { Card } from 'antd';
class AssessmentNoticeTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      khList: this.props.khList ? this.props.khList : [],
      notes: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ khList: nextProps.khList })
    if (nextProps.khList.length != 0) {
      //console.log(nextProps.khList[0].notes)
      this.setState({
        notes: nextProps.khList[0].notes,
      })
    }
  }
  render() {
    const { notes } = this.state;
    return (
      <Fragment>
        <Card style={{ height: '100%', overflow: 'hidden auto' }} className="m-card">
          <div >
            <i class="iconfont icon-warning-circle" />   <span style={{ color: '#333', fontSize: '1.166rem', fontWeight: 'bold' }}>&nbsp;注意事项 </span>
            <div>
              <br></br>
              <textarea style={{ background: '#F3F6FA', width: '100%' }} value={notes} rows="3" cols="20" ></textarea>
            </div>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default AssessmentNoticeTop;
