let text = [];
const API = "https://chatgpt-demo-s8o2.vercel.app/api/generate";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ text, enable: false, lang: "Chinese" });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.sync.get(["text", "enable", "lang"], async function (result) {
    if (!result.enable) {
      // chrome.storage.sync.set({ pos: [], enable: false });
      return;
    }

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      body: JSON.stringify({ animal: request.text, lang: result.lang }),
    });
    const data = await response.json();

    const _text = result.text;
    const _index = _text.findIndex(
      (item) => item.url.split("#")[0] === sender.tab.url.split("#")[0]
    );
    if (_index !== -1) {
      _text[_index].text = request.text;
      _text[_index].result = data.result;
    } else {
      _text.push({
        url: sender.tab.url,
        text: request.text,
        result: data.result,
      });
    }

    chrome.storage.sync.set({ pos: _text });

    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ["normal", "panel", "popup"],
      },
      function (windows) {
        windows.forEach((window) => {
          window.tabs.forEach((tab) => {
            const foundPos = _text.find(
              (item) => item.url.split("#")[0] === tab.url.split("#")[0]
            );
            if (foundPos) {
              chrome.tabs.sendMessage(tab.id, {
                text: foundPos.text,
                result: foundPos.result,
              });
            }
          });
        });
      }
    );
  });
	return true;
});
