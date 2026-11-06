# nestjs-admin

基于 **NestJS + TypeScript + TypeORM + PostgreSQL** 构建的后管服务端脚手架，内置 JWT 鉴权、全局参数校验、全局异常过滤、统一响应、Swagger 文档、请求日志、文件上传、邮件发送与定时任务能力，开箱即用。

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | NestJS 12 | HTTP 服务框架（ESM-only，CommonJS 产物依赖 Node 22+ 的 `require(esm)`） |
| 语言 | TypeScript 6 | 目标 ES2021 / CommonJS |
| ORM | TypeORM 1.x | 使用 `DataSource` API 直连数据库 |
| 数据库 | PostgreSQL | 依赖驱动 `pg` |
| 鉴权 | Passport + JWT（`@nestjs/jwt`、`passport-jwt`） | Bearer Token，默认有效期 24h |
| 参数校验 | class-validator + class-transformer | 自定义全局管道 |
| 文档 | @nestjs/swagger + swagger-ui-express | 挂载在 `/api` |
| 日志 | winston + winston-daily-rotate-file | 按天切割，输出到 `logs/` |
| 邮件 | nodemailer + nodemailer-smtp-transport | 支持纯文本 / HTML / 附件 |
| 定时任务 | @nestjs/schedule | 基于 Cron 表达式 |
| 代码风格 | ESLint 10（flat config）+ Prettier 3 | 配置见 `eslint.config.mjs` |
| 测试 | Jest 30 + ts-jest | 单测 / e2e |
| 其他 | dayjs、fs-extra、dotenv、pm2 | 时间与文件处理、进程守护 |

## 目录结构

```text
nestjs-admin
├── config/                     # 环境配置（按 NODE_ENV 加载）
│   └── dev.env
├── src
│   ├── main.ts                 # 应用入口：Swagger、全局管道/过滤器/拦截器、监听 3000 端口
│   ├── app.module.ts           # 根模块
│   ├── controller/             # 控制器：auth / user / upload / test / cats
│   ├── service/                # 业务服务：auth / user / upload / email / cats / config
│   │   └── interface/          # 服务层接口定义
│   ├── provider/               # 自定义 Provider：数据源、用户仓储
│   ├── entity/                 # TypeORM 实体：user
│   ├── dto
│   │   ├── request/            # 入参 DTO（带 class-validator 校验规则）
│   │   └── response/           # 出参 VO（带 Swagger 注解）
│   ├── module/                 # 功能模块：auth / config（全局模块）
│   ├── task/                   # 定时任务
│   └── infrastructure/         # 基础设施层
│       ├── decorator/          # 参数装饰器
│       ├── enum/               # 响应码枚举
│       ├── exception/          # 业务异常
│       ├── filter/             # 全局异常过滤器
│       ├── gurad/              # 守卫
│       ├── interceptor/        # 全局拦截器（响应包装、请求日志）
│       ├── logger/             # ORM 日志
│       ├── pipe/               # 全局校验管道、类型转换管道
│       └── strategy/           # Passport JWT 策略
├── eslint.config.mjs           # ESLint 10 flat config
├── upload/                     # 上传文件落盘目录（按 YYYYMMDD 分目录）
├── logs/                       # 运行日志（reqlog / ormlog，按天切割）
└── test/                       # e2e 测试
```

## 快速开始

### 1. 环境要求

- Node.js 22+（NestJS 12 的依赖均为 ESM，需 Node 22 的 `require(esm)` 支持；e2e 测试需 Node 24.9+）
- PostgreSQL 数据库
- pnpm 11（`package.json` 已通过 `packageManager` 锁定 `pnpm@11.5.2`，建议用 corepack 启用）

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

环境变量文件按 `NODE_ENV` 加载，规则为 `config/${NODE_ENV || 'dev'}.env`，即默认读取 `config/dev.env`。

```env
DB_HOST=<数据库地址>
DB_PORT=6543
DB_USER=<用户名>
DB_PASSWORD=<密码>
DB_NAME=postgres

secretKey=<JWT 加签密钥>
defaultSgy=jwt

email_host=<SMTP 地址>
email_port=465
email_auth_user=<发件邮箱>
email_auth_pass=<邮箱授权码>
```

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | 是 | PostgreSQL 连接信息 |
| `secretKey` | 是 | JWT 签名密钥，签发（`auth.module.ts`）与校验（`jwt.strategy.ts`）共用 |
| `defaultSgy` | 否 | 默认 Passport 策略名 |
| `email_host` / `email_port` / `email_auth_user` / `email_auth_pass` | 否 | 邮件发送所需 SMTP 配置，未配置时邮件接口不可用 |

> 建议：不要将真实数据库密码、邮箱授权码提交到仓库。可将 `config/*.env` 加入 `.gitignore`，仅保留一份 `dev.env.example` 作为模板。

### 4. 启动

```bash
# 开发模式（热更新）
pnpm start:dev

# 普通启动（会先清空 logs/ 目录）
pnpm start

# 调试模式
pnpm start:debug

# 生产模式（需先 build）
pnpm build && pnpm start:prod

# pm2 守护进程
pnpm start:pm2
```

服务默认监听 `3000` 端口，启动成功后访问 Swagger 文档：

```text
http://127.0.0.1:3000/api
```

### 5. 测试与代码风格

```bash
pnpm test          # 单元测试
pnpm test:e2e      # e2e 测试（需 Node 24.9+，脚本已带 --experimental-vm-modules）
pnpm test:cov      # 覆盖率
pnpm lint          # ESLint 检查并修复（flat config，见 eslint.config.mjs）
pnpm format        # Prettier 格式化
```

> e2e 测试说明：`@nestjs/testing@12` 为 ESM-only。Jest 30 在 Node 22 下无法 `require` ESM 模块，需 Node 24.9+ 才能运行；测试通过 `test/setup-env.ts` 将 `NODE_ENV` 固定为 `dev`，读取 `config/dev.env`。

> 注意：数据库开启了 `synchronize: true`，应用启动时会自动根据实体同步表结构。首次启动需确保 `Users` 实体对应的表可被自动创建，同时对测试环境自行插入一条账号用于登录。

## 核心功能

### 1. 集成 NestJS + TypeORM + PostgreSQL

`provider/database.provider.ts` 中以 `CommonDataSource` 为 token 注册 TypeORM `DataSource`，并在 `module/config.module.ts` 中作为全局模块导出；`provider/user.provider.ts` 基于该数据源导出 `UserRepository`。

```ts
const AppDataSource = new DataSource({
  type: 'postgres',
  entities: [Users],
  synchronize: true,
  logging: ['query', 'error'],
  logger: new OrmLogger(['query', 'error', 'info', 'warn']),
})
```

实体定义位于 `entity/user.entity.ts`，主键使用 UUID 自增策略：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `_id` | uuid | 主键，自动生成 |
| `username` | string | 用户名（登录用） |
| `password` | string | 密码（当前为明文比对） |
| `email` / `mobile` / `qq` / `company` | string | 扩展资料 |

### 2. JWT 鉴权机制

- `module/auth.module.ts`：注册 `JwtModule`（`global: true`，有效期 `24h`，密钥取 `secretKey`）。
- `infrastructure/strategy/jwt.strategy.ts`：基于 `passport-jwt`，从 `Authorization: Bearer <token>` 中提取令牌，校验通过后将用户实体挂到 `request.user`，查不到用户抛 `UnauthorizedException`。
- `app.module.ts` 中注册 `PassportModule.register({ defaultStrategy: 'jwt' })`。
- 使用方式：在控制器上添加 `@UseGuards(AuthGuard())`，并配合 `@ApiBearerAuth()` 在 Swagger 中显示锁标识。
- `AuthService.login()` 校验用户名密码后签发 token，payload 为 `{ id, name }`，返回 `{ userId, name, token }`。

### 3. 全局请求参数校验管道

`infrastructure/pipe/params.validation.pipe.ts` 基于 `class-validator + class-transformer` 实现，在 `main.ts` 中通过 `app.useGlobalPipes(new ParamsValidationPipe())` 全局生效：

- 跳过 `String / Boolean / Number / Array / Object` 等原生类型；
- 其余类型先 `plainToClass` 转换，再取第一条校验错误抛出 `ApiException`；
- 校验规则写在 DTO 上，例如 `dto/request/user.req.ts` 的登录参数要求用户名长度为 4~12。

### 4. 全局异常过滤器

`infrastructure/filter/response.error.exception.filter.ts` 捕获 `HttpException`，统一格式化为：

```json
{
  "data": {},
  "message": "用户名必须是4到12个字符",
  "success": false,
  "code": 1
}
```

`ApiException`（`infrastructure/exception/api.exception.ts`）为业务异常基类，默认 HTTP 400、`errorCode` 取 `ApiCode.FAIL`。

### 5. 全局响应拦截器

`infrastructure/interceptor/response.success.transform.interceptor.ts` 将所有成功响应包装为统一结构：

```json
{
  "code": 0,
  "data": { "...": "..." },
  "message": "请求成功",
  "success": true
}
```

响应码枚举 `infrastructure/enum/api.code.enum.ts`：

| 枚举 | 值 | 含义 |
| --- | --- | --- |
| `ApiCode.SUCCESS` | 0 | 成功 |
| `ApiCode.FAIL` | 1 | 失败 |

### 6. 请求日志

`infrastructure/logger/logging.interceptor.ts` 记录每次请求的 `url / method / body / query / params / headers`、响应数据与耗时，成功为 `info`、失败为 `error`，落地到 `logs/reqlog_YYYY-MM-DD.log`。

`infrastructure/logger/orm.logger.ts` 继承 TypeORM `FileLogger`，将 SQL 日志写入 `logs/ormlog_YYYY-MM-DD.log`。

### 7. Swagger 接口文档

入口 `main.ts` 中通过 `DocumentBuilder` 构建文档，标题 `admin`、版本 `1.0.0`，并开启 Bearer 认证；DTO/VO 使用 `@ApiProperty`、控制器使用 `@ApiTags`、`@ApiOperation` 描述。同时已通过 `app.enableCors()` 放开跨域。

### 8. 文件上传

`service/upload.service.ts` 使用 `fs.createWriteStream` 分块（128 字节）写入磁盘，落地路径为 `upload/YYYYMMDD/HHmmssSSS-原文件名`，并对 `latin1` 编码的原始文件名做 UTF-8 还原以避免中文乱码。

### 9. 邮件发送

`service/email.service.ts` 通过 nodemailer 发送邮件，支持 `default` / `smtp` 两种 transport（后者 `secure: true`），支持 Text、HTML 与远程附件；收件人支持逗号分隔的多个地址。

### 10. 定时任务

`task/task.service.ts` 基于 `@nestjs/schedule`，示例任务 `@Cron(CronExpression.EVERY_HOUR)` 每小时执行一次；`app.module.ts` 中通过 `ScheduleModule.forRoot()` 启用。

## 接口清单

| 方法 | 路径 | 说明 | 需要鉴权 | 状态 |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | 登录，签发 JWT | 否 | 可用 |
| POST | `/user/queryAllUsers` | 查询全部用户（返回列表与总数） | 否 | 可用 |
| POST | `/upload/file` | 单文件上传 | 否 | 可用 |
| POST | `/upload/files` | 多文件上传，返回 URL 数组 | 否 | 可用 |
| GET | `/test/query/current/user` | 获取当前登录用户 | 是 | 可用 |
| POST | `/test/queryAllUsers` | 查询全部用户 | 是 | 可用 |
| POST | `/test/sendEmail` | 发送测试邮件 | 是 | 可用 |
| POST | `/cats/create` | 新增猫（内存演示） | 是 | 未注册模块，暂不可用 |
| POST | `/cats/queryAll` | 查询猫列表 | 是 | 未注册模块，暂不可用 |
| GET | `/cats/queryOne/:id` | 按 ID 查询，`ParseIntPipe` 转换校验 | 是 | 未注册模块，暂不可用 |

登录请求示例：

```bash
curl -X POST http://127.0.0.1:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"name":"liuhui","password":"your-password"}'
```

鉴权接口请求示例：

```bash
curl -X POST http://127.0.0.1:3000/test/queryAllUsers \
  -H "Authorization: Bearer <token>"
```

## 已知问题与改进建议

| 问题 | 位置 | 建议 |
| --- | --- | --- |
| `@SessionUser()` 返回固定的空对象，未从 `request.user` 取值 | `infrastructure/decorator/session.decorator.ts` | 改为从 `ExecutionContext` 中读取 `request.user` 返回 |
| `CatsController` / `CatsService` 未注册到 `AppModule`，`/cats/*` 接口不可访问 | `app.module.ts` | 在根模块的 `controllers` / `providers` 中注册 |
| 数据源开启 `synchronize: true`，生产环境存在丢数据风险 | `provider/database.provider.ts` | 生产环境关闭，改用 TypeORM Migration |
| 密码以明文形式存储与比对 | `entity/user.entity.ts`、`service/auth.service.ts` | 使用 bcrypt 加盐哈希后比对，且不返回敏感字段 |
| `EmailService` 中 reject 后仍会继续执行 resolve | `service/email.service.ts` | 在 reject 后 `return`，或改用 async/await 包装 |
| `config/dev.env` 含真实数据库密码、邮箱授权码 | `config/dev.env` | 移出版本库，替换为 `.env.example` 模板并轮换凭据 |
| 服务端口硬编码为 3000 | `main.ts` | 改为从 `ConfigService` 读取，支持 `process.env.PORT` |
| `CommonAuthGuard` 与 Passport `AuthGuard()` 功能重复且未被引用 | `infrastructure/gurad/common.auth.guard.ts` | 确认取舍后删除或统一使用 |
| TypeORM 已通过 DataSource 注册实体，`TypeOrmModule` 未使用 | 全局 | 可考虑迁移到 `@nestjs/typeorm` 以简化 Provider 样板代码 |

