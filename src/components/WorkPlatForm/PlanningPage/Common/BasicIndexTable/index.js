import React from 'react';
import { Table, Input, Popconfirm, InputNumber, Select, Tooltip } from 'antd';

//可输入文本最大数
const maxLength = 1000;
class BasicIndexTable extends React.Component {
    constructor(props) {
        super(props);
        this.spanArr = [];
        this.indexArr = [];
        this.dataResult = [];
        this.state = {
            data: [],
            option: {}
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        const { data = [] } = this.props;
        this.setState({
            data: data
        });
    }

    componentWillReceiveProps(nextProps) {
        const { data = [] } = nextProps;
        this.setState({
            data: data
        });
    }

    mapCont = (arr, name) => {
        let newArr = [];
        arr.forEach((item, i) => {
            let index = -1;
            const isExists = newArr.some((newItem, j) => {
                if (item[name] === newItem.name) {
                    index = j;
                    return true;
                }
            })
            if (!isExists) {
                newArr.push({
                    name: item[name],
                    res: [item]
                });
            } else {
                newArr[index].res.push(item);
            }
        });
        return newArr;
    };

    //数据分类
    dataSort = (data, column, index, times) => {
        if (times > 0) {
            const dataSort = this.mapCont(data, column[index].dataIndex || []);
            dataSort.forEach((item) => {
                item.newres = this.dataSort(item.res, column, index + 1, times - 1);
            })
            return dataSort;
        } else {
            return data;
        }
    };

    //单元格行合并跨度计算
    calculateRowSpan = (data, index) => {
        data.forEach((item) => {
            if (item.res && item.res.length > 1) {
                this.spanArr[index].push(item.res.length);
                this.indexArr[index].push(this.dataResult.length);
                this.calculateRowSpan(item.newres, index + 1);
            } else {
                if (this.spanArr.length > index && item.res) {
                    this.spanArr[index].push(item.res.length);
                    this.indexArr[index].push(this.dataResult.length);
                    this.calculateRowSpan(item.newres, index + 1);
                    // this.dataResult = [...this.dataResult, ...item.res];
                } else {
                    this.dataResult = [...this.dataResult, item];
                }
            }
        })
    };

    cmptChange = (column, pos, value, type) => {  //colum: 列字段名 pos :行位置 value:单元格显示数据 type:组件类型
        const { data = [] } = this.state;
        const { handleChangeData } = this.props
        data[pos][column] = value;
        if (type) { handleChangeData && handleChangeData(data, pos, type) } else { handleChangeData && handleChangeData(data, pos, "") }
    }

    getLabel = (str, label) => {
        ////console.log("------------str---------",str)
        let html = '';
        if (label === '1') {
            html = <label title={str}>{this.renderText(Number(str).toFixed(2))}</label>;
        } else if (label === '2') {
          if(str){
            html = <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: str.replace(/\n/g, '<br/>') || '' }}></div>;
          }
        } else {
            html = <label title={str}>{str || '--'}</label>;
        }
        return html;
    }

    renderText = (value, suffix = '%') => {
        if (value !== 'NaN') {
            return `${value}${suffix}`;
        }
        return '--';
    }

    //选择组件
    chooseComponent = (option, column, value, type, pos, data, label, edit, selectedWidth) => {
        // colum:列字段名；value:单元格数据 type: 组件类型 pos: 行位置 isEdit:是否可编辑
        const { selectedArray = [] } = this.props
        let cpt = "";
        switch (type) {
            case '1':     // 文本
                //<div dangerouslySetInnerHTML={{__html: '<p>123</p>'}} />

                cpt = this.getLabel(value, label);
                break;
            case '2':   // 数字框
                let formatter = {};
                if (label === '1') {
                    formatter = {
                        formatter: value => `${value}%`,
                        parser: value => value.replace('%', ''),
                        precision: 2,
                        min: 0,
                        max: 100
                    }
                }
                cpt = <InputNumber
                    {...formatter}
                    value={value}
                    className='ap-cell-input'
                    onChange={data => this.cmptChange(column, pos, data)}
                    maxLength={maxLength}
                    style={{ width: '90%' }}
                />
                break;
            case '3':   // 文本框
                cpt = <Input
                    value={value}
                    className='ap-cell-input'
                    onChange={e => this.cmptChange(column, pos, e.target.value)}
                    maxLength={maxLength}
                    style={{ width: '90%' }}
                />
                break;
            case '4':   // 文本域
                cpt = <Input.TextArea
                    value={value}
                    className='ap-cell-textarea'
                    onChange={e => this.cmptChange(column, pos, e.target.value)}
                    maxLength={maxLength}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ width: '90%' }}
                    disabled={edit}
                />
                break;
            case '5':    // 普通下拉框
                cpt = <Select className='ap-cell-select' onChange={value => this.cmptChange(column, pos, value, 2)}
                    showSearch
                    allowClear={true}
                    optionFilterProp="children"
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                    option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={value}
                    style={{ width: selectedWidth === 0 ? '90%' : 0.9 * selectedWidth }}
                >

                    {option.map((item, current) => {
                        if (item.orgId) {
                            return <Select.Option key={item.key} value={item.key}>
                                <Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>
                                    {item.value}</Tooltip>
                            </Select.Option>
                        } else {
                            return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        }
                    })}
                </Select>;
                break;
            case '6':    // 特殊互斥双下拉框 通用的话需要修改属性
                cpt = <Select className='ap-cell-select' onChange={value => this.cmptChange(column, pos, value)}
                    showSearch
                    optionFilterProp="children"
                    onSearch={this.onSearch}
                    value={value}
                    style={{ width: selectedWidth === 0 ? '90%' : 0.9 * selectedWidth }}
                >
                    {option.length > 0 ? option.map((item, current) => {
                        if (item.idxType === data[pos].INDI_TYPE) {
                            ////console.log((JSON.parse(JSON.stringify(selectedArray)).slice(0, selectedArray.length - 1)), item)
                            const tempSelected = JSON.parse(JSON.stringify(selectedArray))
                            tempSelected.splice(pos, 1)
                            if (!(tempSelected.includes(Number(item.idxId)))) {
                                return <Select.Option key={item.idxId} value={item.idxId}>{item.idxName}</Select.Option>
                            }
                        }
                    }) : option.map((item, current) => {
                        return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                    })}
                </Select>;
                break;
            case '7':    // 互斥单下拉框
                cpt = <Select className='ap-cell-select' onChange={value => this.cmptChange(column, pos, value)}
                    showSearch
                    optionFilterProp="children"
                    onSearch={this.onSearch}
                    value={value}
                    style={{ width: selectedWidth === 0 ? '90%' : 0.9 * selectedWidth }}
                >
                    {option.map((item, current) => {
                        const tempSelected = JSON.parse(JSON.stringify(selectedArray))
                        tempSelected.splice(pos, 1)
                        if (!(tempSelected.includes(Number(item.key)))) {
                            // //console.log("我看一下这个value ", value, item.key, value === item.key)
                            return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        }
                    })}
                </Select>;
                break;
            default:
                break;
        }
        return cpt;
    }


    handleDelete = (row, index) => {
        const data = [...this.state.data];
        this.setState({
            data: data.filter(item =>
                JSON.stringify(item) !== JSON.stringify(row)
            )
        });
        this.props.deleteData(data.filter(item => JSON.stringify(item) !== JSON.stringify(row)), data.filter(item => JSON.stringify(item) === JSON.stringify(row)), index)//删除之后 将data返回父组件
    };

    update = (row) => {
        if (this.props.editIndex) {
            this.props.editIndex(row);
        }
    }

    dealColumn = () => {

        const { column = [], sortColumn = 0, operation = 0, data } = this.props;
        let columnResult = column.map((item, current) => {
            const {
                type = '1',
                columnName = '',
                dataIndex = '',
                colSpan = 1,
                width = '',
                option = [],
                align = '',
                columnAlign = 'center',
                label = '',
                edit = false,
                selectedWidth = 0,
            } = item;
            return {
                title: columnName,
                colSpan: colSpan,
                dataIndex: dataIndex,
                align: align,
                render: (value, row, index) => {
                    const obj = {

                        children: <div>{this.chooseComponent(option, dataIndex, value, type, index, data, label, edit, selectedWidth)}</div>,
                        props: {
                            rowSpan: 0,
                            colSpan: 1,
                            align: columnAlign
                        },
                    };
                    if (current < sortColumn && this.indexArr[current] && this.spanArr[current]) {
                        this.indexArr[current].forEach((item, i) => {
                            if (index === item) {
                                obj.props.rowSpan = this.spanArr[current][i] || 0;
                            }
                        })
                    } else {
                        obj.props.rowSpan = 1;
                    }
                    // if (current + colSpan <= column.length && colSpan > 1) {
                    //     let thisColSpan = 1;
                    //     for (let i = 1; i < colSpan; i++) {
                    //         const name = column[current + i].dataIndex;
                    //         if (row[name]) {
                    //             break;
                    //         } else {
                    //             thisColSpan++;
                    //         }
                    //     }
                    //     obj.props.colSpan = thisColSpan;
                    // } else if (colSpan === 0) {
                    // const name = dataIndex;
                    // if (row[name]) {
                    //     obj.props.colSpan = 1;
                    // } else {
                    //     obj.props.colSpan = 0;
                    // }
                    // }
                    if (width) {
                        obj.props.width = width;
                    }
                    return obj;
                },
            }
        })
        if (operation) {
            columnResult.push({
                title: '',
                width: '5%',
                dataIndex: 'operation',
                render: (value, row, index) => {
                    return this.state.data.length >= 1 ?
                        <React.Fragment>
                            {operation === 1 &&
                                <Popconfirm title={`确定删除当前指标吗?`} onConfirm={() => this.handleDelete(row, index)}>
                                    <a><i className='iconfont icon-shanchu' style={{ fontSize: '1.333rem' }} /></a>
                                </Popconfirm>
                            }
                            {operation === 2 &&
                                <a><i className='iconfont icon-spdp' title='分解' style={{ fontSize: '1.333rem' }} onClick={() => this.update(row)} /></a>}
                        </React.Fragment>
                        : null
                }
            })
        }
        return columnResult;
    }

    render() {
        const { column = [], sortColumn = 0, bordered = false, showHeader = true } = this.props;
        // const { dataIndex = '' } = column[0];
        const { data = [] } = this.state;
        if (sortColumn > 0) {
            this.spanArr = [];
            this.indexArr = [];
            for (let i = 0; i < sortColumn; i++) {
                this.spanArr.push([]);
                this.indexArr.push([]);
            }
            this.dataResult = [];
            const dataSort = this.dataSort(data, column, 0, sortColumn);
            this.calculateRowSpan(dataSort, 0);
        } else {
            this.dataResult = data;
        }
        const columnResult = this.dealColumn();

        return (
            <div className='basic-index-table'>
                <Table
                    showHeader={showHeader}
                    columns={columnResult}
                    dataSource={this.dataResult}
                    bordered={bordered === true ? true : false}
                    pagination={false}
                    className="m-table-common m-table-common-bortop"
                    // rowKey={(record) => {
                    //     //console.log("看一下这个key", record, record[dataIndex] + Date.now())
                    //     return (dataIndex ? record[dataIndex] + Date.now() : '' + Date.now()) //在这里加上一个时间戳就可
                    // }}
                    locale={
                        { emptyText: '暂无数据' }
                    }
                    rowClassName={record => (record.keyWork ? 'bc-grey' : 'bc-white')} />
            </div>
        );
    }
}
export default BasicIndexTable;
