const open = require('open')
const { execSync } = require('child_process')

;(async () => {
  const branch = execSync('git symbolic-ref --short HEAD', {
    encoding: 'utf8',
  })
  const [id] = branch.match(/APP-\d+/)
  if (!id) {
    return console.error('No Jira key found in branch name')
  }
  const url = `https://aurorasolar.atlassian.net/browse/${id}`
  await open(url)
  console.log(`Opening - ${url}`)
})()
