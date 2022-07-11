import React from 'react';
import BasicModal from '../../../../../../Common/BasicModal';
import { Transfer, Button } from 'antd'

class DefinedDisplayColumn extends React.Component {

    state = {
        targetKeys: []
    };

    componentDidMount() {
        // this.getMock();
    }

    componentWillReceiveProps(nextprops) {
        const { targetKeys = [] } = nextprops;
        this.setState({
            targetKeys: targetKeys
        })
    }

    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }

    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };

    // handleSearch = (dir, value) => {
    //     console.log('search:', dir, value);
    // };

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
        return (
            <BasicModal {...modalProps}>
                <div className="display-column">
                    <Transfer
                        dataSource={mockData}
                        titles={['可选项', '已选项']}
                        showSearch
                        filterOption={this.filterOption}
                        targetKeys={targetKeys}
                        onChange={this.handleChange}
                        // onSearch={this.handleSearch}
                        render={item => item.title}
                    />
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