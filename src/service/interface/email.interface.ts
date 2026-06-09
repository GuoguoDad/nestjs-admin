export interface iMailOptions {
    from: String;
    to: String;
    subject: String;
    text?: String;
    html?: String;
    attachments?: file[]
}

export interface iContent {
    transport?: 'default' | 'smtp';
    target: String; //多个用逗号隔开，例如 '19941558406@163.com,447092991@qq.com'
    title: String;
    text?: String;
    html?: String;
    attachments?: file[]
}

export interface file {
    filename: String;
    path: String;
}

export interface iResult {
    httpCode: Number;
    message: any;
}