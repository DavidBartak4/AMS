import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator"

export function IsDateRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isDateRangeValid",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            value.min && value.max && new Date(value.min) <= new Date(value.max)
          )
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} range is invalid: 'min' must be before 'max'`
        },
      },
    })
  }
}