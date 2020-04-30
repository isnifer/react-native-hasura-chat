import { distanceInWordsToNow } from 'date-fns'

export default function getRelativeTime(time) {
  return `${distanceInWordsToNow(time || '2020-04-19T17:20:00Z')} ago`
    .replace('about', '')
    .replace(' minutes ', 'm ')
    .replace(' minute ', 'm ')
    .replace(' hours ', 'h ')
    .replace(' hour ', 'h ')
    .replace(' days ', 'd ')
    .replace(' day ', 'd ')
}
