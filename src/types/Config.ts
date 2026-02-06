import { Home } from 'pages/Home'
import { Same } from 'pages/Same'
import { SamePreview } from 'pages/Same/preview'
import { Klondike } from 'pages/Klondike'
import { KlondikePreview } from 'pages/Klondike/preview'
import { WordMix } from 'pages/WordMix'
import { WordMixPreview } from 'pages/WordMix/preview'
import type { Viewable } from 'util/ui'

type AppType = {
  run: () => Viewable
  preview?: () => Viewable
}

const pages: Record<string, AppType> = {
  home: {
    run: () => new Home(),
  },
  same: {
    run: () => new Same(),
    preview: () => new SamePreview(),
  },
  wordmix: {
    run: () => new WordMix(),
    preview: () => new WordMixPreview(),
  },
  klondike: {
    run: () => new Klondike(),
    preview: () => new KlondikePreview(),
  },
}

export default {
  CONTEXT: '/kirox/',

  pages,

  isApp: new URLSearchParams(location.search).get('mode') === 'app',

  COLOR: {
    BLACK: ['000000', '505050'],
    GRAPHITE: ['202020', '686868'],
    GRAY: ['404040', '808080'],
    SILVER: ['707070', 'a0a0a0'],
    WHITE: ['c0c0c0', 'f0f0f0'],
    BLUE: ['1020a0', '2040d0'],
    SKY: ['1080e0', '20c0ff'],
    GRASS: ['004000', '208020'],
    GREEN: ['00a000', '40ff40'],
    NEON: ['60a000', '90e020'],
    RED: ['a01000', 'f04030'],
    WINE: ['600000', 'a03030'],
    ORANGE: ['b05000', 'e08040'],
    YELLOW: ['a0a000', 'd8d840'],
    MAGENTA: ['a000a0', 'd840d8'],
    CYAN: ['00a0a0', '40d8d8'],
    BROWN: ['602000', 'a04030'],
  },
}
