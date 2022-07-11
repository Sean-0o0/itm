/*
 * @Description: 实时数据配置页面--左侧列表项
 * @Autor:
 * @Date: 2020-04-17 10:36:15
 */
import React, { Fragment } from 'react';
import { List, Icon } from 'antd';
import ErrorMessageModal from '../../../ErrorMessageModal';

class DataListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount(){
    const { kafkaDataSource=[],sinkDataSource = [],sourceDataSource = [], selectedId } = this.props;
    if (!selectedId) {
      if(kafkaDataSource[0]!=null){
        this.handleSelect(kafkaDataSource[0]);
      }else if(sourceDataSource[0]!=null){
        this.handleSelect(sourceDataSource[0]);
      }else if(sinkDataSource[0]!=null){
        this.handleSelect(sinkDataSource[0]);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { kafkaDataSource=[],sinkDataSource = [],sourceDataSource = [], selectedId } = nextProps;
    if (!selectedId) {
      if(kafkaDataSource[0]!=null){
        this.handleSelect(kafkaDataSource[0]);
      }else if(sourceDataSource[0]!=null){
        this.handleSelect(sourceDataSource[0]);
      }else if(sinkDataSource[0]!=null){
        this.handleSelect(sinkDataSource[0]);
      }
    }
  }
  handleSelect=(item) => {
    const { handleSelect } = this.props;
    if (item && typeof handleSelect === 'function') {
      handleSelect(item);
    }
  }
  handleStart=({ tblId }) => {
    const { handleStart } = this.props;
    if (tblId && typeof handleStart === 'function') {
      handleStart(tblId);
    }
  }
  handleStop=({ tblId }) => {
    const { handleStop } = this.props;
    if (tblId && typeof handleStop === 'function') {
      handleStop(tblId);
    }
  }
  handleDelete=({ tblId }) => {
    const { handleDelete } = this.props;
    if (tblId && typeof handleDelete === 'function') {
      handleDelete(tblId);
    }
  }
  changeFailModalVisible=(visible = false) => {
    this.setState({ visible });
  }
  render() {
    const { dataSource = [], selectedId, keyword, selectedItem = {} } = this.props;
    const { visible } = this.state;
    return (
      <Fragment>
        {
          dataSource.length>0?(
            <List
          className="mot-prod-list"
          split={false}
          dataSource={dataSource}
          renderItem={(item) => {
              const { tblNm = '' } = item;
              const index = tblNm.indexOf(keyword);
              let [beforeStr, afterStr, redStr] = ['', '', ''];
              if (keyword && index > -1) {
                beforeStr = tblNm.substring(0, index);
                afterStr = tblNm.substring(index + keyword.length);
                redStr = tblNm.substr(index, keyword.length);
              }
              return (
                <List.Item extra={
                  item.tblId === selectedId && (
                  <span>
                    {item.strtUseSt === '2' && <Icon type="play-circle" className="icon-play" title="开始" onClick={() => this.handleStart(item)} />}
                    {item.strtUseSt === '1' && item.ctcTp !== '3' && <Icon type="pause-circle" className="icon-pause" title="停止" onClick={() => this.handleStop(item)} />}
                    {(((item.strtUseSt === '0' || item.strtUseSt === '2') && item.ctcTp === '2') || (item.strtUseSt === '0' && item.ctcTp === '3')) && <Icon type="close-circle" className="icon-close" title="删除" onClick={() => this.handleDelete(item)} />}
                    {(item.strtUseSt === '-1' || item.strtUseSt === '-2') && <Icon type="info-circle" className="icon-info" onClick={() => this.changeFailModalVisible(true)} />}
                    {/* {item.strtUseSt === '2' && <i className="iconfont icon-yunhang" title="开始" onClick={() => this.handleStart(item)} />}
                    {item.strtUseSt === '1' && item.ctcTp !== '3' && <i className="iconfont icon-tingzhi" title="停止" onClick={() => this.handleStop(item)} />}
                    {(item.strtUseSt === '0' || item.strtUseSt === '2') && item.ctcTp === '2' && <i className="iconfont icon-guanbi1" title="删除" onClick={() => this.handleDelete(item)} />}
                    {item.strtUseSt === '-1' && <i className="iconfont icon-about1" onClick={() => this.changeFailModalVisible(true)} />} */}
                  </span>
                )}
                >
                  <List.Item.Meta
                    // eslint-disable-next-line no-nested-ternary
                    avatar={<div className={`mot-prod-list-tag ${item.strtUseSt === '1' ? 'tag-yunxingzhong' : item.strtUseSt === '2' ? 'tag-zanting' : (item.strtUseSt === '-1' || item.strtUseSt === '-2') ? 'tag-shibai' : 'tag-weifabu'}`}>{item.strtUseStNm}</div>}
                    title={
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a onClick={() => this.handleSelect(item)} className={`mot-prod-list-title ${item.tblId === selectedId && 'sel'}`}>
                        {keyword ? <span>{beforeStr}<span style={{ color: 'red' }}>{redStr}</span>{afterStr}</span> : item.tblNm}
                      </a>
                    }
                    description={item.tblDesc}
                  />
                </List.Item>
              );
            }}
        />
          ):''
        }
        
        <ErrorMessageModal
          handleOk={() => this.changeFailModalVisible(false)}
          handleCancel={() => this.changeFailModalVisible(false)}
          errMsg={selectedItem.errMsg}
          visible={visible}
        />
      </Fragment>

    );
  }
}
export default DataListItem;

