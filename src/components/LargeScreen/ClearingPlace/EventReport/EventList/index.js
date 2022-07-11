import React from 'react';

class EventList extends React.Component {

    render() {
        const { infoItem = {}, position = 0 } = this.props;

        let theme = '';
        let rtime = '';
        let contg = '';
        // const tmpl = [];
        if (infoItem) {
            theme = infoItem.PRO_NAME;
            rtime = infoItem.TIME;
            contg = infoItem.CONTG;
            if (contg) {
                contg = contg.split("||");
                // for (let i = 0; i < contg.length; i++) {
                //     tmpl.push(i);
                // }
            }
        }

        return (
            <React.Fragment>
                <div className="flex-r report-top">
                    <div className="flex1 fwb" style={{ fontWeight: '600' }}>
                        <img className="report-top-dot" src={[require("../../../../../image/icon_exception.png")]} alt="" />{theme}
                        {/* {position === 1 ?
                            <div className="fs16 wid100 tr" style={{ display: 'inline', color:'#C6E2FF', fontWeight: 'normal' }}>{rtime}</div> : null
                        } */}
                    </div>
                    {position === 0 ?
                        <div className="fs16" style={{ color: '#C6E2FF' }}>{rtime}</div> : null
                    }
                </div>
                {/* {position === 1 ?
                            <div className="fs16 wid100 tr" style={{ display: 'inline', color:'#C6E2FF', fontWeight: 'normal' }}>{rtime}</div> : null
                        } */}
                <div className="report-cont" style={{ color: '#C6E2FF', fontWeight: '600' }}>
                    {contg.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}
export default EventList;
