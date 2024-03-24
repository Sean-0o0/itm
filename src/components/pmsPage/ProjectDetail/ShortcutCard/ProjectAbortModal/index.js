import React, { useEffect, useState } from 'react';
import { Button, Table, message, Modal, Spin, Tooltip, Empty } from 'antd';
import moment from 'moment';
import { CreateOperateHyperLink } from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import Lodash from 'lodash'

/**
 * 项目终止窗口
 * @param {*} props 
 * @returns 
 */
export default function ProjectAbortModal(props) {

  const { prjBasic,
    xmid,  //项目ID
    getPrjDtlData, // 刷新页面数据
    modalVisible,
    setModalVisible
  } = props;

  const {
    XMJLID, //项目经理ID
  } = prjBasic

  /** livebos的URL */
  const [url, setUrl] = useState('')

  /**
   * 解析liveBos
   * @param {*} objName  liveBos对象名
   * @param {*} oprName  liveBos方法名
   * @param {*} data     liveBos参数列表
   * @returns 
   */
  const getLivebosParams = (objName, oprName, data) => {
    return {
      attribute: 0,
      authFlag: 0,
      objectName: objName,
      operateName: oprName,
      parameter: data,
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
  };

  /** 获取Livebos弹窗链接 */
  const initialHandle = async () => {

    const queryParams = getLivebosParams('LC_XMZZ', 'LC_XMZZ_ZZFQ', [
      {
        name: 'XMMC',      //项目名称
        value: Number(xmid),
      },
      {
        name: 'XMJL',      //项目经理ID
        value: Number(XMJLID),
      },
      {
        name: 'SFFQLX',  //是否发起立项 1是 2否
        value: 1,
      },
      {
        name: 'ZZSM',  //终止说明
        value: '',
      },
      {
        name: 'FQR',   //传项目经理ID
        value: Number(XMJLID),
      },
    ])
    try {
      const res = await CreateOperateHyperLink(queryParams)
      const { code, message, url } = res;
      if (res.code === 1) {
        setUrl(url)
      }
    }
    catch (err) {
      console.error(!err.success ? err.message : err.note);
      message.error('链接获取失败', 1);
    }

  }

  useEffect(() => {
    initialHandle()
  }, [])

  const modalProps = {
    isAllWindow: 1,
    title: '项目终止',
    width: '600px',
    height: '520px',
    style: { top: '60px' },
    visible: modalVisible.projectAbort,
    footer: null,
  };

  return (
    <div>
      <BridgeModel
        modalProps={modalProps}
        onSucess={() => {
          message.success('操作成功', 1);
          setModalVisible((val) => {
            return {
              ...val,
              projectAbort: false
            }
          })
          getPrjDtlData()
        }}
        onCancel={() => {
          setModalVisible((val) => {
            return {
              ...val,
              projectAbort: false
            }
          })
        }}
        src={url}
      />


    </div>
  )
}
