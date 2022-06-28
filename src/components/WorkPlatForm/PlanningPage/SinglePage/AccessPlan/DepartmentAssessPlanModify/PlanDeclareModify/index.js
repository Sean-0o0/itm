import React from 'react';
import { Row, Col, message, Table, Menu, Input, Button, Form } from 'antd';
import BasicIndexTable from '../../../../Common/BasicIndexTable';
import DepartmentAssessPlanFoot from '../DepartmentAssessPlanFootModify'
import { EncryptBase64 } from '../../../../../../Common/Encrypt';
import { FetchQueryUserList, FetchQueryIndiList, FetchAddAssessPlanLegalNote, FetchQueryAssessPlanFuncDetail, FetchUpdateFuncAssessPlan } from '../../../../../../../services/planning/planning'
import RichTextEditor from '../../BussinessAssessmentModify/RichTextEditor';
import BasicModal from '../../../../../../Common/BasicModal';

const { TextArea } = Input;
class PlanDeclare extends React.Component {
    state = {
        option: [],
        option1: [],
        option2: [],
        selectedArray1: [],//共性考核质量系数表中已选中的下拉框
        selectedArray2: [],//具体考核方案表中的已选中的下拉框
        userOption: [],
        data: [],
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        column: [],
        column1: [],
        column2: [],
        remark: "", // 归档说明
        current: '职能部门考核方案',
        columns: [],
        secondPageDataSource: [],
        defaultRow: {
            INDI_CLASS: 1,
            INDI_CLASSNAME: '考核方案设计说明',
            INDI_TYPENAME: '',//指标类别名称   例子:目的
            DESIGN_NOTE: '',
            SNO: '',
        },
        defaultRow1: {
            INDI_CLASS: 2,
            INDI_CLASSNAME: '共性质量考核系数',
            INDI_TYPE: '',//指标类别
            INDI_TYPENAME: '',//指标类别名称
            INDI_ID: '',//指标id
            INDI_NAME: '',//指标名称
            WEIGHT: '',//权重
            ASSESS_PURPOSE: '',//考核目的
            SCORE_CERTERIA: '',//评分标准
            SCORE_PROCEDURE: '',//评分程序
        },
        defaultRow2: {
            INDI_CLASS: 3,
            INDI_CLASSNAME: '具体考核方案',
            INDI_TYPE: '', //指标类别
            INDI_TYPENAME: '', //指标类别名称
            INDI_ID: '', //指标id
            INDI_NAME: '', //指标名称
            WEIGHT: '',//权重
            ASSESS_NOTE: '',//考核内容
            SCORE_RULE: '',//评分规则
            DATA_SOURCES: '',//数据来源
            ASSESS_EMP: '',//考核人
            ASSESS_EMPNAME: '',//考核人姓名
            REMARK: ''//备注
        },
        inputValue: '',
        orgId: '',
        headId: '',
        yr: '',
        defaultOpen1: true,
        defaultOpen2: false,
        defaultOpen3: false,
    };
    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };

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
            }, {
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

    saveSecondPageData = (id, obj) => {
        //const { data4 } = this.props
        let flag = true;

        this.state.data3.forEach((item, index) => {
            if (item.MODULAR_ID == id) {
                //该ID数组已经存在了  删除替换
                this.state.data3.splice(index, 1, obj)
                flag = false
                return
            }
        })
        if (flag) {
            //遍历完了还没有  直接插入这个新的对象数据
            this.state.data3.push(obj)

        }
        // this.setState({
        //     data4: data4
        // })
    }

    // 506209 职能部门考核方案明细查看
    handleFetchQueryAssessPlanFuncDetail = () => {
        FetchQueryAssessPlanFuncDetail(
            {
                planId: this.props.planId //考核方案ID
            }
        )
            .then(res => {
                const { code = 0, result = '' } = res
                if (code === 1) {
                    let dataList = JSON.parse(result)

                    let { defaultRow, defaultRow1, defaultRow2 } = this.state

                    const { result1 = [], result2 = [], result3 = [], result4 = [] } = dataList
                    // "{"planType":"3","orgId":"350","orgName":"办公室","yr":"2021","headId":"1634","head":"耿**"}"
                    let note = JSON.parse(res.note)
                    // 考核说明查询
                    this.props.handleFetchQueryLegalNote(note)

                    //向头部组件传递部门名称、年份、负责人
                    this.props.onChange(note)
                    this.setState({
                        orgId: note.orgId,
                        yr: note.yr,
                        data: result1.length === 0 ? [defaultRow] : result1,
                        data1: result2.length === 0 ? [defaultRow1] : result2,
                        data2: result3.length === 0 ? [defaultRow2] : result3,
                        data3: result4,
                    }, () => {

                    })
                }
            })
    }

    // 506239 人员列表
    handleFetchQueryUserList = () => {
        FetchQueryUserList({
            "orgId": 1,
            "type": 2
        })
            .then(res => {
                const { code = 0, records = [] } = res
                if (code === 1) {
                    let userOption = []
                    records.forEach(item => {
                        let param = {
                            'key': item.userId || '',
                            'value': item.userName || '',
                            'orgId': item.orgId || '',
                            'orgName': item.orgName || '',
                        }
                        userOption.push(param)
                    })

                    this.setState({
                        userOption
                    })
                }
            })
    }

    /**
     * 指标列表查询
     * @param {number} param  3|质量系数;4|具体考核方案
     * @returns {object} null
     */
    handleFetchQueryIndiList = (param) => {
        if (param === 3) {
            // 506220 可选指标列表查询
            FetchQueryIndiList(
                {
                    idxClass: 3, //1|经营指标;2|管理指标;3|质量系数;4|具体考核方案
                    planType: 3, //1|高管考核方案;2|业务条线;3|职能部门
                }
            ).then(res => {
                const { code = 0, records = [] } = res
                if (code === 1) {
                    let option1 = []
                    records.forEach(item => {
                        //创建两个数组 分开装下拉框的内容
                        const param = {
                            'key': item.idxId || '',
                            'value': item.idxName || '',
                            'idxId': item.idxId || '',
                        }
                        if (JSON.stringify(option1).indexOf(JSON.stringify(param)) === -1) {
                            option1.push(param)
                        }
                    })
                    this.setState({ option1: option1 })
                }
            })
        } else {
            // 506220 具体考核方案指标列表查询
            FetchQueryIndiList(
                {
                    idxClass: 4, //1|经营指标;2|管理指标;3|质量系数;4|具体考核方案
                    planType: 3, //1|高管考核方案;2|业务条线;3|职能部门
                }
            ).then(res => {
                const { code = 0, records = [] } = res
                if (code === 1) {
                    let option2 = []
                    records.forEach(item => {
                        //创建两个数组 分开装下拉框的内容
                        const param = {
                            'idxId': item.idxId || '',
                            'key': item.idxType || '',
                            'value': item.idxTypeName || '',
                        }
                        if (JSON.stringify(option2).indexOf(JSON.stringify(param)) === -1) {
                            option2.push(param)
                        }
                    })
                    this.setState({ option2: option2 })
                }
            })
        }

    }



    componentWillMount() {
        // 506209 职能部门考核方案明细查看
        this.handleFetchQueryAssessPlanFuncDetail()

        // 506239 人员列表
        this.handleFetchQueryUserList()

        // 506220 可选指标列表查询
        this.handleFetchQueryIndiList(3)

        // 506220 具体考核方案指标列表查询
        this.handleFetchQueryIndiList(4);


        const column = [{
            columnName: '指标类别',
            colSpan: 1,

            dataIndex: 'INDI_TYPENAME',
            type: '3',
            width: '10%',
            align: 'center'
        },
        {
            columnName: '备注',
            colSpan: 1,

            dataIndex: 'DESIGN_NOTE',
            type: '4',
            align: 'center'
        }
        ]

        const column1 = [{
            columnName: '指标类别',
            colSpan: 1,

            dataIndex: 'INDI_ID',
            type: '7',
            width: '10%',
            align: 'center'
        },
        {
            columnName: '权重',
            colSpan: 1,
            width: '10%',
            dataIndex: 'WEIGHT',
            type: '2',
            align: 'center',
            label: '1'
        },
        {
            columnName: '考核目的',
            colSpan: 1,
            dataIndex: 'ASSESS_PURPOSE',
            type: '4',
            align: 'center'
        },
        {
            columnName: '考核标准',
            colSpan: 1,
            dataIndex: 'SCORE_CERTERIA',
            type: '3',
            align: 'center'
        },
        {
            columnName: '评分程序',
            colSpan: 1,
            dataIndex: 'SCORE_PROCEDURE',
            type: '3',
            align: 'center'
        }
        ]
        const column2 = [{
            columnName: '指标类别',
            colSpan: 1,

            dataIndex: 'INDI_TYPE',
            type: '7',
            width: '10%',
            align: 'center'
        },
        {
            columnName: '权重',
            colSpan: 1,
            width: '10%',
            dataIndex: 'WEIGHT',
            type: '2',
            align: 'center',
            label: '1'
        },
        {
            columnName: '考核内容',
            colSpan: 1,
            width: '25%',
            dataIndex: 'ASSESS_NOTE',
            type: '4',
            align: 'center'
        },
        {
            columnName: '评分规则',
            colSpan: 1,

            dataIndex: 'SCORE_RULE',
            type: '4',
            align: 'center'
        },
        {
            columnName: '数据来源',
            colSpan: 1,

            dataIndex: 'DATA_SOURCES',
            type: '3',
            align: 'center'
        },
        // {
        //     columnName: '考核人',
        //     colSpan: 1,
        //     dataIndex: 'ASSESS_EMP',
        //     type: '5',
        //     width: '10%',
        //     align: 'center'
        // },
        {
            columnName: '备注',
            colSpan: 1,
            dataIndex: 'REMARK',
            type: '3',
            align: 'center'
        }
        ]

        this.setState(
            {
                column: column,
                column2: column2,
                column1: column1,
            }
        )
    }

    getColumn = (num) => {
        let { column, column1, column2 } = this.state
        if (num === 1) {
            return column;
        } else if (num === 2) {
            return column1;
        } else {
            return column2;
        }
    }
    //添加设计说明
    addData = () => {
        let { data } = this.state

        //INDI_TYPE不为空的时候允许添加新的共性考核质量系数行
        // if(flag ==0 ) {
        if ((data.length === 0 || !(data[data.length - 1].INDI_TYPENAME === ''))) {
            data.push(
                {
                    INDI_CLASS: '',
                    INDI_CLASSNAME: '考核方案设计说明',
                    INDI_TYPENAME: '',//指标类别名称   例子:目的
                    DESIGN_NOTE: '',
                    SNO: '',
                }
            )
        } else {
            message.error("请输入指标类别")
        }
        this.setState({
            data: data,
        })
        // }

        // }
    }
    // 添加共性考核质量系数
    addData1 = (params) => {
        let { data1 } = this.state
        // if (data1.length === option1.length) {
        //     message.error("已无更多下拉框选项")
        //     return
        // }
        //INDI_TYPE不为空的时候允许添加新的共性考核质量系数行
        if (data1.length === 0 || !(data1[data1.length - 1].INDI_ID === '')) {
            data1.push({
                INDI_CLASS: 2,
                INDI_CLASSNAME: '共性质量考核系数',
                INDI_TYPE: '',//指标类别
                INDI_TYPENAME: '',//指标类别名称
                INDI_ID: '',//指标id
                INDI_NAME: '',//指标名称
                WEIGHT: '',//权重
                ASSESS_PURPOSE: '',//考核目的
                SCORE_CERTERIA: '',//评分标准
                SCORE_PROCEDURE: '',//评分程序
            })
        } else {
            message.error("请选择下拉框")
        }
        this.setState({
            data1: data1,
        })
    }
    // 添加具体考核方案
    addData2 = (params) => {
        let { data2 } = this.state
        // if (data2.length === option2.length) {
        //     message.error("已无更多下拉框选项")
        //     return
        // }
        //INDI_TYPE不为空的时候允许添加新的共性考核质量系数行
        if (data2.length === 0 || !(data2[data2.length - 1].INDI_TYPE === '')) {
            data2.push({
                INDI_CLASS: '3',
                INDI_CLASSNAME: '具体考核方案',
                INDI_TYPE: '', //指标类别
                INDI_TYPENAME: '', //指标类别名称
                INDI_ID: '', //指标id
                INDI_NAME: '', //指标名称
                WEIGHT: '',//权重
                ASSESS_NOTE: '',//考核内容
                SCORE_RULE: '',//评分规则
                DATA_SOURCES: '',//数据来源
                ASSESS_EMP: '',//考核人
                ASSESS_EMPNAME: '',//考核人姓名
                REMARK: ''//备注
            })
        } else {
            message.error("请选择下拉框")
        }
        this.setState({
            data2: data2,
        })

    }


    /**
 * 参数校验
 * @param {number} oprtype 操作类型 ：1 修改 2 归档修改
 * @returns {number} 返回值： 0内容不完整 1 内容完整 2 设计说明指标类别重复
 *          内容完整则返回以下参数
 *          funcDesign, //设计说明
            massCoeff, //共性考核质量系数
            scheme  //具体考核方案
 */
    checkParam(oprtype) {
        const OPR_TYPE_ENTER = 2; //确定提交
        let { data, data1, data2 } = this.state

        let flag = 1 //0 内容不完整 1 内容完整 2 设计说明指标类别重复

        let funcDesign = [] //设计说明
        data.forEach((item, idx) => {
            if (oprtype === OPR_TYPE_ENTER) {
                for (let key in item) {
                    if (item[key] === '') flag = 0
                }
                // if (typeof item.DESIGN_NOTE == 'undefined' || item.DESIGN_NOTE === '') {
                //     flag = 0;
                //     return
                // }
            }

            let param = {
                INDI_CLASS: item.INDI_TYPENAME,//指标类别
                DESIGN_NOTE: item.DESIGN_NOTE,//说明内容
                SNO: ++idx//展示顺序
            }
            funcDesign.push(param)
        })
        let massCoeff = []  //共性考核质量系数
        data1.forEach((item, idx) => {
            let param = {
                // INDI_CLASS: item.INDI_TYPE,//考核维度（即指标列表的INDI_TYPE）
                INDI_ID: item.INDI_ID,//指标ID
                ASSESS_NOTE: item.ASSESS_PURPOSE,//考核目的
                SCORE_CERTERIA: item.SCORE_CERTERIA,//评分标准
                SCORE_PROCEDURE: item.SCORE_PROCEDURE,//评分程序
                WEIGHT: item.WEIGHT,//权重
            }
            if (oprtype === OPR_TYPE_ENTER) {
                for (let prop in param) {
                    if (param[prop] === null || param[prop] === '' || Object.is(param[prop], NaN)) {
                        flag = 0;
                        return
                    }
                }
            }
            massCoeff.push(param)
        })
        let scheme = [] //具体考核方案
        data2.forEach((item, idx) => {

            let param = {
                INDI_CLASS: item.INDI_TYPE,//指标类别（指标列表的INDI_TYPE）
                INDI_ID: item.INDI_ID,//指标ID
                ASSESS_NOTE: item.ASSESS_NOTE,//考核内容
                SCORE_RULE: item.SCORE_RULE,//评分规则
                DATA_SOURCES: item.DATA_SOURCES,//数据来源
                // ASSESS_EMP: item.ASSESS_EMP,//考核人ID
                WEIGHT: item.WEIGHT,//权重
                REMARK: item.REMARK
            }
            if (oprtype === OPR_TYPE_ENTER) {
                for (let prop in param) {
                    if (param[prop] === null || param[prop] === '' || Object.is(param[prop], NaN)) {
                        flag = 0;
                        return
                    }
                }
            }

            scheme.push(param)
        })



        // 检查考核方案重复指标类别
        let indiArr = []
        if (oprtype === OPR_TYPE_ENTER) {
            funcDesign.forEach(item => {
                if (indiArr.indexOf(item.INDI_CLASS) !== -1) {
                    message.error(`考核方案设计说明指标类别名称重复：${item.INDI_CLASS}`)
                    flag = 2
                    return
                } else {
                    indiArr.push(item.INDI_CLASS);
                }
            })
        }


        let result = {
            flag,
            funcDesign, //设计说明
            massCoeff, //共性考核质量系数
            scheme  //具体考核方案
        }

        return result;

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

    /**
     * 506222 修改职能部门考核方案
     * @param {number} oprtype 操作类型 ：1 修改 2 归档修改
     * @returns {string} null
     */
    saveData(oprtype) {

        // 参数校验
        let result = this.checkParam(oprtype)

        if (result.flag === 0) {
            message.error("内容不完整，请检查输入！")
            return
        } else if (result.flag === 2) { // 设计说明类别重复
            return
        }

        let { funcDesign, massCoeff, scheme, legalNote } = result
        funcDesign = this.toStr(funcDesign)
        massCoeff = this.toStr(massCoeff)
        scheme = this.toStr(scheme)
        legalNote = this.toStr(this.state.data3)


        // this.state.secondPageDataSource
        let { orgId, yr, remark } = this.state
        let payload = {
            funcDesign: JSON.stringify(funcDesign), //设计说明
            head: Number(this.props.headId), //负责人
            legalNote: JSON.stringify(legalNote), //考核说明
            massCoeff: JSON.stringify(massCoeff), //共性考核质量系数
            ogrId: Number(orgId), //业务条线组织机构ID
            oprType: oprtype, //操作类型  操作类型  1|修改;2|归档修改
            scheme: JSON.stringify(scheme), //具体考核方案
            yr: Number(yr), //年份
            remark: remark
        }
        // //console.log("506221 新增职能部门考核方案",JSON.stringify(payload));

        //let { data4 } = this.props
        // 506222 修改职能部门考核方案
        FetchUpdateFuncAssessPlan(payload).then(res => {

            const planID = res.note.substring(res.note.indexOf(":") + 1)
            const params = {
                planId: planID || '',
                planType: "3" || '',
            };
            let flag = 0;
            this.state.data3.length > 0 && this.state.data3.forEach((item, index) => {
                // item.planId = planID
                FetchAddAssessPlanLegalNote({
                    "legalNote": item.NOTE,
                    "modularId": Number(item.MODULAR_ID),
                    "modularName": item.MODULAR_NAME,
                    "planId": Number(planID),
                    "sno": Number(item.SNO),
                }).then((ret) => {
                    if (ret.code === 1) {
                        flag += 1
                    }
                    if (flag === this.state.data3.length) {
                        message.success("修改成功！")

                        window.location.href = `/#/esa/planning/accessPlanDetail/${EncryptBase64(JSON.stringify(params))}`
                    }
                })

            })
            if (this.state.data3.length === 0) {
                window.location.href = `/#/esa/planning/accessPlanDetail/${EncryptBase64(JSON.stringify(params))}`
            }

        }).catch(res => {
            if (res.note !== '') {
                message.error(res.note ? res.note : '操作失败')
            }

        })

    }

    deleteData = (data) => {
        //obj是删除掉的行数据  取出放置到下拉框中
        // let option = this.state.option.concat(obj[0].name)
        // for (let i = 0; i < data.length; i++) {
        //     delete data[i].key;
        // }

        this.setState({
            data: data,
        })
    }

    deleteData1 = (data) => {//index是删除的数据的行数
        // let tempSelectedArray = JSON.parse(JSON.stringify(selectedArray1))
        //将删除的数据从已选框中删除
        // tempSelectedArray.splice(index, 1)
        this.setState({
            data1: data,
            // selectedArray1: tempSelectedArray,
        })
    }
    deleteData2 = (data) => {
        this.setState({
            data2: data,
        })
    }
    handleChangeData = (data) => {  //colum: 列字段名 pos :行位置 value:单元格显示数据 type:组件类型

        this.setState({
            data: data
        })
    }
    cmptChange = (data) => {
        this.setState({
            data: data
        })
    }
    cmptChange1 = (data, pos, num = '') => {
        //将data中已选择的指标放入已选指标数组
        let selectedArray1 = []
        if (num === '') {
            data.forEach((item, index) => {
                selectedArray1.push(Number(item.INDI_TYPE))
            })
            this.setState({
                // selectedArray1: selectedArray1,
                data1: data,
            })
        }
        // 新增接口需要 INDI_ID 参数
        let rowData = data[pos]
        this.state.option1.forEach(item => {
            if (item.key == rowData.INDI_TYPE) {
                rowData.INDI_ID = item.idxId
                return
            }
        })
        this.setState({
            data1: data
        })
    }
    cmptChange2 = (data, pos, num = '') => {

        // 新增接口需要 INDI_ID 参数
        let rowData = data[pos]
        this.state.option2.forEach(item => {
            if (item.key == rowData.INDI_TYPE) {
                rowData.INDI_ID = item.idxId
                return
            }
        })
        this.setState({
            data2: data
        })
    }

    handleOptionChange = (value) => {
        let { defaultRow, data } = this.state
        defaultRow.INDI_TYPENAME = value
        defaultRow.SNO = data.length + 1
        this.setState({
            defaultRow: defaultRow,
            inputValue: value
        })
    }
    handleOptionChange2 = (key) => {
        let { defaultRow2, option2 } = this.state
        option2.forEach(item => {
            if (item.key == key) {
                defaultRow2.INDI_TYPE = key
                defaultRow2.INDI_TYPENAME = item.value
                defaultRow2.INDI_ID = item.idxId
            }
        })

    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    //点击确定
    handleOk = () => {

        this.saveData(2)
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

    changeOpen = (order) => {
        const { defaultOpen1, defaultOpen2, defaultOpen3 } = this.state;
        if (order === 1) {
            this.setState({
                defaultOpen1: !defaultOpen1,
            })
        } else if (order === 2) {
            this.setState({
                defaultOpen2: !defaultOpen2,
            })
        } else {
            this.setState({
                defaultOpen3: !defaultOpen3,
            })
        }
    }

    render() {
        const { inputValue,
            column,
            userOption,
            data,
            data2,
            column1,
            data1,
            column2,
            defaultRow1,
            defaultRow2,
            option1,
            option2,
            selectedArray1,
            selectedArray2,//已选中的下拉框
            defaultOpen1,
            defaultOpen2,
            defaultOpen3
        } = this.state;

        if (column1 && column1.length > 0) {
            column1[0].option = option1
        }
        if (column2 && column2.length > 0) {
            column2[0].option = option2
            column2[5].option = userOption
        }


        let { current } = this.state
        // //console.log('data4====',data4);
        //let { data4 } = this.props
        return (


            <React.Fragment>

                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" key='职能部门考核方案' >
                    <Menu.Item key="职能部门考核方案"> 职能部门考核方案</Menu.Item>
                    {this.state.data3.map((item, index) => {
                        return <Menu.Item key={item.MODULAR_ID} > {item.MODULAR_NAME}</Menu.Item>
                    })}
                </Menu>

                {current === '职能部门考核方案' &&
                    <div>
                        <div className='dp-table-box'>
                            {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                                <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                                考核方案设计说明&nbsp;
                                <div onClick={() => { this.changeOpen(1) }}>
                                    {defaultOpen1 === true ?
                                        <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                        <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                    }
                                </div>
                            </div>}
                            {defaultOpen1 === true &&
                                <div className='dp-index-table'>
                                    <BasicIndexTable
                                        data={data}
                                        addText="考核方案设计说明"
                                        deleteData={this.deleteData}
                                        column={this.getColumn(1)}
                                        operation={1} //操作类型 0:查看||1: 修改/新增
                                        sortColumn={1}
                                        bordered={true}
                                        onRef={(ref) => this.child1 = ref}
                                        handleChangeData={this.cmptChange}
                                    />
                                    <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                                        <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={this.addData} >
                                            {'添加设计说明'}
                                        </Button>
                                    </Row>
                                </div>
                            }
                        </div>
                        <div className='dp-table-box'>
                            {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                                <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                                共性考核质量系数&nbsp;
                                <div onClick={() => { this.changeOpen(2) }}>
                                    {defaultOpen2 === true ?
                                        <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                        <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                    }
                                </div>
                            </div>}
                            {defaultOpen2 === true &&
                                <div className='dp-index-table'>
                                    <BasicIndexTable
                                        data={data1}
                                        deleteData={this.deleteData1}
                                        column={this.getColumn(2)}
                                        operation={1} //操作类型 0:查看||1: 修改/新增
                                        sortColumn={0}
                                        bordered={true}
                                        onRef={(ref) => this.child2 = ref}
                                        allOption={option1}
                                        selectedArray={selectedArray1}
                                        handleChangeData={this.cmptChange1}
                                    />
                                    <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                                        <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData1(defaultRow1) }} >
                                            {'添加共性考核质量系数'}
                                        </Button>
                                    </Row>
                                </div>
                            }
                        </div>
                        <div className='dp-table-box'>
                            {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                                <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                                具体考核方案&nbsp;
                                <div onClick={() => { this.changeOpen(3) }}>
                                    {defaultOpen3 === true ?
                                        <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                        <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                    }
                                </div>
                            </div>}
                            {defaultOpen3 === true &&
                                <div className='dp-index-table'>
                                    <BasicIndexTable
                                        data={data2}
                                        deleteData={this.deleteData2}
                                        column={this.getColumn(3)}
                                        operation={1} //操作类型 0:查看||1: 修改/新增
                                        sortColumn={0}
                                        bordered={true}
                                        onRef={(ref) => this.child3 = ref}
                                        handleChangeData={this.cmptChange2}
                                        allOption={option2}
                                        selectedArray={selectedArray2}
                                        option={userOption}
                                    />
                                    <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                                        <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData2(defaultRow2) }} >
                                            {'添加具体考核方案'}
                                        </Button>
                                    </Row>
                                </div>
                            }
                        </div>
                    </div>
                }
                {
                    this.state.data3 && this.state.data3.map(item => {
                        if (current == item.MODULAR_ID) {
                            // return <Table dataSource={dataSource} columns={columns} />;
                            return <div>
                                <Col xs={24} sm={24} lg={24} xl={24}>
                                    <Table
                                        className="esa-evaluate-notice-table"
                                        size="middle"
                                        bordered
                                        columns={this.renderSelfEvaluation(item)}
                                        dataSource={[item]}
                                        pagination={false}
                                    //scroll={{ x: 1500, y: 480 }}
                                    />
                                </Col>

                            </div>
                        }
                    })
                }

                <div className='clearfix' style={{ padding: '1rem' }}>
                    <DepartmentAssessPlanFoot saveData={(oprtype) => this.saveData(oprtype)} saveData2={this.showModal} onCancelOperate={this.props.onCancelOperate} />
                    <BasicModal
                        style={{ top: '10rem' }}
                        width="50rem"
                        title="归档说明"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Form.Item style={{ margin: '1rem', padding: '1rem' }}
                            wrapperCol={{ span: 24 }}>
                            <TextArea rows={4} onChange={e => this.handleInput(e.target.value)} />
                        </Form.Item>
                    </BasicModal>
                </div>

            </React.Fragment>

        );
    }
}
export default PlanDeclare;
