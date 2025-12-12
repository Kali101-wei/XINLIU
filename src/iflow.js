const fetch = require('node-fetch');
const { AI_PROVIDERS } = require('./ai-config');

const selectOptimalIFlowModel = (functionType) => {
  const { IFLOW } = AI_PROVIDERS;
  const baseModel = IFLOW.models.IFLOW_TSTARS;

  switch (functionType) {
    case 'ppt':
      return { model: baseModel, reasoning: 'PPT 制作任务使用该模型' };
    case 'translate':
      return { model: baseModel, reasoning: '翻译任务使用该模型' };
    case 'writing':
      return { model: baseModel, reasoning: '写作任务使用该模型' };
    case 'code':
      return { model: baseModel, reasoning: '编程任务使用该模型' };
    case 'document':
      return { model: baseModel, reasoning: '文档处理任务使用该模型' };
    case 'assistant':
      return { model: baseModel, reasoning: '助手任务使用该模型' };
    case 'analysis':
      return { model: baseModel, reasoning: '数据分析任务使用该模型' };
    default:
      return { model: baseModel, reasoning: '通用任务使用该模型' };
  }
};

const getSystemPrompt = (functionType) => {
  // 保持原有 prompt 文本或按需修改
  return `你是一个专业的 AI 助手。请根据用户的需求提供帮助。`;
};

const callIFlowFreeModel = async (functionType, userInput) => {
  try {
    if (!userInput || userInput.trim().length === 0) {
      return { success: false, error: '输入内容不能为空' };
    }

    const apiKey = process.env.IFLOW_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return { success: false, error: '未配置心流 API 密钥，请设置环境变量 IFLOW_API_KEY' };
    }

    const { model, reasoning } = selectOptimalIFlowModel(functionType);

    const requestData = {
      model: model,
      messages: [
        { role: 'system', content: getSystemPrompt(functionType) },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      max_tokens: Math.min(2000, 8192),
      stream: false,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.5,
      n: 1,
      response_format: { type: 'text' }
    };

    const url = `${process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1'}${process.env.IFLOW_CHAT_PATH || '/chat/completions'}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-biz-info': 'test-request'
      },
      body: JSON.stringify(requestData),
      timeout: 30000
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: `请求失败，HTTP ${response.status}: ${errorData.error?.message || '未知错误'}` };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (!aiResponse) {
      return { success: false, error: 'AI 返回空结果' };
    }

    return {
      success: true,
      data: aiResponse,
      model: model,
      reasoning: reasoning,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined
    };

  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
};

const testIFlowConnection = async () => {
  try {
    const apiKey = process.env.IFLOW_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return { success: false, message: '未配置 IFLOW_API_KEY，无法测试连接' };
    }
    const url = `${process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1'}${process.env.IFLOW_CHAT_PATH || '/chat/completions'}`;
    const testData = { model: AI_PROVIDERS.IFLOW.models.IFLOW_TSTARS, messages: [{ role: 'user', content: '你好' }], max_tokens: 10 };
    const testResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-biz-info': 'test-request'
      },
      body: JSON.stringify(testData),
      timeout: 15000
    });
    if (testResponse.ok) return { success: true, message: '连接测试成功' };
    const text = await testResponse.text();
    return { success: false, message: `连接测试失败 (HTTP ${testResponse.status}): ${text}` };
  } catch (err) {
    return { success: false, message: `连接测试异常: ${err instanceof Error ? err.message : err}` };
  }
};

module.exports = { callIFlowFreeModel, testIFlowConnection };
