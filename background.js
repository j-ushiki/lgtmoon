// background.js
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
  const generateValidImageUrl = async () => {
    while (true) {
      const randomId = Math.floor(Math.random() * 275513);
      const imageUrl = `https://image.lgtmoon.dev/${randomId}`;
      
      try {
        // 1秒待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(imageUrl);
        if (response.ok) {
          return imageUrl;
        }
      } catch (err) {
        console.error('画像の検証に失敗:', err);
        // エラー時も1秒待機してから次の試行
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  // 毎回新しい実行を開始
  generateValidImageUrl().then(validImageUrl => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (url) => {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Copied to clipboard:', url);
      },
      args: [validImageUrl]
    });
  }).catch(err => {
    console.error('Failed to execute script:', err);
  });
});