import React from 'react';

class TdItem extends React.Component {

    render() {
        const { itemData = {} , index = 1 } = this.props;

        return (
            <tr>
                <td>{itemData.PRO_NAME?index:''}</td>
                <td>{itemData.PRO_NAME}</td>
                <td>{itemData.PRO_TYPE}</td>
                <td>{itemData.IV_YEAR}</td>
                <td>{itemData.ROI}</td>
            </tr>
        );
    }
}
export default TdItem;
