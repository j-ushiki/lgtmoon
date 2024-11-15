// contentScript.js
function copyToClipboard(url) {
  navigator.clipboard.writeText(url).then(() => {
    console.log('Image URL copied to clipboard:', url);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}