import React from 'react';
import { connect } from 'dva';
import CheckableTagItem from './CheckableTagItem';
import CreateReportModal from './CreateReportModal';
import { getDictKey } from '../../../../../../utils/dictUtils';


class ReportFormsLeftList extends React.Component {
  state = {
    index: 0, // eslint-disable-line 
  }
  componentDidMount() {
  }
  getListDetail = (wdID, key) => {
    const { getListDetail } = this.props;
    if (getListDetail && typeof getListDetail === 'function') {
      getListDetail.call(this, wdID);
    }
    this.hendleRemmberKey(key);
  }

  // 记录点击的位置
  hendleRemmberKey = (index) => {
    this.setState({
      index, // eslint-disable-line 
    });
  }
  render() {
    const { dictionary = {}, wdID = '', refresRightList } = this.props;
    const WDArr = dictionary[getDictKey('BBZX_WD')] || []; // 报表中心 维度
    return (
      <React.Fragment>
        <div className="m-report-left-title">报表列表</div>
        <div className="m-pay-tag-list" style={{ minHeight: '37rem' }}>
          {/* 创建报表modal */}
          <CreateReportModal refresRightList={refresRightList} />
          {WDArr.map((item, index) => {
            return <CheckableTagItem key={item.ibm} index={index} item={item} getListDetail={this.getListDetail} wdID={wdID} /* getListData={this.props.refreshLeftList} */ />;
          })}
          {WDArr.length === 0 && <div style={{ textAlign: 'center', height: '20rem', lineHeight: '20rem' }}> <a>暂无数据</a> </div>}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ReportFormsLeftList);
