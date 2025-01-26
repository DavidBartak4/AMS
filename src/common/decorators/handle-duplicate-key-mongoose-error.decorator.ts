import { ConflictException } from "@nestjs/common"

export function HandleDuplicateKeyMongooseError(key: string, errorMessage: string) {
    return function (constructor: Function) {
        const originalPrototype = constructor.prototype
        Object.getOwnPropertyNames(originalPrototype).forEach(function (methodName) {
            const originalMethod = originalPrototype[methodName]
            if (typeof originalMethod === "function" && methodName !== "constructor") {
                const isAsync = originalMethod.constructor.name === "AsyncFunction"
                if (isAsync) {
                    originalPrototype[methodName] = async function (...args: any[]) {
                        try {
                            return await originalMethod.apply(this, args)
                        } catch (error) {
                            if (error.code === 11000 && error.keyValue && error.keyValue[key]) {
                                throw new ConflictException(errorMessage)
                            }
                            throw error
                        }
                    }
                } else {
                    originalPrototype[methodName] = function (...args: any[]) {
                        try {
                            return originalMethod.apply(this, args)
                        } catch (error) {
                            if (error.code === 11000 && error.keyValue && error.keyValue[key]) {
                                throw new ConflictException(errorMessage)
                            }
                            throw error
                        }
                    }
                }
            }
        })
    }
}