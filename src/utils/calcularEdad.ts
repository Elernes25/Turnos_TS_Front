const obtenerFechaCalendario = (valor: string): Date | null => {
  const coincidencia = valor.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (!coincidencia) return null;

  const [, anioTexto, mesTexto, diaTexto] = coincidencia;
  const anio = Number(anioTexto);
  const mes = Number(mesTexto);
  const dia = Number(diaTexto);
  const fecha = new Date(anio, mes - 1, dia);

  if (
    fecha.getFullYear() !== anio
    || fecha.getMonth() !== mes - 1
    || fecha.getDate() !== dia
  ) {
    return null;
  }

  return fecha;
};

export const calcularEdad = (
  fechaNacimiento?: string,
  fechaReferencia?: string | Date,
): number | null => {
  if (!fechaNacimiento) return null;

  const nacimiento = obtenerFechaCalendario(fechaNacimiento);
  if (!nacimiento) return null;

  let referencia: Date;
  if (fechaReferencia instanceof Date) {
    referencia = fechaReferencia;
  } else if (fechaReferencia) {
    const referenciaCalendario = obtenerFechaCalendario(fechaReferencia);
    if (!referenciaCalendario) return null;
    referencia = fechaReferencia.length > 10 ? new Date(fechaReferencia) : referenciaCalendario;
  } else {
    referencia = new Date();
  }

  if (Number.isNaN(referencia.getTime())) return null;

  let edad = referencia.getFullYear() - nacimiento.getFullYear();
  if (
    referencia.getMonth() < nacimiento.getMonth()
    || (
      referencia.getMonth() === nacimiento.getMonth()
      && referencia.getDate() < nacimiento.getDate()
    )
  ) {
    edad -= 1;
  }

  return edad >= 0 ? edad : null;
};
