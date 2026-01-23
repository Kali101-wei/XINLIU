// 简单的心流AI配置示例
const API_CONFIG = {
  production: {
    IFLOW_API_KEY: 'sk-b6eaccfb21aba1c93ec5b36214266bca'
  },
  development: {
    IFLOW_API_KEY: 'sk-b6eaccfb21aba1c93ec5b36214266bca'
  }
};

const AI_PROVIDERS = {
  IFLOW: {
    // 官方 OpenAI Base URL（由你提供）
    baseUrl: process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1',
    // endpoints 不应重复包含 /v1，因为 baseUrl 已包含版本前缀
    endpoints: {
      chat: process.env.IFLOW_CHAT_PATH || '/chat/completions',
      models: process.env.IFLOW_MODELS_PATH || '/models'
    },
    models: {
      IFLOW_TSTARS: process.env.IFLOW_MODEL || 'tstars2.0'
    }
  }
};

module.exports = {
  AI_PROVIDERS,
  API_CONFIG
};

