import "reflect-metadata";

import { JsonController } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController()
export class ControllerBase {}
