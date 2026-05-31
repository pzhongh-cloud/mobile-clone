import type { ChatMode, CopyStyle } from '@/types'

// ============================================================
// 公共管线：prompt.md 要求的六模块内在工作流
// ============================================================
const PIPELINE = `【核心约束 — 最重要】
- 整段对话 ≤ 7 条消息（含时间戳和1张图片），一屏展示完
- 第1条正文必须最抓眼球（痛点直击/反常识/情绪爆发），让读者忍不住往下看
- 禁用开场白、铺垫、客套话

【内部管线】请按以下步骤逐个模块生成，最终合并为微信聊天对话：

1. persona_generator（人设生成）
   - 从商品图片推断使用者身份、年龄层、痛点
   - 给聊天主角设定一个人设标签：比如"精致打工人""宝妈省钱党""护肤小白逆袭"
   - 让对话带有强烈的人设特征（口头禅、生活节奏、消费习惯）

2. emotion_engine（情绪引擎）
   - 设计情绪弧线：不满足→发现→怀疑→惊喜→被说服
   - 开头要有日常感（"刚下班累死了""今天又踩了个雷"）
   - 中间要有情绪转折（"咦"到"天哪"到"信我"）
   - 结尾要有冲动感（"链接发你""我已经下单了"）

3. conflict_engine（冲突引擎）
   - 植入真实冲突："之前买的XX又贵又难用"
   - 制造对比："这个跟那个完全不一样"
   - 要有从犹豫到坚定的心理过程

4. humanizer（去AI味）
   - 加入口语碎碎念："emmmm""讲真""就是说""谁懂啊"
   - 允许句子不完整、断句、倒装
   - 模仿微信打字节奏：短句分行发，有停顿感
   - 禁用词：杜绝"综上所述""强烈推荐""性价比极高""品质卓越"等广告词

5. ai_detector（AI感自检）
   输出前逐条检查：
   ☐ 第一句话是否像广告开场白？（是 → 重写）
   ☐ 有没有"推荐""安利""种草"等硬广告词？（有 → 替换为自然口语）
   ☐ 句子是否太完整工整？（是 → 打碎、加语气词）
   ☐ 情绪是否太平铺直叙？（是 → 加入冲突和转折）
   ☐ 是否像客服在回答问题？（是 → 重写为朋友闲聊）

6. dialogue_renderer（对话渲染）
   - 每条消息只承载一个信息点（一页一句）
   - 用短句制造高情绪密度
   - 适合抖音图文截图的对话节奏`

// ============================================================
// 三种文案风格
// ============================================================
const STYLE_PROFILES: Record<CopyStyle, string> = {
  natural: `【风格：自然安利】
- 人设示例：热心闺蜜、爱分享的邻家女孩
- 说话方式："姐妹！！！""我跟你说""真的""不夸张"
- emoji密度：每条消息1-2个emoji
- 句子长度：8-15字，偶尔蹦几个3-5字短句
- 禁止：书面语、完整长句、客服语气`,

  professional: `【风格：专业种草】
- 人设示例：成分党、护肤品测评达人、家电发烧友
- 说话方式："讲真""实测下来""对比过好几款""信我"
- 适当带数据和对比，但不堆术语
- 句子长度：10-18字，带信息量但不啰嗦
- 禁止：念参数表、像测评报告、罗列功能`,

  short: `【风格：短句神评】
- 人设示例：评论区高赞达人、金句制造机
- 说话方式：每条都是金句，像抖音评论区最顶上那条
- 一句话打中痛点或爽点
- 句子长度：5-12字，极少超过20字
- 禁止：任何解释、废话、客气话`,
}

// ============================================================
// 两种聊天模式
// ============================================================
function buildModeRules(mode: ChatMode): string {
  if (mode === 'single') {
    return `【模式：单人安利】
你扮演"{nickname}"，向朋友"我"安利。
- "{nickname}"的角色(role="assistant")发大部分消息，像朋友私聊
- "我"(role="user")只偶尔简短回应（"真的？""链接！""买了"）
- 对话比例约 4:1（安利者:回应者）
- 开头加 type="timestamp" 时间戳
- 适当插入 type="image" 发商品图`
  }

  return `【模式：双人对话】
两个朋友聊天，自然引出好物推荐。
- 角色A="{nickname1}"，发现好物的人，热情但不刻意
- 角色B="{nickname2}"，朋友，反应真实（好奇/半信半疑/被说服）
- 两条角色交替发言，像真实闺蜜/同事私聊
- 角色B不能只是捧哏，要有自己的态度和真实反应
- 对话中适当插入 type="image" 发商品图
- 每条消息带 speaker 字段（值为角色昵称）
- 开头加 type="timestamp" 时间戳`
}

// ============================================================
// 主入口
// ============================================================
export function buildSystemPrompt(mode: ChatMode, style: CopyStyle): string {
  const styleProfile = STYLE_PROFILES[style]
  const modeRules = buildModeRules(mode)

  return `${PIPELINE}

---
${styleProfile}

---
${modeRules}

---
【最终输出要求】
- 严格返回 JSON，不要包在 markdown 代码块里
- 场景适配：抖音图文带货场景，最终渲染为微信聊天截图风格`
}

// ============================================================
// 用户消息（传图）
// ============================================================
export function buildUserPrompt(base64Images: string[]): Array<{ type: string; text?: string; image_url?: { url: string } }> {
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = []

  content.push({
    type: 'text',
    text: '生成极简推荐对话（≤7条消息），一屏展示完。识别商品，走管线流程。先走persona_generator→emotion_engine→conflict_engine→humanizer→ai_detector→dialogue_renderer，最后输出JSON。',
  })

  for (const img of base64Images) {
    content.push({
      type: 'image_url',
      image_url: { url: img },
    })
  }

  return content
}

// ============================================================
// 追回指令
// ============================================================
export function buildFollowUpPrompt(instruction: string): string {
  return `根据之前的对话上下文，请按以下要求调整对话内容："${instruction}"。重新走一遍管线流程（特别是 humanizer 和 ai_detector），保持 JSON 格式不变。`
}

// ============================================================
// JSON 格式提示
// ============================================================
export function buildJSONFormatHint(): string {
  return `\n输出格式（严格JSON，总消息≤7条）：
{
  "product": { "name": "商品名称", "highlights": ["卖点1", "卖点2", "卖点3"] },
  "messages": [
    { "role": "assistant", "type": "timestamp", "content": "下午 3:27" },
    { "role": "assistant", "type": "text", "content": "消息内容", "speaker": "昵称(双人模式必填)" },
    { "role": "assistant", "type": "image", "content": "商品图片URL或占位" },
    { "role": "user", "type": "text", "content": "真的吗！" },
    ...
  ]
}`
}
