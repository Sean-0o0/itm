import React from 'react';
import ThirdItem from './ThirdItem';

class InfoItem extends React.Component {

    render() {
        const { info = [] } = this.props;
        let name = '';
        if (info[0]&&info[0].name) {
            name = info[0].name;
        }
        let numOfItem = [];
        for (let i = 1; i < info.length; i++) {
            numOfItem.push(i);
        }

        return (
            <React.Fragment>
                <div className="jk-side-title" style={{fontSize:"1.725rem"}}>{name}</div>
                <div className="jk-side-cont">
                    {numOfItem.map(i => (
                        <ThirdItem
                            key = {i}
                            infoItem = {info[i]}
                        />
                    ))}
                </div>
            </React.Fragment>
        );
    }
}
export default InfoItem;
