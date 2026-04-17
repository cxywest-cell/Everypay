---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["_bmad-output/planning-artifacts/prd-revised-2026-04-07.md", "_bmad-output/planning-artifacts/ux-design-specification.md", "_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md"]
workflowType: 'architecture'
project_name: 'Everypay'
user_name: 'Daniel'
date: '2026-04-02'
prototypeMode: true
revision: '2026-04-13'
revisionNote: 'MVP 范围缩减：托管/Cregis/里程碑延期至第二阶段；简化的结算流程；Wei Zhang 4 条转换路径'
status: 'complete'
completedAt: '2026-04-13'
---

# 架构决策文档 — Everypay

_修订版：MVP 范围简化 — 托管延期至第二阶段；4 条转换路径结算；仅 PRELOCK_

## 修订历史

| 日期 | 版本 | 变更内容 |
|------|----------|---------|
| 2026-04-02 | 1.0 | 初始架构 |
| 2026-04-07 | 1.1 | 根据 PRD 修订版更新结算货币和收款账户 |
| 2026-04-13 | 1.2 | MVP 范围缩减：托管/里程碑/INTIME 延期至第二阶段；简化结算流程；Wei Zhang 4 条转换路径 |

---

## 项目上下文分析

### 需求概述

**功能需求：** 17 个类别共 87+ 条 FR（详见 PRD）

**原型重点：** 用于 UI 验证的子集：
- 卖家工作流（FR5–FR12）：发票创建、付款协议、证据包
- 买家工作流（FR13–FR20）：付款发起、汇率锁定、结算跟踪
- 审批工作流（FR42–FR46）：CFO 审批队列
- 销售账本（FR77–FR80）：卖家仪表板
- 采购账本（FR73–FR76）：买家仪表板
- 交易对手 CRM（FR69–FR72）：交易对手档案

### 规模与复杂度

- **复杂度：** 原型 — 专注于 UI 验证，无后端
- **主要领域：** 前端 Web 应用
- **用户：** 4 类角色（Carlos/买家、Wei/卖家、CFO/审批人、Ops 运营团队）

### 结算模型（修订版 MVP）

**4 条转换路径链：**
```
fiat → stablecoins → stablecoins → fiat → fiat(main)
```
- fiat → stablecoins：买家存入本地法币，转换为稳定币
- stablecoins → stablecoins：单一稳定币转账（同类型币种）
- stablecoins → fiat：卖家收到稳定币，转换为 USD 或 HKD
- fiat → fiat(main)：USD 或 HKD 汇入卖家内地连接的离岸账户

**MVP 简化结算流程（无托管）：**
1. 卖家（最常见）或买家发起结算
2. 每笔分期可能附带双方协商的相关文件
3. 买家将本地法币（BRL/ARS）转入 Everypay 收款账户
4. Everypay 将本地货币 → USDT
5. Everypay HK 将 USDT → USD 或 HKD
6. USD 或 HKD 转入 Wei 的离岸香港银行账户
7. Wei 收到证据包（按每笔分期）

**注意：** Cregis 托管、里程碑跟踪（已发货、已清关）、INTIME 汇率协商全部归入**第二阶段**。

---

## 第 4 步 — 核心原型架构决策

### 状态管理：仅用于瞬态 UI 状态的 Zustand

**决策：** Zustand 仅用于瞬态 UI 状态 — 不作为数据源。

- Seed JSON 文件是规范数据源
- Zustand 存储管理：表单状态、筛选/分页、UI 开关、活动标签页
- **不要**将 seed 数据复制至 Zustand — 通过 API 路由处理器从 seed 文件读取
- 存储切片命名为 `use[Domain]Store`（如 `useApprovalStore`、`useRateLockStore`）

**理由：** 保持原型简洁，同时建立可在原型后延续的模式。数据源保存在 seed JSON 中，便于后续替换为真实 API。

### Mock API 层

**决策：** 基于 Next.js 路由处理器的薄服务层。

```
/src/lib/api.ts          — 共享 fetch 封装 + mockDelay 工具
/src/app/api/*/route.ts  — 返回 seed JSON 的路由处理器
/src/seeds/*.json        — 规范 mock 数据
```

**规范：**
- 每个路由处理器与其 seed JSON 文件同址存放
- `mockDelay(ms)` 工具模拟网络延迟（默认 300-800ms）
- 包含错误模拟：5% 随机超时，2% 500 响应
- API 形状必须匹配真实后端合约期望（记录于 PRD FR 中）

### 组件架构

**决策：** 全量使用 `use client`，后续再优化边界。

- 所有页面组件默认 `"use client"`，避免在快速原型阶段处理 Server/Client 边界问题
- 仅在优化时（原型后）提取 Server Components
- Headless UI 锁定 `@headlessui/react@^2.1.0` 以兼容 React 19
- 组件文件结构镜像 UX 规范章节

### 类型系统（单一数据源）

**决策：** `src/lib/types.ts` 是规范类型定义文件。

- 所有领域类型（Invoice、Settlement、Approval、Counterparty 等）在此定义
- API 响应类型与 types 同址存放
- 第一个开发故事**必须**先建立类型 + mock API 合约，再进行任何 UI 工作

### 4 项强制规范（提交前）

以下规范在首次提交前不可省略：

1. **`src/lib/types.ts`** — 所有领域类型的单一数据源
2. **路由处理器 + Seed JSON 同址存放** — 每个 API 路由读取对应的 seed 文件
3. **Zustand store 切片命名** — 强制执行 `use[Domain]Store` 模式
4. **共享 `mockDelay.ts`** — 所有 mock 端点使用一致的延迟模拟

---

## 结算配置架构（第二阶段）

> **注意：** 本节适用于实现托管和里程碑跟踪的第二阶段。MVP 使用简化配置。

### MVP 配置

| 维度 | 选项 | 实现方式 |
|-----------|---------|---------------|
| 汇率方式 | 仅 PRELOCK | `rate_method: 'PRELOCK'` |
| 托管 | 不适用 | 第二阶段 |
| 结算类型 | 简单延期结算 | fiat → USDT → USD/HKD |

### 第二阶段多维模型

| 维度 | 选项 | 实现方式 |
|-----------|---------|---------------|
| 托管 | 必需 / 不需要 | `escrow_required` 布尔标志（第二阶段） |
| 汇率方式 | PRELOCK / INTIME | `rate_method` 枚举（INTIME：第二阶段） |
| 托管金额 | EXACT / OVER / UNDER | `escrow_amount_type` 枚举（第二阶段） |
| 托管结构 | 一次性 / 分期 | `escrow_structure` 枚举（第二阶段） |
| 发起方 | 卖家 / 买家 / 系统 | `initiated_by` 枚举（第二阶段） |

### 汇率风险管理

| 场景 | 汇率保护 | MVP 状态 |
|----------|----------------|------------|
| PRELOCK | 发起时锁定汇率 | MVP ✅ |
| INTIME | 协商 | 第二阶段 |
| 托管 + PRELOCK | 买家受保护 | 第二阶段 |
| 托管 + INTIME | 48h SLA 协商 | 第二阶段 |
| 无托管 | 双边协商 | MVP ✅ |

### 风险评分系统（第二阶段）

> **注意：** 风险评分因子包含第二阶段才有的托管功能。MVP 不计算风险评分。

**风险评分计算（0-100）— 第二阶段：**

| 风险因子 | 权重 | 分数影响 |
|-------------|--------|--------------|
| 启用托管 | 高 | 启用 -30（第二阶段） |
| 汇率方式 | 中 | PRELOCK: -15, INTIME: -5, 无: 0 |
| 托管金额类型 | 高 | EXACT: -20, OVER: -10, UNDER: +10（第二阶段） |
| 托管结构 | 中 | 分期: -10, 一次性: 0（第二阶段） |
| 纠纷历史 | 高 | 每次 +20 |
| 支付金额 | 中 | 每超 $10k +1 |
| 通道波动性 | 中 | 因通道而异 |

---

## MVP 后端集成

| 合作伙伴 | 集成类型 | MVP 状态 |
|---------|-----------------|------------|
| 巴西支付合作伙伴 | 本地轨道 API | MVP ✅ — BRL/ARS 收款 |
| Everypay HK 实体 | 内部 FX 引擎 | MVP ✅ — USDT → USD/HKD 转换 |
| Cregis 托管 | API + 策略引擎 | 第二阶段 — 托管 |
| 物流合作伙伴 Oracle | Webhook/内部数据源 | 第二阶段 — 里程碑跟踪 |

**MVP 集成说明：**
- Everypay HK FX 引擎将 USDT → USD 或 HKD
- 结算汇入 Wei 的离岸香港银行账户
- 使用香港银行轨道进行 USD/HKD 清算

## 第二阶段后端集成

新增集成：

| 合作伙伴 | 集成类型 | 用途 |
|---------|-----------------|---------|
| Cregis 托管 | API + 策略引擎 | USDT 托管、冻结指令、储备金管理 |
| 物流合作伙伴 Oracle | Webhook/内部数据源 | 里程碑数据（已发货、已清关） |

---

## 延期决策（原型后）

### MVP 仍需实现
- 真实身份认证（JWT/OAuth）
- 真实数据库（PostgreSQL）
- 真实巴西支付合作伙伴集成
- 真实 Everypay HK FX 引擎集成
- CI/CD 流水线
- 部署基础设施
- Server Component 优化

### 第二阶段功能（延期）
- 真实 Cregis 托管集成
- 真实物流合作伙伴集成（里程碑跟踪）
- INTIME 汇率协商
- 风险评分算法和校准
- 超额/不足托管模式
- 托管纠纷处理

---

## 角色验证

**Winston（架构师）发现：**
- 即使在原型中也要构建薄 `lib/api.ts` 服务层 — 支持替换为真实 API
- Mock 端点中的错误模拟（超时、500）可尽早发现 UI 边界情况
- Zustand 仅用于瞬态 UI 状态，seed JSON 是数据源
- MVP 简化结算：仅 fiat → USDT → USD/HKD（托管/里程碑第二阶段）
- 灵活的数据模型支持双方协商的文件类型

**Amelia（开发者）发现：**
- 锁定 `@headlessui/react@^2.1.0` 以兼容 React 19
- 第一个故事必须先建立 types.ts + mock API 合约，再进行任何 UI 工作
- `use client` 默认值避免了 Server/Client Component 边界调试开销
- 风险评分展示不在 MVP 中 — 延期至第二阶段

**范围变更总结：**
- ✅ MVP：简单延期结算（无托管），仅 PRELOCK，灵活文件
- ❌ 从 MVP 移除：托管/Cregis、里程碑跟踪、INTIME 汇率、风险评分
