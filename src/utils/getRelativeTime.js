import { distanceInWordsToNow } from 'date-fns'

export default function getRelativeTime(time) {
  if (!time) {
    return ''
  }

  const transformedTime = distanceInWordsToNow(time)
  if (transformedTime === 'less than a minute') {
    return 'less than a minute ago'
  }

  return `${transformedTime} ago`
    .replace('about', '')
    .replace(' minutes ', 'm ')
    .replace(' minute ', 'm ')
    .replace(' hours ', 'h ')
    .replace(' hour ', 'h ')
    .replace(' days ', 'd ')
    .replace(' day ', 'd ')
}
