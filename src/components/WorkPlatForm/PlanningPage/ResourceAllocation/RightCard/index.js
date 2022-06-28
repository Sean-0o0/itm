import React from 'react';
import { connect } from 'dva';
import { Card, Tooltip } from 'antd';

class RightCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    const num = Number(data?.planNum);
    const nowPercent = Number(data?.nowNum) * 100 / num;
    const addPercent = Number(data?.addNum) * 100 / num;
    const planPercent = 100 - nowPercent - addPercent;
    // console.log('planPercent', planPercent);
    return data !== undefined && (!Array.prototype.isPrototypeOf(data) && data.length !== 0) ? (
      <div className='right-card'>
        <Card className='right-card1' bodyStyle={{ padding: '1rem' }}>
          <div className='key'>{data.resClassName === "" ? '--' : data.resClassName}</div>
          <div className='yr'>{data.yr}</div>
          <div className='condition1'>
            <div className='data'><span className='key'>实际情况</span>{data.nowNum === "" ? '--' : data.nowNum}</div>
            <div className='data' style={{ paddingLeft: '10rem' }}><span className='key'>计划情况</span>{data.planNum === "" ? '--' : data.planNum}
            </div>
          </div>
          <div className='condition2'>
            <div className='data'><span className='key'>拟增配情况</span>{data.addNum === "" ? '--' : data.addNum}</div>
          </div>
          <div className='remark'>
            <div className='data'><span className='key'>备注</span>
              <div style={{
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                overflow: 'hidden',
              }}>{data.remark.length > 40 ? data.remark.slice(0, 40) + '...' : (data.remark === "" ? '--' : data.remark)}</div>
            </div>
          </div>
        </Card>
        <div className='flex-r'>
          <div style={{
            margin: '2rem 0rem 0rem 1.5rem',
            width: `1rem`,
            height: '1rem',
            borderRadius: '1rem',
            background: 'rgba(115, 160, 250, 1)',
            display: 'inline',
          }}>
          </div>
          <span style={{
            margin: '1.3rem 0.5rem 0rem 0.5rem',
          }}>实际情况</span>
          <div style={{
            margin: '2rem 0rem 0rem 1.5rem',
            width: `1rem`,
            height: '1rem',
            borderRadius: '1rem',
            background: 'rgba(247, 192, 43, 1)',
            display: 'inline',
          }}>
          </div>
          <span style={{
            margin: '1.3rem 0.5rem 0rem 0.5rem',
          }}>拟配置情况</span>
          <div style={{
            margin: '2rem 0rem 0rem 1.5rem',
            width: `1rem`,
            height: '1rem',
            borderRadius: '1rem',
            background: 'rgba(84, 169, 223, 0.1)',
            display: 'inline',
          }}>
          </div>
          <span style={{
            margin: '1.3rem 0.5rem 0rem 0.5rem',
          }}>计划情况</span>
        </div>
        <div className='flex-r' style={{
          height: '1rem',
          width: '30rem',
          borderRadius: '0.8rem',
          overflow: 'hidden',
          margin: '1rem 0',
          backgroundColor: !num || num === 0 ? 'rgba(84, 169, 223, 0.1)' : null,
        }}>
          <Tooltip placement="right" title={data?.nowNum}>
            <div style={{
              width: `${nowPercent}%`,
              background: 'rgba(115, 160, 250, 1)',
              display: 'inline',
            }}>
            </div>
          </Tooltip>
          <Tooltip placement="right" title={data?.addNum}>
            <div style={{
              width: `${addPercent}%`,
              background: 'rgba(247, 192, 43, 1)',
              marginLeft: addPercent !== 0 && nowPercent !== 0 ? '0.1%' : '',
              display: 'inline',
            }}>
            </div>
          </Tooltip>
          <Tooltip placement="right" title={data?.planNum}>
            <div style={{
              width: `${planPercent}%`,
              background: 'rgba(84, 169, 223, 0.1)',
              marginLeft: planPercent !== 0 && (nowPercent !== 0 || addPercent !== 0) ? '0.1%' : '',
              display: 'inline',
            }}>
            </div>
          </Tooltip>
        </div>
      </div>

    ) : (<div className='right-card'>
      <Card className='right-card1' bodyStyle={{ padding: '1rem' }}>
        <div className='key'>{'--'}</div>
        <div className='yr'>{'--'}</div>
        <div className='condition1'>
          <div className='data'><span className='key'>实际情况</span>{'--'}</div>
          <div className='data' style={{ paddingLeft: '10rem' }}><span className='key'>计划情况</span>{'--'}</div>
        </div>
        <div className='condition2'>
          <div className='data'><span className='key'>拟增配情况</span>{'--'}</div>
        </div>
        <div className='remark'>
          <div className='data'><span className='key'>备注</span>
            <div style={{
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              overflow: 'hidden',
            }}>{'--'}</div>
          </div>
        </div>
      </Card>
      <div className='flex-r'>
        <div style={{
          margin: '2rem 0rem 0rem 1.5rem',
          width: `1rem`,
          height: '1rem',
          borderRadius: '1rem',
          background: 'rgba(115, 160, 250, 1)',
          display: 'inline',
        }}>
        </div>
        <span style={{
          margin: '1.3rem 0.5rem 0rem 0.5rem',
        }}>实际情况</span>
        <div style={{
          margin: '2rem 0rem 0rem 1.5rem',
          width: `1rem`,
          height: '1rem',
          borderRadius: '1rem',
          background: 'rgba(247, 192, 43, 1)',
          display: 'inline',
        }}>
        </div>
        <span style={{
          margin: '1.3rem 0.5rem 0rem 0.5rem',
        }}>拟配置情况</span>
        <div style={{
          margin: '2rem 0rem 0rem 1.5rem',
          width: `1rem`,
          height: '1rem',
          borderRadius: '1rem',
          background: 'rgba(84, 169, 223, 0.1)',
          display: 'inline',
        }}>
        </div>
        <span style={{
          margin: '1.3rem 0.5rem 0rem 0.5rem',
        }}>计划情况</span>
      </div>
      <div className='flex-r' style={{
        height: '1rem',
        width: '30rem',
        borderRadius: '0.8rem',
        overflow: 'hidden',
        margin: '1rem 0',
        backgroundColor: !num || num === 0 ? 'rgba(84, 169, 223, 0.1)' : null,
      }}>
        <Tooltip placement="right" title={data?.nowNum}>
          <div style={{
            width: `${nowPercent}%`,
            background: 'rgba(115, 160, 250, 1)',
            display: 'inline',
          }}>
          </div>
        </Tooltip>
        <Tooltip placement="right" title={data?.addNum}>
          <div style={{
            width: `${addPercent}%`,
            background: 'rgba(247, 192, 43, 1)',
            marginLeft: addPercent !== 0 && nowPercent !== 0 ? '0.1%' : '',
            display: 'inline',
          }}>
          </div>
        </Tooltip>
        <Tooltip placement="right" title={data?.planNum}>
          <div style={{
            width: `${planPercent}%`,
            background: 'rgba(84, 169, 223, 0.1)',
            marginLeft: planPercent !== 0 && (nowPercent !== 0 || addPercent !== 0) ? '0.1%' : '',
            display: 'inline',
          }}>
          </div>
        </Tooltip>
      </div>
    </div>);
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(RightCard);
