const fetch = require('isomorphic-fetch')
const BASE_URL = 'https://aurorasolar.atlassian.net/rest/api/3'
const username = process.env.JIRA_USERNAME
const password = process.env.JIRA_TOKEN
const token = Buffer.from(`${username}:${password}`).toString(
  'base64',
)
exports.search = () =>
  fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${Buffer.from(
        `${username}:${password}`,
      ).toString('base64')}`,
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: JSON.stringify({
      jql: `project=APP AND assignee=${
        username.split('@')[0]
      } AND status!=Closed`,
      fields: ['id', 'summary'],
      maxResults: 100,
    }),
  })
    .then(res => res.json())
    .then(result => {
      if (!result.issues) {
        throw new Error('no')
      }
      return result.issues
    })
    .catch(() => [])
