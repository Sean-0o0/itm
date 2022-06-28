import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { basicservices: {
  messageSendStrategy,
  staffMessageQuota,
  messageSendChannel,
  cusMessageSendList,
  messageBatchList,
  messageBatchAdtBoxList,
  messageBatchDtl,
  messageBatchNum,
  messageBatchAdtboxNum,
  messageSndDtl,
  messageSndDtlDSC,
  messageBatchRvw,
  draftSend,
  queryShortMessageChannel,
} } = api;

// 消息中心 获取发送策略列表
export async function getMessageSendStrategy(payload) {
  const option = {
    url: messageSendStrategy,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心 获取员工短信配额度
export async function getStaffMessageQuota(payload) {
  const option = {
    url: staffMessageQuota,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心 获取发送渠道列表
export async function getMessageSendChannel(payload) {
  const option = {
    url: messageSendChannel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心 获取客户消息发送记录(当前/历史)
export async function getCusMessageSendList(payload) {
  const option = {
    url: cusMessageSendList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心 获取消息批次列表(发件箱/已发送/草稿箱)
export async function getMessageBatchList(payload) {
  const option = {
    url: messageBatchList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心 获取发送批次列表(审核箱)
export async function getMessageBatchAdtBoxList(payload) {
  const option = {
    url: messageBatchAdtBoxList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心  获取发送批次详细信息
export async function getMessageBatchDtl(payload) {
  const option = {
    url: messageBatchDtl,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  获取消息批次数(发件箱/已发送/草稿箱)
export async function getMessageBatchNum(payload) {
  const option = {
    url: messageBatchNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  获取消息批次数(审核箱)
export async function getMessageBatchAdtboxNum(payload) {
  const option = {
    url: messageBatchAdtboxNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  获取消息发送明细
export async function getMessageSndDtl(payload) {
  const option = {
    url: messageSndDtl,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  获取消息发送明细-DSC
export async function getMessageSndDtlDSC(payload) {
  const option = {
    url: messageSndDtlDSC,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  消息批次审核操作
export async function messageBatchRvwFunc(payload) {
  const option = {
    url: messageBatchRvw,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心  删除中转附件
export async function DeletMessageFile(url) {
  const option = {
    url,
    method: 'delete',
    data: '',
  };
  return request(option);
}

// 消息中心  获取附件
export async function getMessageFile(url) {
  const option = {
    url,
    method: 'get',
    data: '',
  };
  return request(option);
}
export async function MessageDraftSend(payload) {
  const option = {
    url: draftSend,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 消息中心  获取短信通道
export async function QueryShortMessageChannel(payload) {
  const option = {
    url: queryShortMessageChannel,
    method: 'post',
    data: payload,
  };
  return request(option);
}