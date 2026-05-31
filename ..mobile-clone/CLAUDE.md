# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

抖音图文带货生成器 — 纯前端 Vue 3 单页应用。用户上传商品图片 → AI 识别并生成微信聊天风格的带货文案 → 截图导出为 PNG。

## 常用命令

```bash
npm run dev       # 启动 Vite 开发服务器 (localhost:5173)
npm run build     # vue-tsc 类型检查 + Vite 生产构建
npm run preview   # 预览生产构建
```

## 架构

```
App.vue
├── LeftPanel.vue              # 左侧操作区（图片上传/配置/生成按钮）
│   ├── ImageUploader.vue      #   拖拽上传 + 压缩 + 缩略图
│   ├── ConfigSelector.vue     #   模型/模式/风格选择
│   ├── GenerateButton.vue     #   生成按钮（含 loading/error 状态）
│   └── SettingsModal.vue      #   API Key 配置弹窗 (Teleport to body)
└── RightPanel.vue             # 右侧预览区
    ├── ChatPreview.vue        #   iPhone 16 Pro Max 外框 + 微信聊天窗
    │   ├── ChatBubble.vue     #     消息气泡（含三角指针/头像/动画）
    │   └── ChatInput.vue      #     底部输入栏（微信风格）
    └── ExportButton.vue       #   html2canvas 导出 PNG
```

**Stores（Pinia）：**
- `stores/config.ts` — 全局配置（API Keys、模型选择、模式、风格、昵称），localStorage 持久化
- `stores/chat.ts` — 聊天状态（消息列表、生成状态、商品信息、图片队列）

**工具函数：**
- `utils/api.ts` — OpenAI-compatible API 调用（Vision + Chat），从 config store 读取 endpoint/key/model
- `utils/prompt.ts` — 系统提示词模板组装（三种风格 × 两种模式）
- `utils/image.ts` — 图片压缩（1024px 上限）、Base64 转换
- `utils/avatar.ts` — 头像随机分配（每次生成重新随机，同次生成内同 speaker 一致），`getMyAvatar()` 返回固定头像

## API 代理

Vite 开发服务器代理 `src/utils/api.ts` 中的请求路径：

| 前端路径 | 代理目标 |
|----------|----------|
| `/api/qwen` | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `/api/openai` | `https://api.openai.com/v1` |

自定义 provider 不走代理，直接使用用户填写的完整 endpoint。

## 关键约定

- 所有样式使用 Tailwind 类，无 `<style scoped>` 块
- 消息类型：`text` / `image` / `timestamp`，role 决定左右对齐（`user` = 右侧绿色气泡）
- 头像放在 `public/avatars/` 下，`avatar.ts` 中的 `AVATAR_FILES` 数组需要与实际文件名同步
- 导出使用 `html2canvas`，目标元素带 `.chat-preview-container` 类
- 状态栏时间可在设置弹窗中编辑（`statusBarTime` 字段）
