// Allt varumärkesinnehåll på ett ställe. Byt namn, ticker, CA och länkar här.
export const BRAND = {
  name: 'AnyShip',
  ticker: 'SHIP',
  tagline: 'Describe it. Ship it.',
  site: 'https://www.useanyship.fun',
  xUrl: 'https://x.com/UseAnyShip',
  xHandle: '@UseAnyShip',
  // TODO(branding): klistra in tokenens contract address efter launch
  ca: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxpump',
  // TODO(branding): treasury-plånboken som tar emot launch-avgifter
  treasury: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  launchFeeSol: 0.025,
  creatorShare: 50,
  buildMinutes: 20,
} as const

export const isPlaceholderAddress = (addr: string) => /^x+(pump)?$/i.test(addr)

export const links = {
  pumpFun: (mint: string) => `https://pump.fun/coin/${mint}`,
  dexscreener: (mint: string) => `https://dexscreener.com/solana/${mint}`,
  solscan: (mint: string) => `https://solscan.io/token/${mint}`,
}
