import { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { ApiException } from '../exception/api.exception'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

export class ParamsValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata

    //当处理的参数是JavaScript类型（它们没有附加模式，因此没有理由通过验证步骤运行它们）时，它负责绕过验证步骤
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      const error = errors.shift()
      const constraints = error.constraints

      for (const key in constraints) {
        throw new ApiException(constraints[key])
      }
    }
    return value
  }

  private toValidate(metatype): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
