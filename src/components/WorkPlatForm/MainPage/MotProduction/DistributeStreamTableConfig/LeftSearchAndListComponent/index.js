/*
 * @Description: 实时数据配置页面--左侧
 * @Autor:
 * @Date: 2020-04-17 10:23:43
 */
import React from 'react';
import InputSearch from './InputSearch';
import DataList from './DataList';

class LeftSearchAndListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { handleKeywordChange, handleListRefresh } = this.props;
    return (
      <div className="mot-prod-left-list">
        <InputSearch handleKeywordChange={handleKeywordChange} handleListRefresh={handleListRefresh} />
        <DataList {...this.props} />
      </div>
    );
  }
}
export default LeftSearchAndListComponent;

