import React from 'react';
import BusinessInfoMorn from './BusinessInfoMorn';
import InsuranceAudit from './InsuranceAudit';

class LeftBlock extends React.Component {
  render() {
    const {  datas = [], InsurAuditData = [], list1 = [], list2 = [], list3 = [], firstMaxTime = '', firstMinTime = '', secondMaxTime = '', secondMinTime = '' }  = this.props;
    return (
      <div className="flex-c h100">
        <div className="h64 flex-c wid100 pd10">
          <BusinessInfoMorn datas={datas}/>
        </div>
        <div className="h36 flex-c wid100 pd10">
          <InsuranceAudit InsurAuditData={InsurAuditData} list1={list1} list3={list3} list2={list2} firstMinTime={firstMinTime} firstMaxTime={firstMaxTime} secondMinTime={secondMinTime} secondMaxTime={secondMaxTime}/>
        </div>
      </div>

    );
  }
}
export default LeftBlock;
