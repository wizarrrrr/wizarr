import semver from "semver";

import { JsonController, Get, Put, Body, Authorized } from "routing-controllers";
import { cachedGetCurrentVersion, getCurrentVersion, getLatestBetaVersion, getLatestStableVersion, getLatestVersion, isBeta, isLatest } from "@/utils/versions.helper";
import { Inject, Service } from "typedi";
import { OpenAPI } from "routing-controllers-openapi";
import { InformationService } from "../services/InformationService";
import { Logger, LoggerInterface } from "@/decorators/LoggerDecorator";
import { InformationPUT } from "../requests/InformationRequest";

import type { Version as IVersion, Health as IHealth, Information as IInformation } from "@wizarrrr/wizarr-sdk";

@Service()
@JsonController()
export abstract class ControllerBase {
    /**
     * Creates an instance of InformationService.
     */
    @Inject() private informationService: InformationService;
    @Logger() private logger: LoggerInterface;

    /**
     * @api {get} /server Server Information
     * @apiName Server Information
     */
    @Get("/information")
    @OpenAPI({ tags: ["General"] })
    public async server(): Promise<Partial<IInformation>> {
        return {
            ...(await this.informationService.getAll()),
            version: await getCurrentVersion(),
            updateAvailable: !(await isLatest()),
            debug: process.env.NODE_ENV !== "production",
        };
    }

    /**
     * @api {put} /server Server Information
     * @apiName Server Information
     */
    @Put("/information")
    @OpenAPI({ tags: ["General"] })
    @Authorized(["admin"])
    public async updateInformation(@Body() body: InformationPUT): Promise<Partial<IInformation>> {
        this.logger.info("Updating server information");
        return this.informationService.update(body);
    }

    /**
     * @api {get} /version Version Information
     * @apiName Version Information
     */
    @Get("/version")
    @OpenAPI({ tags: ["General"] })
    public async version(): Promise<IVersion> {
        const currentVersion = await getCurrentVersion();
        const latestVersion = await getLatestVersion();
        const latestStableVersion = await getLatestStableVersion();
        const latestBetaVersion = await getLatestBetaVersion();

        return {
            currentVersion: currentVersion,
            latestVersion: latestVersion,
            latestStableVersion: latestStableVersion,
            latestBetaVersion: latestBetaVersion,
            isBeta: await isBeta(),
            isLatest: await isLatest(),
            versionInfo: {
                currentVersion: semver.parse(currentVersion),
                latestVersion: semver.parse(latestVersion),
                latestStableVersion: semver.parse(latestStableVersion),
                latestBetaVersion: semver.parse(latestBetaVersion),
            },
        };
    }

    /**
     * @api {get} /health Health Check
     * @apiName Health Check
     */
    @Get("/health")
    @OpenAPI({ tags: ["General"] })
    public async health(): Promise<IHealth> {
        return {
            status: "OK",
            version: await cachedGetCurrentVersion(),
        };
    }
}
