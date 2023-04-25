chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getUrls') {
      const urls = getUrlsFromPage();
      sendResponse(urls);
    }
  });
  
  function getUrlsFromPage() {
    const links = document.getElementsByTagName('a');
    const urls = [];
  
    for (let i = 0; i < links.length; i++) {
      const url = links[i].href;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.push(url);
      }
    }
  
    return urls;
  }
  