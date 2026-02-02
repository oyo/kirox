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
  noun = [...noun, ...word]
  console.log(JSON.stringify(noun) + ',')
  return noun
}

const query = async (items) => {
  for (let i = 0; i < items.length; i++) {
    await queryOnline(items[i])
    await sleep(500)
  }
}

const removeDuplicates = (nouns) => {
  const words = nouns.map(JSON.stringify)
  const uni = [...new Set(words)].map(JSON.parse)
  console.log(JSON.stringify(uni))
}

const listWords = (words) =>
  console.log(
    JSON.stringify([
      ...new Set(
        words.map((w) => w[1].replace(/\./g, '')).sort((a, b) => b.length - a.length)
      ),
    ])
  )

const groupByLength = (words) =>
  words.reduce(
    (a, c) => (
      (a[c[1].replace(/\./g, '').length] ??= []).push(c[1].replace(/\./g, '')),
      a
    ),
    {}
  )

console.log(groupByLength(nouns))

//const miss = uni.filter(w => !words.includes(w[1]))
////console.log(miss.length, miss)
//
//query(miss)
