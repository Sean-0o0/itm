import React from 'react';

class EventList extends React.Component {

    render() {
        const { infoItem = {} } = this.props;

        let theme = '';
        let rtime = '';
        let contg = '';
        // const tmpl = [];
        if (infoItem) {
            theme = infoItem.SJBT;
            rtime = infoItem.SBSJ;
            contg = infoItem.SJMS;

        }

        return (
            <React.Fragment>
                <div className="report-top flex-r" style={{fontWeight: '600', wordBreak: 'break-all'}}>
                    <div className="flex1 fwb"><img className="report-top-dot" src={[require("../../../../../../image/icon_exception.png")]} alt="" />{theme}</div>
                    <div className="fs16" style={{marginLeft:'1.25rem',color:'rgb(198, 226, 255)'}}>{rtime}</div>
                </div>
                <div className="report-cont" style={{fontWeight: '600'}}>【说明】{contg}</div>
            </React.Fragment>
        );
    }
}
export default EventList;
