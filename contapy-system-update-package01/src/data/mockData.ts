import type { Cliente, Factura, LibroEntry, LibroMayor, Impuesto, AjustesContador, DashboardStats } from '../types';

export const mockClientes: Cliente[] = [
  { id: 1, razonSocial: 'Empresa ABC S.A.', ruc: '80012345-6', email: 'abc@empresa.com.py', telefono: '021-555-001', direccion: 'Av. Mcal. López 1234, Asunción', activo: true },
  { id: 2, razonSocial: 'Comercial XYZ S.R.L.', ruc: '80067890-1', email: 'xyz@comercial.com.py', telefono: '021-555-002', direccion: 'Calle Palma 567, Asunción', activo: true },
  { id: 3, razonSocial: 'Industrias DEF S.A.', ruc: '80034567-8', email: 'def@industrias.com.py', telefono: '021-555-003', direccion: 'Ruta 2 Km 10, San Lorenzo', activo: true },
  { id: 4, razonSocial: 'Servicios GHI S.R.L.', ruc: '80089012-3', email: 'ghi@servicios.com.py', telefono: '021-555-004', direccion: 'Av. España 890, Asunción', activo: false },
  { id: 5, razonSocial: 'Consultora JKL S.A.', ruc: '80056789-0', email: 'jkl@consultora.com.py', telefono: '021-555-005', direccion: 'Av. Santa Teresa 123, Fernando de la Mora', activo: true },
  { id: 6, razonSocial: 'Distribuidora MNO S.R.L.', ruc: '80023456-7', email: 'mno@distribuidora.com.py', telefono: '021-555-006', direccion: 'Av. Artigas 456, Asunción', activo: true },
];

export const mockFacturas: Factura[] = [
  { id: 1, numero: '001-001-0000001', clienteId: 1, clienteNombre: 'Empresa ABC S.A.', clienteRuc: '80012345-6', fecha: '2025-06-01', vencimiento: '2025-07-01', subtotal: 5000000, iva10: 500000, iva5: 0, total: 5500000, estado: 'Pagada', tipo: 'Contado' },
  { id: 2, numero: '001-001-0000002', clienteId: 1, clienteNombre: 'Empresa ABC S.A.', clienteRuc: '80012345-6', fecha: '2025-06-15', vencimiento: '2025-07-15', subtotal: 3000000, iva10: 300000, iva5: 0, total: 3300000, estado: 'Pendiente', tipo: 'Crédito' },
  { id: 3, numero: '001-001-0000003', clienteId: 2, clienteNombre: 'Comercial XYZ S.R.L.', clienteRuc: '80067890-1', fecha: '2025-05-20', vencimiento: '2025-06-20', subtotal: 8500000, iva10: 850000, iva5: 0, total: 9350000, estado: 'Vencida', tipo: 'Crédito' },
  { id: 4, numero: '001-001-0000004', clienteId: 3, clienteNombre: 'Industrias DEF S.A.', clienteRuc: '80034567-8', fecha: '2025-06-10', vencimiento: '2025-07-10', subtotal: 12000000, iva10: 1200000, iva5: 0, total: 13200000, estado: 'Pendiente', tipo: 'Crédito' },
  { id: 5, numero: '001-001-0000005', clienteId: 4, clienteNombre: 'Servicios GHI S.R.L.', clienteRuc: '80089012-3', fecha: '2025-06-05', vencimiento: '2025-06-05', subtotal: 2500000, iva10: 250000, iva5: 0, total: 2750000, estado: 'Anulada', tipo: 'Contado' },
  { id: 6, numero: '001-001-0000006', clienteId: 5, clienteNombre: 'Consultora JKL S.A.', clienteRuc: '80056789-0', fecha: '2025-06-20', vencimiento: '2025-07-20', subtotal: 4500000, iva10: 450000, iva5: 0, total: 4950000, estado: 'Pagada', tipo: 'Contado' },
  { id: 7, numero: '001-001-0000007', clienteId: 6, clienteNombre: 'Distribuidora MNO S.R.L.', clienteRuc: '80023456-7', fecha: '2025-06-22', vencimiento: '2025-07-22', subtotal: 7800000, iva10: 780000, iva5: 0, total: 8580000, estado: 'Pendiente', tipo: 'Crédito' },
  { id: 8, numero: '001-001-0000008', clienteId: 2, clienteNombre: 'Comercial XYZ S.R.L.', clienteRuc: '80067890-1', fecha: '2025-06-25', vencimiento: '2025-07-25', subtotal: 1500000, iva10: 150000, iva5: 0, total: 1650000, estado: 'Pagada', tipo: 'Contado' },
  { id: 9, numero: '001-001-0000009', clienteId: 3, clienteNombre: 'Industrias DEF S.A.', clienteRuc: '80034567-8', fecha: '2025-06-28', vencimiento: '2025-07-28', subtotal: 9200000, iva10: 920000, iva5: 0, total: 10120000, estado: 'Pendiente', tipo: 'Crédito' },
  { id: 10, numero: '001-001-0000010', clienteId: 1, clienteNombre: 'Empresa ABC S.A.', clienteRuc: '80012345-6', fecha: '2025-07-01', vencimiento: '2025-08-01', subtotal: 6000000, iva10: 600000, iva5: 0, total: 6600000, estado: 'Pendiente', tipo: 'Crédito' },
];

const diarioEntries: LibroEntry[] = [
  { id: 1, fecha: '2025-06-01', descripcion: 'Venta de servicios Empresa ABC', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-001', debe: 5500000, haber: 0, saldo: 5500000 },
  { id: 2, fecha: '2025-06-01', descripcion: 'Venta de servicios Empresa ABC', cuenta: 'Ingresos por Servicios', comprobante: 'FAC-001', debe: 0, haber: 5000000, saldo: 500000 },
  { id: 3, fecha: '2025-06-01', descripcion: 'IVA Débito Fiscal 10%', cuenta: 'IVA Débito Fiscal', comprobante: 'FAC-001', debe: 0, haber: 500000, saldo: 0 },
  { id: 4, fecha: '2025-06-05', descripcion: 'Pago de servicios varios', cuenta: 'Gastos Operativos', comprobante: 'EGR-001', debe: 1200000, haber: 0, saldo: 1200000 },
  { id: 5, fecha: '2025-06-05', descripcion: 'IVA Crédito Fiscal 10%', cuenta: 'IVA Crédito Fiscal', comprobante: 'EGR-001', debe: 120000, haber: 0, saldo: 120000 },
  { id: 6, fecha: '2025-06-05', descripcion: 'Pago de servicios varios', cuenta: 'Caja', comprobante: 'EGR-001', debe: 0, haber: 1320000, saldo: 0 },
  { id: 7, fecha: '2025-06-10', descripcion: 'Venta Industrias DEF S.A.', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-004', debe: 13200000, haber: 0, saldo: 13200000 },
  { id: 8, fecha: '2025-06-10', descripcion: 'Venta Industrias DEF S.A.', cuenta: 'Ingresos por Servicios', comprobante: 'FAC-004', debe: 0, haber: 12000000, saldo: 1200000 },
  { id: 9, fecha: '2025-06-10', descripcion: 'IVA Débito Fiscal 10%', cuenta: 'IVA Débito Fiscal', comprobante: 'FAC-004', debe: 0, haber: 1200000, saldo: 0 },
  { id: 10, fecha: '2025-06-15', descripcion: 'Cobro Empresa ABC FAC-001', cuenta: 'Caja', comprobante: 'REC-001', debe: 5500000, haber: 0, saldo: 5500000 },
  { id: 11, fecha: '2025-06-15', descripcion: 'Cobro Empresa ABC FAC-001', cuenta: 'Cuentas por Cobrar', comprobante: 'REC-001', debe: 0, haber: 5500000, saldo: 0 },
  { id: 12, fecha: '2025-06-20', descripcion: 'Venta Consultora JKL S.A.', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-006', debe: 4950000, haber: 0, saldo: 4950000 },
];

export const mockLibroDiario: LibroEntry[] = diarioEntries;

export const mockLibroMayor: LibroMayor[] = [
  {
    cuenta: 'Caja',
    codigo: '1.1.1',
    entries: [
      { id: 1, fecha: '2025-06-15', descripcion: 'Cobro FAC-001', cuenta: 'Caja', comprobante: 'REC-001', debe: 5500000, haber: 0, saldo: 5500000 },
      { id: 2, fecha: '2025-06-05', descripcion: 'Pago gastos operativos', cuenta: 'Caja', comprobante: 'EGR-001', debe: 0, haber: 1320000, saldo: 4180000 },
      { id: 3, fecha: '2025-06-20', descripcion: 'Cobro FAC-006', cuenta: 'Caja', comprobante: 'REC-002', debe: 4950000, haber: 0, saldo: 9130000 },
    ],
    totalDebe: 10450000,
    totalHaber: 1320000,
    saldoFinal: 9130000,
  },
  {
    cuenta: 'Cuentas por Cobrar',
    codigo: '1.1.2',
    entries: [
      { id: 1, fecha: '2025-06-01', descripcion: 'Venta FAC-001', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-001', debe: 5500000, haber: 0, saldo: 5500000 },
      { id: 2, fecha: '2025-06-10', descripcion: 'Venta FAC-004', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-004', debe: 13200000, haber: 0, saldo: 18700000 },
      { id: 3, fecha: '2025-06-15', descripcion: 'Cobro FAC-001', cuenta: 'Cuentas por Cobrar', comprobante: 'REC-001', debe: 0, haber: 5500000, saldo: 13200000 },
      { id: 4, fecha: '2025-06-20', descripcion: 'Venta FAC-006', cuenta: 'Cuentas por Cobrar', comprobante: 'FAC-006', debe: 4950000, haber: 0, saldo: 18150000 },
    ],
    totalDebe: 23650000,
    totalHaber: 5500000,
    saldoFinal: 18150000,
  },
  {
    cuenta: 'Ingresos por Servicios',
    codigo: '4.1.1',
    entries: [
      { id: 1, fecha: '2025-06-01', descripcion: 'Ingreso FAC-001', cuenta: 'Ingresos por Servicios', comprobante: 'FAC-001', debe: 0, haber: 5000000, saldo: 5000000 },
      { id: 2, fecha: '2025-06-10', descripcion: 'Ingreso FAC-004', cuenta: 'Ingresos por Servicios', comprobante: 'FAC-004', debe: 0, haber: 12000000, saldo: 17000000 },
      { id: 3, fecha: '2025-06-20', descripcion: 'Ingreso FAC-006', cuenta: 'Ingresos por Servicios', comprobante: 'FAC-006', debe: 0, haber: 4500000, saldo: 21500000 },
    ],
    totalDebe: 0,
    totalHaber: 21500000,
    saldoFinal: 21500000,
  },
];

export const mockImpuestos: Impuesto[] = [
  { id: 1, nombre: 'IVA 10%', tipo: 'IVA', tasa: 10, descripcion: 'Impuesto al Valor Agregado tasa general 10%', vigente: true, base: 45000000, monto: 4500000, periodo: 'Junio 2025' },
  { id: 2, nombre: 'IVA 5%', tipo: 'IVA', tasa: 5, descripcion: 'Impuesto al Valor Agregado tasa reducida 5% (inmuebles y capitales)', vigente: true, base: 8000000, monto: 400000, periodo: 'Junio 2025' },
  { id: 3, nombre: 'IRP - Impuesto a la Renta Personal', tipo: 'IRP', tasa: 8, descripcion: 'Impuesto a la Renta Personal para personas físicas', vigente: true, base: 150000000, monto: 12000000, periodo: '2025' },
  { id: 4, nombre: 'IRE - Régimen General', tipo: 'IRE', tasa: 10, descripcion: 'Impuesto a la Renta Empresarial — Régimen General', vigente: true, base: 320000000, monto: 32000000, periodo: '2025' },
  { id: 5, nombre: 'IRE SIMPLE', tipo: 'IRE_SIMPLE', tasa: 10, descripcion: 'IRE Régimen Simplificado — Empresas con ingresos hasta ₲ 2.000.000.000', vigente: true, base: 85000000, monto: 8500000, periodo: '2025' },
  { id: 6, nombre: 'IRE ReSimple', tipo: 'IRE_RESIMPLE', tasa: 3, descripcion: 'IRE Régimen ReSimple — Microempresas con ingresos hasta ₲ 80.000.000', vigente: true, base: 48000000, monto: 1440000, periodo: '2025' },
  { id: 7, nombre: 'ISC - Selectivo al Consumo', tipo: 'ISC', tasa: 5, descripcion: 'Impuesto Selectivo al Consumo para productos específicos', vigente: true, base: 12000000, monto: 600000, periodo: 'Junio 2025' },
  { id: 8, nombre: 'IMAGRO', tipo: 'IMAGRO', tasa: 10, descripcion: 'Impuesto a las Rentas de las Actividades Agropecuarias', vigente: false, base: 0, monto: 0, periodo: '2025' },
];

export const mockAjustes: AjustesContador = {
  nombreEstudio: 'Estudio Contable Rodney Busto',
  ruc: '5.234.567-8',
  direccion: 'Av. Mcal. López 2790 esq. Tres Corrientes, Asunción',
  telefono: '0981-555-123',
  email: 'contacto@bustocontable.com.py',
  logo: null,
  moneda: 'PYG',
  pais: 'Paraguay',
  zonaHoraria: 'America/Asuncion',
  firmaDigital: false,
  timbradoActivo: true,
  numeroTimbrado: '12345678',
  vencimientoTimbrado: '2026-12-31',
};

export const mockDashboardStats: DashboardStats = {
  totalFacturas: 10,
  facturasPendientes: 4,
  facturasVencidas: 1,
  ingresosMes: 45280000,
  ingresosAnio: 312500000,
  totalClientes: 6,
  clientesActivos: 5,
  impuestosMes: 4900000,
};

export const mockChartData = [
  { mes: 'Ene', ingresos: 28000000, gastos: 12000000 },
  { mes: 'Feb', ingresos: 35000000, gastos: 15000000 },
  { mes: 'Mar', ingresos: 42000000, gastos: 18000000 },
  { mes: 'Abr', ingresos: 38000000, gastos: 14000000 },
  { mes: 'May', ingresos: 51000000, gastos: 22000000 },
  { mes: 'Jun', ingresos: 45000000, gastos: 19000000 },
];
