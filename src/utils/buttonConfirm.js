// 操作按钮确认弹框
// import { Modal } from 'antd';

export default function confirmOk(_this, ...props) {
  // const { selectedCount = 0 } = _this.props;
  // if (selectedCount >= 1000) {
  //   Modal.confirm({
  //     title: '操作确认',
  //     content: '所选客户数大于1000，确定要继续当前操作吗？',
  //     onOk() {
  //       _this.handleOk(...props);
  //     },
  //     cancelText: '取消',
  //     okText: '确认',
  //   });
  // } else {
  _this.handleOk(...props);
  // }
}
