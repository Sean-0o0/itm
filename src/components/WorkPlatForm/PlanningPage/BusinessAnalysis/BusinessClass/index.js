import React, { Component } from 'react'
import { Row } from 'antd';
import BusinessClassItem from './BusinessClassItem';
// import { BussinessClassHead } from "./BussinessClassHead";
// import { BussinessClassLeft } from "./BussinessClassLeft";
// import { BussinessClassRight } from "./BussinessClassRight";
/*
* @Author: cyp
* @Date:  
* @Description: 经营分析 - 财务类页面
*/
export class BussinessClass extends Component {
    constructor(props) {
        super(props)

        this.state = {
            brokerArray: [true, true, true, true, true, true, true, true],//业务类情况
        }
    }

    changeDisplay = (index, obj) => {
        let { brokerArray } = this.state
        brokerArray[index - 1] = obj
        this.setState({ brokerArray })

    }

    componentDidMount() {
        this.handleBrokerArray()
        // 定位到上次浏览位置
        let scrollTop = sessionStorage.getItem("scrollTop")
        let detailPageBackFlag = sessionStorage.getItem("detailPageBackFlag")

        if (scrollTop !== null && detailPageBackFlag !== null) {
            let htmlContent = document.getElementById("htmlContent")
            htmlContent.scrollTop = scrollTop
            sessionStorage.removeItem("scrollTop")
            sessionStorage.removeItem("detailPageBackFlag")
        }
    }

    handleBrokerArray = () => {
        const { brokerArray } = this.props
        let temArray = brokerArray.split(',')
        temArray.map((item, index) => {
            if (item === 'true') {
                temArray.splice(index, 1, true)
            } else if (item === 'false') {
                temArray.splice(index, 1, false)
            }
        })
        brokerArray && this.setState({
            brokerArray: temArray
        })
    }
    render() {
        const { brokerArray } = this.state
        return (
            <Row style={{ padding: '0 0px 10px 0px' }}>
                {/* type为约定好的 */}
                <BusinessClassItem type={1} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={2} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={3} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={4} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={5} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={6} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
                <BusinessClassItem type={7} brokerArray={brokerArray} changeDisplay={this.changeDisplay} />
            </Row>
        )
    }

}
export default BussinessClass
