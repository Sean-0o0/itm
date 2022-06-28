import React from 'react';
import { Button, Row, message } from 'antd'
import BasicIndexTable from '../../../../Common/BasicIndexTable'
import { FetchQueryIndiList } from '../../../../../../../services/planning/planning'
class QualityIndexTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            column: [],
            option: [],             //二级指标下拉选项

            managementOption1: [],      //经营指标三级下拉框
            selectedArray: []
        }
    }
    componentDidMount() {
        const { managementOption1, } = this.state;
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
                const param = {
                    //'idxClass': item.idxClass,
                    'key': item.idxId,
                    'value': item.idxName,
                }
                if (JSON.stringify(managementOption1).indexOf(JSON.stringify(param)) === -1) {
                    managementOption1.push(param)
                }
            })
            this.setState(
                {
                    managementOption1: managementOption1,
                    option: ret.records,
                }
            )
        })

    }
    addData = (params) => {
        let { data, changeData } = this.props
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
        changeData(2, data)

    }
    deleteData = (data, obj, index) => {
        const { changeData } = this.props
        const { selectedArray } = this.state
        let tempSelectedArray = JSON.parse(JSON.stringify(selectedArray))
        //将删除的数据从已选框中删除
        tempSelectedArray.splice(index, 1)

        this.setState({
            selectedArray: tempSelectedArray,
        }, () => {
            changeData(2, data)

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
        this.props.changeData(2, data)
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

    render() {
        const { managementOption1 = [], selectedArray } = this.state
        const { column = [], data = [], title, idxClass, defaultOpen = false } = this.props
        const dataSource = this.numberToString(data)

        let columns = JSON.parse(JSON.stringify(column))
        if (columns && columns.length > 0) {
            columns[1].option = managementOption1
        }
        const defaultRow = {
            INDI_CLASSNAME:'管理指标',
            INDI_ID: '',
            INDI_CLASS: idxClass,
            ASSESS_NOTE: '',
            SCORE_RULE: '',
            WEIGHT: '',
        };
        return (
            <div>
                {title && <div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingRight: '1rem' }}>
                    <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                        效率指标</div>}
                {column.length > 0 && defaultOpen===true && 
                    < BasicIndexTable
                        // title={'效率指标'}
                        key={2}
                        handleChangeData={this.handleChangeData}
                        deleteData={this.deleteData}
                        data={dataSource}
                        column={columns}
                        operation={1} //操作类型 0：查看||1: 修改/新增

                        bordered={true}
                        onRef={(ref) => this.child1 = ref}
                        selectedArray={selectedArray}
                    />}
                {defaultOpen===true && 
                <Row style={{ border: '1px solid #E8E8E8', borderTop: 'none', height: '4rem', textAlign: 'center', lineHeight: '4rem' }}>
                    <Button style={{ marginTop: '7px' }} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor " onClick={() => { this.addData(defaultRow) }} >
                        添加管理指标
                    </Button>
                    {/* <AddNewRow ButtonName="添加经营指标" flag={2}  rowParam={rowParam} handleOptionChange={this.handleOptionChange}  addData={this.addData} text={text} /> */}
                </Row>}
            </div>

        );
    }
}
export default QualityIndexTable;
