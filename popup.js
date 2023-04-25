document.addEventListener('DOMContentLoaded', () => {
    const urlList = document.getElementById('url-list');
    const deleteButton = document.getElementById('delete-button');
    const exportButton = document.getElementById('export-button');
  
    urlList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        chrome.tabs.create({ url: event.target.href });
      }
    });
  
    function addUrlsToPage(urls) {
      urlList.innerHTML = '';
  
      urls.forEach((url) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        listItem.appendChild(link);
        urlList.appendChild(listItem);
      });
    }
  
    function deleteSelectedUrls() {
      const selectedItems = urlList.querySelectorAll('li.selected');
      selectedItems.forEach((item) => {
        item.remove();
      });
    }
  
    function exportListToCsv(urls) {
      const csv = urls.join('\n');
      const url = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      chrome.downloads.download({
        url: url,
        filename: 'urls.csv',
      });
    }
  
    deleteButton.addEventListener('click', deleteSelectedUrls);
    exportButton.addEventListener('click', () => {
      getUrlsFromPage().then((urls) => {
        exportListToCsv(urls);
      });
    });
  
    function getUrlsFromPage() {
      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              files: ['content.js'],
            },
            (result) => {
              if (
                chrome.runtime.lastError ||
                !result ||
                !result[0] ||
                !result[0].result
              ) {
                console.error('Failed to get URLs from page');
                return;
              }
              resolve(result[0].result);
            }
          );
        });
      });
    }
  
    getUrlsFromPage().then((urls) => {
      addUrlsToPage(urls);
    });
  });
  