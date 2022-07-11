import React from 'react';
import 'react-id-swiper/src/styles/css/swiper.css';
import PorgressLine from './ProgressLine';

class FundTransferWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { zjhbData = [], jsjdData = [] } = this.props;
    const ftzh = jsjdData[5];
    return (
      <div className='ax-card flex-c left-cont'>
        <div className='pos-r'>
          <div className='card-title title-r'>资金划拨业务</div>
        </div>
        <div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
          <div className='flex-c h100'>
            
            <div className = "flex-r flex1">
              <PorgressLine data = {zjhbData[0]}/>
              <PorgressLine data = {zjhbData[1]}/>
            </div>
            <div className = "flex-r flex1">
              <PorgressLine data = {zjhbData[2]}/>
              <div className='squreKey h66 flex-r flex1 fwb' style={{ margin: '2.5rem 1rem 1rem 1rem', alignItems:'center' }}>
                <div className = "wid45">
                <img src={[require('../../../../../image/icon_jzjsje.png')]} className='icon-style' alt='' />
                </div>
                <div className = "flex-c">
                  <div className = "data-font" style ={{height:"3rem"}}>{ftzh?ftzh.NAME:"-"}</div>
                  <div style ={{color:"#00ACFF",  fontWeight: "bold"}}>{ftzh?ftzh.VALUE:"0.0"} 亿元</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FundTransferWork;
