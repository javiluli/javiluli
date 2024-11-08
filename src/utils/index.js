export function time(eventos) {
  const fecha = new Date()
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long' }
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)

  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const clave = `${mes}-${dia}`

  const eventosEspeciales = eventos[clave] || []

  if (eventosEspeciales.length > 0) {
    const eventosTexto = eventosEspeciales.map((evento) => `${evento.evento} ${evento.emojis}`).join(', ')
    return `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${fecha.getHours()}:${fecha.getMinutes()} CET - ${eventosTexto}`
  } else {
    return `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${fecha.getHours()}:${fecha.getMinutes()} CET`
  }
}
