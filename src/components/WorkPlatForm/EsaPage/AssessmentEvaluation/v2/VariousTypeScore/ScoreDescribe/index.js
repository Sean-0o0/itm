import React, { Component } from 'react';

class ScoreDescribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { data: { records } } = this.props;
    return (
      <div className="wid100" style={{ background: '#f3f6fa', margin: '1.5rem 0', padding: '1rem', lineHeight: '26px' }}>
        {records.length > 0 && <p style={{ marginBottom: 0 }}>打分说明：{records[0].examItmName}</p>}
        {records.length > 0 && <p style={{ marginBottom: 0 }}>计分规则：{records[0].examStd}</p>}
      </div>
    );
  }
}

export default ScoreDescribe;