export default function time() {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const key = `${month}-${day}`

  const eventosEspeciales = eventos[key] || []

  if (eventosEspeciales.length > 0) {
    eventosEspeciales.forEach((evento) => {
      console.log(`Evento: ${evento.evento}, Emojis: ${evento.emojis}`)
    })
  } else {
    console.log('No hay eventos especiales para hoy.')
  }
}
