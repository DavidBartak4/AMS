import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"

export function IsRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isRangeValid",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== "object") return false
          const { min, max } = value
          return typeof min === "number" && typeof max === "number" && min < max
        },
        defaultMessage(args: ValidationArguments) {
          return `Range 'min' must be smaller than 'max'`
        },
      },
    })
  }
}