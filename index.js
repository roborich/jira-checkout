const { AutoComplete, Snippet } = require('enquirer')
const { search } = require('./jira')
const { kebabCase } = require('lodash')
const { exec } = require('child_process')

;(async () => {
  const issues = await search()

  const selection = await new AutoComplete({
    name: 'issue',
    message: 'pick an issue',
    limit: 5,
    choices: issues.map(
      ({ key, fields }) => `${key} ${fields.summary}`,
    ),
  }).run()

  const [id] = selection.match(/APP-\d+/)
  const defaultSuffix = kebabCase(selection.substring(id.length))
  const fields = await new Snippet({
    name: 'farm',
    message: 'Format your branch name',
    //required: true,
    fields: [],
    template: `\${prefix:feat}/${id}-\${suffix:${defaultSuffix}}`,
  })
    .run()
    .catch(err => console.error('oh poo', err))

  exec(`git checkout -b ${fields.result}`)
})()
