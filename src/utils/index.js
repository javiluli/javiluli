const TIME_ZONE = 'Europe/Madrid'

// Formatea fecha, hora y festividad en la misma zona horaria, incluso cerca de medianoche UTC.
export function time(events, date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('es-ES', {
      timeZone: TIME_ZONE,
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]),
  )
  const numericParts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'numeric', day: 'numeric' })
      .formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]),
  )
  const zone = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, timeZoneName: 'short' })
    .formatToParts(date).find(({ type }) => type === 'timeZoneName')?.value ?? TIME_ZONE
  const day = `${parts.weekday.charAt(0).toUpperCase()}${parts.weekday.slice(1)}`
  const holidays = events[`${numericParts.month}-${numericParts.day}`] ?? []
  const suffix = holidays.map(({ evento, emojis }) => `${evento} ${emojis}`).join(', ')
  return `${day}, ${parts.day} de ${parts.month}, ${parts.hour}:${parts.minute} ${zone}${suffix ? ` - ${suffix}` : ''}`
}
