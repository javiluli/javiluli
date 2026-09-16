export function time(eventos) {
  const fecha = new Date()
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long' }
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)

  // Convertir la hora a la zona horaria de Madrid
  const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' }
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora)

  // Determinar si es horario de verano (CEST) o invierno (CET)
  const isDaylightSaving = fecha.toLocaleTimeString('es-ES', { timeZoneName: 'short', timeZone: 'Europe/Madrid' }).includes('CEST')
  const timezoneAbbr = isDaylightSaving ? 'CEST' : 'CET'

  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const clave = `${mes}-${dia}`

  const eventosEspeciales = eventos[clave] || []

  if (eventosEspeciales.length > 0) {
    const eventosTexto = eventosEspeciales.map((evento) => `${evento.evento} ${evento.emojis}`).join(', ')
    return `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada} ${timezoneAbbr} - ${eventosTexto}`
  } else {
    return `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada} ${timezoneAbbr}`
  }
}
