import React from 'react';
import { Carousel } from 'antd';
import styles from './index.less';

class DynamicReminding extends React.Component {

    render() {
        return (
            <div className="clearfix" style={{ background: '#fff', margin: '0 -3rem' }}>
                <div style={{ float: 'left', width: '100%' }}>
                    <div className="notice clearfix">
                        <div className="notice-left ">
                            {/* <Link to="/dynamicRemindingList"> */}
                            <i className="iconfont icon-gg" style={{ paddingLeft: '1.25rem' }} /><span>动态提醒</span>
                            {/* </Link> */}
                        </div>
                        <div className="notice-right" style={{ width: '60%', height: '4.5rem', display: 'flex', alignItems: 'center' }}>
                            <div className="m-border2">
                                <div className="m-border3" />
                            </div>
                            <div className={`${styles.remind}`}>
                                <Carousel dotPosition="left" dots={false} autoplay>
                                    {/* {
                                        userNoticeList.map((item) => {
                                            return (
                                                <div style={{ width: '300' }} key={item.notcid}>
                                                    <Link to={`dynamicRemindingDetail/${item.notcid}`} target="_blank" >
                                                        <span style={{ fontSize: '1.333rem', fontWeight: '400', lineHeight: '3rem' }}>{item.title || '--'}</span>
                                                    </Link>
                                                </div>
                                            );
                                        })
                                    } */}
                                    <div style={{ width: '300' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: '400', lineHeight: '5rem' }}>重大消息111</span>
                                    </div>
                                    <div style={{ width: '300' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: '400', lineHeight: '5rem' }}>重大消息222</span>
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                        <div className="clear" />
                    </div>
                </div>
            </div>
        );
    }
}
export default DynamicReminding;
