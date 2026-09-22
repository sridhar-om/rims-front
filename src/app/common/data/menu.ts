import { Menu } from '../models/menu.model';

export const applicationMenuItems: Menu[] = [
  new Menu(1, 'Dashboard', '/dashboard', null, 'grid_view', null, false, 0),
  new Menu(10, 'Dossiers', '/projects', null, 'business_center', null, false, 0),
  new Menu(20, 'Orders', '/stages', null, 'layers', null, false, 0),
  new Menu(30, 'Reports', '/gates', null, 'door_front', null, false, 0),
  new Menu(40, 'Activity', '/activity', null, 'groups', null, false, 0),
  new Menu(50, 'Setup', '/master-data', null, 'database', null, false, 0),
  new Menu(60, 'Admin', '/admin', null, 'verified_user', null, true, 0),

  // Dropdown items for Admin
  new Menu(61, 'Roles', '/admin/roles', null, 'manage_accounts', null, false, 60),
  new Menu(62, 'Users', '/admin/users', null, 'group', null, false, 60),
  // new Menu(63, 'Event Log', '/admin/event-log', null, 'record_voice_over', null, false, 60),
  new Menu(64, 'Escalation Matrix', '/admin/escalation-matrix', null, 'mail_outline', null, false, 60),
];

export const verticalMenuItems = applicationMenuItems;

export const horizontalMenuItems = applicationMenuItems;
