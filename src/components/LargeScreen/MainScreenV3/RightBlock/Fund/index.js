import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ProgressLine from './ProgressLine';
import ProgressChart from './ProgressChart';

class Fund extends React.Component {
    state = {
        business: [],
        TAFASurvey: []
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            const { MFndTAFASurvey = [], FndClearingbusiness = [] } = nextProps;
            this.handleBusiness(FndClearingbusiness);
            this.setState({ TAFASurvey: MFndTAFASurvey });
        }
    }

    handleBusiness = (arr) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].GROUPCODE) {
                if (!map[arr[i].GROUPCODE]) {
                    myArr.push({
                        GROUPCODE: arr[i].GROUPCODE,
                        GROUPNAME: arr[i].GROUPNAME,
                        GROUPSTEPNUM: arr[i].GROUPSTEPNUM,
                        COMPLTSTEPNUM: arr[i].COMPLTSTEPNUM,
                        GROUPSTATUS: arr[i].GROUPSTATUS,
                        data: [arr[i]]
                    });
                    map[arr[i].GROUPCODE] = arr[i]
                } else {
                    for (let j = 0; j < myArr.length; j++) {
                        if (arr[i].GROUPCODE === myArr[j].GROUPCODE) {
                            myArr[j].data.push(arr[i]);
                            break
                        }
                    }
                }
            }
        }
        this.setState({ business: myArr })
    }

    render() {
        const { business = [], TAFASurvey = [] } = this.state;
        const [firstData = {}, secondData = {}, thirdData = {}, fourthData = {}] = business;
        const { hightLight = 0 } = this.props
        return (
            <div className="h100 pd10">
                <div className={ hightLight === 5 ? 'ax-card2 flex-c' : 'ax-card flex-c'}>
                    <div className="pos-r">
                        <div className="card-title title-c"><Link to={`/fund`} style={{color: '#C6E2FF'}} target='_blank'>兴证基金</Link></div>
                    </div>
                    <div className="flex-c" style={{ height: 'calc(100% - 3.66rem)', padding: '1rem' }}>
                        <div className="flex-r h36" style={{justifyContent:'space-around'}}>
                            <ProgressChart item={firstData} hightLight={hightLight}/>
                            <ProgressChart item={secondData} hightLight={hightLight}/>
                        </div>
                        <div className="flex-r h36" style={{justifyContent:'space-around'}}>
                            <ProgressChart item={thirdData} hightLight={hightLight}/>
                            <ProgressChart item={fourthData} hightLight={hightLight}/>
                        </div>
                        <div className="h28 flex-r">
                            <ProgressLine data={TAFASurvey[0]} />
                            <ProgressLine data={TAFASurvey[1]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Fund;
