import React, { Component, Fragment } from 'react';
import { Checkbox, Row, message, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { fetchObject } from '../../../../../../../services/sysCommon';

/**
 * 主题数据配置主内容
 */

class BasicDataModal extends Component {
  constructor(props) {
    super(props);
    const { selectedBaicData = [] } = props;
    this.state = {
      basicData: [],
      selectedData: selectedBaicData.split(';'), // 已选数据
    };
  }

  componentDidMount = () => {
    this.fetchData();
  }

  // eslint-disable-next-line react/sort-comp
  fetchData = (value) => {
    fetchObject('SJMBPZ', { condition: {tmpl_name: value} }).then((res) => {
      const { records = [], code } = res;
      if (code > 0) {
        this.setState({
          basicData: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  onChange = (selectedData) => {
    this.setState({
      selectedData,
    });
  }

  // 提供已选数据
  handleSelectedData = () => {
    // 返回已选项
    const { selectedData, basicData } = this.state;
    return basicData.filter(item => selectedData.includes(item.TMPL_NO));
  }

  render() {
    const { basicData = [], selectedData = [] } = this.state;
    return (
      <Fragment>
        <Input.Search
          placeholder="请输入关键字进行搜索"
          onSearch={value => this.fetchData(value)}
        />
        <Scrollbars autoHide style={{ width: '100%', height: '20rem', marginTop: '10px' }} >
          <Checkbox.Group onChange={this.onChange} defaultValue={selectedData}>
            {basicData.map((item) => {
              return (
                <Row key={item.TMPL_NO}>
                  <Checkbox value={item.TMPL_NO} key={item.TMPL_NO}>{item.TMPL_NAME}</Checkbox>
                </Row>
              );
            })}
          </Checkbox.Group>
        </Scrollbars>
      </Fragment>
    );
  }
}
export default BasicDataModal;
