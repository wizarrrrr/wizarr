import { IsBoolean, IsOptional, IsString } from "class-validator";
import type { InformationRequest as IInformationRequest } from "@wizarrrr/wizarr-sdk";

export class InformationRequest implements IInformationRequest {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsBoolean()
    bugReporting: boolean;
}

export class InformationPUT implements InformationRequest {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    bugReporting: boolean;
}
