> ⚠️ 远期规划文档 —— 以下模块化管线（persona_generator / emotion_engine / conflict_engine / humanizer / ai_detector / dialogue_renderer）当前版本通过提示词工程实现，尚未拆分为独立代码模块。

请严格按照 prompt.md 的规则执行。
要求：

1. 支持输入：
- 产品
- 产品卖点
- 用户人群
- 平台（抖音/小红书）
- 对话关系
- 情绪类型

2. 自动生成：
- 人设
- 生活场景
- 情绪推进
- 冲突感
- 产品自然植入
- 去AI味处理

3. 输出格式：
- 可直接用于抖音图文
- 微信聊天截图格式
- 一页一句
- 高情绪密度

4. 增加：
“AI感检测器”

自动检查：
- 是否像广告
- 是否像客服
- 是否过于完整
- 是否太像AI

如果AI感过高：
自动重写。

5. 使用模块化结构开发：
- persona_generator
- emotion_engine
- conflict_engine
- humanizer
- ai_detector
- dialogue_renderer

6. 使用可扩展架构，
后期方便加入：
- 爆款拆解
- 评论区模仿
- 平台语感学习
- 用户画像训练

先输出：
项目架构设计
不要直接开始写代码。