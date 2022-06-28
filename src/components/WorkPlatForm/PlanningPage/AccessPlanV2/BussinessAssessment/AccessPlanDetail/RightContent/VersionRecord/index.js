import React from 'react';
import { Timeline, message } from 'antd';
import VersionItem from './VersionItem';
import nodata from '../../../../../../../../assets/no-data.png';
import { FetchQueryHisAssessPlanList } from '../../../../../../../../services/planning/planning.js';

class VersionRecord extends React.Component {
  state = {
    versionRecord: [],
  };

  componentDidMount() {
    this.fetchQueryHisAssessPlanList();
  }

  handleDivClick = (item, e) => {
    //console.log('------点击历史记录----');
    const { handleItemClick,rollback } = this.props;
    if (handleItemClick) {
      //console.log('------item----', item);
      handleItemClick(item,rollback);
    }
  };

  fetchQueryHisAssessPlanList = () => {
    const { planId = '' } = this.props;
    FetchQueryHisAssessPlanList({ planId }).then(res => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        this.setState({ versionRecord: records });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  };

  render() {
    const { versionRecord } = this.state;
    return (
      <div className='af-detail' style={{ margin: '1rem 2rem 1rem 4rem', position: 'relative', minHeight: '50rem' }}>
        {versionRecord.length === 0 ?
          <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
            <img src={nodata} alt='' width='240' />
            <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂无可展示内容!
            </div>
          </div> :
          <Timeline>
            {versionRecord.map(item => {
              return <div onClick={(e) => this.handleDivClick(item, e,)}><VersionItem data={item} /></div>;
            })}
          </Timeline>
        }
      </div>
    );
  }
}

export default VersionRecord;
