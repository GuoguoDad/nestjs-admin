export interface iMailOptions {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: file[]
}

export interface iContent {
  transport?: 'default' | 'smtp'
  target: string //多个用逗号隔开，例如 '19941558406@163.com,447092991@qq.com'
  title: string
  text?: string
  html?: string
  attachments?: file[]
}

export interface file {
  filename: string
  path: string
}

export interface iResult {
  httpCode: number
  message: any
}
