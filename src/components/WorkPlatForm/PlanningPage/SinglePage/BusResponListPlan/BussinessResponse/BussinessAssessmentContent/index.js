import React from 'react';
import { Menu, Col, Table, message, Row } from 'antd'
import { withRouter } from 'dva/router'
import BussinessAssessmentFoot from '../BussinessAssessmentFoot'
import BussinessassessmentTable from '../BussinessAssessmentTable';
import QualityIndexTable from "../QualityIndexTable";
import EfficiencyIndexTable from "../EfficiencyIndexTable"
import RichTextEditor from '../../BussinessResponseModify/RichTextEditor'
import {
  FetchQueryDefIndi,
  FetchAddAssessPlanLegalNote,
  FetchQueryLegalNote,
  FetchAddBusRespon, FetchQueryBusResponLegalNote,
} from '../../../../../../../services/planning/planning';
import PlanDeclare from '../PlanDeclare';
import { EncryptBase64 } from '../../../../../../Common/Encrypt'
class BussinessAssessmentContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '基础指标',     //当前选中的分页
            data: [],               //第一张表的data
            column: [],             //第一张表的column

            data2: [],               //第2张表的data
            column2: [],             //第2张表的column

            data3: [],               //第3张表的data
            column3: [],             //第3张表的column

            orgId: -1,
            headId: 0,
            year: 2021,
            data4: [],               //富文本编译器的数据
            defaultOpen1: true,      //默认展开表
            defaultOpen2: false,

        }
    }
    //设置三个表格的column信息
    componentDidMount() {
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
                align: 'center',
                selectedWidth: 0.15 * selectedFatherWidth,
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
                type: '2',
                label: '1',
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
                selectedWidth: 0.1 * selectedFatherWidth,
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
                dataIndex: 'WEIGHT',
                type: '2',
                label: '1',
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
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 1,
                dataIndex: 'INDI_ID',
                type: '6',
                width: '15%',
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
                dataIndex: 'WEIGHT',
                type: '2',
                width: '10%',
                label: '1',
                align: 'center'
            },
        ]

        this.setState({
            column,
             column2,
             column3,
        })
    }

    //切换tab页面
    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };

    // 渲染富文本编译器表格
    renderSelfEvaluation = (data) => {
        let columns = [
            {
                title: '说明类别',
                dataIndex: 'MODULAR_NAME',
                // key: 'MODULAR_NAME',
                width: '10%',
            }, {
                title: "说明",
                dataIndex: 'NOTE',
                // key: 'MODULAR_NOTE',
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

    //保存富文本编译器传递过来的数据 id和对应的编码内容
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

    //当组织机构或者领导人改变的时候 获取相应的表格默认值
    changeHeadParams = (orgId = 1, headId) => {
        const { params } = this.props //获取url传递过来的planType
        this.setState({
            orgId: orgId,
            headId: headId,
        }, () => {
            const { year } = this.state
            //获取表单默认数据
            let param = {
                "head": headId.length === 0 ? -1 : Number(headId),
                "oprType": 1,       //当前页面是新增页面 所以该参数固定为1
                "orgId": Number(orgId),
                "planType": Number(params),      //1|高管考核方案;2|业务条线;3|职能部门
                "yr": year,
            }


            FetchQueryDefIndi(param).then((ret) => {
                const data = ret.result
                if (data.length >= 0) {
                    this.setState({
                        data: data
                    })
                }
            })
            FetchQueryBusResponLegalNote({
                // 操作人	I_CZR	NUMBER	✓
                // 操作类型	I_OPRTYPE	NUMBER	✓ 1
                // 考核方案类型	I_PLANTYPE	NUMBER	✓ 2
                // 年份	I_YR	NUMBER	✓ 2021
                // 组织机构ID	I_ORGID	NUMBER	✓ orgId
                // 负责人	I_HEAD	NUMBER
                "head": headId,
                "oprType": 1,
                "planType": 2,
                "orgId": orgId,
                "yr": year
            }).then((ret) => {
                // modularId: "6"
                // modularName: "激励方式"
                // modularNote: ""
                // sno: "1"
                // MODULAR_ID: "6"
                // MODULAR_NAME: "激励方式"
                // NOTE: ""
                // SNO: "1"
                let arr = new Array(ret.records.length);
                ret.records.forEach((item, index) => {
                    //arr.splice(Number(item.sno) - 1, 1, item)
                    let obj = {}
                    for (let obj1 in item) {
                        if (obj1 === 'modularId') {
                            obj.MODULAR_ID = item[obj1]
                        } else if (obj1 === 'modularName') {
                            obj.MODULAR_NAME = item[obj1]
                        } else if (obj1 === 'sno') {
                            obj.SNO = item[obj1]
                        } else if (obj1 === 'modularNote') {
                            obj.NOTE = item[obj1]
                        }
                    }
                    arr.splice(Number(obj.SNO) - 1, 1, obj)
                })
                this.setState({
                    data4: arr
                })
            })

        })

    }

    //保存子类传递过来的相应数据data
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

    //函数防抖
    debounce = (fn, delay) => {
        return (...rest) => {
            const params = rest
            if (this.timeOut) {
                clearTimeout(this.timeOut)
            }
            this.timeOut = setTimeout(() => {
                fn.apply(this, params)
            }, delay);
        }
    }

    //卸载时清除定时器
    componentWillUnmount() {
        clearTimeout(this.timeOut)
        this.setState = () => { return; }

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


    //点击确定或者保存草稿
    getData = (oprType) => {
        const { data, data2, data3, orgId, headId, data4, year } = this.state
        const { params, history } = this.props
        const numberData = this.toStr(data)
        const numberData2 = this.toStr(data2)
        const numberData3 = this.toStr(data3)

        //新增的时候需要判断是否有输入完整的内容
        let flag = true
        if ((orgId === -1 || orgId === '') && params === 2) {//data4.length === 0
            message.error("请选择适用的业务条线")
            flag = false;
        }
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

        //如果有没填写的
        flag && FetchAddBusRespon({
            "head": Number(headId),
            "orgId": params === 2 ? Number(orgId) : 1,
            "oprType": oprType, //保存草稿是1 新增是2
            "yr": year,
            "busindi": JSON.stringify(numberData),
            "magindi": JSON.stringify(numberData2),
            "masscoeff": JSON.stringify(numberData3),
            "legalNote": JSON.stringify(data4),
        }).then((ret) => {
            if (ret.code === 1) {
                const planID = ret.note.substring(ret.note.indexOf(":") + 1)
                const params = {
                    planId: planID || '',
                    planType: "2" || '',
                };
                if (data4.length === 0) {
                    message.success("新增成功")
                    history.push(`/esa/planning/busAccessPlanDetail/${EncryptBase64(JSON.stringify(params))}`)
                    return;
                }
                const promises = data4.length > 0 && data4.map((item, index) => {
                    // MODULAR_ID: "16"
                    // MODULAR_NAME: "激励方式"
                    // NOTE: ""
                    // SNO: "1"
                    // planId: "31"

                    return FetchAddAssessPlanLegalNote(
                        {
                            "legalNote": item.NOTE,
                            "modularId": Number(item.MODULAR_ID),
                            "modularName": item.MODULAR_NAME,
                            "planId": Number(planID),
                            "sno": Number(item.SNO),
                        }
                    )

                    // .then((ret) => {
                    //     if (ret.code === 1) {
                    //         flag += 1
                    //     }
                    //     if (flag === data4.length) {
                    //         message.success("新增成功")
                    //         window.location.href = `/#/esa/planning/accessPlanDetail/${EncryptBase64(JSON.stringify(params))}`
                    //     }
                    // })
                })
                Promise.all(promises).then(
                    res => {
                        message.success("新增成功")
                        history.push(`/esa/planning/busAccessPlanDetail/${EncryptBase64(JSON.stringify(params))}`)
                    }
                ).catch(
                    err => {
                        message.error("新增失败,请稍候重试")
                    }
                )
            }

            else if (ret.code === -1) {
                message.error(ret.note)
            }
        }).catch((error) => {
            message.error(error.note)
        })
    }

    //改变年份信息
    changeYearParams = (year) => {
        this.setState({
            year: year
        })
    }



    //表格展开
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
            data4 = [],
            column = [],
            data = [],
            column2 = [],
            data2 = [],
            column3 = [],
            data3 = [],
            defaultOpen1,
            defaultOpen2 } = this.state;
        const { onCancelOperate, params } = this.props//params是livebos页面调用时传递进来的planId 决定页面是领导考核还是业务条线考核

        //如果data中没有数据 则添加默认数据
        data.length === 0 && data.push({
            INDI_CLASSNAME: '经营指标',
            INDI_CLASS: 1,
            INDI_TYPE: '',
            INDI_ID: '',
            BASE_GOAL: '', BREAK_GOAL: '', CHALLENGE_GOAL: '', WEIGHT: ''
        })
        data2.length === 0 && data2.push({
            INDI_CLASSNAME: '管理指标',
            //idxTypeName: managementOption1[0] ? managementOption1[0] : '',
            INDI_ID: '',
            INDI_CLASS: 2,
            ASSESS_NOTE: '',
            SCORE_RULE: '',
            WEIGHT: '',
        })
        data3.length === 0 && data3.push({
            INDI_CLASS: 3,
            INDI_ID: '',
            ASSESS_NOTE: '',
            SCORE_RULE: '',
            WEIGHT: ''
        })
        return (
            <div style={{ backgroundColor: 'white', padding: '0 25px 0 25px ', paddingBottom: '20px' }}>
                <div className='dp-title'>
                    <PlanDeclare params={params} changeYearParams={this.changeYearParams} changeHeadParams={this.changeHeadParams} />
                </div>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" key='基础指标' >
                    <Menu.Item key="基础指标" style={{fontSize:'1.3rem',fontWeight:'700',color:'#333'}}> 基础指标</Menu.Item>
                    {data4.length > 0 && data4.map((item, index) => {
                        return <Menu.Item key={item.MODULAR_ID} style={{fontSize:'1.3rem',fontWeight:'700',color:'#333'}}> {item.MODULAR_NAME}</Menu.Item>
                    })}
                </Menu>
                {current === '基础指标' &&
                    //1|经营指标;2|管理指标;3|质量系数;4|具体考核方案	 idxClass  指标类别 这个参数根据表格来确定 该页面有4个表格
                    <div id={'forWidth'}>
                        <BussinessassessmentTable changeOpen={this.changeOpen} defaultOpen={defaultOpen1} changeData={this.changeData} title="效率指标" text="添加经营指标" column={column} data={data} idxClass={1} />
                        <QualityIndexTable defaultOpen={defaultOpen1} changeData={this.changeData} text="添加管理指标" column={column2} data={data2} idxClass={2} />
                        <EfficiencyIndexTable planType={params} changeOpen={this.changeOpen} defaultOpen={defaultOpen2} changeData={this.changeData} title="质量系数" text="添加质量系数" column={column3} data={data3} idxClass={3} />
                    </div>
                }
                {/* 渲染富文本编辑器页面 */}
                {
                    data4.length > 0 && data4.map((item, index) => {
                        if (current === item.MODULAR_ID) {
                            return <div>
                                <Col  >
                                    <Table
                                        className="esa-evaluate-notice-table"
                                        size="middle"
                                        bordered
                                        key={index}
                                        columns={this.renderSelfEvaluation(item)}
                                        dataSource={[item]}
                                        pagination={false}
                                    //scroll={{ x: 1500, y: 480 }}
                                    />
                                </Col>
                            </div>
                        }
                        return null
                    })
                }
                <Row style={{ backgroundColor: 'white' }} >
                    <BussinessAssessmentFoot style={{ backgroundColor: 'white' }} onCancelOperate={onCancelOperate} saveData={this.debounce(this.getData, 200)} />
                </Row>
            </div >
        );
    }
}
export default withRouter(BussinessAssessmentContent);
