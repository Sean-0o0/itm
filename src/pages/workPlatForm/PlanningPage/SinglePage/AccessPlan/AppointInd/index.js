import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import AppointIndHeader from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/AppointInd/AppointIndHeader'
import AppointIndBody from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/AppointInd/AppointIndBody'
import { FetchQueryOrgList } from '../../../../../../services/planning/planning'
import moment from 'moment';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
class AppointInd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mon: '',
            data: [],
            orgName: '',
            yr:'',
        }
    }
    componentWillMount() {
        // 传入参数 {"orgId":"383","orgName":"FICC事业部",planId":"1"}
        const { orgId = '', planId = '',yr = '' } = this.getUrlParams();
        this.setState({
            orgId: orgId,
            planId: planId,
            yr,
        })
        // 506204 查询组织机构信息
        FetchQueryOrgList({
            pageLength: 999,
            pageNo: 1,
            paging: 1,
            planType: 2, //1|高管;2|业务条线;3|职能部门
            sort: "",
            totalRows: 0
        }).then(res => {
            const { code = 0, records = []} = res;
            // //console.log("查询组织机构信息:",res);
            if (code > 0) {
                this.setState({ orgList: res.records })
                records.forEach(item => {
                    if (item.orgId == orgId) {
                        this.setState({
                            orgName: item.orgName
                        })

                        return
                    }
                });
            }
        })
        let month = moment().format('YYYYMM')
        // let month = 202102
        this.handleMonthPickerOnChange(month)
    }
    handleMonthPickerOnChange = (mon) => {
        this.setState({
            mon: mon
        })

    }
    changeData = (data) => {
        // //console.log("data=",data);
        this.setState({
            data: data
        })
    }
    // 获取url参数
    getUrlParams = () => {
        const { match: { params: { params: encryptParams = '' } } } = this.props;
        // //console.log("DecryptBase64(encryptParams)=",DecryptBase64(encryptParams));
        const params = JSON.parse(DecryptBase64(encryptParams));
        return params;
    }
    render() {
        const { onCancelOperate, onSubmitOperate } = this.props;
        let { mon, orgName, planId, data, orgId,yr } = this.state
        return (
            <Fragment>
                <div style={{ padding: '0 25px' }} >
                    <Row style={{ height: '100%' }} className='dp-body'>
                        <Col span={24} className='dp-title'>
                            <AppointIndHeader handleMonthPickerOnChange={this.handleMonthPickerOnChange} orgName={orgName} />
                        </Col>
                        <Col span={24} className='dp-cont'>
                            <AppointIndBody orgId={orgId} mon={mon} data={data} planId={planId} changeData={this.changeData} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} yr={yr} />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(AppointInd);
