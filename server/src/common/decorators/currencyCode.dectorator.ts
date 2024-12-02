import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"
const currencyCodes = require("currency-codes")

export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isCurrencyCode",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === "string" && currencyCodes.codes().includes(value.toUpperCase())
          )
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 4217 currency code.`
        },
      },
    })
  }
}