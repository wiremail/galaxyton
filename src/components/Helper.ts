// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

export const holdOn = (ms: number) => new Promise(r => setTimeout(r, ms ?? 5000))

export const getQueryVariable = (key: string) => {
  const query = window.location.search.substring(1)
  const params = query.split("&")
  for (let i = 0; i < params.length; i++) {
    const pair = params[i].split("=")
    if (pair[0] === key) {
      return pair[1]
    }
  }
  return
}

export function tryParseJSON(jsonString: string) {
  try {
    const o = JSON.parse(jsonString)
    if (o && typeof o === "object") return o
  }
  catch (e) { }

  return false
}

export function formatDate(date: any) {
  const f = (n: number) => `0${n}`.slice(-2)
  const d = new Date(date)
  return `${f(d.getDate())}.${f(d.getMonth() + 1)}.${d.getFullYear()} ${f(d.getHours())}:${f(d.getMinutes())}`
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)

  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(':')
}

export function replaceAt(str: string, index: number, offset: number, replacement: string) {
  return str.substring(0, index) + replacement + str.substring(index + offset)
}

export function blockBet(blockId: string, payrollCoin: string) {
  if (localStorage.getItem(blockId) === null) return 0

  const bet = JSON.parse(localStorage.getItem(blockId) || '')
  if (bet?.coin !== payrollCoin) return 0

  return `${bet?.trend.toUpperCase() === 'UP' ? '↑' : '↓'} ${bet?.amount} ${bet?.coin} `
}

export function clearExpiredBets() {
  for (let key in localStorage) {
    const jsonObj = tryParseJSON(localStorage.getItem(key) || '')
    if (
      jsonObj &&
      jsonObj?.timestamp &&
      jsonObj?.timestamp + 720000 < Date.now()
    ) {
      localStorage.removeItem(key)
    }
  }
}

export function setBets(bets: any) {
  if (bets && bets.length) {
    for (let bet of bets) {
      if (localStorage.getItem(bet.blockId) === null) {
        const data = {
          amount: bet.amount,
          trend: bet.trend,
          timestamp: new Date(bet.createdAt).getTime()
        }
        localStorage.setItem(bet.blockId, JSON.stringify(data))
      }
    }
  }
}