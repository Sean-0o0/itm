import React, { Component } from 'react'

//监管推送
export default class TOP5BusinessAuditCentralTime extends Component {
  state = {
  };
  render() {
    // const { top5Per = [], top5Org = [] } = this.props;
    const top5Per = [
      { ywmc: '1.客户系信息修改', pjbllcsc: '27' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '25' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '22' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '21' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '17' },
    ]
    const top5Org = [
      { ywmc: '1.客户系信息修改', pjbllcsc: '27' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '25' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '22' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '21' },
      { ywmc: '1.客户系信息修改', pjbllcsc: '17' },
    ]
    const maxtop5Per = top5Per[0] && top5Per[0].pjbllcsc && top5Per[0].pjbllcsc > 0 ? 1.176 * top5Per[0].pjbllcsc : 1;
    const maxtop5Org = top5Org[0] && top5Org[0].pjbllcsc && top5Org[0].pjbllcsc > 0 ? 1.176 * top5Org[0].pjbllcsc : 1;
    return (
      <div className="flex-r co-top5-box h100" >
        <div className="flex1 flex-r wid50 pr24">
          <div className="co-top5-num wid20">个人业务</div>
          <div className="flex1 flex-c ml12 wid50" style={{ justifyContent: 'space-between' }}>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Per[0] && top5Per[0].ywmc ? top5Per[0].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Per[0] && top5Per[0].pjbllcsc ? top5Per[0].pjbllcsc : 0) / maxtop5Per}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Per[0] && top5Per[0].pjbllcsc ? top5Per[0].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Per[1] && top5Per[1].ywmc ? top5Per[1].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Per[1] && top5Per[1].pjbllcsc ? top5Per[1].pjbllcsc : 0) / maxtop5Per}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Per[1] && top5Per[1].pjbllcsc ? top5Per[1].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label">{top5Per[2] && top5Per[2].ywmc ? top5Per[2].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Per[2] && top5Per[2].pjbllcsc ? top5Per[2].pjbllcsc : 0) / maxtop5Per}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Per[2] && top5Per[2].pjbllcsc ? top5Per[2].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Per[3] && top5Per[3].ywmc ? top5Per[3].ywmc : '-'}  </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Per[3] && top5Per[3].pjbllcsc ? top5Per[3].pjbllcsc : 0) / maxtop5Per}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Per[3] && top5Per[3].pjbllcsc ? top5Per[3].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label">  {top5Per[4] && top5Per[4].ywmc ? top5Per[4].ywmc : '-'}  </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Per[4] && top5Per[4].pjbllcsc ? top5Per[4].pjbllcsc : 0) / maxtop5Per}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Per[4] && top5Per[4].pjbllcsc ? top5Per[4].pjbllcsc : ''}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex1 flex-r pl24 wid50">
          <div className="co-top5-num wid20">机构业务</div>
          <div className="flex1 flex-c ml12 wid50" style={{ justifyContent: 'space-between' }}>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Org[0] && top5Org[0].ywmc ? top5Org[0].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Org[0] && top5Org[0].pjbllcsc ? top5Org[0].pjbllcsc : 0) / maxtop5Org}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Org[0] && top5Org[0].pjbllcsc ? top5Org[0].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Org[1] && top5Org[1].ywmc ? top5Org[1].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Org[1] && top5Org[1].pjbllcsc ? top5Org[1].pjbllcsc : 0) / maxtop5Org}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Org[1] && top5Org[1].pjbllcsc ? top5Org[1].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Org[2] && top5Org[2].ywmc ? top5Org[2].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Org[2] && top5Org[2].pjbllcsc ? top5Org[2].pjbllcsc : 0) / maxtop5Org}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Org[2] && top5Org[2].pjbllcsc ? top5Org[2].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Org[3] && top5Org[3].ywmc ? top5Org[3].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Org[3] && top5Org[3].pjbllcsc ? top5Org[3].pjbllcsc : 0) / maxtop5Org}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Org[3] && top5Org[3].pjbllcsc ? top5Org[3].pjbllcsc : ''}</div>
              </div>
            </div>
            <div className="flex-c">
              <div className="co-top5-label"> {top5Org[4] && top5Org[4].ywmc ? top5Org[4].ywmc : '-'} </div>
              <div className="flex-r wid100" style={{ height: "1.5rem", margin: "0.5rem 0 0", backgroundColor: '#29387B' }}>
                <div className="co-top5-background" style={{ width: `${100 * (top5Org[4] && top5Org[4].pjbllcsc ? top5Org[4].pjbllcsc : 0) / maxtop5Org}%`, display: "inline" }}></div>
                <div className='ml12 co-top5-sublabel'> {top5Org[4] && top5Org[4].pjbllcsc ? top5Org[4].pjbllcsc : ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
