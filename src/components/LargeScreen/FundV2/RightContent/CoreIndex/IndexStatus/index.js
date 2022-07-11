import React, { Component } from 'react'

export class index extends Component {

    getIcon = (state) => {
        if (state === '1') {
            return <img className="jk-side-img2" src={[require("../../../../../../image/icon_completed.png")]} alt="" />;
        } else if (state === '2') {
            return <img className="jk-side-img2" src={[require("../../../../../../image/icon_abnormal.png")]} alt="" />;
        } else if (state === '3') {
            return <img className="jk-side-img2" src={[require("../../../../../../image/icon_edit.png")]} alt="" />;
        } else {
            return <img className="jk-side-img2" src={[require("../../../../../../image/icon_nostart.png")]} alt="" />;
        }
    }

    bgColor = (state) => {
        if (state === '2') {
            return 'linear-gradient(-90deg,rgba(226, 60, 57, 0) 0%, rgba(226, 60, 57, 0.8) 100%)';
        } else if (state === '3') {
            return 'linear-gradient(-90deg, rgba(247, 180, 50, 0) 0%, #F7B432 100%)';
        } else {
            return 'linear-gradient(-90deg, rgba(17, 47, 111, 0) 0%, #11276F 100%)';
        }
    }

    stateTxt = (state) => {
        if (state === '1') {
            return "检查正常";
        } else if (state === '2') {
            return "检查异常";
        } else if (state === '3') {
            return "手工确认";
        } else {
            return "未开始";
        }
    }

    render() {
        const { content = {} } = this.props;
        let color = "#666666";
        if (content.STATE === '1') {
            color = '#00ACFF';
        } else if (content.STATE === '2') {
            color = '#E23C39';
        } else if (content.STATE === '3') {
            color = '#00ACFF';
        }
        return (
            <div className="pd6" style={{width:'50%',height:"33.33%"}} >
                <div className="pd6 fs18 flex-r"
                    style={{background:this.bgColor(content.STATE),borderRadius: '1.5rem',alignItems:"center"}}>
                    <div className="flex-r flex1" style={{alignItems: 'center',width:'100%'}}>
                        <span style={{width:'10%'}}>
                            {this.getIcon(content.STATE)}
                        </span>
                        <span className="txt fs20" style={{ paddingLeft: '0.5833rem',lineHeight:"1.6rem",width:'90%'}}>{content.IDX_NM}</span>
                    </div>
                    {/* 0未开始,1已完成，2异常，3手工确认 */}
                    <span className="txt fs20" style={{ color: color }}>
                        {this.stateTxt(content.STATE)}</span>
                </div>
            </div>
        )
    }
}

export default index
