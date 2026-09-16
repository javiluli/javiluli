export function formatDate(eventos, fecha = new Date()) {
  const timeZone = 'Europe/Madrid'
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', timeZone }
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)
  const horaFormateada = fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  })

  // Los tres valores deben calcularse en Madrid, incluso cerca de medianoche.
  const partes = new Intl.DateTimeFormat('en-GB', {
    month: 'numeric', day: 'numeric', timeZoneName: 'short', timeZone,
  }).formatToParts(fecha)
  const parte = (tipo) => partes.find(({ type }) => type === tipo).value
  const eventosEspeciales = eventos[`${Number(parte('month'))}-${Number(parte('day'))}`] || []
  const fechaYHora = `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada} ${parte('timeZoneName')}`

  if (eventosEspeciales.length > 0) {
    const eventosTexto = eventosEspeciales.map((evento) => `${evento.evento} ${evento.emojis}`).join(', ')
    return `${fechaYHora} - ${eventosTexto}`
  }
  return fechaYHora
}
