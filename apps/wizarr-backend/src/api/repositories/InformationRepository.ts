import { RepositoryBase } from "./BaseRepository";
import { Information } from "../models/InformationModel";
import { EntityRepository } from "../../decorators/entity-repository.decorator";

@EntityRepository(Information)
export class InformationRepository extends RepositoryBase<Information> {}
