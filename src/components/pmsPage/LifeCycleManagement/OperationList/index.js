import React from 'react';
import { Button, Input, Select, Row, Col, message, Pagination } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
const { Option } = Select;
const PASE_SIZE = 10;
const DEFAULT_CURRENT = 1;

class OperationList extends React.Component {
  state = {
    open: false,
    optionsData: []
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  onChange = (value) => {
    console.log(`selected ${value}`);
    const { fetchQueryLiftcycleMilestone, fetchQueryLifecycleStuff } = this.props;
    fetchQueryLiftcycleMilestone(value);
    fetchQueryLifecycleStuff(value);
  };

  onSearch = (value) => {
    console.log('search:', value);
  };

  render() {
    const { open, optionsData } = this.state;
    const { defaultValue, data, fetchQueryOwnerProjectList } = this.props;
    console.log("defaultValuedefaultValue", defaultValue);
    console.log('dataaaaaaa',data);
    return (
      <Row style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <Col span={20}
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '2.381rem 3.571rem',
            fontSize: '2.083rem'
          }}
        >
          <Input.Group compact>
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} style={{position:'relative'}}>
              <Select
                style={{ width: '34rem', borderRadius: '8px !important' }}
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
                open={open}
                onDropdownVisibleChange={(visible) => { this.setState({ open: visible }); }}
                dropdownStyle={{height: '355px'}}
                dropdownRender={(options) => {
                  return (<>
                    {options}
                    <div style={{ display: 'flex', height: '4.46rem', lineHeight:'4.46rem', position:'absolute', bottom: '0' }}>
                      <span style={{ padding: '0 2.381rem', lineHeight:'4.46rem' }}>共 {data.length} 条</span>
                      <Pagination size="small" simple defaultCurrent={DEFAULT_CURRENT} total={data.length} pageSize={PASE_SIZE} onChange={(pageNum) => {
                        fetchQueryOwnerProjectList(pageNum, PASE_SIZE);
                      }} />
                    </div>
                  </>);
                }}
              >
                {
                  data?.map((item = {}, ind) => {
                    return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                  })
                }
              </Select></div>
          </Input.Group>
        </Col>
        {/*<Col span={4}*/}
        {/*     style={{height: '100%', display: 'flex', alignItems: 'center', textAlign: 'end', fontSize: '2.083rem'}}>*/}
        {/*  <img src={icon_flag} alt="" style={{width: '2rem', height: '2rem'}}/>*/}
        {/*  &nbsp;<span style={{color: 'rgba(144, 147, 153, 1)'}}>当前处于：<span*/}
        {/*  style={{color: 'rgba(48, 49, 51, 1)'}}>项目立项阶段</span></span>*/}
        {/*</Col>*/}
      </Row>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
