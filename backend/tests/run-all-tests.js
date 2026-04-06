import { spawnSync } from 'node:child_process'

const bunExecutable = process.execPath
const flags = new Set(process.argv.slice(2))
const runIntegration = flags.has('--integration') || flags.has('--all')
const runDataChecks = flags.has('--data') || flags.has('--all')
const requireDb = runIntegration || runDataChecks || flags.has('--db') || flags.has('--all')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

function runStep(name, args) {
  console.log('\n' + colors.cyan + '????????????????????????????????????????????????????' + colors.reset)
  console.log(colors.cyan + name + colors.reset)
  console.log(colors.cyan + '????????????????????????????????????????????????????' + colors.reset)
  const result = spawnSync(bunExecutable, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env
  })
  return result.status === 0
}

const summary = []

summary.push({
  name: 'Unit tests',
  required: true,
  passed: runStep('Unit tests', ['test', 'tests/unit'])
})

let dbReady = true
if (requireDb) {
  dbReady = runStep('Database connectivity', ['src/db/test-connection.js'])
  summary.push({
    name: 'Database connectivity',
    required: true,
    passed: dbReady
  })
}

if (runIntegration && dbReady) {
  summary.push({
    name: 'Auth flow integration test',
    required: true,
    passed: runStep('Auth flow integration test', ['tests/auth-flow.test.js'])
  })
  summary.push({
    name: 'Exam workflow integration test',
    required: true,
    passed: runStep('Exam workflow integration test', ['tests/exam-workflow.test.js'])
  })
} else if (runIntegration && !dbReady) {
  console.log('\n' + colors.yellow + 'Skipping integration tests because database connectivity failed.' + colors.reset)
  summary.push({ name: 'Auth flow integration test', required: true, passed: false, skipped: true })
  summary.push({ name: 'Exam workflow integration test', required: true, passed: false, skipped: true })
}

if (runDataChecks && dbReady) {
  summary.push({
    name: 'Answer accuracy data check',
    required: true,
    passed: runStep('Answer accuracy data check', ['tests/answer-accuracy.test.js'])
  })
  summary.push({
    name: 'Knowledge points data check',
    required: false,
    passed: runStep('Knowledge points data check', ['tests/knowledge-points-validator.js'])
  })
  summary.push({
    name: 'Video links data check',
    required: false,
    passed: runStep('Video links data check', ['tests/video-links-validator.js'])
  })
} else if (runDataChecks && !dbReady) {
  console.log('\n' + colors.yellow + 'Skipping data checks because database connectivity failed.' + colors.reset)
  summary.push({ name: 'Answer accuracy data check', required: true, passed: false, skipped: true })
  summary.push({ name: 'Knowledge points data check', required: false, passed: false, skipped: true })
  summary.push({ name: 'Video links data check', required: false, passed: false, skipped: true })
}

const passedRequired = summary.filter((item) => item.required && item.passed).length
const failedRequired = summary.filter((item) => item.required && !item.passed).length

console.log('\n' + colors.cyan + '????????????????????????????????????????????????????' + colors.reset)
console.log(colors.cyan + 'Test summary' + colors.reset)
console.log(colors.cyan + '????????????????????????????????????????????????????' + colors.reset)
for (const item of summary) {
  const status = item.passed
    ? colors.green + 'PASS' + colors.reset
    : item.skipped
      ? colors.yellow + 'SKIP' + colors.reset
      : colors.red + 'FAIL' + colors.reset
  const suffix = item.required ? 'required' : 'advisory'
  console.log(status + ' ' + item.name + ' (' + suffix + ')')
}
console.log('\nRequired passed: ' + passedRequired)
console.log('Required failed: ' + failedRequired)
process.exit(failedRequired === 0 ? 0 : 1)