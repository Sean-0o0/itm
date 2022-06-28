import React from 'react';

import { Select, Spin } from 'antd';

import debounce from 'lodash.debounce';

const { Option } = Select;

class FuzzySearch extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchDatas = debounce(this.fetchDatas, 800);// 强制一个函数在某个连续时间段内只执行一次
    const { value } = props;
    this.state = {
      data: [],
      value: Object.assign({}, { key: '', value: '' }, value),
      fetching: false,
    };
  }
  componentDidMount() {
    this.fetchDatas();
  }
  componentWillReceiveProps(props) {
    if ('value' in props) {
      const { value } = props;
      this.setState({
        value: Object.assign({}, { key: '', value: '' }, value),
      });
    }
  }
  fetchDatas = (value) => { // eslint-disable-line
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    // fetch(`https://suggest.taobao.com/sug?${value}`)
    //   .then(response => response.json())
    //   .then((body) => {
    //     if (fetchId !== this.lastFetchId) { // for fetch callback order
    //       return;
    //     }
    //     const data = body.results.map(user => ({
    //       text: `${user.name.first} ${user.name.last}`,
    //       value: user.login.username,
    //     }));
    //     this.setState({ data, fetching: false });
    //   });
    setTimeout(() => {
      this.setState({
        data: [{ text: '测试1', value: 101 }, { text: '测试2', value: 102 }, { text: '测试3', value: 103 }],
        fetching: false,
      });
    }, 1000);
  }
  handleChange = (value) => {
    const { onChange } = this.props;
    // this.setState({
    //   value,
    //   data: [],
    //   fetching: false,
    // });
    if (onChange) {
      onChange(Object.assign(
        {},
        value,
      ));
    }
  }
  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        mode="combobox"
        labelInValue
        value={value}
        placeholder="客户号/客户名称/资金账号/手机号"
        showSearch
        showArrow={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        optionLabelProp="children"
        onSearch={this.fetchDatas}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    );
  }
}

export default FuzzySearch;
