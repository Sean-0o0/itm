import React from 'react';
import Export from './Export';

class Buttons extends React.Component {
  render() {
    const { queryParams = {}, count = 0 } = this.props;
    return (
      <div>
        {/* 导出 */}
        <Export queryParams={queryParams} count={count} />
      </div>
    );
  }
}

export default Buttons;
