import {PermissionResponse} from './permission.response';

export interface RoleRespose {
  id:string;
  roleName:string;
  permissions:PermissionResponse[]
}
