import React, { Component } from 'react'
import { Row, Col,Card } from "antd";
import { Fragment } from 'react';
export class IncomeCard extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    const { cardList, type, height } = this.props
    return (
      <>
        {Object.keys(cardList).length === 0 ?
          <>
            <Col span={12} style={{
              // height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem',
              height:'20.25rem',
              padding: '2rem 1rem 1rem 2rem'
            }}>
              {/*<Col span={12} style={{ height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem', paddingTop: 2.41 + height / 4 + 'rem',paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '2rem'}}>*/}
              <Card title="&nbsp;" style={{ height: '100%', width: '100%', }}
                    headStyle={{ width: '100%', minHeight: 4, height: 4, borderRadius: 4, backgroundColor: '#54A9DF' }}
                    bodyStyle={{ width: '100%', height: '100%', padding: '1rem' }}
                    hoverable={true} className="grad-content">
              </Card>
            </Col>
            <Col span={12} style={{
              // height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem',
              height:'20.25rem',
              padding: '2rem 1rem 1rem 2rem'
            }}>
              {/*<Col span={12} style={{ height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem', paddingTop: 2.41 + height / 4 + 'rem',paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '2rem' }}>*/}
              <Card title="&nbsp;" style={{ height: '100%', width: '100%', }}
                    headStyle={{ width: '100%', minHeight: 4, height: 4, borderRadius: 4, backgroundColor: '#54A9DF' }}
                    bodyStyle={{ width: '100%', height: '100%', padding: '1rem' }}
                    hoverable={true} className="grad-content">
              </Card>
            </Col>
          </> : <>
            <Col span={12} style={{
              // height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem',
              height:'20.25rem',
              padding: '2rem 1rem 1rem 2rem',
              textAlign: 'left'
            }}>
              {/*<Col span={12} style={{ height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem', paddingTop: 2.41 + height / 4 + 'rem'}}>*/}
              <Card title="&nbsp;" style={{ height: '100%', width: '100%', }}
                    headStyle={{ width: '100%', minHeight: 4, height: 4, borderRadius: 4, backgroundColor: '#54A9DF' }}
                    bodyStyle={{ width: '100%', height: '100%', padding: '2rem' }}
                    hoverable={true} className="grad-content">
                <div>
                  <Row type='flex'>
                    <Col span={24} className='card-firstRow'>
                      本月收入/月分解目标
                    </Col>
                  </Row>
                  <Row type='flex' className='card-secondRow'>
                    <Col span={24}>
                      {cardList.INDIVAL}/{cardList.MONBREAKGOAL}
                    </Col>
                  </Row>
                  <Row type='flex' className='card-thirdRow'>
                    <Col span={24}>
                      单位：亿元
                    </Col>
                  </Row>
                  <Row type='flex' className='card-fourthRow'>
                    <Col span={24}>
                      <span className='firstSpan'>环比：</span>
                      <span className='secondSpan'>{cardList.MONYOY}%</span>
                    </Col>
                  </Row>
                  <Row type='flex' className='card-fifthRow'
                       style={{ textAlign: 'left', marginBottom: 2.41 + height / 4 + 'rem' }}>
                    <Col span={24}>
                      <span className='firstSpan'>完成率：</span>
                      <span className='secondSpan'>{cardList.MONCOMPLETE}%</span>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col span={12} style={{
              // height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem',
              height:'20.25rem',
              padding: '2rem 1rem 1rem 2rem',
            }}>
              {/*<Col span={12} style={{ height: type === 3 ? '20.25rem' : 17.67 + height / 2 + 'rem', paddingTop: 2.41 + height / 4 + 'rem', }}>*/}
              <Card title="&nbsp;" style={{ height: '100%', width: '100%', }}
                    headStyle={{ width: '100%', minHeight: 4, height: 4, borderRadius: 4, backgroundColor: '#54A9DF' }}
                    bodyStyle={{ width: '100%', height: '100%', padding: '2rem' }}
                    hoverable={true} className="grad-content">
                <Row type='flex'>
                  <Col span={24} className='card-firstRow'>
                    本年收入/本年目标
                  </Col>
                </Row>
                <Row type='flex' className='card-secondRow'>
                  <Col span={24}>
                    {cardList.TOTLVAL}/{cardList.BREAKGOAL}
                  </Col>
                </Row>
                <Row type='flex' className='card-thirdRow'>
                  <Col span={23}>
                    单位：亿元
                  </Col>
                </Row>
                <Row type='flex' className='card-fourthRow'>
                  <Col span={24}>
                    <span className='firstSpan'>环比：</span>
                    <span className='secondSpan'>{cardList.YEARYOY}%</span>
                  </Col>
                </Row>
                <Row type='flex' className='card-fifthRow'
                     style={{ textAlign: 'left',marginBottom: '2.41rem' }}>
                  <Col span={24}>
                    <span className='firstSpan'>完成率：</span>
                    <span className='secondSpan'>{cardList.TOTLCPMPLETE}%</span>
                  </Col>
                </Row>
              </Card>
            </Col>

          </>
        }
      </>
    )
  }
}

export default IncomeCard
