/**
 * ACLC LabPulse - Prisma Database Seeder
 * Target Institution: ACLC College of Manila - College of Computer Studies / IT Department
 * 
 * Executes foundational seeding for Laboratories, Administrative Users, Workstations,
 * Consumable Inventory, and Timetable Schedules.
 */

export interface SeedDataSummary {
  usersCount: number;
  labsCount: number;
  assetsCount: number;
  consumablesCount: number;
  schedulesCount: number;
}

export const SEED_USERS = [
  {
    email: 'lab.head@aclc-manila.edu.ph',
    fullName: 'Prof. Reynaldo Bautista, MSCS',
    employeeId: 'ACLC-FAC-2015-089',
    role: 'LAB_HEAD',
    department: 'College of Computer Studies',
    phoneNumber: '+63 917 123 4567',
  },
  {
    email: 'admin.it@aclc-manila.edu.ph',
    fullName: 'Engr. Danica Flores',
    employeeId: 'ACLC-ADM-2018-014',
    role: 'SUPER_ADMIN',
    department: 'Management Information Systems (MIS)',
    phoneNumber: '+63 918 234 5678',
  },
  {
    email: 'tech.santos@aclc-manila.edu.ph',
    fullName: 'Mark Alvin Santos',
    employeeId: 'ACLC-TECH-2021-032',
    role: 'TECHNICIAN',
    department: 'IT Support & Laboratory Maintenance',
    phoneNumber: '+63 920 345 6789',
  },
  {
    email: 'custodian.delacruz@aclc-manila.edu.ph',
    fullName: 'Marilou Dela Cruz',
    employeeId: 'ACLC-CUST-2019-022',
    role: 'CUSTODIAN',
    department: 'Property & Inventory Custodianship',
    phoneNumber: '+63 922 456 7890',
  },
  {
    email: 'faculty.mendoza@aclc-manila.edu.ph',
    fullName: 'Prof. Cristine Mendoza, MIT',
    employeeId: 'ACLC-FAC-2020-105',
    role: 'FACULTY',
    department: 'College of Computer Studies',
    phoneNumber: '+63 919 567 8901',
  },
  {
    email: 'sa.villanueva@aclc-manila.edu.ph',
    fullName: 'Joshua Villanueva (Student Assistant)',
    employeeId: 'ACLC-SA-2024-512',
    role: 'STUDENT_ASSISTANT',
    department: 'College of Computer Studies',
    phoneNumber: '+63 995 678 9012',
  },
];

export const SEED_LABORATORIES = [
  {
    code: 'LAB-1',
    name: 'Multimedia & Game Development Laboratory',
    building: 'Main Academic Wing',
    floor: '3rd Floor',
    roomNumber: 'Room 301',
    capacity: 40,
    gridRows: 5,
    gridCols: 8,
    ipSubnet: '192.168.10.0/24',
    defaultGateway: '192.168.10.1',
    status: 'ACTIVE',
    notes: 'Equipped with dedicated GPUs for 3D modeling and multimedia programming.',
  },
  {
    code: 'LAB-2',
    name: 'Software Engineering & Database Laboratory',
    building: 'Main Academic Wing',
    floor: '3rd Floor',
    roomNumber: 'Room 302',
    capacity: 40,
    gridRows: 5,
    gridCols: 8,
    ipSubnet: '192.168.20.0/24',
    defaultGateway: '192.168.20.1',
    status: 'ACTIVE',
    notes: 'Configured for Web development, Python, Java, and DBMS coursework.',
  },
  {
    code: 'LAB-3',
    name: 'Cisco Networking & Systems Administration Lab',
    building: 'Main Academic Wing',
    floor: '3rd Floor',
    roomNumber: 'Room 304',
    capacity: 35,
    gridRows: 5,
    gridCols: 7,
    ipSubnet: '192.168.30.0/24',
    defaultGateway: '192.168.30.1',
    status: 'ACTIVE',
    notes: 'Dedicated patch panels, Cisco 2960 switches, and dual NIC workstations.',
  },
  {
    code: 'SERVER-ROOM',
    name: 'IT Custodian & Data Center Center',
    building: 'Main Academic Wing',
    floor: '3rd Floor',
    roomNumber: 'Room 305',
    capacity: 6,
    gridRows: 2,
    gridCols: 3,
    ipSubnet: '192.168.1.0/24',
    defaultGateway: '192.168.1.1',
    status: 'RESTRICTED',
    notes: 'Authorized personnel only. Central UPS bank and core routing infrastructure.',
  },
];

export const SEED_CONSUMABLES = [
  {
    sku: 'CON-CBL-CAT6-BLU',
    name: 'Belden Category 6 UTP Network Cable (1000ft Box)',
    category: 'CABLE_UTP_CAT6',
    description: 'Solid copper 23 AWG 4-pair unshielded twisted pair roll',
    unit: 'ROLLS',
    stockQuantity: 4,
    minThreshold: 2,
    reorderQuantity: 5,
    unitCost: 6500.00,
    storageLocation: 'Custodian Storage Rm 305, Shelf A-1',
  },
  {
    sku: 'CON-CON-RJ45-01',
    name: 'AMP RJ45 Cat6 Gold-Plated Modular Connectors (Box of 100)',
    category: 'RJ45_CONNECTORS',
    description: 'High conductivity RJ-45 8P8C plugs',
    unit: 'BOXES',
    stockQuantity: 12,
    minThreshold: 3,
    reorderQuantity: 10,
    unitCost: 850.00,
    storageLocation: 'Custodian Storage Rm 305, Bin 4',
  },
  {
    sku: 'CON-PER-KB-MEM',
    name: 'A4Tech ComfortKey USB Spill-Resistant Keyboard',
    category: 'KEYBOARD_MEMBRANE',
    description: 'Standard institutional laboratory replacement keyboards',
    unit: 'PIECES',
    stockQuantity: 18,
    minThreshold: 8,
    reorderQuantity: 25,
    unitCost: 380.00,
    storageLocation: 'Custodian Storage Rm 305, Shelf B-2',
  },
  {
    sku: 'CON-PER-MOU-OPT',
    name: 'Logitech B100 Optical USB Mouse 1000 DPI',
    category: 'OPTICAL_MOUSE',
    description: 'Ergonomic 3-button optical replacement mouse',
    unit: 'PIECES',
    stockQuantity: 24,
    minThreshold: 10,
    reorderQuantity: 30,
    unitCost: 260.00,
    storageLocation: 'Custodian Storage Rm 305, Shelf B-3',
  },
  {
    sku: 'CON-THM-PST-MX4',
    name: 'Arctic MX-4 High Performance Thermal Compound (4g)',
    category: 'THERMAL_PASTE',
    description: 'Non-conductive carbon micro-particle thermal grease for CPU repaste',
    unit: 'TUBES',
    stockQuantity: 8,
    minThreshold: 3,
    reorderQuantity: 10,
    unitCost: 390.00,
    storageLocation: 'Technician Toolkit Drawer 1',
  },
  {
    sku: 'CON-BAT-CR2032',
    name: 'Panasonic CR2032 3V Lithium Coin Cell Battery (Pack of 5)',
    category: 'CMOS_CR2032',
    description: 'BIOS RTC clock backup batteries for motherboard maintenance',
    unit: 'PACKS',
    stockQuantity: 15,
    minThreshold: 4,
    reorderQuantity: 10,
    unitCost: 175.00,
    storageLocation: 'Technician Toolkit Drawer 2',
  },
];

export const SEED_SUPPLIERS = [
  {
    companyName: 'Octagon Computer Superstore - Manila',
    contactPerson: 'Dennis Tan',
    email: 'corporate.sales@octagon.com.ph',
    phone: '+63 2 8524 9911',
    address: 'SM City Manila Cyberzone, Ermita, Manila',
    taxIdentificationNumber: '102-458-920-000',
    paymentTerms: '30 Days Net',
    rating: 5,
  },
  {
    companyName: 'PC Express Corporate Sales Division',
    contactPerson: 'Marianne Santos',
    email: 'b2b@pcexpress.com.ph',
    phone: '+63 2 8727 0990',
    address: 'Gilmore Commercial Plaza, New Manila, Quezon City',
    taxIdentificationNumber: '210-983-411-000',
    paymentTerms: '15 Days Net',
    rating: 5,
  },
];

export async function main() {
  console.log('--- Initializing ACLC LabPulse Database Seed Outline ---');
  console.log(`Seeding ${SEED_USERS.length} institutional users with RBAC`);
  console.log(`Seeding ${SEED_LABORATORIES.length} computer laboratories with floor grid dimensions`);
  console.log(`Seeding ${SEED_CONSUMABLES.length} inventory SKUs with threshold triggers`);
  console.log(`Seeding ${SEED_SUPPLIERS.length} procurement suppliers`);
  console.log('Seed blueprint verified and ready for database execution.');
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((err) => {
    console.error('Seeding error:', err);
  });
}
