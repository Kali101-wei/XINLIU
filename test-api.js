// debug-api.js - 详细的调试版本
const fetch = require('node-fetch');
const https = require('https');
require('dotenv').config();

// 优先从环境变量读取 API Key （安全做法）
const API_KEY = process.env.IFLOW_API_KEY || process.env.API_KEY || 'sk-044ef75690b3236799421166537a8e88';
const BASE_URL = 'https://apis.iflow.cn/v1';

async function debugRequest() {
  console.log('🔍 详细调试API请求...\n');
  
  // 创建自定义的agent来忽略SSL证书问题（如果有的话）
  const agent = new https.Agent({
    rejectUnauthorized: false // 仅用于调试，生产环境不要这样
  });
  
  const requestBody = {
    model: 'tstars2.0',
    messages: [
      {
        role: 'user',
        content: 'hi'
      }
    ],
    max_tokens: 10
  };
  
  console.log('📦 请求数据:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  console.log('\n🌐 请求配置:');
  console.log(`URL: ${BASE_URL}/chat/completions`);
  console.log(`方法: POST`);
  console.log(`Headers:`);
  console.log(`  Content-Type: application/json`);
  console.log(`  Authorization: Bearer ${API_KEY.substring(0, 10)}...`);
  
  try {
    if (!process.env.IFLOW_API_KEY && !process.env.API_KEY) {
      console.warn('\n⚠️  当前没有通过环境变量提供 API Key，正在使用内置的默认 key（不推荐在公共仓库中保存密钥）。');
    } else {
      console.log('\n✅  使用环境变量中的 API Key 进行请求（已隐藏显示）。');
    }
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'x-biz-info': 'test-request'
      },
      body: JSON.stringify(requestBody),
      agent: agent // 使用自定义agent
    });
    
    console.log('\n📥 响应信息:');
    console.log(`状态码: ${response.status}`);
    console.log(`状态文本: ${response.statusText}`);
    
    console.log('\n📋 响应Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const responseText = await response.text();
    console.log('\n📝 响应体 (原始文本):');
    console.log(responseText);
    
    try {
      const jsonData = JSON.parse(responseText);
      console.log('\n📊 响应体 (JSON解析):');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (response.ok) {
        console.log('\n✅ 请求成功！');
      } else {
        console.log('\n❌ 请求失败！');
      }
    } catch (jsonError) {
      console.log('\n⚠️  响应不是有效的JSON格式');
    }
    
  } catch (error) {
    console.error('\n❌ 请求异常:');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    if (error.code) {
      console.error('错误代码:', error.code);
    }
  }
}

// 运行调试
debugRequest();