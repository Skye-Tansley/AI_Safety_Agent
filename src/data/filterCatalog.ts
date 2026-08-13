/**
 * Temporary cascading-filter catalogue for the clickable prototype.
 * A future API can replace this module without changing filter components.
 */

export const siteOptions = [
  'All Pilbara sites',
  'Brockman 4',
  'Dampier Salt',
  'Gudai-Darri',
  'Marandoo',
  'Mesa A',
  'Nammuldi',
  'Paraburdoo',
  'Tom Price',
  'Western Range',
  'Perth Operations Centre',
]

export const departmentsBySite: Record<string, string[]> = {
  'Brockman 4': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Dampier Salt': ['Operations', 'Maintenance', 'Marine', 'HSE'],
  'Gudai-Darri': ['Mining', 'Processing', 'Maintenance', 'Projects', 'HSE'],
  Marandoo: ['Mining', 'Processing', 'Maintenance', 'HSE'],
  'Mesa A': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  Nammuldi: ['Mining', 'Processing', 'Maintenance', 'HSE'],
  Paraburdoo: ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Tom Price': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Western Range': ['Mining', 'Processing', 'Maintenance', 'HSE'],
  'Perth Operations Centre': ['Operations Centre', 'Planning & Scheduling', 'Technology', 'HSE', 'People & Culture'],
}

export const areasByDepartment: Record<string, string[]> = {
  Mining: ['Load & Haul', 'Drill & Blast', 'Mine Services'],
  Processing: ['Crushing Plant', 'Concentrator', 'Processing Plant'],
  Maintenance: ['Fixed Plant Maintenance', 'Mobile Maintenance', 'Electrical & Instrumentation'],
  Rail: ['Rail Operations', 'Rail Maintenance'],
  HSE: ['Safety Systems', 'Field Safety', 'Emergency Services'],
  Operations: ['Harvest Operations', 'Port Operations'],
  Marine: ['Marine Operations', 'Shipping'],
  Projects: ['Project Delivery', 'Commissioning'],
  'Operations Centre': ['Integrated Operations Centre', 'Remote Operations'],
  'Planning & Scheduling': ['Mine Planning', 'Maintenance Planning'],
  Technology: ['Operational Technology', 'Digital Systems'],
  'People & Culture': ['Workplace Relations', 'Learning & Development'],
}

export const membersByArea: Record<string, string[]> = {
  'Load & Haul': ['Tom Kelly', 'Maria Garcia', 'Brandon Williams'],
  'Drill & Blast': ['James Taylor', 'Aisha Patel'],
  'Mine Services': ['Sarah Lee', 'Daniel Moore'],
  'Crushing Plant': ['Mia Wilson', 'Liam Smith'],
  Concentrator: ['Noah Brown', 'Olivia Chen'],
  'Processing Plant': ['Ethan Wright', 'Grace Walker'],
  'Fixed Plant Maintenance': ['Jack Martin', 'Amelia King'],
  'Mobile Maintenance': ['Ben Hall', 'Isla Young'],
  'Electrical & Instrumentation': ['Lucas Green', 'Sophie Scott'],
  'Rail Operations': ['Harry Davis', 'Emily White'],
  'Rail Maintenance': ['Oscar Lewis', 'Ruby Harris'],
  'Safety Systems': ['Mason Clark', 'Zoe Turner'],
  'Field Safety': ['Tahlia Robinson', 'Cooper Evans'],
  'Emergency Services': ['Jordan Allen', 'Chloe Baker'],
  'Integrated Operations Centre': ['Ava Thompson', 'William Parker'],
  'Remote Operations': ['Ella Mitchell', 'Leo Campbell'],
  'Mine Planning': ['Harper Adams', 'Henry Collins'],
  'Maintenance Planning': ['Charlotte Stewart', 'Thomas Morris'],
  'Operational Technology': ['Nathan Rogers', 'Lucy Reed'],
  'Digital Systems': ['Archie Bell', 'Eva Murphy'],
}
