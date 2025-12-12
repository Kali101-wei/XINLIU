// 脱敏版本的调试脚本 — 不包含硬编码 API Key
const fetch = require('node-fetch');
const https = require('https');
require('dotenv').config();

const API_KEY = process.env.IFLOW_API_KEY || process.env.API_KEY;
const BASE_URL = 'https://apis.iflow.cn/v1';

if (!API_KEY) {
  console.warn('警告：未检测到 IFLOW_API_KEY 环境变量，若要执行请求请在本地设置 .env 或环境变量');
}

async function debugRequest() {
  console.log('详细调试API请求（脱敏）...');
  const agent = new https.Agent({ rejectUnauthorized: false });
  const requestBody = {
    model: 'tstars2.0',
    messages: [{ role: 'user', content: 'hi' }],
    max_tokens: 10
  };

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY || ''}`,
        'x-biz-info': 'test-request'
      },
      body: JSON.stringify(requestBody),
      agent: agent
    });

    console.log(`状态: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log('响应体:', text);
  } catch (error) {
    console.error('请求异常:', error && error.message ? error.message : error);
  }
}

// 运行调试
debugRequest();
