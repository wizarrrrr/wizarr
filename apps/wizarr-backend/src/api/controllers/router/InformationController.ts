import "reflect-metadata";
import semver from "semver";

import { Get, JsonController } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ControllerBase } from "./BaseController";
import { OpenAPI } from "routing-controllers-openapi";
import { cachedGetCurrentVersion, getCurrentVersion, getLatestBetaVersion, getLatestStableVersion, getLatestVersion, isBeta, isLatest } from "../../../utils/versions.helper";
import { Cached } from "src/decorators/CachedDecorator";

import type { Version as IVersion, Health as IHealth, Information as IInformation } from "@wizarrrrr/wizarr-sdk";
import { Connection } from "src/config/models/ConnectionModel";
import { DataSource } from "typeorm";

@Service()
@JsonController()
export class InformationController extends ControllerBase {
    /**
     * Injects the config connection.
     * @param configConnection - The config connection.
     */
    constructor(@Inject("configConnection") private readonly configConnection: DataSource) {
        super();
    }

    /**
     * @api {get} /server Server Information
     * @apiName Server Information
     */
    @Get("/information")
    @OpenAPI({ tags: ["General"] })
    public async server(): Promise<Partial<IInformation>> {
        return {
            name: "Wizarr",
            description: "Wizarr is a server management tool for Plex and Jellyfin.",
            version: await getCurrentVersion(),
            setupRequired: (await this.configConnection.getRepository(Connection).count()) === 0,
            updateAvailable: !(await isLatest()),
            debug: process.env.NODE_ENV !== "production",
        };
    }

    /**
     * @api {get} /version Version Information
     * @apiName Version Information
     */
    @Get("/version")
    @OpenAPI({ tags: ["General"] })
    @Cached()
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
