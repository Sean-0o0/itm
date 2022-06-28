import React from 'react';
import { Button } from 'antd'

class BussinessAssessmentFoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount(){
        
    }
    componentDidMount() {

    }
    handleButtonClick(oprtype){
        this.props.saveData(oprtype);
    }

    render() {

        return (
            <div style={{ float: 'right', marginTop: '2rem' }}>
                <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={()=>this.handleButtonClick(1)}>保存草稿</Button>
                {/* <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={onCancelOperate}>取消</Button> */}
                <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={()=>this.handleButtonClick(2)}>确定</Button>
            </div>
        );
    }
}
export default BussinessAssessmentFoot;
