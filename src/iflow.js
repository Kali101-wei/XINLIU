const fetch = require('node-fetch');
const { AI_PROVIDERS, API_CONFIG } = require('./ai-config');



const selectOptimalIFlowModel = (functionType) => {
  const { IFLOW } = AI_PROVIDERS;
  const baseModel = IFLOW.models.IFLOW_TSTARS;

  switch (functionType) {
    case 'ppt':
      return { model: baseModel, reasoning: 'PPT制作任务使用TStars 2.0模型，高性能适合复杂推理和专业内容创作，完全免费' };
    case 'translate':
      return { model: baseModel, reasoning: '翻译任务使用TStars 2.0模型，平衡性能与准确性，适合语言处理任务，完全免费' };
    case 'writing':
      return { model: baseModel, reasoning: '写作任务使用TStars 2.0模型，支持长文本生成和创意写作，完全免费' };
    case 'code':
      return { model: baseModel, reasoning: '编程任务使用TStars 2.0模型，支持代码生成和优化，完全免费' };
    case 'document':
      return { model: baseModel, reasoning: '文档处理任务使用TStars 2.0模型，平衡的文本处理能力，适合总结和整理，完全免费' };
    case 'assistant':
      return { model: baseModel, reasoning: '智能助手任务使用TStars 2.0模型，优化了交互质量和对话体验，完全免费' };
    case 'analysis':
      return { model: baseModel, reasoning: '数据分析任务使用TStars 2.0模型，强大的推理能力适合复杂分析，完全免费' };
    default:
      return { model: baseModel, reasoning: '通用任务使用TStars 2.0模型，平衡的性能和适用性，完全免费' };
  }
};

const getSystemPrompt = (functionType) => {
  switch (functionType) {
    case 'ppt':
      return `你是一个专业的PPT制作助手。你擅长将用户的主题转化为结构化、有逻辑性的演示文稿大纲。\n要求：\n1. 提供清晰的章节结构和内容要点\n2. 确保内容逻辑连贯，层次分明\n3. 包含引言、主体和结论部分\n4. 为每一页提供具体的建议内容\n5. 突出重点，便于演示和理解`;
    case 'translate':
      return `你是一个专业的翻译助手。请准确、流畅地进行多语言翻译。\n要求：\n1. 保持原文的语气和风格\n2. 确保专业术语翻译准确\n3. 语句通顺自然\n4. 上下文连贯一致\n5. 如有歧义，提供最可能的翻译选项`;
    case 'writing':
      return `你是一个专业的写作助手。你擅长各种文体的创作和优化。\n要求：\n1. 根据用户需求进行创作或优化\n2. 确保内容结构清晰，逻辑性强\n3. 语言表达准确、生动\n4. 符合目标读者的阅读习惯\n5. 提供有创意的内容和建议`;
    case 'code':
      return `你是一个专业的编程助手。你擅长多种编程语言的代码开发、调试和优化。\n要求：\n1. 提供准确、可执行的代码\n2. 遵循编程最佳实践和规范\n3. 包含必要的注释和说明\n4. 考虑代码的性能和安全性\n5. 提供完整的解决方案或实现思路`;
    case 'document':
      return `你是一个专业的文档处理助手。你擅长文档总结、信息提取和内容整理。\n要求：\n1. 准确理解文档内容的核心要点\n2. 提供清晰、结构化的总结\n3. 提取关键信息和数据\n4. 保持信息的准确性和完整性\n5. 便于用户快速理解和应用`;
    case 'assistant':
      return `你是一个全能的AI智能助手。你能够帮助用户解决各种问题和提供专业建议。\n要求：\n1. 认真理解用户的问题和需求\n2. 提供准确、有用的信息和建议\n3. 思考全面，考虑不同的可能性\n4. 沟通友好，表达清晰\n5. 尽最大能力帮助用户解决问题`;
    case 'analysis':
      return `你是一个专业的数据分析助手。你擅长数据洞察、趋势分析和逻辑推理。\n要求：\n1. 深入分析所给的数据和问题\n2. 提供有价值的洞察和结论\n3. 识别关键模式和趋势\n4. 用数据支撑分析和观点\n5. 提供可行的建议和方案`;
    default:
      return `你是一个专业的AI助手。请根据用户的需求提供准确、有用的帮助。\n要求：\n1. 理解用户的真实需求\n2. 提供相关和准确的信息\n3. 表达清晰，逻辑性强\n4. 保持专业和友好的态度\n5. 尽最大能力解决用户的问题`;
  }
};

const callIFlowFreeModel = async (functionType, userInput) => {
  try {
    if (!userInput || userInput.trim().length === 0) {
      return { success: false, error: '输入内容不能为空，请输入有效的文本内容后再试。' };
    }

    const apiKey = 'sk-044ef75690b3236799421166537a8e88';
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

    // 直接使用官方完整 URL
    const url = 'https://apis.iflow.cn/v1/chat/completions';

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
      switch (response.status) {
        case 400:
          return { success: false, error: `请求参数错误: ${errorData.error?.message || '请检查输入格式和内容'}` };
        case 401:
          return { success: false, error: 'API密钥无效，请检查心流AI API密钥配置' };
        case 429:
          return { success: false, error: '请求频率过高，请稍后重试。心流AI免费模型有频率限制' };
        case 500:
          return { success: false, error: '心流AI服务器内部错误，请稍后重试' };
        default:
          return { success: false, error: `请求失败，HTTP状态码: ${response.status}，错误信息: ${errorData.error?.message || '未知错误'}` };
      }
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (!aiResponse) {
      return { success: false, error: '心流AI返回了空的内容，请重试或换个问题试试' };
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
    if (error instanceof Error) {
      if (error.message.includes('API密钥')) {
        return { success: false, error: '心流AI API密钥未配置或无效，请检查环境变量 IFLOW_API_KEY' };
      }
      if (error.message.includes('Failed to fetch')) {
        return { success: false, error: '网络请求失败，请检查网络连接后重试' };
      }
      if (error.message.includes('timeout')) {
        return { success: false, error: '请求超时，请稍后重试或简化输入内容' };
      }
      return { success: false, error: `心流AI处理失败: ${error.message}` };
    }
    return { success: false, error: '心流AI处理过程中发生未知错误，请重试' };
  }
};

const testIFlowConnection = async () => {
  try {
    const apiKey = 'sk-044ef75690b3236799421166537a8e88';
    // 用简单的 chat 请求来测试连接（跳过 /models 端点）
    const url = 'https://apis.iflow.cn/v1/chat/completions';
    const testData = {
      model: 'tstars-2.0',
      messages: [{ role: 'user', content: '你好' }],
      max_tokens: 10
    };
    
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
    if (testResponse.ok) {
      return { success: true, message: '✅ 心流AI连接测试成功，API密钥有效，可以使用免费模型' };
    } else {
      const errorText = await testResponse.text();
      return { success: false, message: `❌ 心流AI连接测试失败 (HTTP ${testResponse.status}): ${errorText || '请检查API密钥和网络连接'}` };
    }
  } catch (error) {
    return { success: false, message: `❌ 心流AI连接测试失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
};

module.exports = {
  callIFlowFreeModel,
  testIFlowConnection
};
