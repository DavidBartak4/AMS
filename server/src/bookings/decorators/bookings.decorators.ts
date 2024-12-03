import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator"
import { isAfter, differenceInDays, parseISO, isToday } from "date-fns"

export function IsMinDateToday(validationOptions?: ValidationOptions) {
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
            return daysDifference >= 1 && daysDifference <= 60
          },
          defaultMessage(): string {
            return "$property must be 1 to 60 nights after check-in."
          },
        },
      })
    }
  }
  
  // TODO : Google API key management
  export function IsValidAddress(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: "IsValidAddress",
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          async validate(value: string) {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                  value
                )}&key=YOUR_API_KEY`
              )
              const data = await response.json()
              return data.status === "OK"
            } catch (error) {
              console.error("Error verifying address:", error)
              return false
            }
          },
          defaultMessage(): string {
            return "$property must be a valid address."
          },
        },
      })
    }
  }
