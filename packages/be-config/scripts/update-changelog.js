'use strict'

const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

function getISODateStringFrom(aJSDate) {
  return aJSDate
    .toISOString()
    .split('T')
    .shift()
}

function getNewContentForCHANGELOG({ aSemVerString, anISODateString }) {
  return `[Unreleased]\n\n## [${aSemVerString}] ${anISODateString}`
}

const CHANGELOG_PATH = join(__dirname, '../CHANGELOG.md')

let changelog = readFileSync(CHANGELOG_PATH, { encoding: 'utf-8' })

changelog = changelog.replace('[Unreleased]', getNewContentForCHANGELOG({
  aSemVerString: process.argv[2],
  anISODateString: getISODateStringFrom(new Date()),
}))

writeFileSync(CHANGELOG_PATH, changelog)
