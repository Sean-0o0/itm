import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import moment from 'moment';
import BussinessClassHead from './BussinessClassHead';
import BussinessClassLeft from './BussinessClassLeft';
import BussinessClassRight from './BussinessClassRight';
import { FetchQueryBusAnalBusiness } from "../../../../../../services/planning/planning";

export class BusinessClassItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //showBroker: true,
            result: {},
            note: {},
            defaultHeadArray: [
                '',
                '大经纪',
                '投资银行',
                '研究所',
                '自营',
                '资管',
                '另类',
                '期货',
            ],
        }
        this.leftRef = React.createRef();
        this.rightRef = React.createRef();
    }



    componentWillMount() {
        this.fetchQueryBusAnalBusiness();
    }

    componentDidMount() {
        // //console.log(this.leftRef.current);
        // //console.log(this.rightRef.current);
    }

    //获取数据
    fetchQueryBusAnalBusiness = () => {
        const { type = '', changeDisplay } = this.props;
        FetchQueryBusAnalBusiness({
            mon: Number(moment().format('YYYYMM')),
            type
        }).then(res => {
            const { code = 0, result = '', note = '' } = res;
            if (code > 0) {
                this.setState({
                    result: result && JSON.parse(result),
                    note: note && JSON.parse(note)
                }, () => {
                    const { result } = this.state
                    if (result.result1.length === 0 && result.result2.length === 0
                        && result.result3.length === 0) {
                        changeDisplay(type, false)
                    }
                })
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
            changeDisplay(type, false)
        })
    }

    render() {
        const { note, defaultHeadArray, result } = this.state;
        const { type, brokerArray, changeDisplay } = this.props
        return (
            <Row className='bg_whith mgb1 ' >
                <Col span={24} >
                    <BussinessClassHead headName={note.orgname ? note.orgname : defaultHeadArray[type]}
                        changeShowBroker={() => changeDisplay(type, !brokerArray[type - 1])} showBroker={brokerArray[type - 1]} />
                </Col>
                <Col span={8} ref={this.leftRef} style={{ display: brokerArray[type - 1] ? 'block' : 'none'}}  >
                    <BussinessClassLeft type={type} result={result} />
                </Col>
                <Col span={16} ref={this.rightRef} style={{ display: brokerArray[type - 1] ? 'block' : 'none' }} >
                    <BussinessClassRight brokerArray={brokerArray} monData={note.mon ? note.mon : ''} type={type} result={result} />
                </Col>
            </Row>
        )
    }
}

export default BusinessClassItem
