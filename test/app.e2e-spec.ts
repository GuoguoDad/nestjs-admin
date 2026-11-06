import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppModule } from './../src/app.module'
import { ResponseSuccessTransformInterceptor } from './../src/infrastructure/interceptor/response.success.transform.interceptor'
import { ResponseErrorExceptionFilter } from './../src/infrastructure/filter/response.error.exception.filter'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalFilters(new ResponseErrorExceptionFilter())
    app.useGlobalInterceptors(new ResponseSuccessTransformInterceptor())
    await app.init()
  })

  afterAll(async () => {
    if (!app) {
      return
    }
    const dataSource = app.get<DataSource>('CommonDataSource')
    await dataSource.destroy()
    await app.close()
  })

  it('POST /user/queryAllUsers 返回统一响应结构', () => {
    return request(app.getHttpServer())
      .post('/user/queryAllUsers')
      .send({})
      .expect(201)
      .expect((res) => {
        expect(res.body.code).toBe(0)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('请求成功')
      })
  })

  it('GET /not-exist 返回统一错误结构', () => {
    return request(app.getHttpServer())
      .get('/not-exist')
      .expect(404)
      .expect((res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.code).toBe(404)
      })
  })
})
