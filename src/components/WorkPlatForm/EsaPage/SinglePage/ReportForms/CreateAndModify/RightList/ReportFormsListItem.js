import React from 'react';
import { List, message, Tag } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import TransferItem from './ModifyIndicators/transferItem';
import { FetchOptionalIndicators, FetchCreateUpdateReports } from '../../../../../../services/reportcenter';

class ReportFormsListItem extends React.Component {
  state = {
    className: '',
    visibleModal: false,
    IndicatorsData: [], // 所属数据维度下所有指标
    selectedKeys: [], // 已选指标IDs
    selectedTitles: [], // 已选指标名称
    confirmBtnLoading: false, // 确认按钮loading
  }
  componentDidMount = () => {
    const { item: { idxCode = '', idxName = '' } } = this.props;
    this.setState({
      selectedKeys: idxCode ? idxCode.split(',') : [],
      selectedTitles: idxName ? idxName.split(',') : [],
    });
  }
  getIndicatorsData = (params = {}) => {
    FetchOptionalIndicators({
      sjwd: '',
      paging: -1,
      ...params,
    }).then((result) => {
      const { records = [] } = result;
      this.setState({ IndicatorsData: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleTransferSelect = ({ selectedKeys, selectedTitles }) => {
    this.setState({ selectedKeys, selectedTitles });
  }
  showModal = () => {
    const { item: { dataGran = '' } } = this.props;// 指标所属数据维度
    if (dataGran) {
      // 获取指标所属数据维度下的全部指标
      this.getIndicatorsData({ sjwd: dataGran });
      this.setState({
        visibleModal: true,
      });
    } else {
      message.error('未获取到所选报表所属的数据维度');
    }
  }
  // 确定按钮
  handleOk = () => {
    const { item: { id = '' } } = this.props;
    const { selectedKeys = [] } = this.state;
    if (selectedKeys && selectedKeys.length > 0) {
      this.setState({ confirmBtnLoading: true });
      FetchCreateUpdateReports({
        czfs: '2', // 1 新增， 2 修改
        bbid: id, // 报表id
        sxzb: selectedKeys.join() || '', // 所选指标
      }).then((result) => {
        const { code = -1 } = result;
        if (code > 0) {
          message.success('修改指标成功!');
          this.setState({ confirmBtnLoading: false });
        }
        if (this.props.getListData && typeof this.props.getListData === 'function') this.props.getListData();
        this.handleCancel();
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
        this.setState({ confirmBtnLoading: false });
      });
    } else {
      message.info('报表指标不能修改为空,请重新修改');
      const { item: { idxCode = '', idxName = '' } } = this.props;
      this.setState({
        selectedKeys: idxCode ? idxCode.split(',') : [],
        selectedTitles: idxName ? idxName.split(',') : [],
      });
    }
  }
  // 取消按钮
  handleCancel = () => {
    const { item: { idxCode = '', idxName = '' } } = this.props;
    this.setState({
      selectedKeys: idxCode ? idxCode.split(',') : [],
      selectedTitles: idxName ? idxName.split(',') : [],
      visibleModal: false,
    });
  }
  render() {
    const { IndicatorsData = [], selectedKeys = [], selectedTitles = [], confirmBtnLoading = false } = this.state;
    const { item, item: { idxName: labelStr = '' } } = this.props;
    const labelArr = labelStr ? labelStr.split(',') : [];
    const allTreeData = IndicatorsData.map(inner => ({ fid: '0', id: inner.id || '', mc: inner.idxNm || '' }));
    return (
      <React.Fragment>
        <List.Item className={this.state.className}>
          <List.Item.Meta
            title={(
              <div className="m-baobiao-top">
                <a className="m-baobiao-title">
                  <span className="left m-baobiao-round">
                    <i className="iconfont icon-shu" />
                  </span>
                  <span className="m-baobiao-text">{item.repoNm || '--'}</span>
                </a>
                <div className="m-baobiao-extra">报表指标<span className="red m-num">{item.idxNum || '--'}</span></div>
              </div>
            )}
            description={(
              <ul className="m-report-list">
                { labelArr && labelArr.map((inner, index) => {
                    return <li key={index}><Tag className="m-report-tag">{inner || '--'}</Tag></li>;
                })}
                <li><Tag className="m-report-tag m-add-tag" onClick={this.showModal}><i className="iconfont icon-add" /><span>修改指标</span></Tag></li>
              </ul>
            )}
          />
        </List.Item>
        <BasicModal
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          confirmLoading={confirmBtnLoading}
          onCancel={this.handleCancel}
          title="修改报表指标"
          width="50%"
          style={{ margin: '0 auto', top: 40 }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TransferItem selectedKeys={selectedKeys} selectedTitles={selectedTitles} allDatas={allTreeData} handleTransferSelect={this.handleTransferSelect} />
        </BasicModal>
      </React.Fragment>

    );
  }
}
export default ReportFormsListItem;

