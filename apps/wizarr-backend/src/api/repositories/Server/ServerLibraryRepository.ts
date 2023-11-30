import { ServerLibrary } from "@/api/models/Server/ServerLibraryModel";
import { RepositoryBase } from "../base.repository";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(ServerLibrary)
export class ServerLibraryRepository extends RepositoryBase<ServerLibrary> {}
