const testCases = require('./testCases')
const diceCoefficient = require('./index')

const times = 1000
let results = []
let counter

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

console.log(results.filter(el => el.coefficient > 0.5))