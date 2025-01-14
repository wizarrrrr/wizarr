import { IsArray, IsBoolean, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class InvitationRequest {
    @IsString()
    server: string;

    @IsString()
    code: string;

    @IsBoolean()
    @IsOptional()
    used?: boolean;

    @IsBoolean()
    @IsOptional()
    unlimited?: boolean;

    @IsArray()
    @IsOptional()
    users?: string[];

    @IsArray()
    @IsOptional()
    libraries?: string[];

    @IsDateString()
    @IsOptional()
    durationAt?: Date;

    @IsDateString()
    @IsOptional()
    expiresAt?: Date;

    @IsDate()
    @IsOptional()
    usedAt?: Date;
}
