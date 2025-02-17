import { ValidationOptions, registerDecorator } from "class-validator";
import { ValidationArguments } from "class-validator/types/validation/ValidationArguments";

export type Type = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";

export function IsType(property: Array<Type>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isType",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    if (property.includes("array")) {
                        return Array.isArray(value) && value.every((item) => property.includes(typeof item));
                    }

                    return property.includes(typeof value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `Value is not a valid type. Expected: ${property.join(", ")}. Received: ${typeof args.value}`;
                },
            },
        });
    };
}
