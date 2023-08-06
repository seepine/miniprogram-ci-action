const padZero = (n: number): string => {
  return n < 10 ? `0${n}` : n.toString()
}

export const formatDate = (date: Date, format: string): string => {
  const map = {
    YYYY: date.getFullYear(),
    MM: padZero(date.getMonth() + 1),
    DD: padZero(date.getDate()),
    HH: padZero(date.getHours()),
    mm: padZero(date.getMinutes()),
    ss: padZero(date.getSeconds())
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched])
}
