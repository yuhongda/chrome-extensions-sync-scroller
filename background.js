let pos = []

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ pos, enable: false })
})

const updatePos = (request, sender, sendResponse) => {
  chrome.storage.sync.get(['enable', 'pos', 'scale'], async function (result) {
    if (!result.enable) {
      return
    }

    const _pos = result.pos
    console.log(_pos)

    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ['normal', 'panel', 'popup'],
      },
      function (windows) {
        windows.forEach(window => {
          window.tabs.forEach(tab => {
            const foundPos = _pos.find(item => item.url.split('#')[0] === tab.url.split('#')[0])
            if (foundPos) {
              chrome.tabs.sendMessage(tab.id, {
                posY: foundPos.y * (foundPos.scale || 1),
              })
            }
          })
        })
      },
    )

    const _index = _pos.findIndex(item => item.url.split('#')[0] === sender.tab.url.split('#')[0])
    if (_index !== -1) {
      _pos[_index].y = request.posY * (request.scale || 1)
      _pos[_index].scale = request.scale || 1
    } else {
      _pos.push({
        url: sender.tab.url,
        y: request.posY * (request.scale || 1),
        scale: request.scale || 1,
      })
    }

    chrome.storage.sync.set({ pos: _pos })
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  updatePos(request, sender, sendResponse)
  return true
})

chrome.tabs.onUpdated.addListener(function (request, sender, sendResponse) {
  updatePos(request, sender, sendResponse)
  return true
})
chrome.tabs.onHighlighted.addListener(function (request, sender, sendResponse) {
  updatePos(request, sender, sendResponse)
  return true
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  const { pos } = changes
  if (!pos) return
  const { newValue, oldValue } = pos
  if (!newValue || !oldValue) return
  // find the item that has different value of the key 'y' in newValue and oldValue
  const diff = newValue.find(item => oldValue.find(oldItem => oldItem.url === item.url && oldItem.y !== item.y))
  if (!diff) return
  const { url, y, scale } = diff
  updatePos({ posY: y, scale }, { tab: { url } }, null)
})
