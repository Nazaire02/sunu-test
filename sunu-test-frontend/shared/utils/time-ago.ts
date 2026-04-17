export function timeAgo(date: string | Date, locale = 'fr') {
  const now = new Date().getTime()
  const past = new Date(date).getTime()
  const diffInSeconds = Math.floor((now - past) / 1000)

  const intervals = [
    { label: 'an', seconds: 31536000 },
    { label: 'mois', seconds: 2592000 },
    { label: 'jour', seconds: 86400 },
    { label: 'heure', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `il y a ${count} ${interval.label}${count > 1 && interval.label !== 'mois' ? 's' : ''}`
    }
  }

  return "à l'instant"
}
