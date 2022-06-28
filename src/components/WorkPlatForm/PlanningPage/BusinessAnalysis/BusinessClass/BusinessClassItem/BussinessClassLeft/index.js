import React, { Component } from 'react';
import { Row, Col, Skeleton } from "antd";
import { BussinessClassLeftEchart } from "./BussinessClassLeftEchart";
import { IncomeCard } from "./IncomeCard";
export class BussinessClassLeft extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cardList: {
            },
            echartData: [],
            temCartList: {},

        }
    }
    componentDidMount() {
        const { result } = this.props
        const cardList = {
            BREAKGOAL: "",
            INDIID: "",
            INDIVAL: "",
            MONBREAKGOAL: "",
            MONCOMPLETE: "",
            MONYOY: "",
            TOTLCPMPLETE: "",
            TOTLVAL: "",
            YEARYOY: "",
        }
        this.setState({
            //  cardList,
            loading: false,
        })
    }
    static getDerivedStateFromProps(nextPro, preState) {

        const temCartList = nextPro.result
        // console.log("temCartList",temCartList)
        if (temCartList && JSON.stringify(preState.temCartList) !== JSON.stringify(temCartList)) {
            return {
                cardList: temCartList.result1.length > 0 ? temCartList.result1[0] : preState.cardList,
                echartData: temCartList.result2.length > 0 ? temCartList.result2 : [],
                temCartList
            }
        }
        return null
    }
    render() {
        const { cardList, loading = true, echartData } = this.state
        const { type = 0, result } = this.props
        let height = 0
        if (type !== 3 && Object.keys(result).length > 0 && Object.keys(result.result3).length > 0 && result.result3) {
            height = (result.result3.length - 5) * 2.668
        }
        return (
            <Col span={24} style={{ backgroundColor: 'white' }}>
                <Skeleton loading={loading}>
                    <Row type='flex' justify='space-between' className='bussinessAnalysis' style={{ fontSize: '1.3rem', }}>
                        <IncomeCard height={height} type={type} cardList={cardList} cardName={'本月达成/月分解目标'} />
                    </Row>
                </Skeleton>
                {type !== 3 && <Row>
                    <Col span={24}>
                        <BussinessClassLeftEchart echartData={echartData} height={height} />
                    </Col>
                </Row>}

            </Col>

        )
    }
}

export default BussinessClassLeft
