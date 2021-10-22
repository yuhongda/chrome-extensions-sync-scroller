/* eslint-disable no-undef */
let pos = [];

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ pos, enable: false });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	chrome.storage.sync.get(["pos", "enable"], function (result) {
		console.log(result)
		if (!result.enable) {
			// chrome.storage.sync.set({ pos: [], enable: false });
			return;
		}

		const _pos = result.pos;
		const _index = _pos.findIndex((item) => item.url === sender.tab.url);
		if (_index !== -1) {
			_pos[_index].y = request.posY;
		} else {
			_pos.push({
				url: sender.tab.url,
				y: request.posY,
			});
		}
		chrome.storage.sync.set({ pos: _pos });

		chrome.windows.getAll(
			{
				populate: true,
				windowTypes: ["normal", "panel", "popup"],
			},
			function (windows) {
				windows.forEach((window) => {
					window.tabs.forEach((tab) => {
						const foundPos = _pos.find((item) => item.url === tab.url);
						if (foundPos) {
							chrome.tabs.sendMessage(tab.id, { posY: foundPos.y });
						}
					});
				});
			}
		);
	});
});
