const bigrams = require('n-gram').bigram
const timer = require('./timer')

module.exports = diceCoefficient

/* Get the edit-distance according to Dice between two values. */
function diceCoefficient(value, alternative) {
  timer.time('metrics', 'diceCoefficient')
  timer.time('metrics', 'bigrams')
  var left = bigrams(String(value).toLowerCase())
  var right = bigrams(String(alternative).toLowerCase())
  timer.timeEnd('metrics', 'bigrams')
  var rightLength = right.length
  var length = left.length
  var index = -1
  var intersections = 0
  var rightPair
  var leftPair
  var offset

  timer.time('metrics', 'outer-while')
  while (++index < length) {
    leftPair = left[index]
    offset = -1

    timer.time('metrics', 'inner-while')
    while (++offset < rightLength) {
      rightPair = right[offset]

      if (leftPair === rightPair) {
        intersections++

        /* Make sure this pair never matches again */
        right[offset] = ''
        break
      }
    }
    timer.timeEnd('metrics', 'inner-while')
  }
  timer.timeEnd('metrics', 'outer-while')

  timer.timeEnd('metrics', 'diceCoefficient')
  return 2 * intersections / (left.length + rightLength)
}