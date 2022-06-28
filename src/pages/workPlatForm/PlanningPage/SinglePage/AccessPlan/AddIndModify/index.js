import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import AddIndHeader from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/AddIndModify/AddIndHeader'
import AddIndBody from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/AddIndModify/AddIndBody'
import { FetchQueryAssessTrackPlan, FetchQueryOrgList } from '../../../../../../services/planning/planning'
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
class AddInd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mon: '',
            orgId: '',
            trackPlanId: '',
            orgName: '',
            planId: '',
            data: [],
            orgList: [],
            keyword: []
        }
    }
    componentWillMount() {
        const { mon = '', orgId = '', trackPlanId = '', planId = '' } = this.getUrlParams();
        this.setState({
            mon: mon,
            orgId: orgId,
            trackPlanId: trackPlanId,
            planId: planId
        })
        FetchQueryOrgList({
            "current": 1,
            "pageSize": 999,
            "paging": 1,
            "planType": 2, //1|高管;2|业务条线;3|职能部门
            "sort": ""

        }).then(res => {
            if (res.code === 1) {

                this.setState({ orgList: res.records })
                res.records.forEach(item => {
                    if (item.orgId == orgId) {
                        this.setState({
                            orgName: item.orgName
                        })

                        return
                    }
                });
            }
        })
        //考核跟踪方案明细查看
        FetchQueryAssessTrackPlan({
            mon: Number(mon),
            orgid: Number(orgId),
            trackplanid: Number(trackPlanId),
            viewType: 2
        }).then(res => {
            const { code = 0, result = '' } = res
            if (code > 0) {
                let data = []
                let keyword = []
                const dataList = result ? JSON.parse(result) : {}
                const { result1 = [], result2 = [] } = dataList
                result1.forEach(item => {
                    let param = {
                        INDI_ClASS_NAME: item.IDX_CLASSNAME || '',
                        INDI_TYPE: item.IDX_TYPE || '',
                        INDI_ID: item.IDX_ID || '',//指标ID
                        BASE_GOAL: item.BASE_GOAL || '',//基础目标
                        BREAK_GOAL: item.BREAK_GOAL || '',//分解目标
                        CHALLENGE_GOAL: item.CHALLENGE_GOAL || '',//挑战目标
                        WEIGHT: item.WEIGHT || '',//权重
                        REMARK: item.REMARK || '',//备注说明
                        OPR_EMP: item.OPR_EMP || '',//录入人
                    }

                    data.push(param)
                })

                result2.forEach(item => {
                    let param = {
                        INDI_ID: item.IDX_ID || '',
                        KEYWORK: item.KEYWORK || '',
                        WEIGHT: item.WEIGHT || '',
                        REMARK: item.REMARK || '',
                        OPR_EMP: item.OPR_EMP || ''
                    }

                    keyword.push(param)
                })

                this.setState({
                    data: data,
                    keyword: keyword
                })
            } else {
                message.error(res.note)
            }
        })
    }
    handleMonthPickerOnChange = (mon) => {
        let { orgId, trackPlanId } = this.state

        // 506229 考核跟踪方案明细查看
        FetchQueryAssessTrackPlan({
            mon: Number(mon),
            orgid: Number(orgId),
            trackplanid: Number(trackPlanId),
            viewType: 2
        }).then(res => {
            const { code = 0, result = '' } = res
            if (code > 0) {
                let data = []
                let keyword = []
                const dataList = result ? JSON.parse(result) : {}
                const { result1 = [], result2 = [] } = dataList
                result1.forEach(item => {
                    let param = {
                        INDI_ClASS_NAME: item.IDX_CLASSNAME || '',
                        INDI_TYPE: item.IDX_TYPE || '',
                        INDI_ID: item.IDX_ID || '',//指标ID
                        BASE_GOAL: item.BASE_GOAL || '',//基础目标
                        BREAK_GOAL: item.BREAK_GOAL || '',//分解目标
                        CHALLENGE_GOAL: item.CHALLENGE_GOAL || '',//挑战目标
                        WEIGHT: item.WEIGHT || '',//权重
                        REMARK: item.REMARK || '',//备注说明
                        OPR_EMP: item.OPR_EMP || '',//录入人
                    }

                    data.push(param)
                })

                result2.forEach(item => {
                    let param = {
                        INDI_ID: item.IDX_ID || '',
                        KEYWORK: item.KEYWORK || '',
                        WEIGHT: item.WEIGHT || '',
                        REMARK: item.REMARK || '',
                        OPR_EMP: item.OPR_EMP || ''
                    }

                    keyword.push(param)
                })

                this.setState({
                    data: data,
                    keyword: keyword
                })
            } else {
                message.error(res.note)
            }
        })
    }
    changeData = (data, order) => {
        if (order === 1) {
            this.setState({
                data: data
            })
        }else{
            this.setState({
                keyword: data
            })
        }

    }
    // 获取url参数
    getUrlParams = () => {
        const { match: { params: { params: encryptParams = '' } } } = this.props;
        const params = JSON.parse(DecryptBase64(encryptParams));
        return params;
    }

    render() {
        const { onCancelOperate, onSubmitOperate } = this.props;
        let { mon, orgName, planId, data, keyword, orgId } = this.state

        return (
            <Fragment>
                <div style={{ padding: '0 25px' }} >
                    <Row style={{ height: '100%' }} className='dp-body'>
                        <Col span={24} className='dp-title'>
                            <AddIndHeader handleMonthPickerOnChange={this.handleMonthPickerOnChange} mon={mon} orgName={orgName} />
                        </Col>
                        <Col span={24} className='dp-cont'>
                            <AddIndBody orgId={orgId} mon={mon} keyword={keyword} data={data} planId={planId} changeData={this.changeData} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(AddInd);
