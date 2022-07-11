import React, { Component } from 'react'
import LeftBlock from './LeftBlock';
import RightBlock from './RightBlock';
import ForthBlock from '../ForthBlock';

export class FootBlock extends Component {
    render() {
        const { intqueryStat = [],serChk = [] } = this.props
        const list1 = [], list2 = []
        //将数据根据分组分为大小屏不同的数据
        for (let i = 0 ; i < serChk.length ; i++){
            if(serChk[i].GROUP_ORDER === '1'){
                list1.push(serChk[i])
            }
            else {
                list2.push(serChk[i])
            }
        }
        return (
            <div className="flex-c flex1">
                <div className="wid100 flex-c h100">
                    {/*<LeftBlock dataList={list1} dataList2={list2} intqueryStat={intqueryStat}/>*/}
                  <ForthBlock intqueryStat={intqueryStat} />
                  <div className="flex-r flex1">
                    <div className="wid50 flex-c h100">
                      <LeftBlock dataList={list1}/>
                    </div>
                    <div className="wid50 flex-c  h100">
                      <RightBlock dataList={list2}/>
                    </div>
                  </div>
                </div>
            </div>
        )
    }
}

export default FootBlock
