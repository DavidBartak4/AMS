import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { isAfter, differenceInDays, parseISO, isToday } from "date-fns"

export function IsCheckInDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsMinDateToday",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = new Date()
          return isToday(parseISO(value)) || isAfter(parseISO(value), today)
        },
        defaultMessage(): string {
          return "$property must be today or a future date."
        },
      },
    })
  }
}

export function IsCheckOutDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsCheckOutDate",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { checkIn } = args.object as any
          if (!checkIn) return false
          const checkInDate = parseISO(checkIn)
          const checkOutDate = parseISO(value)
          const daysDifference = differenceInDays(checkOutDate, checkInDate)
          return daysDifference >= 1
        },
        defaultMessage(): string {
          return "$property must be at least 1 night after check-in."
        },
      },
    })
  }
}