import {UserRole} from '../../models/enums/user-role.enum';

export interface SidebarModel {
  label: string;
  icon : string;
  route: string;
  roles?: UserRole[];
}
