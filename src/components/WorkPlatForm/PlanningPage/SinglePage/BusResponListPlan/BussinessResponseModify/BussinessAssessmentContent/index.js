import React from 'react';
import { Menu, Col, Table, Input, message, Row,Form, } from 'antd'
import { withRouter } from "dva/router";

import BussinessAssessmentFoot from '../BussinessAssessmentFoot'
import BussinessassessmentTable from '../../BussinessResponse/BussinessAssessmentTable';
import QualityIndexTable from "../../BussinessResponse/QualityIndexTable";
import EfficiencyIndexTable from "../../BussinessResponse/EfficiencyIndexTable"
import RichTextEditor from '../../BussinessResponseModify/RichTextEditor'
import {
  FetchUpdateBusRespon,
  FetchAddAssessPlanLegalNote,
  FetchQueryAssessPlanBusDetail,
  FetchQueryBusResponDetail,
} from '../../../../../../../services/planning/planning';
import PlanDeclare from '../PlanDeclare';
import { EncryptBase64 } from '../../../../../../Common/Encrypt'
import BasicModal from '../../../../../../Common/BasicModal';
const { TextArea } = Input;
class BussinessAssessmentContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '基础指标', //当前选中的分页
            data: [],               //第一张表的data
            column: [],             //第一张表的column

            data2: [],               //第2张表的data
            column2: [],             //第2张表的column

            data3: [],               //第3张表的data
            column3: [],             //第3张表的column

            data4: [],      //富文本编译器的数据
            header: {},     //方案基本信息

            planType: 0, //计划类型
            orgId: 0, //组织ID
            orgName: '',//xx事业部
            yr: 0,      //年份
            head: '',   //领导人姓名
            headId: 0,

            visible: false,
            remark: '',  //归档评论
            defaultOpen1: true,
            defaultOpen2: false,
        }
    }

    dataConvertion = (array) => {
        array.forEach((ele, index) => {
            for (let item in ele) {
                if (item === "INDI_CLASS" || item === "INDI_TYPE" || item === "INDI_ID") {
                    ele[item] = Number(ele[item])
                }
            }
        })
        return array
    }

    //获取初始数据和设置表格的column
    componentDidMount() {
        const { jsonParam } = this.props
        //获取初始数据
        FetchQueryBusResponDetail(
            jsonParam
        ).then((ret) => {
            // const tem = JSON.parse(ret.note)
            // const noteArray = ret.note.split(",")//获取到的note中的数据  planType:2,orgId:383,orgName:FICC事业部,yr:2021,head:吴**
            // noteArray.forEach((item, index) => {
            //     const tem = item.split(":")
            //     this.setState({
            //         [tem[0]]: tem[1]
            //     }, () => {

            //     }
            //     )
            // })

            const header = JSON.parse(ret.note)

            this.setState({
                header: header,
                headId: header.headId || '',
                orgId: header.orgId || '',
                yr: header.yr || '',
            })
            const defaultdata = JSON.parse(ret.result)
            const { result1, result2, result3, result4 } = defaultdata
            this.setState({
                data: this.dataConvertion(result1),
                data2: this.dataConvertion(result2),
                data3: this.dataConvertion(result3),
                data4: result4,
            })
        })
        //const { orgId = 1 } = this.state
        //result1":[{"INDI_CLASS":"1","INDI_CLASSNAME":"经营指标","INDI_TYPE":"10","INDI_TYPENAME":"业务类"
        //,"INDI_ID":"21","INDI_NAME":"产品投资规模(亿)","BASE_GOAL":"0","BREAK_GOAL":"0","CHALLENGE_GOAL":"0","WEIGHT":"0"}
        const selectedFatherWidth = document.getElementById('forWidth').offsetWidth
        const column = [
            {
                columnName: '指标类别',
                colSpan: 1,
                dataIndex: 'INDI_CLASSNAME',
                type: '1',
                width: '10%',
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 2,
                dataIndex: 'INDI_TYPE',
                type: '5',
                width: '15%',
                selectedWidth: 0.15 * selectedFatherWidth,
                align: 'center',
                flag: true,
            },
            {
                columnName: '指标名称2',
                colSpan: 0,
                dataIndex: 'INDI_ID',
                type: '6',
                width: '15%',
                selectedWidth: 0.15 * selectedFatherWidth,
                align: 'center',
                flag: true,
            },
            {
                columnName: '基础目标',
                colSpan: 1,
                dataIndex: 'BASE_GOAL',
                type: '2',
                width: '15%',
                align: 'center'
            },
            {
                columnName: '分解目标',
                colSpan: 1,
                dataIndex: 'BREAK_GOAL',
                type: '2',
                width: '15%',
                align: 'center'
            },
            {
                columnName: '挑战目标',
                colSpan: 1,
                dataIndex: 'CHALLENGE_GOAL',
                type: '2',
                width: '15%',
                align: 'center'
            },
            {
                columnName: '权重',
                colSpan: 1,
                dataIndex: 'WEIGHT',
                label: '1',
                type: '2',
                width: '10%',
                align: 'center'
            },

        ]
        const column2 = [
            {
                columnName: '指标类别',
                colSpan: 1,
                dataIndex: 'INDI_CLASSNAME',
                type: '1',
                width: '10%',
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 1,
                dataIndex: 'INDI_ID',
                type: '7',
                width: '15%',
                selectedWidth: 0.15 * selectedFatherWidth,
                align: 'center'
            },
            //"ASSESS_NOTE":"考核内容1","SCORE_RULE":"评分规则1","WEIGHT":0.1
            {
                columnName: '考核内容',
                colSpan: 1,
                dataIndex: 'ASSESS_NOTE',
                type: '4',
                width: '30%',
                align: 'center'
            },
            {
                columnName: '评分规则',
                colSpan: 1,
                dataIndex: 'SCORE_RULE',
                type: '4',
                width: '30%',
                align: 'center'
            },
            {
                columnName: '权重',
                colSpan: 1,
                label: '1',
                dataIndex: 'WEIGHT',
                type: '2',
                width: '10%',
                align: 'center'
            },
        ]
        const column3 = [
            {
                columnName: '指标类别',
                colSpan: 1,
                dataIndex: 'INDI_TYPE',
                type: '5',
                width: '10%',
                selectedWidth: 0.1 * selectedFatherWidth,
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 1,
                dataIndex: 'INDI_ID',
                type: '6',
                width: '15%',
                selectedWidth: 0.15 * selectedFatherWidth,
                align: 'center'
            },
            //"ASSESS_NOTE":"考核内容1","SCORE_RULE":"评分规则1","WEIGHT":0.1
            {
                columnName: '考核内容',
                colSpan: 1,
                dataIndex: 'ASSESS_NOTE',
                type: '4',
                width: '30%',
                align: 'center'
            },
            {
                columnName: '评分规则',
                colSpan: 1,
                dataIndex: 'SCORE_RULE',
                type: '4',
                width: '30%',
                align: 'center'
            },
            {
                columnName: '权重',
                colSpan: 1,
                label: '1',
                dataIndex: 'WEIGHT',
                type: '2',
                width: '10%',
                align: 'center'
            },
        ]

        this.setState(
            {
                column,
                column2,
                column3,
            }
        )
    }

    //点击tab
    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };

    // 渲染富文本编译器
    renderSelfEvaluation = (data) => {
        //if (data.length > 0) {
        let columns = [
            // modularId: "16"
            // modularName: "激励方式"
            // modularNote: ""
            // sno: "1"
            {
                title: '说明类别',
                dataIndex: 'MODULAR_NAME',
                // key: 'MODULAR_NAME',
                width: '10%',
            },
            {
                title: "说明",
                dataIndex: 'NOTE',
                // key: 'MODULAR_NOTE',
                // width: '42%',
                render: (value, row, index) => {
                    const obj = {
                        children:
                            <RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar"
                                data={[data]} sort={data.SNO}
                                saveSecondPageData={this.saveSecondPageData}
                                name={data.MODULAR_NAME} id={data.MODULAR_ID} />,
                        props: {
                            rowSpan: 1,
                            colSpan: 1
                        },
                    };
                    return obj
                }
            },
        ]
        return columns;
        //}
    }

    //更新富文本编译器的数据
    saveSecondPageData = (id, obj) => {
        const { data4 } = this.state
        let flag = true;

        data4.forEach((item, index) => {
            if (item.MODULAR_ID == id) {
                //该ID数组已经存在了  删除替换
                data4.splice(index, 1, obj)
                flag = false
                return
            }
        })
        if (flag) {
            //遍历完了还没有  直接插入这个新的对象数据
            data4.push(obj)
        }
    }

    //从子类中获取并改变3个模块的数据
    changeData = (num, data) => {
        if (num === 1) {
            this.setState({
                data: data
            })
        }
        if (num === 2) {
            this.setState({
                data2: data
            })
        }
        if (num === 3) {
            this.setState({
                data3: data
            })
        }
    }



    //对象属性转化为字符
    toStr = (array) => {
        let cloneArray = JSON.parse(JSON.stringify(array))
        cloneArray.map((item, index) => {
            for (let obj in item) {
                if (obj !== '') {
                    item[obj] = item[obj] + ''
                }
            }
            return null
        })
        return cloneArray;
    }

    //确定按钮事件
    getData = (oprType) => {
        const { data = [], data2 = [], data3 = [], yr, data4 = [], orgId, headId, remark } = this.state
        const { history } = this.props
        const numberData = this.toStr(data)
        const numberData2 = this.toStr(data2)
        const numberData3 = this.toStr(data3)

        //新增的时候需要判断是否有输入完整的内容
        let flag = true
        if (oprType === 2 && flag) {
            //循环判断是哪张表数据未填写
            numberData.forEach((item, index) => {
                for (let obj in item) {
                    if (item[obj] === '') {
                        flag = false
                        message.error("请完整填写效率指标表格")
                        return
                    }
                }
            })
            flag && numberData2.forEach((item, index) => {
                for (let obj in item) {
                    if (item[obj] === '') {
                        flag = false
                        message.error("请完整填写效率指标表格")
                        return
                    }
                }
            })
            flag && numberData3.forEach((item, index) => {
                for (let obj in item) {
                    if (item[obj] === '') {
                        flag = false
                        message.error("请完整填写质量系数表格")
                        return
                    }
                }
            })

        }
        if (flag) {
            //将参数都转换成JSON类型 FetchAddAssessPlan
            const param = {
                "head": Number(headId),
                "orgId": Number(orgId),
                "oprType": oprType,       //归档修改为2
                "yr": yr,
                "busindi": JSON.stringify(numberData),
                "magindi": JSON.stringify(numberData2),
                "masscoeff": JSON.stringify(numberData3),
                "legalNote": JSON.stringify(data4),
                "remark": remark,
            }
            FetchUpdateBusRespon(param).then((ret) => {
                if (ret.code === 1) {
                    const planID = ret.note.substring(ret.note.indexOf(":") + 1)
                    const params = {
                        planId: planID || '',
                        planType: "2" || '',
                    };
                    if (data4.length === 0) {
                        history.push(`/esa/planning/busAccessPlanDetail/${EncryptBase64(JSON.stringify(params))}`)
                    }
                    const promises = data4.length > 0 && data4.map((item, index) => {
                        return FetchAddAssessPlanLegalNote(
                            {
                                "legalNote": item.NOTE,
                                "modularId": Number(item.MODULAR_ID),
                                "modularName": item.MODULAR_NAME,
                                "planId": Number(planID),
                                "sno": Number(item.SNO),
                            }
                        )

                    })
                    Promise.all(promises).then(() => {
                        //promise状态都为fulfilled的时候执行跳转操作
                        history.push(`/esa/planning/busAccessPlanDetail/${EncryptBase64(JSON.stringify(params))}`)
                        //window.location.href = `/#/esa/planning/accessPlanDetail/${EncryptBase64(JSON.stringify(params))}`

                    })

                } else {
                    message.error("请求错误,请重新提交")
                }
            })
        }

    }

    changeTableData = (tableData) => {
        this.setState({
            tableData: tableData
        })
    }

    showModal = () => {
        this.setState({
            visible: true
        })
    }
    //点击确定
    handleOk = () => {
        this.getData(2)
    }

    //取消弹窗
    handleCancel = () => {
        this.setState({
            visible: false,
            remark: '',
        })
    }

    //输入remark
    handleInput = (value) => {
        this.setState({
            remark: value,
        })
    }
    handleHeadIdChange = (value) => {
        this.setState({
            headId: value
        })
    }

    changeOpen = (defaultOpen, order) => {
        if (order === 1) {
            this.setState({
                defaultOpen1: defaultOpen,
            })
        } else {
            this.setState({
                defaultOpen2: defaultOpen,
            })
        }

    }

    render() {
        const { current,
            data4,
            column = [],
            data = [],
            column2 = [],
            data2 = [],
            column3 = [],
            data3 = [],
            visible,
            header,
            headId,
            defaultOpen1,
            defaultOpen2 } = this.state
        const { onCancelOperate } = this.props
        return (
            <div id={'forWidth'} style={{ backgroundColor: 'white', padding: '0 25px 0 25px ', paddingBottom: '20px' }}>
                <div className='dp-title'>
                    <PlanDeclare header={header} handleHeadIdChange={this.handleHeadIdChange} headId={headId} />
                </div>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" key='基础指标' >
                    <Menu.Item key="基础指标" style={{fontSize:'1.3rem',fontWeight:'700',color:'#333'}}> 基础指标</Menu.Item>
                    {data4.map((item, index) => {
                        return <Menu.Item key={item.MODULAR_ID} style={{fontSize:'1.3rem',fontWeight:'700',color:'#333'}}> {item.MODULAR_NAME}</Menu.Item>
                    })}
                </Menu>
                {current === '基础指标' &&
                    //1|经营指标;2|管理指标;3|质量系数;4|具体考核方案	 idxClass  指标类别 这个参数根据表格来确定 该页面有4个表格
                    <div>
                        <BussinessassessmentTable changeOpen={this.changeOpen} defaultOpen={defaultOpen1} changeData={this.changeData} title="效率指标" text="添加经营指标" column={column} data={data} idxClass={1} />
                        <QualityIndexTable defaultOpen={defaultOpen1} changeData={this.changeData} text="添加管理指标" column={column2} data={data2} idxClass={2} />
                        <EfficiencyIndexTable edit changeOpen={this.changeOpen} defaultOpen={defaultOpen2} changeData={this.changeData} title="质量系数" text="添加质量系数" column={column3} data={data3} idxClass={3} />
                    </div>
                }

                {
                    data4.map((item, index) => {
                        if (current === item.MODULAR_ID) {
                            // return <Table dataSource={dataSource} columns={columns} />;
                            return <div>
                                <Col>
                                    <Table
                                        className="esa-evaluate-notice-table"
                                        size="middle"
                                        bordered
                                        columns={this.renderSelfEvaluation(item)}
                                        dataSource={[item]}
                                        pagination={false}
                                        rowKey={item => item.MODULAR_ID}
                                    //scroll={{ x: 1500, y: 480 }}
                                    />
                                </Col>

                            </div>
                        }
                        return null
                    })
                }
                <Row style={{ backgroundColor: 'white' }}>
                    <BussinessAssessmentFoot onCancelOperate={onCancelOperate} saveData1={this.showModal} saveData={this.getData} />
                </Row>
                <BasicModal
                    style={{ top: '10rem' }}
                    width="50rem"
                    title="归档说明"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form.Item style={{ margin: '1rem', padding: '1rem' }}
                        wrapperCol={{ span: 24 }}>
                        <TextArea rows={4} onChange={e => this.handleInput(e.target.value)} />
                    </Form.Item>
                </BasicModal>
            </div>
        );
    }
}
export default withRouter(BussinessAssessmentContent);
