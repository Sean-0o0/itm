import React from 'react';
import { Modal, message } from 'antd';
import { FetchOperateRoyaltyFormula } from '../../../../../../../services/EsaServices/commissionManagement';

class Delete extends React.Component {
    handleDelete = () => {
      const { versionId = '',st } = this.props;
      if (st === '1') {
        message.error('上架后禁止操作！')
        return false;
      }
      const _this = this;
      Modal.confirm({
        content: '是否确认删除?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const { gsid = '', refresh } = _this.props;
          FetchOperateRoyaltyFormula({
            calFmla: '',
            fmlaDesc: '',
            fmlaId: gsid,
            fmlaName: '',
            oprType: 3, // 1|新增;2|修改;3|删除
            paramDefine: '',
            remk: '',
            settType: 0,
            tmplType: 0,
            valMode: 0,
            versionId,
          }).then((result) => {
            const { note = '' } = result;
            message.success(note);
            if (refresh) {
              refresh();
            }
          }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
          });
        },
        onCancel() {
        },
      });
    }

    render() {
      const { st } = this.props;
      return (
        <a style={{ display: st === '2' ? 'none' : '' }} className="m-pay-delete" onClick={() => this.handleDelete()}><i className="iconfont icon-shanchu" /></a>
      );
    }
}

export default Delete;
