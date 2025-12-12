const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const { callIFlowFreeModel, testIFlowConnection } = require('./iflow');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.get('/api/iflow/test', async (req, res) => {
  const result = await testIFlowConnection();
  if (result.success) {
    res.json({ success: true, message: result.message });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
});

app.post('/api/iflow/call', async (req, res) => {
  const { functionType, userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ success: false, error: '参数 userInput 必填' });
  }

  try {
    const result = await callIFlowFreeModel(functionType || 'default', userInput);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : '未知错误' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`IFlow service running on http://localhost:${port}`);
});
