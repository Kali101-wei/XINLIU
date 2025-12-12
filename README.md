# IFlow Node 服务

这是一个简单的 Node.js 服务，封装了心流 AI（IFlow）免费模型的调用，提供 HTTP 接口：

- `GET /api/iflow/test` — 测试 API Key 与服务连通性
- `POST /api/iflow/call` — 调用模型，JSON 请求体：`{ functionType, userInput }`

快速开始：

1. 安装依赖：

```powershell
npm install
```

2. 复制并编辑环境变量：

```powershell
cp .env.example .env
# 在 .env 中填写 IFLOW_API_KEY 等
```

3. 启动服务：

```powershell
npm start
```

示例调用：

```powershell
curl -X POST http://localhost:3000/api/iflow/call -H "Content-Type: application/json" -d "{ \"functionType\": \"writing\", \"userInput\": \"请帮我写一段产品简介\" }"
```
