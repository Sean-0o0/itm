import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import { Row, Col, } from 'antd';

export class BussinessClassHead extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }




    render() {
        const { showBroker, changeShowBroker, headName,} = this.props
        return (

            <Row className='nucleus-Index'>
                <Col span={24}>
                    <div className='basic-index-outline title'  >
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center"}}>
                            {headName}
                            <div onClick={() => { changeShowBroker() }}>
                                {showBroker ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>
                        </div>}
                    </div>
                </Col>
            </Row >
        )
    }

}
export default BussinessClassHead
