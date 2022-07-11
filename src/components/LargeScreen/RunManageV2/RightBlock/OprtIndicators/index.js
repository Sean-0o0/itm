import React from 'react';
// import InfoItem from '../../LeftBlock/BusinessInfoMorn/InfoItem';

class OprtIndicators extends React.Component {
  render() {
    const { OptIndictData = [] }  = this.props;
    let list1 = [], list2 = [], list3 = [], list4 = [];
    for(let i = 0; i < OptIndictData.length; i++){
      if(OptIndictData[i]){
        if(OptIndictData[i].GROUPNAME === '用户权限流程'){
          list1.push(OptIndictData[i]);
        }else if(OptIndictData[i].GROUPNAME === '参数设置'){
          list2.push(OptIndictData[i]);
        }else if(OptIndictData[i].GROUPNAME === '会员业务'){
          list3.push(OptIndictData[i]);
        }else if(OptIndictData[i].GROUPNAME === '数据管理'){
          list4.push(OptIndictData[i]);
        }
      }
    }
    return (
        <div className="ax-card current flex-c Oprtanagement">
          <div className="card-title title-r">运营指标</div>
          <div className='flex-r ' style={{ padding: '1rem 0 1rem 1rem' }}>
            <div className='in-side-sub flex-c' style={{width:'50%'}}>
              {/*左上*/}
              <div className="h100 wid50 pos-yhqx">
              <div className='in-side-sub-title in-side-sub-item'>
                <img className="data-item-img" src={[require("../../../../../image/icon_circle.png")]} alt="" /> {list1[0]? list1[0].GROUPNAME :  ''}</div>
              <div className='flex-r pos-line'>
                <img src={[require('../../../../../image/icon-line.png')]} className='' alt='' />
              </div>
              <div className='flex-r pos-sqlc'>
                {/*申请流程处理完成情况*/}
                <img src={[require('../../../../../image/icon_sqlcclwcqk.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list1[0]? list1[0].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                  <span className='fwb data-font tl'>
                    {list1[0]? list1[0].IDXNAME :  ''}
                  </span>
                    <span> </span>
                  <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                     {list1[0]? list1[0].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                  <span className='fwb data-font tl'>
                    {list1[1]? list1[1].IDXNAME :  ''}
                  </span>
                    <span> </span>
                  <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list1[1]? list1[1].IDXVAL+"笔" :  ''}
                  </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex-r pos-lzwxh'>
                {/*离职未销户*/}
                <img src={[require('../../../../../image/icon_lzwxh.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list1[2]? list1[2].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                 <span className='fwb data-font tl'>
                    {list1[2]? list1[2].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list1[2]? list1[2].IDXVAL :  ''}个
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list1[3]? list1[3].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list1[3]? list1[3].IDXVAL :  ''}个
                  </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/*左下*/}
              <div className="h100 wid50 pos-jydy">
              <div className='in-side-sub-title in-side-sub-item'>
                <img className="data-item-img" src={[require("../../../../../image/icon_circle.png")]} alt="" /> {list3[0]? list3[0].GROUPNAME :  ''}</div>
              <div className='flex-r pos-line'>
                <img src={[require('../../../../../image/icon-line.png')]} className='' alt='' />
              </div>
              <div className='flex-r pos-czl'>
                {/*交易单元业务*/}
                <img src={[require('../../../../../image/icon_jydyyw.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list3[0]? list3[0].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                  <span className='fwb data-font tl'>
                    {list3[0]? list3[0].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list3[0]? list3[0].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list3[1]? list3[1].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list3[1]? list3[1].IDXVAL+"笔" :  ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
              <div className='flex-r pos-zyl'>
                {/*外接机构及产品信息报备*/}
                <img src={[require('../../../../../image/icon_wjjg.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list3[2]? list3[2].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list3[2]? list3[2].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list3[2]? list3[2].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list3[3]? list3[3].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list3[3]? list3[3].IDXVAL+"笔" :  ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/*右上*/}
            <div className='in-side-sub flex-c' style={{width:'50%'}}>
              <div className="h100 wid50 pos-cssz">
              <div className='in-side-sub-title in-side-sub-item'>
                <img className="data-item-img" src={[require("../../../../../image/icon_circle.png")]} alt="" /> {list2[0]? list2[0].GROUPNAME :  ''}</div>
              <div className='flex-r pos-line'>
                <img src={[require('../../../../../image/icon-line.png')]} className='' alt='' />
              </div>
              <div className='flex-r pos-csszrw'>
                {/*参数设置任务完成情况*/}
                <img src={[require('../../../../../image/icon_csszrwwcqk.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list2[0]? list2[0].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                   <span className='fwb data-font tl'>
                    {list2[0]? list2[0].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list2[0]? list2[0].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list2[1]? list2[1].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list2[1]? list2[1].IDXVAL+"笔" :  ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
              <div className='flex-r pos-csszsq'>
                {/*参数设置申请流程处理情况*/}
                <img src={[require('../../../../../image/icon_csszsqlcclqk.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list2[2]? list2[2].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                 <span className='fwb data-font tl'>
                    {list2[2]? list2[2].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list2[2]? list2[2].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                     <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list2[3]? list2[3].IDXNAME : ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list2[3]? list2[3].IDXVAL+"笔" : ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>

            {/*右下*/}
            <div className="h100 wid50 pos-sjgl">
              <div className='in-side-sub-title in-side-sub-item'>
                <img className="data-item-img" src={[require("../../../../../image/icon_circle.png")]} alt="" /> {list4[0]? list4[0].GROUPNAME :  ''}</div>
              <div className='flex-r pos-line'>
                <img src={[require('../../../../../image/icon-line.png')]} className='' alt='' />
              </div>
              <div className='flex-r pos-czl'>
                {/*信托产品清算数据申请送审*/}
                <img src={[require('../../../../../image/icon_xtcpqssjssss.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list4[0]? list4[0].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                   <span className='fwb data-font tl'>
                    {list4[0]? list4[0].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list4[0]? list4[0].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list4[1]? list4[1].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list4[1]? list4[1].IDXVAL+"笔" :  ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
              <div className='flex-r pos-zyl'>
                {/*数据接收情况监控*/}
                <img src={[require('../../../../../image/icon_sjjsqkjk.png')]} className='icon-style' alt='' />
                <div className='flex-c bg-style-l'>
                  <div className='fwb data-font tl' style={{ fontSize: '1.633rem', padding: '1rem 1rem 1.5rem 0' }}>{list4[2]? list4[2].WORKFLOWNAME :  ''}
                  </div>
                  <div className="flex-r wid100">
                    <div className="wid50">
                  <span className='fwb data-font tl'>
                    {list4[2]? list4[2].IDXNAME :  ''}
                  </span>
                    <span> </span>
                    <span className='blue1 tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list4[2]? list4[2].IDXVAL+"笔" :  ''}
                  </span>
                    <span className='fwb data-font tl'>
                    ;
                  </span>
                    </div>
                    <div className="wid50">
                    <span className='fwb data-font tl'>
                    {list4[3]? list4[3].IDXNAME : ''}
                  </span>
                    <span> </span>
                    <span className='orange tl' style={{ fontSize: '2.136rem', fontWeight: 'bold'  }}>
                    {list4[3]? list4[3].IDXVAL+"笔" : ''}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

          </div>
        </div>
    );
  }
}
export default OprtIndicators;
