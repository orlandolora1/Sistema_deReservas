// Convierte "2026-10-30" y "14:30" en un objeto Date (hora local)
export function unirFechaHora(fecha: string, hora: string): Date | null {
  const okFecha = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
  const okHora = /^\d{2}:\d{2}$/.test(hora);
  if (!okFecha || !okHora) return null;

  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  const resultado = new Date(anio, mes - 1, dia, h, m);

  return isNaN(resultado.getTime()) ? null : resultado;
}

export function formatearFecha(iso: string) {
  const d = new Date(iso);
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}
