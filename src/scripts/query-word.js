#!/usr/bin/env node

import nouns from '../../public/data/lang/de.json' with { type: 'json' }

const URL = 'https://de.wiktionary.org/wiki/'

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

const queryOnline = async (noun) => {
  noun[1] = noun[1].replace(/[.·]/g, '')
  const response = await fetch(`${URL}${noun[1]}`)
  const text = await response.text()
  const word = (text.split('\n').filter((l) => l.match(/·/))[0] ?? '')
    .replace(/<[^<]*>/g, '')
    .replace(/·/g, '.')
    .split(/,?\s+/)
    .filter((w) => !w.match(/^(kein|Plural:?)$/))
  noun = [noun[0], ...word]
  console.log(JSON.stringify(noun) + ',')
  return noun
}

const query = async (items) => {
  for (let i = 0; i < items.length; i++) {
    await queryOnline(items[i])
    await sleep(500)
  }
}

const sort = (words) =>
  words.sort((a, b) => a[1].replace(/\./g, '').localeCompare(b[1].replace(/\./g, '')))
const sortLength = (words) => words.sort((a, b) => b[1].length - a[1].length)
const uniq = (words) => [...new Set(words.map(JSON.stringify))].map(JSON.parse)
const plain = (words) => words.map((w) => w[1].replace(/\./g, ''))
const upper = (words) => words.map((w) => w[1].toLocaleUpperCase())
const noUmlaut = (words) => words.filter((w) => w[1].match(/^[A-Z]+$/i))

console.log(plain(nouns))
