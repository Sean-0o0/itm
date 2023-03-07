import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { QueryXWHYAFJ } from '../../../../services/pmsServices';

//提案附件
export default function AnnexExport(props) {
  const [visible, setVisible] = useState(false); //显示
  const { submitOperate, closeDialog } = props;
  const handleOk = () => {
    // setVisible(false);
    submitOperate();
    closeDialog();
  };
  const handleCancel = () => {
    QueryXWHYAFJ({})
      .then(res => {
        console.log('附件导出', res);
        let fileName = `信委会议案附件(${new moment().format('YYYYMMDD')}).xlsx`;
        var link = document.createElement('a');
        link.href = res;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        message.success('请求成功，正在导出中', 1);
      })
      .catch(e => {
        console.error('QueryXWHYAFJ', e);
      });
    closeDialog();
    //  setVisible(false);
  };
  return (
    <Modal visible={true} title="附件导出" onOk={handleOk} onCancel={handleCancel}>
      是否确认导出？
    </Modal>
  );
}
