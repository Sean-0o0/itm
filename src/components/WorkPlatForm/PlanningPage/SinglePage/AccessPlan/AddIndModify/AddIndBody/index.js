import React from 'react';
import { Row, message, Button } from 'antd'
import BasicIndexTable from '../../../../Common/BasicIndexTable';
import AddIndFoot from '../AddIndFoot'
import { FetchQueryIndiList, FetchQueryUserList, FetchUpdateAssessTrackPlan } from '../../../../../../../services/planning/planning';
class AddIndHeader extends React.Component {

    state = {
        option: [],
        soureceOption: [],
        secondOption: [],
        data: [
            {
                INDI_ClASS_NAME: '经营指标',
                INDI_TYPE: '',
                INDI_ID: '',//指标ID
                BASE_GOAL: '',//基础目标
                BREAK_GOAL: '',//分解目标
                CHALLENGE_GOAL: '',//挑战目标
                WEIGHT: '',//权重
                REMARK: '',//备注说明
                OPR_EMP: '',//录入人

            }],
        keyword: [
            {
                INDI_ID: '',
                KEYWORK: '',
                WEIGHT: '',
                REMARK: '',
                OPR_EMP: ''
            }],
        keyworkColumns: [],
        columns: [],
        userOption: [],
        selectedArray: [],
        selectedKeywork: [],
        managementOption: [],
        indexOpen: true,
        keyworkOpen: false,
    };

    componentWillMount() {
        const { orgId = ''} = this.props;
        // 506239 人员列表
        FetchQueryUserList({
            "orgId": orgId,
            "type": 3
        }).then(res => {
            const { code = 0, records = [] } = res;
            if (code > 0) {
                let userOption = []
                records.forEach(item => {
                    let param = {
                        'key': item.userId,
                        'value': item.userName,
                        'orgId': item.orgId,
                        'orgName': item.orgName,
                    }
                    userOption.push(param)
                })

                this.setState({
                    userOption: userOption
                })
            }
        })

        //获取下拉框内容
        FetchQueryIndiList(
            {
                "idxClass": 1,  //1表示经营指标表格
                "planType": 2,//业务条线页面固定为2
            }
        ).then((res) => {
            const { code = 0, records = [] } = res;
            if (code > 0) {
                let option = []
                records.forEach((item, index) => {
                    //创建两个数组 分开装下拉框的内容
                    const param = {
                        //'idxClass': item.idxClass,
                        'key': item.idxType,
                        'value': item.idxTypeName,
                    }
                    if (JSON.stringify(option).indexOf(JSON.stringify(param)) === -1) {
                        option.push(param)
                    }
                })
                this.setState({
                    option: option,            //第一级下拉框部分选项
                    soureceOption: res.records //全部选项
                })
            }
        })

        //获取重点工作下拉框内容
        FetchQueryIndiList(
            {
                "idxClass": 2,  //1表示经营指标表格
                "planType": 2,//业务条线页面固定为2
            }
        ).then((res) => {
            const { code = 0, records = [] } = res;
            if (code > 0) {
                let managementOption = []
                records.forEach((item, index) => {
                    //创建两个数组 分开装下拉框的内容
                    const param = {
                        'key': item.idxId,
                        'value': item.idxName,
                    }
                    if (JSON.stringify(managementOption).indexOf(JSON.stringify(param)) === -1) {
                        managementOption.push(param)
                    }
                })
                this.setState({
                    managementOption: managementOption,
                })
            }
        })

        const column = this.getColumn(1);
        const keyworkColumns = this.getColumn(2);
        this.setState({
            columns: column,
            keyworkColumns: keyworkColumns
        })

    }

    addData = (params, order) => {
        if (order === 1) {
            const { data } = this.props
            if (data.length === 0 || !(data[data.length - 1].INDI_ID === '')) {
                data.push(params)
            } else {
                message.error("请选择下拉框")
            }
            this.setState({
                data: data
            })
            this.props.changeData(data, order)
        } else {
            const { keyword } = this.props
            if (keyword.length === 0 || !(keyword[keyword.length - 1].INDI_ID === '')) {
                keyword.push(params)
            } else {
                message.error("请选择下拉框")
            }
            this.setState({
                keyword: keyword
            })
            this.props.changeData(keyword, order)
        }
    }

    saveData = (opr) => {
        let { onSubmitOperate } = this.props
        let busindi = []
        let keywork = []
        let flag = 0
        const { data = [], keyword = [] } = this.props

        data.forEach(item => {
            let param = {
                INDI_ID: Number(item.INDI_ID),//指标ID
                BASE_GOAL: Number(item.BASE_GOAL),//基础目标
                BREAK_GOAL: Number(item.BREAK_GOAL),//分解目标
                CHALLENGE_GOAL: Number(item.CHALLENGE_GOAL),//挑战目标
                WEIGHT: Number(item.WEIGHT),//权重
                REMARK: item.REMARK,//备注说明
                OPR_EMP: parseInt(item.OPR_EMP)//录入人
            }
            if (opr === 1) {
                for (let prop in param) {
                    // //console.log('prop=',prop,'param[prop]=',param[prop]);
                    if (prop === 'REMARK') {
                        ////console.log("跳过备注判断")
                        continue
                    }
                    if (param[prop] === null || param[prop] === '' || Object.is(param[prop], NaN)) {
                        flag = 1;
                        // //console.log('prop=',prop);
                        return
                    }
                }
            }
            busindi.push(param)
        })

        keyword.forEach(item => {
            let param = {
                INDI_ID: Number(item.INDI_ID),//指标ID
                KEYWORK: item.KEYWORK,//基础目标
                WEIGHT: Number(item.WEIGHT),
                REMARK: item.REMARK,
                OPR_EMP: parseInt(item.OPR_EMP)
            }
            if (opr === 1) {
                for (let prop in param) {
                    // //console.log('prop=',prop,'param[prop]=',param[prop]);
                    if (prop === 'REMARK') {
                        ////console.log("跳过备注判断")
                        continue
                    }
                    if (param[prop] === null || param[prop] === '' || Object.is(param[prop], NaN)) {
                        flag = 1;
                        // //console.log('prop=',prop);
                        return
                    }
                }
            }
            keywork.push(param)
        })

        if (flag === 1 && opr === 1) {
            message.error("内容不完整，请检查输入！")
            return
        }
        //考核跟踪方案修改
        FetchUpdateAssessTrackPlan({
            busindi: JSON.stringify(busindi),  //经营指标
            keywork: JSON.stringify(keywork),
            mon: Number(this.props.mon),
            oprType: opr,
            planId: Number(this.props.planId)  //考核方案ID
        }).then(res => {
            const { code = 0 } = res;
            if (code > 0) {
                message.success("操作成功！")
                onSubmitOperate()
            }
        }).catch(res => {
            message.error(res.note ? res.note : '操作失败')
        })

    }

    deleteData = (data, obj, index) => {
        //obj是删除掉的行数据  取出放置到下拉框中
        const { selectedArray } = this.state
        let tempSelectedArray = JSON.parse(JSON.stringify(selectedArray))
        //将删除的数据从已选框中删除
        tempSelectedArray.splice(index, 1)

        this.setState({
            selectedArray: tempSelectedArray,
            data: data,
        }, () => {
            this.props.changeData(data, 1)
        })
    }

    deleteKeywork = (data, obj, index) => {
        //obj是删除掉的行数据  取出放置到下拉框中
        const { selectedKeywork } = this.state
        let tempSelectedKeywork = JSON.parse(JSON.stringify(selectedKeywork))
        //将删除的数据从已选框中删除
        tempSelectedKeywork.splice(index, 1)
        this.setState({
            selectedKeywork: tempSelectedKeywork,
            keyword: data,
        }, () => {
            this.props.changeData(data, 2)
        })
    }

    handleChangeData = (data, pos, num = '') => {
        //将data中已选择的三级指标放到数组中
        let selectedArray = []
        if (num === '') {
            data.forEach((item, index) => {
                selectedArray.push(Number(item.INDI_ID))
            })
            this.setState({
                selectedArray: selectedArray,
            })
        }
        this.setState({
            data: data
        }, () => {
            this.props.changeData(data, 1)
        })
    }

    handleChangeKeyWord = (data, pos, num = '') => {
        //将data中已选择的三级指标放到数组中
        let selectedArray = []
        if (num === '') {
            data.forEach((item, index) => {
                selectedArray.push(Number(item.INDI_ID))
            })
            this.setState({
                selectedKeywork: selectedArray,
            })
        }
        this.setState({
            keyword: data
        }, () => {
            this.props.changeData(data, 2)
        })
    }

    changeOpen = (order) => {
        const { indexOpen, keyworkOpen } = this.state;
        if (order === 1) {
            this.setState({
                indexOpen: !indexOpen,
            })
        } else if (order === 2) {
            this.setState({
                keyworkOpen: !keyworkOpen,
            })
        }
    }

    getColumn = (order) => {
        let column = [];
        if (order === 1) {
            column = [
                {
                    columnName: '指标',
                    colSpan: 2,
                    width: '12%',
                    dataIndex: 'INDI_TYPE',
                    type: '5',
                    align: 'center',

                },
                {
                    columnName: '指标2',
                    colSpan: 0,
                    width: '18%',
                    dataIndex: 'INDI_ID',
                    type: '6',
                    align: 'center'
                },
                {
                    columnName: '基础目标',
                    colSpan: 1,
                    dataIndex: 'BASE_GOAL',
                    type: '2',
                    align: 'center'
                },
                {
                    columnName: '分解目标',
                    colSpan: 1,
                    dataIndex: 'BREAK_GOAL',
                    type: '2',
                    align: 'center'
                },
                {
                    columnName: '挑战目标',
                    colSpan: 1,
                    dataIndex: 'CHALLENGE_GOAL',
                    type: '2',
                    align: 'center'
                },
                {
                    columnName: '权重',
                    colSpan: 1,
                    dataIndex: 'WEIGHT',
                    type: '2',
                    width: '11%',
                    align: 'center',
                    label: '1'
                },
                {
                    columnName: '备注',
                    colSpan: 1,
                    dataIndex: 'REMARK',
                    type: '3',
                    width: '10%',
                    align: 'center'
                },
                {
                    columnName: '录入人',
                    colSpan: 1,
                    dataIndex: 'OPR_EMP',
                    type: '5',
                    width: '10%',
                    align: 'center'
                }]
        } else if (order === 2) {
            column = [
                {
                    columnName: '指标名称',
                    colSpan: 1,
                    width: '30%',
                    dataIndex: 'INDI_ID',
                    type: '7',
                    align: 'center',

                },
                {
                    columnName: '工作内容',
                    colSpan: 1,
                    dataIndex: 'KEYWORK',
                    type: '4',
                    align: 'center'
                },
                {
                    columnName: '权重',
                    colSpan: 1,
                    dataIndex: 'WEIGHT',
                    type: '2',
                    width: '11%',
                    align: 'center',
                    label: '1'
                },
                {
                    columnName: '备注',
                    colSpan: 1,
                    dataIndex: 'REMARK',
                    type: '3',
                    width: '10%',
                    align: 'center'
                },
                {
                    columnName: '录入人',
                    colSpan: 1,
                    dataIndex: 'OPR_EMP',
                    type: '5',
                    width: '10%',
                    align: 'center',
                    label: '1'
                }]
        }
        return column;
    }

    render() {
        const { keyworkColumns,
            columns,
            soureceOption,
            userOption,
            option,
            managementOption,
            selectedArray,
            indexOpen,
            keyworkOpen,
            selectedKeywork } = this.state;
        let { data = [], keyword = [] } = this.props
        // //console.log('data=',data);
        //将下拉框数据填充到列属性中
        if (columns && columns.length > 7) {
            columns[0].option = option
            columns[1].option = soureceOption
            columns[7].option = userOption
        }
        if (keyworkColumns && keyworkColumns.length > 4) {
            keyworkColumns[0].option = managementOption
            keyworkColumns[4].option = userOption
        }
        const defaultRow = {
            INDI_ClASS_NAME: '经营指标',
            INDI_TYPE: '',//类型ID 虽然提交的时候不需要 但是现在需要用来做二级下拉框的筛选
            INDI_ID: '',//指标ID
            BASE_GOAL: '',//基础目标
            BREAK_GOAL: '',//分解目标
            CHALLENGE_GOAL: '',//挑战目标
            WEIGHT: '',//权重
            REMARK: '',//备注说明
            OPR_EMP: '',//录入人

        }
        const keyworkRow = {
            INDI_ID: '',
            KEYWORK: '',
            WEIGHT: '',
            REMARK: '',
            OPR_EMP: ''
        }

        return (
            <React.Fragment>
                <div className='dp-table-box'>
                    {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                        <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                        经营指标&nbsp;
                        <div onClick={() => { this.changeOpen(1) }}>
                            {indexOpen === true ?
                                <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                            }
                        </div>
                    </div>}
                    {indexOpen === true &&
                        <div className='dp-index-table'>
                            <BasicIndexTable
                                data={data}
                                column={columns}
                                operation={1} //操作类型 0：查看||1: 修改/新增
                                bordered={true}
                                deleteData={this.deleteData}
                                option={userOption}
                                onRef={(ref) => this.child1 = ref}
                                handleChangeData={this.handleChangeData}
                                allOption={soureceOption}
                                selectedArray={selectedArray}
                            />
                            <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                                <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData(defaultRow, 1) }} >
                                    {'添加经营指标'}
                                </Button>
                            </Row>

                        </div>
                    }
                    <div className='dp-table-box' >
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                            <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                            重点工作&nbsp;
                            <div onClick={() => { this.changeOpen(2) }}>
                                {keyworkOpen === true ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                }
                            </div>
                        </div>}
                        {keyworkOpen === true &&
                            <div className='dp-index-table'>
                                <BasicIndexTable
                                    data={keyword}
                                    column={keyworkColumns}
                                    operation={1} //操作类型 0：查看||1: 修改/新增
                                    bordered={true}
                                    deleteData={this.deleteKeywork}
                                    onRef={(ref) => this.child2 = ref}
                                    handleChangeData={this.handleChangeKeyWord}
                                    selectedArray={selectedKeywork}
                                />
                                <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                                    <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData(keyworkRow, 2) }} >
                                        {'添加重点工作'}
                                    </Button>
                                </Row>
                            </div>
                        }
                    </div>
                    <AddIndFoot saveData={this.saveData} onCancelOperate={this.props.onCancelOperate} />
                </div>
            </React.Fragment>
        );
    }
}
export default AddIndHeader;
