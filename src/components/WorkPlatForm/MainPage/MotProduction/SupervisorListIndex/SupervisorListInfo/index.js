import React, { Fragment } from 'react';
import { Row, message } from 'antd';
import { FetchquerySuperviseBasicInformation } from '../../../../../../services/motProduction';
import moment from 'moment';
// 日期份选择控件
import 'moment/locale/zh-cn';
// 组件国际化
moment.locale('zh-cn');
/**
 * 考评人员结构配置
 */

class SupervisorListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        this.fecth();
    }
    fecth = () => {
        FetchquerySuperviseBasicInformation().then((ret = {}) => {
            const { records = [] } = ret;
            if (records && records.length > 0) {
              this.setState({ data: records[0]});
            }
          }).catch(((error) => {
            message.error(!error.success ? error.message : error.note);
          }));
    }
    render() {
        const { data} = this.state;
        return (
            <Fragment>
                <Row style={{ margin: '16px 20px', height: '32px', display: 'flex', color: '#333333' }}>
                    <div style={{ width: '120px', margin: '5px 0', borderRight: '1px solid #EDEDED' }}>
                        月份<span className="supervisor-info-span">{moment(new Date()).format('YYYY-MM')}</span>
                    </div>
                    <div className="supervisor-info-div">
                        <i className="iconfont icon-customerAll supervisor-info-i" />
                        <div style={{ margin: '7px 5px' }}>员工总数<span className="supervisor-info-span">{data.stfTotNum}</span></div>
                    </div>
                    <div className="supervisor-info-div">
                        <i className="iconfont icon-calendarLine supervisor-info-i" />
                        <div style={{ margin: '7px 5px' }}>事件总数<span className="supervisor-info-span">{data.evntTotNum}</span></div>
                    </div>
                </Row>
            </Fragment>
        );
    }
}
export default SupervisorListInfo;
