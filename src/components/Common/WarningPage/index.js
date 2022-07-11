import React from 'react';
import { Result } from 'antd';

class WarningPage extends React.Component {
  render() {
    return (
      <div className="flex-c h100">
        <Result
          status="404"
          title="建设中...敬请期待!"
          // subTitle="Sorry, the page you visited does not exist."
        />
      </div>

    );
  }
}
export default WarningPage;
