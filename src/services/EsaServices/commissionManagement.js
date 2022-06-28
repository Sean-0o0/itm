import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    operateRoyaltyFormula, operateRoyaltyTemplate, queryInfoRoyaltyFormulaParam, queryInfoRoyaltyFormulaVariable,
    queryInfoRoyaltyTemplate, queryListRoyaltyFormula, operateRoyaltyFormulaIndicator, operateSubjectData, operateSubjectDataDetail,
    querySubjectDataList, queryInfoSubjectData, operateDataTemplateField, operateExamineItem,queryListExamineItems,queryListExamineItemFormula,
    operateExamineItemFormula, queryOrgSalaryFormulaConf, queryIndicators, queryDataTemplateField
  } } = api;
/* =================提成公式定义=================== */
// 操作提成公式定义
export async function FetchOperateRoyaltyFormula(payload = {}) {
  const option = {
    url: operateRoyaltyFormula,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 操作提成公式模板
export async function FetchOperateRoyaltyTemplate(payload = {}) {
  const option = {
    url: operateRoyaltyTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询提成公式定义_变量(查询参数列表描述)
export async function FetchQueryInfoRoyaltyFormulaParam(payload = {}) {
  const option = {
    url: queryInfoRoyaltyFormulaParam,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询提成公式变量
export async function FetchQueryInfoRoyaltyFormulaVariable(payload = {}) {
  const option = {
    url: queryInfoRoyaltyFormulaVariable,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询提成模板
export async function FetchQueryInfoRoyaltyTemplate(payload = {}) {
  const option = {
    url: queryInfoRoyaltyTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询提成公式定义列表
export async function FetchQueryListRoyaltyFormula(payload = {}) {
  const option = {
    url: queryListRoyaltyFormula,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 设置拆分指标
export async function FetchOperateRoyaltyFormulaIndicator(payload = {}) {
  const option = {
    url: operateRoyaltyFormulaIndicator,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 主题数据配置
export async function FetchOperateSubjectData(payload = {}) {
  const option = {
    url: operateSubjectData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 主题数据明细配置
export async function FetchOperateSubjectDataDetail(payload = {}) {
  const option = {
    url: operateSubjectDataDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 主题数据查询
export async function FetchQuerySubjectDataList(payload = {}) {
  const option = {
    url: querySubjectDataList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 主题数据明细查询
export async function FetchQueryInfoSubjectData(payload = {}) {
  const option = {
    url: queryInfoSubjectData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 导入数据模板字段维护
export async function FetchoperateDataTemplateField(payload = {}) {
  const option = {
    url: operateDataTemplateField,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考核项维护
export async function FetchoperateExamineItem(payload = {}) {
  const option = {
    url: operateExamineItem,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 考核项查询
export async function FetchqueryListExamineItems(payload = {}) {
  const option = {
    url: queryListExamineItems,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 考核项公式查询
export async function FetchqueryListExamineItemFormula(payload = {}) {
  const option = {
    url: queryListExamineItemFormula,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 考核项公式定义查询
export async function FetchoperateExamineItemFormula(payload = {}) {
  const option = {
    url: operateExamineItemFormula,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 机构考核薪酬项公式配置项目查询
export async function FetchqueryOrgSalaryFormulaConf(payload = {}) {
  const option = {
    url: queryOrgSalaryFormulaConf,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 机构考核指标查询
export async function FetchqueryIndicators(payload = {}) {
  const option = {
    url: queryIndicators,
    method: 'post',
    data: payload,
  }
  return request(option);
}

// 外部数据查询
export async function FetchqueryDataTemplateField(payload = {}) {
  const option = {
    url: queryDataTemplateField,
    method: 'post',
    data: payload,
  }
  return request(option);
}