import { RepositoryBase } from "./BaseRepository";
import { Information } from "../models/InformationModel";
import { EntityRepository } from "../../decorators/entity-repository.decorator";
import { connection } from "../../config/connection";

@EntityRepository(Information)
export class InformationRepository extends RepositoryBase<Information> {}
