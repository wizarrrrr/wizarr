import { InjectRepository } from "@/decorators";
import { Service } from "typedi";
import { InformationRepository } from "../repositories/InformationRepository";
import { Information } from "../models/InformationModel";
import { booleanConverter, env } from "@/utils/env.helper";

import type { Information as IInformation } from "@wizarrrr/wizarr-sdk";

@Service()
export class InformationService {
    /**
     * Creates an instance of InformationService.
     * @param informationRepository
     * @constructor
     */
    constructor(@InjectRepository() private informationRepository: InformationRepository) {}

    /**
     * Gets all information.
     * @returns {Promise<Information>}
     */
    public async getAll(): Promise<Partial<IInformation>> {
        return await this.getDefault(this.informationRepository.getOne());
    }

    /**
     * Information default values.
     * @returns {Partial<Information>}
     */
    public async getDefault(data: Promise<Information>): Promise<Partial<IInformation>> {
        const response = {
            name: "Wizarr",
            description: "Wizarr is a media server",
            setupRequired: booleanConverter(env("SETUP_REQUIRED", true)),
            bugReporting: booleanConverter(env("BUG_REPORTING", true)),
            ...(await data),
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
