/**
 * 修正后的测试脚本
 */
const fetch = require('node-fetch');

// 使用正确的 API 密钥
const API_KEY = 'sk-044ef75690b3236799421166537a8e88';

async function testSimple() {
  console.log(' 开始测试 iFlow API...\n');

  try {
    console.log(' 构建请求...');
    const requestBody = {
      model: 'tstars2.0',  // 正确的模型名称
      messages: [
        { role: 'user', content: '写一个快速排序算法的 Python 实现' }
      ],
      stream: false,
      max_tokens: 1000,
      temperature: 0.7
    };

    console.log('请求体:', JSON.stringify(requestBody, null, 2));

    console.log(' 发送请求...');
    const response = await fetch('https://apis.iflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'x-biz-info': 'test-request'  // 必须的头
      },
      body: JSON.stringify(requestBody),
      timeout: 30000  // 30秒超时
    });

    console.log(` 收到响应，状态码: ${response.status}\n`);

    // 获取原始响应文本
    const responseText = await response.text();
    console.log('原始响应文本:', responseText);

    if (!response.ok) {
      console.log(` HTTP 错误 ${response.status}: ${response.statusText}`);
      console.log('错误详情:', responseText);
      return;
    }

    // 解析 JSON
    const data = JSON.parse(responseText);
    
    console.log(' 解析 JSON 响应...\n');
    console.log('完整响应结构:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n 提取结果...\n');
    
    if (data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      console.log(' 调用成功！\n');
      
      if (choice.message) {
        console.log('AI 回复:');
        console.log(choice.message.content);
        
        console.log(`\n完成原因: ${choice.finish_reason}`);
      } else {
        console.log(' 响应中没有 message 字段');
        console.log('Choice 内容:', choice);
      }
    } else {
      console.log(' 响应中没有 choices 或 choices 为空');
    }

    // 显示使用统计
    if (data.usage) {
      console.log(`\n Token 统计:`);
      console.log(`  - 输入 (prompt): ${data.usage.prompt_tokens}`);
      console.log(`  - 输出 (completion): ${data.usage.completion_tokens}`);
      console.log(`  - 总计 (total): ${data.usage.total_tokens}`);
    }

    // 显示扩展信息（如果有）
    if (data.extend_fields) {
      console.log(`\n 扩展字段:`);
      console.log(`  - traceId: ${data.extend_fields.traceId}`);
      console.log(`  - requestId: ${data.extend_fields.requestId}`);
    }

  } catch (error) {
    console.log(` 异常错误: ${error.message}`);
    console.log('\n堆栈信息:');
    console.log(error.stack);
  }

  console.log('\n========== 测试完成 ==========\n');
}

// 运行测试
testSimple();
