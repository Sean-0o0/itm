import React from 'react';
import BasicModal from '../../../../Common/BasicModal';
import { Button } from 'antd';
import Transfer from './Transfer';

class DefinedDisplayColumn extends React.Component {

    state = {
        targetKeys: [],
        // mockData: []
    };

    componentDidMount() {
        // this.getMock();
    }

    componentWillReceiveProps(nextprops) {
        const { targetKeys = [] } = nextprops;
        // const mockData = []
        // if (JSON.stringify(display) !== JSON.stringify(column)) {
        //     display.forEach((element, index) => {
        //         const root = Object.keys(element)[0]
        //         const one = element[root];
        //         const children = [];
        //         const titles = Object.keys(one);
        //         let temp = {}
        //         titles.forEach((item, i) => {
        //             children.push({
        //                 key: item,
        //                 title: one[item],
        //             })
        //         })
        //         temp = {
        //             key: root,
        //             title: root,
        //         }
        //         if (children.length) {
        //             temp.children = children;
        //         }
        //         mockData.push(temp)
        //     })
        // }
        this.setState({
            targetKeys: targetKeys,
            // mockData: mockData.length ? mockData : this.state.mockData
        })
    }

    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }

    handleChange = targetKeys => {
        console.log('targetKeys', targetKeys)
        this.setState({ targetKeys });
    };

    handleCancel = () => {
        this.props.handleDisplayVisible(false);
    }

    changeDisplayColumn = () => {
        this.props.changeDisplayColumn(this.state.targetKeys);
    }

    render() {
        const { visible = false, mockData = [] } = this.props;
        const { targetKeys } = this.state;
        const modalProps = {
            width: '98rem',
            title: '自定义展示列',
            style: { top: '10rem' },
            visible: visible,
            // confirmLoading,
            onCancel: () => this.handleCancel(),
            footer: null,
        };
        console.log('mockData11',mockData)

        return (
            <BasicModal {...modalProps}>
                <div className="display-column">
                    {/* <Transfer
                        dataSource={mockData}
                        titles={['可选项', '已选项']}
                        showSearch
                        filterOption={this.filterOption}
                        targetKeys={targetKeys}
                        onChange={this.handleChange}
                        // onSearch={this.handleSearch}
                        render={item => item.title}
                    /> */}
                    <Transfer dataSource={mockData} targetKeys={targetKeys} onChange={this.handleChange} />
                    <div className="display-column-footer">
                        <Button onClick={this.handleCancel}>关闭</Button>
                        <Button type="primary" onClick={this.changeDisplayColumn}>确定</Button>
                    </div>
                </div>
            </BasicModal>

        );
    }
}

export default DefinedDisplayColumn;