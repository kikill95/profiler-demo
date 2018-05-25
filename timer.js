const log = console // or other module

let starts = {}
let totals = {}
let counters = {}

function time (group, name) {
  starts[group] = starts[group] || {}

  starts[group][name] = process.hrtime()
}

function timeEnd (group, name) {
  let start = starts[group][name]
  let diff = process.hrtime(start)

  totals[group] = totals[group] || {}

  let total = totals[group][name] || [0, 0]
  total[0] += diff[0]
  total[1] += diff[1]
  totals[group][name] = total

  count(group, name)
}

function count (group, name) {
  counters[group] = counters[group] || {}

  let count = counters[group][name] || 0
  count += 1
  counters[group][name] = count
}

let formatLog = (group) => (name) => {
  let count = counters[group][name]
  counters[group][name] = 0

  let totalS
  let operationMs
  if (totals[group] && totals[group][name]) {
    let nano = (totals[group][name][0] * 1e9) + totals[group][name][1]
    let avg = (nano / count)

    totalS = nano * 1e-9
    operationMs = avg * 1e-6
    totals[group][name] = [0, 0]
  } else {
    totalS = '-'
    operationMs = '-'
  }

  return `${name} | ${totalS} | ${count} | ${operationMs}`
}

function logGroup (group) {
  if (counters[group]) {
    log.info(`
${group}

What | Total s | Count | Operation ms
-----+----------+-------+-------------
${Object.keys(counters[group]).map(formatLog(group)).join('\n')}
    `)

    totals[group] = undefined
    counters[group] = undefined
  }
}

function logAll () {
  Object.keys(counters).map(logGroup)
}

function exportAll () {
  let ex = {totals, counters}
  totals = {}
  counters = {}

  return ex
}

function importAll (imp) {
  Object.keys(imp.counters).forEach((group) => {
    counters[group] = counters[group] || {}

    Object.keys(imp.counters[group]).forEach((name) => {
      let count = counters[group][name] || 0
      count += imp.counters[group][name]
      counters[group][name] = count
    })
  })

  Object.keys(imp.totals).forEach((group) => {
    totals[group] = totals[group] || {}

    Object.keys(imp.totals[group]).forEach((name) => {
      let total = totals[group][name] || [0, 0]
      total[0] += imp.totals[group][name][0]
      total[1] += imp.totals[group][name][1]
      totals[group][name] = total
    })
  })
}

module.exports.time = time
module.exports.timeEnd = timeEnd
module.exports.count = count
module.exports.formatLog = (group, name) => log.info(formatLog(group)(name))
module.exports.logGroup = logGroup
module.exports.logAll = logAll
module.exports.exportAll = exportAll
module.exports.importAll = importAll
