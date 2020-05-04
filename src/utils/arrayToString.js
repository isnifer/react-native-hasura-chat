import { isNil } from 'lodash'

export default function arrayToString(items, delimeter = ', ', defaultValue) {
  const array = items || []

  return array.filter(item => !isNil(item) && item !== '').join(delimeter) || defaultValue
}
