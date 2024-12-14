import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"

export function IsRange(minProperty: string, maxProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isRangeValid",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minProperty, maxProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minProperty, maxProperty] = args.constraints
          const min = (args.object as any)[minProperty]
          const max = (args.object as any)[maxProperty]
          return typeof min === "number" && typeof max === "number" && min < max
        },
        defaultMessage(args: ValidationArguments) {
          const [minProperty, maxProperty] = args.constraints
          return `${minProperty} must be smaller than ${maxProperty}`
        },
      },
    })
  }
}