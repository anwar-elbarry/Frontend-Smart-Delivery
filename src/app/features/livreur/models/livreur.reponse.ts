import { User } from "../../../core/models/auth/user.rensponse";
import { ZoneResp } from "../../zone/models/zone.response";

export interface LivreurResp {
    id: string;
    user: User;
    vehicule: string;
    zoneAssignee:ZoneResp;
}