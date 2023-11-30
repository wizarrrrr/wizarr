import { IsPassword } from "@/validators/IsPassword";
import { IsType } from "@/validators/IsType";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterRequest {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsPassword()
    password: string;

    @IsNotEmpty()
    @IsType(["string", "array"])
    roles: string | string[];
}
