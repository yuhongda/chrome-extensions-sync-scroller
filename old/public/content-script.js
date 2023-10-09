let __sync_scroller_locker = null;

window.addEventListener("scroll", async function () {
	if (__sync_scroller_locker) {
		window.clearTimeout(__sync_scroller_locker);
	}

	__sync_scroller_locker = window.setTimeout(function () {
		chrome.runtime.sendMessage(
			{ posY: window.scrollY },
			function (response) {}
		);
	}, 500);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	window.scrollTo({
		top: request.posY,
		left: 0,
		behavior: "smooth",
	});
});
