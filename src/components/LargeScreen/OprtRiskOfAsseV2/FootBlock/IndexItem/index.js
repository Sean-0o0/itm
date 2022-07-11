import React, { Component } from 'react'
import { Popover } from 'antd';

export class IndexItem extends Component {

    render() {
        const { itemData } = this.props
        const status = itemData.ISCOMPL;
        const content = (
            <div style={{ color: '#fff', fontSize: '1.333rem', width: '25rem' }}>
                <p>检查结果状态：<span style={{ whiteSpace: '', color: status === '2' ? '#E23C39' : '#F7B432' }}>{itemData.ISCOMPLNAME}</span></p>
                <p>正常产品的数量：<span>{itemData.COMPLDATA}</span></p>
                <p>手工确认产品的数量：<span style={{ color: itemData.MANUACONFMDT === '0' ? '' : '#F7B432' }}>{itemData.MANUACONFMDT}</span></p>
                <p>手工确认的原因：<span style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{itemData.MANUACONFMINSTR}</span></p>
                <p>异常检查的产品数量：<span style={{ color: itemData.EXCEPTNUM === '0' ? '' : '#E23C39' }}>{itemData.EXCEPTNUM}</span></p>
                <p>异常的具体产品内容：<span style={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                }}>{itemData.EXCEPTINSTR}</span></p>
            </div>
        );


        return (
            <div className='in-side-sub-item' style={{ paddingBottom: '1rem', fontWeight: '600', lineHeight: '2rem', width: '100%' }}>
                {
                    //0和其他是未开始，1是已完成，2是异常，3是手工确认, 99是未启用
                    itemData.ISCOMPL === '99' ?
                        <React.Fragment>
                            <div style={{ paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require("../../../../../image/notEnable.png")]} alt="" /></div>
                            <div className="flex-r h100 target" style={{ borderRadius: '0.5rem', width: '90%', color: '#7e8ccc' }}>{itemData.CURRSTEP}</div>
                        </React.Fragment> :
                        itemData.ISCOMPL === '1' ?
                            <React.Fragment>
                                <div style={{ paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require("../../../../../image/icon_completed.png")]} alt="" /></div>
                                <div className="flex-r h100 target" style={{ borderRadius: '0.5rem', width: '90%' }}>{itemData.CURRSTEP}</div>
                            </React.Fragment> :
                            itemData.ISCOMPL === '2' ?
                                <React.Fragment>
                                    <Popover content={content} title={itemData.CURRSTEP}>
                                        <div style={{ paddingRight: '1.068rem', paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require('../../../../../image/icon_abnormal.png')]} alt="" /></div>
                                    </Popover>
                                    {/*<div className="flex-r h100 target" style={{ background: 'linear-gradient(90deg, rgba(226, 60, 57, 0.8) 0%, rgba(226, 60, 57, 0) 100%)',borderRadius: '0.5rem', width:'90%' }}>{itemData.CURRSTEP}</div>*/}
                                    <div className="flex-r h100 target" style={{ color: "#D34643", borderRadius: '0.5rem', width: '90%' }}>{itemData.CURRSTEP}</div>
                                </React.Fragment>
                                :
                                itemData.ISCOMPL === '3' ?
                                    <React.Fragment>
                                        <Popover content={content} title={itemData.CURRSTEP}>
                                            <div style={{ paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require("../../../../../image/icon_edit.png")]} alt="" /></div>
                                        </Popover>
                                        {/*<div className="flex-r h100 target" style={{ background: 'linear-gradient(90deg, rgb(247, 180, 50, 0.5) 0%, rgba(247, 180, 50, 0) 95%)',borderRadius: '0.5rem', width:'90%' }}>{itemData.CURRSTEP}</div>*/}
                                        <div className="flex-r h100 target" style={{ borderRadius: '0.5rem', width: '90%' }}>{itemData.CURRSTEP}</div>
                                    </React.Fragment> :
                                    itemData.ISCOMPL === '5' ?
                                        <React.Fragment>
                                            <Popover content={content} title={itemData.CURRSTEP}>
                                                <div style={{ paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require("../../../../../image/icon_wfs.png")]} alt="" /></div>
                                            </Popover>
                                            {/*<div className="flex-r h100 target" style={{ background: 'linear-gradient(90deg, rgb(247, 180, 50, 0.5) 0%, rgba(247, 180, 50, 0) 95%)',borderRadius: '0.5rem', width:'90%' }}>{itemData.CURRSTEP}</div>*/}
                                            <div className="flex-r h100 target" style={{ borderRadius: '0.5rem', width: '90%' }}>{itemData.CURRSTEP}</div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            {/* <div style={{paddingRight:'1.068rem',paddingTop:'.1rem', width:'10%'}}><img className="jk-side-img" src={[require("../../../../../image/icon_nostart.png")]} alt="" /></div> */}
                                            <div style={{ paddingTop: '.1rem', width: '10%' }}><img className="jk-side-img" src={[require("../../../../../image/icon_nostart.png")]} alt="" /></div>
                                            <div className="flex-r h100 target" >{itemData.CURRSTEP}</div>
                                        </React.Fragment>
                }
            </div>
        )
    }
}

export default IndexItem
