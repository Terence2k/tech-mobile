import browser from '../models/browser';

export default function getImageHeight(tplType: number = 2, ratio: number = 1) {
  const clientWidth = browser.state.isMobileBrowser ? document.documentElement.clientWidth : 375;
  // 模板2为48%，模板3为100%
  const width = (clientWidth - 30) * (tplType === 2 ? 0.48 : 1);
  return Math.round(width * ratio);
}
