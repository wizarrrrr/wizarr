import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { DiversityType, passwordStrength } from "check-password-strength";
import { env } from "../utils/env.helper";

export function IsPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isPassword",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return passwordStrength(value).id === env("PASSWORD_STRENGTH", 3);
                },
                defaultMessage(args: ValidationArguments) {
                    const strength = passwordStrength(args.value);
                    const diversity = ["lowercase", "uppercase", "symbol", "number"] as DiversityType[];
                    const diff = diversity.filter((x) => !strength.contains.includes(x));

                    if (diff.length > 0) {
                        return `Password must contain at least: ${diff.join(", ")}`;
                    }

                    return `Your password is too weak`;
                },
            },
        });
    };
}
