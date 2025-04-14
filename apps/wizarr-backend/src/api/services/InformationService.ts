import "reflect-metadata";

import { InjectRepository } from "../../decorators/InjectRepository";
import { Service } from "typedi";
import { InformationRepository } from "../repositories/InformationRepository";
import { booleanConverter } from "../../utils/env.helper";
import { AdminRepository } from "../repositories/Account/AdminRepository";
import { Information } from "../models/InformationModel";

import type { Information as IInformation } from "@wizarrrrr/wizarr-sdk";
import { UserEntity } from "../models/Account";

@Service()
export class InformationService {
    /**
     * Creates an instance of InformationService.
     * @param informationRepository
     * @constructor
     */
    constructor(
        @InjectRepository(Information) public informationRepository: InformationRepository,
        @InjectRepository(UserEntity) public adminRepository: AdminRepository,
    ) {}

    /**
     * Gets all information.
     * @returns {Promise<Information>}
     */
    public async getAll(): Promise<Partial<IInformation>> {
        const data = await this.informationRepository.getOne();
        return await this.getDefault(data);
    }

    /**
     * Information default values.
     * @returns {Partial<Information>}
     */
    public async getDefault(data: Information): Promise<Partial<IInformation>> {
        const response = {
            name: "Wizarr",
            description: "Wizarr is a media server",
            setupRequired: (await this.adminRepository.count()) === 0,
            bugReporting: booleanConverter(env("BUG_REPORTING", true)),
            ...data,
        };
        delete response.id;
        return response;
    }

    /**
     * Updates information.
     * @param {Information} data
     * @returns {Promise<Information>}
     */
    public async update(data: Partial<Information>): Promise<Information> {
        let information = (await this.informationRepository.getOne()) ?? new Information();
        Object.assign(information, data);
        return await this.informationRepository.save(information);
    }
}
