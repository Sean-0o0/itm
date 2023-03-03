import React, { Component } from 'react'
import { Timeline, Popover, Empty } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import 'moment/locale/zh-cn';
import EventItem from './EventItem';

class DataItem extends Component {
    state = {}
    render() {
        const { data = {}, fxxxItem = [] } = this.props;
        const { lcbmc = '', jssj, kssj, matterInfos = [] } = data;
        let content = <div>
            {fxxxItem.length ?
                <Scrollbars
                    autoHide
                    style={{ height: '40rem', width: '60rem' }}
                >
                    {fxxxItem.map((item, index) => {
                        const { FXBT = '-', FXNR = '-', ZT, CLNR } = item;
                        return <div className='risk-item-box' style={{ borderBottom: index !== fxxxItem.length - 1 ? '1px solid #EBEEF5' : 'none' }}>
                            <div className='risk-item-header flex-r'>
                                <div className='risk-item-title  flex1'>风险{index + 1}</div>
                                <div className='risk-item-status' style={{ background: ZT===2?'#EAEFFF':'#F5F7FA', color: ZT===2?'#3361FF':'#909399' }}>▪ {ZT===2?'已处理':'未处理'}</div>
                            </div>
                            <div className='risk-item-body'>
                                <div className='risk-item-cont'>
                                    <span className='risk-item-name'>风险标题：</span>
                                    {FXBT}
                                </div>
                                <div className='risk-item-cont'>
                                    <span className='risk-item-name'>风险内容：</span>
                                    {FXNR}
                                </div>
                                {CLNR && <div className='risk-item-cont'>
                                    <span className='risk-item-name'>处理内容：</span>
                                    {CLNR}
                                </div>}
                            </div>
                        </div>
                    })
                    }
                </Scrollbars> :
                <div className='empty-box'><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无风险信息" /></div>

            }
        </div>

        return (
            <Timeline.Item color="#3461FF">
                <div className='data-item'>
                    <div className='data-header'>
                        <div className='data-title flex1'>{lcbmc}</div>
                        <div className='data-risk flex1'>
                            <Popover placement="bottomLeft" overlayClassName="main-tooltip" content={content} trigger="click">
                                <a className="iconfont fill-warning-t" style={{ fontSize: '2.0832rem', color: '#D70E19' }}>
                                    &nbsp;存在风险 {fxxxItem.length} (点击查看)
                                </a>
                            </Popover>

                        </div>
                        <div className='data-item-time flex1'>
                            <a className="iconfont time" style={{ fontSize: '2.0832rem', color: '#909399' }}>
                                &nbsp;{kssj ? moment(kssj, 'YYYYMMDD').format('YYYY.MM.DD') : '-.-.-'}
                                ~
                                {jssj ? moment(jssj, 'YYYY-MM-DD').format('YYYY.MM.DD') : '-.-.-'}
                            </a>
                        </div>
                    </div>
                    <div className='data-box'>
                        {matterInfos.length ?

                            matterInfos.map((item = {}, index) => {
                                const { swlxmc = '', sxlb = [] } = item
                                const arr = sxlb.map(item => item.sxmc)
                                const value = arr.join('、');
                                return <EventItem label={swlxmc} value={value} />
                            })
                            :
                            <React.Fragment>
                                <div style={{ width: '100%', paddingBottom: '2rem', textAlign: 'center', color: 'rgb(144, 147, 153)' }}>暂无数据</div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </Timeline.Item>
        );
    }
}

export default DataItem;