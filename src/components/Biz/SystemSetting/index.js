import React from 'react';
import { message } from 'antd';
import BasicModal from '../../Common/BasicModal';
import SettingContent from './SettingContent';
import { FetchqueryShortcutMenuConfig, FetchupdateShortcutMenuConfig } from '../../../services/commonbase';

class SystemSetting extends React.Component {
    state = {
      visible: false,
      options: [],
      selectedItem: [], // 已选的菜单值
    }
  openModal = () => {
    const { name, authedQuickOperationData } = this.props;
    FetchqueryShortcutMenuConfig({
      fadm: name,
    }).then((response) => {
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const selectIds = [];
        authedQuickOperationData.forEach((element) => {
          const { kjcd } = element;
          if (kjcd) {
            selectIds.push(kjcd);
          }
        });
        this.setState({
          options: records,
          selectedItem: selectIds,
        });
      }
    });
    this.setState({
      visible: true,
    });
  }
  closeModal = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk=() => { // 点确定之后的操作
    const { updateQuickOperationData, name = '' } = this.props;
    const { options = [] } = this.state;
    const quickOperationData = [];
    const ids = [];
    options.forEach((item) => {
      const { xsmc = '', url = '', kjcd = '', icon = '', id = '' } = item;
      if (this.state.selectedItem.includes(kjcd)) {
        quickOperationData.push({
          key: kjcd,
          path: url,
          title: xsmc,
          icon,
          kjcd,
        });
        ids.push(id);
      }
    });
    FetchupdateShortcutMenuConfig({
      fadm: name,
      sxcd: ids.join(','),
    }).then(() => {
      updateQuickOperationData(quickOperationData);
      this.closeModal();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleItemChange = (checked, value) => {
    if (checked) {
      this.state.selectedItem.push(value);
    } else {
      this.state.selectedItem = this.state.selectedItem.filter(item => item !== value);
    }
    this.setState({
      selectedItem: this.state.selectedItem,
    });
  }
  render() {
    const { options = [], selectedItem = [] } = this.state;
    const { theme, handleThemeChange, name, icon } = this.props;
    return (
      <React.Fragment>
        <li key="SystemSetting" onClick={() => { this.openModal(); }} >
          <span className="m-handle-icon"><i className={`iconfont ${icon || 'icon-nearby'}`} /></span>
          <span className="m-handle-text">
            <div>
              <div>系统设置</div>
            </div>
          </span>
        </li>
        <BasicModal
          isAllWindow={1}
          style={{ top: '10rem', overflowY: 'auto' }}
          width="78rem"
          destroyOnClose
          title="系统设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.closeModal}
        >
          <SettingContent options={options} selectedItem={selectedItem} handleItemChange={this.handleItemChange} name={name} handleThemeChange={handleThemeChange} theme={theme} />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default SystemSetting;
