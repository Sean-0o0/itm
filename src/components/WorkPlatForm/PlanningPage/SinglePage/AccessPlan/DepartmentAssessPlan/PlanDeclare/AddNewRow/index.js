import React from 'react';
import { message, Input, Select, Icon } from 'antd';

class AddNewRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRow: {},
            inputValue:''
        }
    }

    componentWillMount() {
        const { defaultRow } = this.props;

        this.setState({ currentRow: defaultRow });
    }

    addData = (type) => {
        const { currentRow } = this.state;
        const { addData, rowParam } = this.props;
        const result = { ...currentRow };
        addData(result);
        // rowParam.forEach(
        //     (element, index) => {
        //         if ((Object.keys(element)).length > 1) {
        //             const { dataIndex } = element;
        //             if (typeof currentRow['DESIGN_NOTE'] !='undefined' && currentRow[dataIndex].length == 0) {
        //                 // flag = true;
        //                 message.error("请输入指标类别")
        //                 return;
        //             } else if (currentRow[dataIndex].length == 0) {
        //                 //console.log('currentRow===',currentRow);
        //                 message.error("请选择下拉框选项")
        //                 return
        //             } else if (currentRow[dataIndex].length > 0 && index == (rowParam.length - 1)) {
        //                 const result = { ...currentRow };
        //                 addData(result);
        //                 return
        //             }
        //         }
        //     });


    }


    handleOptionChange = (value, dataIndex, type) => {

        let { currentRow } = this.state;


        currentRow[dataIndex] = value;

        this.props.handleOptionChange(value, dataIndex)
        this.setState({
            currentRow: currentRow,
        })



    }


    render() {
        const { rowParam, text } = this.props;

        return (
            <div className='flex-r' style={{ width: '100%' }}>
                {/* {rowParam.map((item, index) => {
                    const { type, defaultValue, option, width, align, dataIndex,title="" } = item;
                    let node = '';
                    if (type === 1) {
                        node = defaultValue;
                    } else if (type === 2) {
                        node = <div > <b>{title}</b>
                        <Select style={{ width: '50%' }}  defaultValue={rowParam[0].defaultValue}

                            disabled={option.length === 0 ? true : false} onChange={(value) => { this.handleOptionChange(value, dataIndex, index) }}>
                            {option.map((item, current) => {

                                return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                            })}
                        </Select></div>;

                    } else if (type === 3) {
                        node = <div > <b>{title}</b><Input
                            className='ap-cell-input'
                            value={this.props.inputValue}
                            onChange={(e) => this.handleOptionChange(e.target.value, dataIndex)}
                            style={{ width: '50%' }}
                        /></div>;
                    }
                    return <div key={index} style={{ padding: '0 16px', fontSize: '1.25rem', width: width ? width : '10%', textAlign: align, display: 'table-cell' }}>{node}</div>
                })
                } */}
                <a className='flex1' style={{ textAlign: 'center' }} onClick={this.addData}> <Icon type="plus-circle" theme="filled" /> {text}</a>
            </div>
        );
    }
}
export default AddNewRow;
