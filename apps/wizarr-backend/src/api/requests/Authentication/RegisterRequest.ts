import { IsPassword } from "@/validators/IsPassword";
import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

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
    @IsArray()
    roles: string | string[];
}
