import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    queryHrPrfmStsSchd,
    queryHrPrfmScoreRslt,
    operateHrPrfmScorePsrv,
    queryScorType,
    queryExamTotal,
    queryExamResult,
    operateDataImport,
    queryTmplDetail,
    operateHrPrfmScorePsrvSpecial,
  }
} = api;

// 考评状态进度查询
export async function FetchQueryHrPrfmStsSchd(payload = {}) {
  const option = {
    url: queryHrPrfmStsSchd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考评打分结果查询
export async function FetchQueryHrPrfmScoreRslt(payload = {}) {
  const option = {
    url: queryHrPrfmScoreRslt,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考评结果得分保存操作
export async function FetchOperateHrPrfmScorePsrv(payload = {}) {
  const option = {
    url: operateHrPrfmScorePsrv,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 打分类型表查询
export async function FetchQueryScorType(payload = {}) {
  const option = {
    url: queryScorType,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 打分类型表查询
export async function FetchqueryExamTotal(payload = {}) {
  const option = {
    url: queryExamTotal,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 打分类型表查询
export async function FetchqueryExamResult(payload = {}) {
  const option = {
    url: queryExamResult,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考核数据导入
export async function FetchoperateDataImport(payload = {}) {
  const option = {
    url: operateDataImport,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 模板明细查询
export async function FetchqueryTmplDetail(payload = {}) {
  const option = {
    url: queryTmplDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考评结果得分保存操作
export async function FetchOperateHrPrfmScorePsrvSpecial(payload = {}) {
  const option = {
    url: operateHrPrfmScorePsrvSpecial,
    method: 'post',
    data: payload,
  };
  return request(option);
}
