// 已脱敏的 ai-config：请通过环境变量配置 API Key
const AI_PROVIDERS = {
  IFLOW: {
    baseUrl: process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1',
    endpoints: {
      chat: process.env.IFLOW_CHAT_PATH || '/chat/completions',
      models: process.env.IFLOW_MODELS_PATH || '/models'
    },
    models: {
      IFLOW_TSTARS: process.env.IFLOW_MODEL || 'tstars2.0'
    }
  }
};

module.exports = { AI_PROVIDERS };
