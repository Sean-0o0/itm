/*
 * @Description: 实时数据配置页面--左侧列表
 * @Autor:
 * @Date: 2020-04-17 10:36:15
 */
import React from 'react';
import { Collapse } from 'antd';
import DataListItem from './DataListItem';

class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: [],
    };
  }
  onAdd=(e, type) => {
    e.stopPropagation();
    const { handleAdd } = this.props;
    if (type && typeof handleAdd === 'function') {
      handleAdd(type);
    }
  }
  changeActiveKey=(activeKey)=>{
    this.setState({
      activeKey,
    });
  }
  componentWillReceiveProps(nextProps){
    const { configurationList, keyword } = nextProps;
    const [kafkaList, sourceList, sinkList] = [[], [], []];
    configurationList.forEach((item) => {
      if (item.tblNm.indexOf(keyword) > -1) {
        if (item.ctcTp === '1') {
          sinkList.push(item);
        } else if (item.ctcTp === '2') {
          sourceList.push(item);
        } else if (item.ctcTp === '3') {
          kafkaList.push(item);
        }
      }
    });
    let activeKey = [];
    if(kafkaList.length>0){
      activeKey.push('1');
    }
    if(sourceList.length>0){
      activeKey.push('2');
    }
    if(sinkList.length>0){
      activeKey.push('3');
    }
    this.setState({
      activeKey,
    });
  }

  render() {
    const { activeKey = [] } = this.state;
    const { configurationList, keyword } = this.props;
    const [kafkaList, sourceList, sinkList] = [[], [], []];
    configurationList.forEach((item) => {
      if (item.tblNm.indexOf(keyword) > -1) {
        if (item.ctcTp === '1') {
          sinkList.push(item);
        } else if (item.ctcTp === '2') {
          sourceList.push(item);
        } else if (item.ctcTp === '3') {
          kafkaList.push(item);
        }
      }
    });
    return (
      <React.Fragment>
        <Collapse onChange={this.changeActiveKey} className="mot-prod-collapse" activeKey={activeKey} expandIconPosition="right">
          <Collapse.Panel
            key="1"
            header={
              <div>
                <span style={{ paddingRight: '1rem' }} className="fwb">KAFKA</span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={e => this.onAdd(e, '1')}><i className="iconfont icon-add2 mot-icon-color fs-inherit mot-icon" /></a>
              </div>
              }
          >
            <DataListItem dataSource={kafkaList} kafkaDataSource={kafkaList} sinkDataSource={sinkList} sourceDataSource={sourceList} {...this.props} type='kafka'/>
          </Collapse.Panel>
          <Collapse.Panel
            key="2"
            header={
              <div>
                <span style={{ paddingRight: '1rem' }} className="fwb">SOURCE</span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={e => this.onAdd(e, '2')}><i className="iconfont icon-add2 mot-icon-color fs-inherit mot-icon" /></a>
              </div>
              }
          >
            <DataListItem dataSource={sourceList} kafkaDataSource={kafkaList} sinkDataSource={sinkList} sourceDataSource={sourceList} {...this.props} type='source'/>
          </Collapse.Panel>
          <Collapse.Panel
            key="3"
            header={
              <div>
                <span style={{ paddingRight: '1rem' }} className="fwb">SINK</span>
              </div>
              }
          >
            <DataListItem dataSource={sinkList} kafkaDataSource={kafkaList} sinkDataSource={sinkList} sourceDataSource={sourceList} {...this.props} type='sink'/>
          </Collapse.Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}
export default DataList;

