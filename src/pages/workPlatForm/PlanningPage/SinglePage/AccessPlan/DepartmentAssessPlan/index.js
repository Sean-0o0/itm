import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import PlanDeclare from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/DepartmentAssessPlan/PlanDeclare';
import DepartmentHeader from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/DepartmentAssessPlan/DepartmentHeader';
import { FetchQueryOrgList, FetchQueryLegalNote } from '../../../../../../services/planning/planning'
class DepartmentAssessPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BussinessArray: [],
            currentSelectDeptId: '0',
            secondOption: '0',
            data4: [],
            year: new Date().getFullYear()
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
            const { code = 0, note = '', records = [] } = res
            // //console.log("查询组织机构信息:",res);
            if (code === 1) {
                this.setState({ BussinessArray: records })
            } else {
                message.error(note)
            }
        })
        // this.setState(
        //     {
        //         BussinessArray: BussinessArray
        //     }
        // )
    }
    changeOptionHandle = (value) => {
        this.setState({
            currentSelectDeptId: value
        }, () => {
            this.handleFetchQueryLegalNote(this.state.currentSelectDeptId, value)
        })

    }
    handleFzrChange = (value) => {
        this.setState({
            secondOption: value
        })
        this.handleFetchQueryLegalNote(this.state.currentSelectDeptId, value)

    }
    changeYearParams = (year) => {
        this.setState({
            year: year
        })
    }
    handleFetchQueryLegalNote(orgId, headId) {
        let param = {
            // 操作人	I_CZR	NUMBER	✓
            // 操作类型	I_OPRTYPE	NUMBER	✓ 1
            // 考核方案类型	I_PLANTYPE	NUMBER	✓ 2
            // 年份	I_YR	NUMBER	✓ 2021
            // 组织机构ID	I_ORGID	NUMBER	✓ orgId
            // 负责人	I_HEAD	NUMBER
            "head": Number(headId),
            "oprType": 1,
            "planType": 3,
            "orgId": Number(orgId),
            "yr": this.state.year
        }
        // //console.log('param=',param);
        FetchQueryLegalNote(param).then((ret) => {
            const { records = [] } = ret
            // 模块ID	MODULAR_ID	NUMBER
            // 模块名称	MODULAR_NAME	VARCHAR2
            // 模块内容	MODULAR_NOTE	VARCHAR2
            // 展示顺序	SNO	NUMBER
            //数组排序
            // //console.log("ret.records=",ret.records);
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
        const { onCancelOperate, onSubmitOperate } = this.props;
        // //console.log('DecryptBase64(params.params)=',DecryptBase64(params.params))
        // const planId= JSON.parse(DecryptBase64(params.params));
        // //console.log('planId=',planId)
        const { BussinessArray, currentSelectDeptId, secondOption, data4, year } = this.state
        // //console.log('prop data=',data4);
        return (

            <Fragment >
                <div style={{ backgroundColor: 'white', height: '100%' }}>
                    <div id={'forWidth'} style={{ padding: '0 25px', backgroundColor: 'white' }} >
                        <Row className='dp-body' style={{ height: '100%' }}>
                            <Col span={24} className='dp-title'>
                                <DepartmentHeader BussinessArray={BussinessArray} changeOptionHandle={this.changeOptionHandle} handleFzrChange={this.handleFzrChange} changeYearParams={this.changeYearParams} />
                            </Col>
                            <Col span={24} className='dp-cont'>
                                <PlanDeclare year={year} currentSelectDeptId={currentSelectDeptId} secondOption={secondOption} data4={data4} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Fragment>

        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(DepartmentAssessPlan);
