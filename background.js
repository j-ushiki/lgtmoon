// background.js
const cache = new Map();
// chrome.action APIが利用可能になるまで待機
self.oninstall = () => {
  console.log('Extension installed');
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension initialized');
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

chrome.action.onClicked.addListener((tab) => {
  async function generateValidImageUrl() {
    const randomId = Math.floor(Math.random() * 275513);
    const imageUrl = `https://image.lgtmoon.dev/${randomId}`;

    // 1秒待機
    await new Promise(resolve => setTimeout(resolve, 1000));

    // すでにキャッシュにある場合はスキップ
    if (cache.has(imageUrl)) {
      if (cache.get(imageUrl) === true) {
        return `![LGTM](${imageUrl})`;
      }
      return generateValidImageUrl();
    }

    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        cache.set(imageUrl, true);
        return `![LGTM](${imageUrl})`;
      }
      cache.set(imageUrl, false);
      return generateValidImageUrl();
    } catch (err) {
      console.error('画像の検証に失敗:', err);
      cache.set(imageUrl, false);
      return generateValidImageUrl();
    }
  }

  generateValidImageUrl().then(markdownText => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      },
      args: [markdownText]
    }).then(() => {
      // コピー成功時に通知を表示
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'LGTM Image URL Copied',
        message: 'クリップボードにURLをコピーしました'
      });
    });
  });
});