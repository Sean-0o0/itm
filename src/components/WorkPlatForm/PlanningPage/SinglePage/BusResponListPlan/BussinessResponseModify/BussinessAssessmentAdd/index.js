import React from 'react';
import { message, Button, Select, Icon } from 'antd';

class BussinessAssessmentAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seMenu: [],//二级指标下拉框
            threeMenu: [],//三级指标下拉框

            curOneMenu: '',//将要添加的一级指标的数值,由父类传递过来的
            curSeMenu: '',//将要添加的二级指标数值
            curThreeMenu: '',//将要添加的三级指标数值
            //defaultValue: '',//下拉框的默认值
        }
    }

    componentWillMount() {
        //为 二三级菜单下拉框注值
        this.setState({
            curOneMenu: this.props.curOneMenu,
            //defaultValue: this.props.threeMenu[0]
        })
        this.handleSeMenuChange(this.props.seMenu[0])
        this.handleThreeMenuChange(this.props.threeMenu[0])
    }

    addData = (value) => {
        let { curOneMenu, curSeMenu, curThreeMenu } = this.state
        const { addData } = this.props
        if (curThreeMenu == 'undefined') {
            message.error("请选择下拉框选项")
        } else {
            const params = {
                name: curOneMenu,
                age: curSeMenu,
                tel: curThreeMenu,
                phone: '',
                address: '',
            }
            // const defaultValue = ''
            // this.setState({
            //     defaultValue:defaultValue
            // })
            addData(params)
        }
    }

    handleSeMenuChange = (value) => {
        this.setState({
            curSeMenu: value,
        })
    }

    handleThreeMenuChange = (value) => {
        this.setState({
            curThreeMenu: value,
        })
    }


    render() {
        const { seMenu = [], threeMenu = [] } = this.props;
        return (
            <div>
                <Select defaultValue={seMenu[0]} style={{ width: '15%', marginRight: '2rem' }} onChange={this.handleSeMenuChange}>
                    {seMenu.map((item, index) => {
                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                    })}
                </Select>
                <Select style={{ width: '15%' }} defaultValue={threeMenu[0]}
                    disabled={threeMenu.length == 0 ? true : false} allowClear onChange={this.handleThreeMenuChange}>
                    {threeMenu.map((item, index) => {
                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                    })}
                </Select>
                <a style={{ marginLeft: '2rem' }} onClick={this.addData}> <Icon type="plus-circle" theme="filled" /> {'点击添加经营指标'}</a>
            </div>
        );
    }
}
export default BussinessAssessmentAdd;
