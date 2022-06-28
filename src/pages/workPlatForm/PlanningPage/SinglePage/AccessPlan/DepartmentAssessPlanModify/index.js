import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import PlanDeclare from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/DepartmentAssessPlanModify/PlanDeclareModify';
import DepartmentHeader from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/DepartmentAssessPlanModify/DepartmentHeaderModify';
import { FetchQueryOrgList, FetchQueryLegalNote, FetchQueryUserList } from '../../../../../../services/planning/planning'
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt'
class DepartmentAssessPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data4: [],
            orgName: '',
            head: '',
            headId: '',
            orgId: '',
            year: '',
            BussinessArray: []
        }
    }
    componentWillMount() {
        // 506204 查询组织机构信息
        FetchQueryOrgList({
            pageLength: 999,
            pageNo: 1,
            paging: 1,
            planType: 3, //1|高管;2|业务条线;3|职能部门
            sort: "",
            totalRows: 0
        }).then(res => {
            const { code = 0, records = [] } = res
            // //console.log("查询组织机构信息:",res);
            if (code === 1) {
                this.setState({ BussinessArray: records })
            } else {
                message.error(res.note)
            }
        })
    }

    onChange = (item) => {
        // //console.log("item=",item);
        this.setState({
            orgName: item.orgName,
            head: item.head,
            headId: item.headId,
            year: item.yr,
            orgId: item.orgId

        })
    }
    handleFzrChange = (value) => {
        this.setState({
            headId: value
        })
        let { headId, year, orgId } = this.state
        this.handleFetchQueryLegalNote(
            {
                headId: headId,
                yr: year,
                orgId: orgId

            }
        )
    }
    // 考核说明
    handleFetchQueryLegalNote = (item) => {
        let param = {
            // 操作人	I_CZR	NUMBER	✓
            // 操作类型	I_OPRTYPE	NUMBER	✓ 1
            // 考核方案类型	I_PLANTYPE	NUMBER	✓ 2
            // 年份	I_YR	NUMBER	✓ 2021
            // 组织机构ID	I_ORGID	NUMBER	✓ orgId
            // 负责人	I_HEAD	NUMBER
            "head": Number(item.headId),
            "oprType": 1,
            "planType": 3,
            "orgId": Number(item.orgId),
            "yr": Number(item.yr)
        }
        FetchQueryLegalNote(param).then((ret) => {
            // 模块ID	MODULAR_ID	NUMBER
            // 模块名称	MODULAR_NAME	VARCHAR2
            // 模块内容	MODULAR_NOTE	VARCHAR2
            // 展示顺序	SNO	NUMBER
            //数组排序
            const { records = [] } = ret
            let arr = new Array(records.length);
            records.forEach((item, index) => {
                arr.splice(Number(item.sno) - 1, 1, item)
            })
            let data4 = []
            arr.forEach(item => {
                let param = {
                    MODULAR_ID: Number(item.modularId),//模块ID
                    MODULAR_NAME: item.modularName,//模块名称
                    NOTE: item.modularNote,//考核说明
                    SNO: item.sno//展示顺序
                }
                data4.push(param)
            })
            this.setState({
                data4: data4
            })
        })
    }

    render() {
        const { dictionary = {}, match: { params }, onCancelOperate, onSubmitOperate } = this.props;
        // const jsonParam = JSON.parse(DecryptBase64(params.params));
        // //console.log('DecryptBase64(params.params)=',DecryptBase64(params.params))
        const planId = JSON.parse(DecryptBase64(params.params));
        // //console.log('planId=',planId)
        // jsonParam={jsonParam}
        const { orgName, headId, year, BussinessArray, data4 } = this.state
        return (
            <Fragment>
                <div style={{ padding: '0 25px', backgroundColor: 'white', }} >
                    <Row style={{ height: '100%' }} className='dp-body'>
                        <Col span={24} className='dp-title'>
                            <DepartmentHeader BussinessArray={BussinessArray} handleFzrChange={this.handleFzrChange} orgName={orgName} headId={headId} year={year} />
                        </Col>
                        <Col span={24} className='dp-cont'>
                            <PlanDeclare planId={planId} onChange={this.onChange} headId={headId} data4={data4} handleFetchQueryLegalNote={this.handleFetchQueryLegalNote} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(DepartmentAssessPlan);
