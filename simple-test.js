// 简化/脱敏的测试脚本 — 不包含硬编码 API Key
const fetch = require('node-fetch');

// 请在本地环境变量中设置 IFLOW_API_KEY，或者将其放在 .env 文件中
const API_KEY = process.env.IFLOW_API_KEY || process.env.API_KEY;
if (!API_KEY) {
  console.warn('警告：未检测到 IFLOW_API_KEY 环境变量，测试请求将不会成功（请在 .env 中配置）');
}

async function testSimple() {
  console.log('开始测试 iFlow API（已脱敏）...');
  try {
    const requestBody = {
      model: 'tstars2.0',
      messages: [
        { role: 'user', content: '写一个快速排序算法的 Python 实现' }
      ],
      stream: false,
      max_tokens: 1000,
      temperature: 0.7
    };

    const response = await fetch('https://apis.iflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY || ''}`,
        'Content-Type': 'application/json',
        'x-biz-info': 'test-request'
      },
      body: JSON.stringify(requestBody),
      timeout: 30000
    });

    console.log(`收到响应，状态码: ${response.status}`);
    const text = await response.text();
    console.log('响应文本:', text);
  } catch (err) {
    console.error('请求异常:', err && err.message ? err.message : err);
  }
}

// 运行测试
testSimple();
