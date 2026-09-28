import { Menu } from '../models/menu.model';

export const applicationMenuItems: Menu[] = [
  new Menu(1, 'Dashboard', '/dashboard', null, 'grid_view', null, false, 0),
  new Menu(2, 'Pipeline Projects', '/pipeline-projects', null, 'timeline', null, false, 0),
  new Menu(3, 'EB Completed Projects', '/eb-completed-projects', null, 'task_alt', null, false, 0),
  new Menu(4, 'BD Requests', '/bd-requests', null, 'business_center', null, false, 0),
  new Menu(5, 'RA Submission Status', '/ra-submission-status', null, 'assignment_turned_in', null, false, 0),
  new Menu(6, 'Approved Data Sharing', '/approved-data-sharing', null, 'share', null, false, 0),
  new Menu(7, 'Commercial Status', '/commercial-status', null, 'store', null, false, 0),
  new Menu(8, 'Market Complaints', '/market-complaints', null, 'report_problem', null, false, 0),
  new Menu(50, 'Setup', '/setup', null, 'tune', null, true, 0),

  // Dropdown items for Setup
  new Menu(501, 'Country', '/setup/country', null, 'public', null, false, 50),
  new Menu(502, 'Region', '/setup/region', null, 'map', null, false, 50),
  new Menu(503, 'Market', '/setup/market', null, 'store', null, false, 50),
  new Menu(504, 'Molecule', '/setup/molecule', null, 'bubble_chart', null, false, 50),
  new Menu(505, 'Product', '/setup/product', null, 'inventory_2', null, false, 50),
  new Menu(506, 'Dosage', '/setup/dosage', null, 'medication', null, false, 50),
  new Menu(507, 'Strength', '/setup/strength', null, 'fitness_center', null, false, 50),
  new Menu(508, 'Fill Volume', '/setup/fill-vol', null, 'opacity', null, false, 50),
  new Menu(509, 'Type of Pack', '/setup/type-pack', null, 'layers', null, false, 50),
  new Menu(510, 'Brand', '/setup/brand', null, 'label', null, false, 50),
  new Menu(511, 'API Holder', '/setup/api-hldr', null, 'apartment', null, false, 50),
  new Menu(512, 'Client', '/setup/client', null, 'people', null, false, 50),
  new Menu(513, 'RA Responsible', '/setup/ra-rspnsbl', null, 'verified_user', null, false, 50),
  new Menu(514, 'BD Responsible', '/setup/bd-rspnsbl', null, 'business_center', null, false, 50),
  new Menu(515, 'MOH RFI 1 Status', '/setup/moh-rfi-one-status', null, 'assignment', null, false, 50),
  new Menu(516, 'MOH RFI 2 Status', '/setup/moh-rfi-two-status', null, 'assignment_turned_in', null, false, 50),
  new Menu(517, 'Variation', '/setup/variation', null, 'alt_route', null, false, 50),

  new Menu(60, 'Admin', '/admin', null, 'verified_user', null, true, 0),

  // Dropdown items for Admin
  new Menu(61, 'Roles', '/admin/roles', null, 'manage_accounts', null, false, 60),
  new Menu(62, 'Users', '/admin/users', null, 'group', null, false, 60),
  // new Menu(63, 'Event Log', '/admin/event-log', null, 'record_voice_over', null, false, 60),
  new Menu(64, 'Escalation Matrix', '/admin/escalation-matrix', null, 'mail_outline', null, false, 60),
];

export const verticalMenuItems = applicationMenuItems;

export const horizontalMenuItems = applicationMenuItems;
