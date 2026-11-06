// Jest 启动时会把 NODE_ENV 设为 test，而本项目只提供 config/dev.env，
// 这里固定使用 dev 配置，避免 ConfigService 读取不存在的 config/test.env。
process.env.NODE_ENV = 'dev'
