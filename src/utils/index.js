export function time(eventos, fecha = new Date()) {
  // Utilizar Madrid tanto en la fecha como en el reloj y la búsqueda de festividades.
  const timeZone = 'Europe/Madrid'
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', timeZone }
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)

  const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora)
  const timezoneAbbr = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'short' })
    .formatToParts(fecha).find(({ type }) => type === 'timeZoneName').value

  const partes = new Intl.DateTimeFormat('en-GB', { month: 'numeric', day: 'numeric', timeZone }).formatToParts(fecha)
  const mes = Number(partes.find(({ type }) => type === 'month').value)
  const dia = Number(partes.find(({ type }) => type === 'day').value)
  const eventosEspeciales = eventos[`${mes}-${dia}`] || []
  const fechaYHora = `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada} ${timezoneAbbr}`

  if (eventosEspeciales.length > 0) {
    const eventosTexto = eventosEspeciales.map((evento) => `${evento.evento} ${evento.emojis}`).join(', ')
    return `${fechaYHora} - ${eventosTexto}`
  }
  return fechaYHora
}
