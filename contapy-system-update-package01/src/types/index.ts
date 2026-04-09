export type UserRole = 'Admin' | 'Contador' | 'Viewer';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isSuperuser: boolean;
}

export interface Cliente {
  id: number;
  razonSocial: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface Factura {
  id: number;
  numero: string;
  clienteId: number;
  clienteNombre: string;
  clienteRuc: string;
  fecha: string;
  vencimiento: string;
  subtotal: number;
  iva10: number;
  iva5: number;
  total: number;
  estado: 'Pagada' | 'Pendiente' | 'Vencida' | 'Anulada';
  tipo: 'Contado' | 'Crédito';
}

export interface LibroEntry {
  id: number;
  fecha: string;
  descripcion: string;
  cuenta: string;
  debe: number;
  haber: number;
  saldo: number;
  comprobante: string;
}

export interface LibroMayor {
  cuenta: string;
  codigo: string;
  entries: LibroEntry[];
  totalDebe: number;
  totalHaber: number;
  saldoFinal: number;
}

export interface Impuesto {
  id: number;
  nombre: string;
  tipo: 'IVA' | 'IRP' | 'IRE' | 'IRE_SIMPLE' | 'IRE_RESIMPLE' | 'ISC' | 'IMAGRO';
  tasa: number;
  descripcion: string;
  vigente: boolean;
  base: number;
  monto: number;
  periodo: string;
}

export interface AjustesContador {
  nombreEstudio: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  logo: string | null;
  moneda: string;
  pais: string;
  zonaHoraria: string;
  firmaDigital: boolean;
  timbradoActivo: boolean;
  numeroTimbrado: string;
  vencimientoTimbrado: string;
}

export interface DashboardStats {
  totalFacturas: number;
  facturasPendientes: number;
  facturasVencidas: number;
  ingresosMes: number;
  ingresosAnio: number;
  totalClientes: number;
  clientesActivos: number;
  impuestosMes: number;
}
