import React from 'react';
import { Button, Row, message } from 'antd'
import BasicIndexTable from '../../../../Common/BasicIndexTable'
import { FetchQueryIndiList } from '../../../../../../../services/planning/planning'
class BussinessAssessmentTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managementOption: [],   //经营指标二级下拉框 
            option: [],             //所有下拉框选项

            selectedArray: []        //已选中下拉框ID
        }
    }

    componentDidMount() {
        const { managementOption, } = this.state;
        const { idxClass } = this.props
        //获取下拉框内容
        FetchQueryIndiList(
            {
                "current": 1,
                "idxClass": idxClass,  //1表示经营指标表格
                "pageSize": 999,
                "paging": 1,
                "planType": 2,//业务条线页面固定为2
                //"sort": "", //排序字段 暂时不使用
                "total": -1
            }
        ).then((ret) => {
            ret.records.forEach((item, index) => {
                //创建两个数组 分开装下拉框的内容
                const param = {
                    //'idxClass': item.idxClass,
                    'key': item.idxType,
                    'value': item.idxTypeName,
                }
                if (JSON.stringify(managementOption).indexOf(JSON.stringify(param)) === -1) {
                    managementOption.push(param)
                }
            })
            this.setState(
                {
                    managementOption: managementOption,
                    option: ret.records,
                }
            )
        })

    }
    addData = (params) => {
        let { data, changeData } = this.props
        //将添加的数据推入data中
        let flag = true
        if (data.length === 0) {
            data.push(params)
            flag = false
        }
        if (flag && data.length > 0 && !(data[data.length - 1].INDI_ID === '')) {
            data.push(params)
        } else if (flag) {
            message.error("请选择下拉框")
        }
        changeData(1, data)

    }
    deleteData = (data, obj, index) => {
        //obj是删除掉的行数据  取出放置到下拉框中
        const { changeData } = this.props
        const { selectedArray } = this.state
        let tempSelectedArray = JSON.parse(JSON.stringify(selectedArray))
        //将删除的数据从已选框中删除
        tempSelectedArray.splice(index, 1)

        this.setState({
            selectedArray: tempSelectedArray,
        }, () => {
            changeData(1, data)

        })
    }

    handleChangeData = (data, pos, num = '') => {
        //将data中已选择的三级指标放到数组中
        //const { changeData } = this.props
        let selectedArray = []
        if (num === '') {
            data.forEach((item, index) => {
                selectedArray.push(Number(item.INDI_ID))
            })
            this.setState({
                selectedArray: selectedArray,
            },
                // ()=>{
                //     changeData(1, data)
                // }
            )
        }

        this.props.changeData(1, data)
    }

    numberToString = (array) => {
        let tempArray = JSON.parse(JSON.stringify(array))
        tempArray.forEach((item, index) => {
            for (let obj in item) {
                if (obj === 'INDI_ID' || obj === 'INDI_TYPE') {
                    item[obj] = '' + item[obj]
                }
            }
        })
        return tempArray
    }

    changeOpen = () => {
        const { defaultOpen = false } = this.props;
        this.props.changeOpen && this.props.changeOpen(!defaultOpen, 1)
    }

    render() {
        const { managementOption = [], selectedArray, option, } = this.state
        const { column = [], data = [], title, idxClass, defaultOpen = false } = this.props
        //{"INDI_CLASS":1,"INDI_ID":1,"BASE_GOAL":80,"BREAK_GOAL":100,"CHALLENGE_GOAL":120,"WEIGHT":0.1}
        //[{"INDI_CLASS":1,"INDI_ID":1,"BASE_GOAL":80,"BREAK_GOAL":100,"CHALLENGE_GOAL":120,"WEIGHT":0.1}
        const dataSource = this.numberToString(data)
        let columns = JSON.parse(JSON.stringify(column))
        if (columns && columns.length > 0) {
            columns[1].option = managementOption
            columns[2].option = option
        }
        const defaultRow = {
            INDI_CLASSNAME: '经营指标',
            //INDI_TYPENAME: '',
            INDI_CLASS: idxClass,
            INDI_TYPE: '',
            INDI_ID: '',
            BASE_GOAL: '', BREAK_GOAL: '', CHALLENGE_GOAL: '', WEIGHT: ''
        };
        return (
            <div style={{ marginTop: '1rem' }}>
                {title && <div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                    <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                        效率指标&nbsp;
                        <div onClick={this.changeOpen}>
                        {defaultOpen === true ?
                            <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                            <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                        }
                    </div>
                </div>}
                {column.length > 0 && defaultOpen === true &&

                    < BasicIndexTable
                        // title={'效率指标'}
                        key={1}
                        handleChangeData={this.handleChangeData}
                        deleteData={this.deleteData}
                        data={dataSource}
                        addText="效率指标"
                        column={columns}
                        operation={1} //操作类型 0：查看||1: 修改/新增
                        bordered={true}
                        onRef={(ref) => this.child1 = ref}
                        selectedArray={selectedArray}
                    />

                }
                {defaultOpen === true &&
                    <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                        <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData(defaultRow) }} >
                            {'添加经营指标'}
                        </Button>
                        {/* <AddNewRow ButtonName="添加经营指标" flag={2}  rowParam={rowParam} handleOptionChange={this.handleOptionChange}  addData={this.addData} text={text} /> */}
                    </Row>

                }
            </div>

        );
    }
}
export default BussinessAssessmentTable;
