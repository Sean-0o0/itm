import React from 'react';
import {Button, Input, Select, Row, Col, message, Pagination} from 'antd';
import {connect} from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import {FetchQueryOwnerProjectList} from "../../../../services/pmsServices";
const { Option } = Select;

class OperationList extends React.Component {
  state = {};

  componentWillMount() {
  }


  onChange = (value) => {
    console.log(`selected ${value}`);
    const {fetchQueryLiftcycleMilestone, fetchQueryLifecycleStuff} = this.props;
    fetchQueryLiftcycleMilestone(value);
    fetchQueryLifecycleStuff(value);
  };

  onSearch = (value) => {
    console.log('search:', value);
  };

  render() {
    const {} = this.state;
    const {data, defaultValue} = this.props;
    console.log("defaultValuedefaultValue", defaultValue);
    return (
      <Row style={{backgroundColor: 'white', height: '8rem'}}>
        <Col span={20}
             style={{
               height: '100%',
               display: 'flex',
               alignItems: 'center',
               paddingLeft: '2.5rem',
               fontSize: '2.083rem'
             }}>
          <Input.Group compact>
            <Select
              style={{width: '30rem'}}
              showSearch
              placeholder="请输入项目名称"
              optionFilterProp="children"
              key={defaultValue ? defaultValue : data[0]?.xmmc}
              defaultValue={defaultValue ? defaultValue : data[0]?.xmmc}
              onChange={this.onChange}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                (option.props.children)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {
                data?.map((item = {}, ind) => {
                  return <Option value={item.xmid}>{item.xmmc}</Option>
                })
              }
            </Select>
          </Input.Group>
        </Col>
        <Col span={4}
             style={{height: '100%', display: 'flex', alignItems: 'center', textAlign: 'end', fontSize: '2.083rem'}}>
          <img src={icon_flag} alt="" style={{width: '2rem', height: '2rem'}}/>
          &nbsp;<span style={{color: 'rgba(144, 147, 153, 1)'}}>当前处于：<span
          style={{color: 'rgba(48, 49, 51, 1)'}}>项目立项阶段</span></span>
        </Col>
      </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
