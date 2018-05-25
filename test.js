const testCases = require('./testCases')
const diceCoefficient = require('./index')
const timer = require('./timer')

const times = 100000
let results = []
let counter

timer.time('metrics', 'wrapper')

for (counter = 0; counter < 100; counter++) {
  testCases.forEach(([case1, case2]) => {
    let coefficient = diceCoefficient(case1, case2)
    if (coefficient > 0) {
      results.push({
        coefficient: coefficient,
        strings: [case1, case2]
      })
    }
  })
}

timer.timeEnd('metrics', 'wrapper')
timer.time('metrics', 'before-filter')

let filtered = results.filter(el => el.coefficient > 0.5)

timer.timeEnd('metrics', 'before-filter')

timer.logAll()
