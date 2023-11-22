import "reflect-metadata";
import semver from "semver";

import { JsonController, Get } from "routing-controllers";
import { cachedGetCurrentVersion, getCurrentVersion, getLatestBetaVersion, getLatestStableVersion, getLatestVersion, isBeta, isLatest } from "../utils/versions.helper";
import { ContainerInstance, Service } from "typedi";

import ServerRepository from "../repositories/server.repository";

import type { Version, Health } from "@wizarrrr/wizarr-sdk";

import { Connection } from "../data-source";
import { Admins } from "../entities/admins.entity";

@Service()
@JsonController()
export class ServerController {
    //  Define the server repository
    private serverRepository: ServerRepository;

    /**
     * Creates an instance of ServerController.
     * @param containers
     * @returns
     */
    constructor(readonly containers: ContainerInstance) {
        this.serverRepository = this.containers.get(ServerRepository);
    }

    /**
     * @api {get} /server Server Information
     * @apiName Server Information
     */
    @Get("/server")
    public async server() {
        return {
            name: "Wizarr",
            version: await getCurrentVersion(),
            description: "Wizarr is a media server",
            setup_required: false,
            update_available: !(await isLatest()),
        };
    }

    /**
     * test
     */
    @Get("/test")
    public async test() {
        // return this.serverRepository.findAll();
        return Connection.getRepository(Admins).find();
    }

    /**
     * @api {get} /version Version Information
     * @apiName Version Information
     */
    @Get("/version")
    public async version(): Promise<Version> {
        const currentVersion = await getCurrentVersion();
        const latestVersion = await getLatestVersion();
        const latestStableVersion = await getLatestStableVersion();
        const latestBetaVersion = await getLatestBetaVersion();

        return {
            current_version: currentVersion,
            latest_version: latestVersion,
            latest_stable_version: latestStableVersion,
            latest_beta_version: latestBetaVersion,
            is_beta: await isBeta(),
            is_latest: await isLatest(),
            version_info: {
                current_version: semver.parse(currentVersion),
                latest_version: semver.parse(latestVersion),
                latest_stable_version: semver.parse(latestStableVersion),
                latest_beta_version: semver.parse(latestBetaVersion),
            },
        };
    }

    /**
     * @api {get} /health Health Check
     * @apiName Health Check
     */
    @Get("/health")
    public async health(): Promise<Health> {
        return { status: "OK", version: await cachedGetCurrentVersion() };
    }
}
