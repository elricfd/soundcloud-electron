// Spoofs navigator.userAgentData so it matches our spoofed UA string and headers.
// Real Chrome's userAgentData reports "Google Chrome"; Electron's reports "Chromium" + a
// "Not Brand" placeholder. Anti-bot scripts compare this against the UA string and the
// Sec-CH-UA headers — any mismatch is an instant flag.

const chromeMajor = process.versions.chrome.split('.')[0];
const chromeFull = process.versions.chrome;

const brands = [
  { brand: 'Chromium', version: chromeMajor },
  { brand: 'Google Chrome', version: chromeMajor },
  { brand: 'Not.A/Brand', version: '99' }
];

const fullVersionList = [
  { brand: 'Chromium', version: chromeFull },
  { brand: 'Google Chrome', version: chromeFull },
  { brand: 'Not.A/Brand', version: '99.0.0.0' }
];

const fakeUAData = {
  brands,
  mobile: false,
  platform: 'Windows',
  getHighEntropyValues(hints) {
    return Promise.resolve({
      architecture: 'x86',
      bitness: '64',
      brands,
      fullVersionList,
      mobile: false,
      model: '',
      platform: 'Windows',
      platformVersion: '15.0.0',
      uaFullVersion: chromeFull,
      wow64: false
    });
  },
  toJSON() {
    return { brands, mobile: false, platform: 'Windows' };
  }
};

Object.defineProperty(Navigator.prototype, 'userAgentData', {
  configurable: true,
  enumerable: true,
  get() { return fakeUAData; }
});

// Belt-and-suspenders: navigator.webdriver should never be true.
// The disable-blink-features=AutomationControlled flag should handle this, but
// some older detectors check the property directly.
Object.defineProperty(Navigator.prototype, 'webdriver', {
  configurable: true,
  enumerable: true,
  get() { return undefined; }
});

console.log('[preload] userAgentData spoof installed:', navigator.userAgentData);