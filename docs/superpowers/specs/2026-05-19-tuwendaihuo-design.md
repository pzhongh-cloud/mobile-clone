# 抖音图文带货生成器 - 设计规格

**日期**: 2026-05-19  
**版本**: v1.0 (MVP)

---

## 一、项目概述

一款 Web 应用，帮助用户快速生成抖音图文带货素材。用户上传商品图片 → AI 识别图中商品 → 生成好物安利文案 → 以微信聊天框形式呈现 → 截图或导出图片用于抖音发布。

## 二、技术选型

| 层 | 技术 | 理由 |
|---|---|---|
| 构建 | Vite | 快速冷启动，默认支持 Vue 3 |
| 框架 | Vue 3 + TypeScript | 生态成熟，中文社区活跃 |
| 状态管理 | Pinia | Vue 3 官方推荐，轻量 |
| 样式 | Tailwind CSS | 快速还原微信 UI 细节 |
| 导出图片 | html2canvas | 将 DOM 元素渲染为 PNG |
| 路由 | 无 | 单页面应用，无需 vue-router |

## 三、架构

纯前端单页应用，无后端。

```
┌──────────────────────────────────────────────┐
│                   App.vue                     │
│  ┌──────────┐  ┌───────────────────────────┐ │
│  │ 左侧操作区 │  │      右侧预览区            │ │
│  │          │  │  ┌─────────────────────┐  │ │
│  │ 图片上传  │  │  │   微信聊天框预览      │  │ │
│  │ 模型选择  │  │  │   ChatPreview.vue   │  │ │
│  │ 模式/风格 │  │  │   多个 ChatBubble    │  │ │
│  │ 生成按钮  │  │  │                     │  │ │
│  └──────────┘  │  └─────────────────────┘  │ │
│                │  ┌─────────────────────┐  │ │
│                │  │   导出按钮           │  │ │
│                │  └─────────────────────┘  │ │
└──────────────────────────────────────────────┘
```

## 四、数据流

```
用户上传图片 → 压缩(最大 1024px) → FileReader 转 Base64
                                              ↓
用户点击"生成文案" → 组装 Prompt(系统提示词 + 模式 + 风格 + 图片 Base64)
                                              ↓
调用大模型 Vision API (用户配置的 Key + Endpoint)
                                              ↓
解析返回 JSON → 写入 chat store (消息列表)
                                              ↓
ChatPreview 监听 store → 渲染微信对话 → html2canvas 导出
```

用户不满意可在同一会话中追加文字指令，带上下文重新生成（无需重新上传图片）。

## 五、组件树

```
App.vue
├── SettingsModal.vue            # API Key 等设置弹窗
├── LeftPanel.vue                # 左侧操作区
│   ├── ImageUploader.vue        # 图片上传 + 拖拽 + 压缩 + 预览 + 删除
│   ├── ConfigSelector.vue       # 模型选择 | 模式选择 | 风格选择
│   └── GenerateButton.vue       # 生成 + 加载状态 + 重试
└── RightPanel.vue               # 右侧预览区
    ├── ChatPreview.vue          # 微信聊天框容器 (可滚动)
    │   ├── ChatBubble.vue       # 消息气泡 (多类型渲染)
    │   └── ChatInput.vue        # 追加指令输入框 (微调文案/重新生成)
    └── ExportButton.vue         # 导出 PNG 按钮
```

Stores:
- `stores/config.ts` — 当前模型、模式、风格、API Keys (localStorage 持久化)
- `stores/chat.ts` — 消息列表、生成状态 (loading/error/idle)、商品信息

## 六、微信聊天框 UI 规格

### 6.1 单人模式
- 对话外观：头像 + 昵称 + 消息气泡
- 昵称可自定义（默认"好物安利菌"）
- 对方消息：灰底黑字，左对齐
- 我的回复：绿底白字，右对齐
- 时间戳分隔线居中

### 6.2 双人模式
- 群聊外观：顶部群名 + 多人消息
- 两个角色名称头像可自定义（默认 🌸小美 / 🍊橙子）
- 两个角色消息交替出现
- 颜色区分两个角色（不同灰度的气泡）

### 6.3 消息类型
- 文字消息 — 核心载体
- 图片消息 — 商品图穿插在对话中
- Emoji 表情 — 增强真实感
- 时间戳分隔线 — 营造对话自然节奏
- (后期可加语音条样式)

### 6.4 样式参考
- 背景：微信灰 #EDEDED
- 对方气泡：#FFFFFF 白色，圆角 4px 12px 12px 4px
- 我方气泡：#95EC69 微信绿，圆角 12px 4px 4px 12px
- 昵称字号：12px 灰色 #8E8E93
- 消息字号：15px #000
- 时间戳：11px #B0B0B0

## 七、AI Prompt 设计

### 7.1 系统提示词模板

系统提示词要求模型返回结构化 JSON：

```json
{
  "product": {
    "name": "商品名称",
    "highlights": ["卖点1", "卖点2", "卖点3"]
  },
  "messages": [
    {"role": "assistant", "type": "text", "content": "消息内容"},
    {"role": "assistant", "type": "image", "content": "图片描述(占位)"},
    {"role": "user", "type": "text", "content": "消息内容"}
  ]
}
```

- messages 数组中的 role 对应聊天框中的发言角色
- type 决定渲染为文字气泡还是图片消息
- 系统提示词会根据用户选择的模式和风格动态拼接

### 7.2 模式 Prompt 差异
- 单人模式：只生成一个角色(assistant)的安利消息，穿插 user 简短回复
- 双人模式：生成两个角色的对话，交替发言，自然引出好物推荐

### 7.3 风格 Prompt 差异
- 自然安利：口语化、emoji 多、语气词多、像朋友聊天
- 专业种草：突出参数/卖点/对比/使用场景、条理清晰
- 简短神评：每条消息 1-2 句，金句密度高

## 八、模型支持

默认支持以下模型配置（用户填入 Key 后可用）：

| 模型提供商 | API Endpoint (可配置) | 默认模型 |
|---|---|---|
| DeepSeek | https://api.deepseek.com/chat/completions | deepseek-chat |
| 通义千问 | https://dashscope.aliyuncs.com/compatible-mode/v1 | qwen-vl-max |
| OpenAI | https://api.openai.com/v1 | gpt-4o |
| 自定义 | 用户自行填写 | 用户自行填写 |

所有模型统一使用 OpenAI-compatible API 格式调用。

## 九、错误处理

| 场景 | 处理方式 |
|---|---|
| API Key 未配置 | 提示用户先配置 Key，引导跳转设置弹窗 |
| API 调用失败 (网络/额度) | 展示错误信息，按钮变为"重试" |
| AI 返回非标准 JSON | 尝试容错解析，失败则提示重新生成 |
| 图片过大 | 上传时自动压缩至 1024px 宽，超过 20MB 拒绝 |
| 图片格式不支持 | 仅接受 PNG/JPG/WebP，其他格式提示错误 |
| 导出失败 | html2canvas 超时重试一次，仍失败提示用户截图 |

## 十、文件结构

```
tuwendaihuo/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   ├── SettingsModal.vue
│   │   ├── LeftPanel.vue
│   │   ├── ImageUploader.vue
│   │   ├── ConfigSelector.vue
│   │   ├── GenerateButton.vue
│   │   ├── RightPanel.vue
│   │   ├── ChatPreview.vue
│   │   ├── ChatBubble.vue
│   │   ├── ChatInput.vue
│   │   └── ExportButton.vue
│   ├── stores/
│   │   ├── config.ts
│   │   └── chat.ts
│   ├── utils/
│   │   ├── api.ts          # 模型 API 调用封装
│   │   ├── image.ts        # 图片压缩、Base64 转换
│   │   └── prompt.ts       # Prompt 模板组装
│   └── types/
│       └── index.ts        # TypeScript 类型定义
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-19-tuwendaihuo-design.md
```
