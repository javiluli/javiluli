export function time(eventos) {
  const fecha = new Date()
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const clave = `${mes}-${dia}`

  const eventosEspeciales = eventos[clave] || []
  const resultado = {
    fecha: fecha.toLocaleDateString('es-ES'),
    eventos: eventosEspeciales.length > 0 ? eventosEspeciales : null,
  }

  if (resultado.eventos) return `${resultado.fecha} - ${resultado.eventos[0].evento} ${resultado.eventos[0].emojis}`
  return `${resultado.fecha}`
}
