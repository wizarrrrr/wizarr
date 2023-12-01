import { IsBoolean, IsOptional, IsString } from "class-validator";
import type { Information as IInformation } from "@wizarrrr/wizarr-sdk";

export class InformationGET implements Partial<IInformation> {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsBoolean()
    bugReporting: boolean;
}

export class InformationPUT implements InformationGET {
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
