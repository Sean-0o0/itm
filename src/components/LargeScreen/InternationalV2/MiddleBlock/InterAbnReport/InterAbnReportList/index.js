import React from 'react';

class InterAbnReportList extends React.Component {

  render() {
    const { infoItem = {} } = this.props;
    let excepttype = '';
    let excepttime = '';
    let excepttopic = '';
    let exceptdetail = '';
    // const tmpl = [];
    if (infoItem) {
      excepttype = infoItem.EXCEPTTYPE;
      excepttime = infoItem.EXCEPTTIME;
      excepttopic = infoItem.EXCEPTTOPIC;
      exceptdetail = infoItem.EXCEPTDETAIL;
      if(exceptdetail){
        exceptdetail = exceptdetail.split("||");
        // for (let i = 0; i < contg.length; i++) {
        //     tmpl.push(i);
        // }
      }
    }

    return (
      <React.Fragment>
        <div className="flex-r report-top">
          <div className="flex1 fwb" style={{fontWeight: '600'}}><img className="report-top-dot" src={[require("../../../../../../image/icon_exception.png")]} alt="" />{excepttopic}-{excepttype}</div>
          <div className="fs16" style={{color:'#C6E2FF'}}>{excepttime}</div>
        </div>
        <div className="report-cont" style={{color:'#C6E2FF',fontWeight: '600'}}>
          {exceptdetail.map((item,index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default InterAbnReportList;
