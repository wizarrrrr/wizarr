import { RepositoryBase } from "./base.repository";
import { Information } from "@/api/models/InformationModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(Information)
export class InformationRepository extends RepositoryBase<Information> {}
