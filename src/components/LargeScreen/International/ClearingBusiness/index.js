import React from 'react';
import ChildItem from './ChildItem';

class ClearingBusiness extends React.Component {
    render() {
        const { taskState = [], sfjyr = '1' } = this.props;
        const tmpl = [];
        const taskItem = [];
        let columnSum = 0;
        const column = [];
        taskState.forEach(item => {
            if (item.IDX_GRD === '1') {
                taskItem.push([]);
                tmpl.push(item);
            }
        });

        taskState.forEach(item => {
            for (let i = 0; i < tmpl.length; i++) {
                if (item.FID === tmpl[i].ID) {
                    taskItem[i].push(item);
                }
            }
        });
        for (let i = 0; i < taskItem.length; i++) {
            if (taskItem[i].length > columnSum) {
                columnSum = taskItem[i].length;
            }
        }
        for (let i = 0; i < columnSum; i++) {
            column.push(i);
        }
        let axClass = 'ax-card current flex-c';
        let bgClass = 'flex1 flex-r';
        let titleClass = 'flex1 jk-side-title';
        if (sfjyr === '0') {
            axClass = 'ax-card1 current flex-c';
            bgClass = 'flex1 flex-r in-bs-bg in-bs-bgimg';
            titleClass = 'flex1 jk-side-title2';
        }

        return (
            <div className="flex1 pd10">
                <div className={axClass}>
                    <div className={bgClass}>
                        <div className="flex-c flex1 in-side">
                            <div className={titleClass}>{tmpl[0] ? tmpl[0].IDX_NM : ''}</div>
                            {tmpl[0] ? (column.map(i => (
                                <ChildItem itemInfo={taskItem[0][i]} key={i} sfjyr={sfjyr}/>
                            ))) : ''}
                        </div>
                        <div className="flex-c flex1 in-side">
                            <div className={titleClass}>{tmpl[1] ? tmpl[1].IDX_NM : ''}</div>
                            {tmpl[1] ? (column.map(i => (
                                <ChildItem itemInfo={taskItem[1][i]} key={i} sfjyr={sfjyr}/>
                            ))) : ''}
                        </div>
                        <div className="flex-c flex1 in-side">
                            <div className={titleClass}>{tmpl[2] ? tmpl[2].IDX_NM : ''}</div>
                            {tmpl[2] ? (column.map(i => (
                                <ChildItem itemInfo={taskItem[2][i]} key={i} sfjyr={sfjyr}/>
                            ))) : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ClearingBusiness;
