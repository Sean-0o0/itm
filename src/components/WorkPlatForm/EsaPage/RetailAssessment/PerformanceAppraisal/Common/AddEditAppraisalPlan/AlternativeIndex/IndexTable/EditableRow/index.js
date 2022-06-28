import React from 'react';
/**
 * 表格自定义行
 */
class EditableRow extends React.Component {
  render() {
    return (
      <tr {...this.props} >{this.props.children}</tr>
    );
  }
}
export default EditableRow;
