import React from 'react';
import { Button } from 'antd'

class BussinessAssessmentFoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    handleButtonClick(oprtype) {
        if (oprtype == 1) {
            this.props.saveData1(oprtype)
        } else {
            this.props.saveData(oprtype);
        }
    }

    render() {
        const { onCancelOperate, } = this.props
        return (
            <div style={{ float: 'right', marginTop: '2rem' }}>
                <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={() => this.handleButtonClick(1)}>归档修改</Button>
                {/* <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={() => { onCancelOperate }}>取消</Button> */}
                <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '10px' }} onClick={() => this.handleButtonClick(2)}>修改</Button>
            </div>
        );
    }
}
export default BussinessAssessmentFoot;
