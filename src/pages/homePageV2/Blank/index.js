import React from 'react';
import Watermark from './Watermark';
import styles from './index.less';

class Blank extends React.Component {

    render() {
        const sysName = localStorage.getItem('sysName');

        return (
            <div style={{ height: '100%',  margin: '0 -1rem', overflow: 'hidden' }}>
                <Watermark sysName={sysName}/>
            </div>
        );
    }
}

export default Blank;

