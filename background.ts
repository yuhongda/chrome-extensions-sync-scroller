export type Pos = {
  url: string
  y: number
  scale?: number
}

let pos: Pos[] = []

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ pos, enable: false })
})

const updatePos = (request: any, sender: any, sendResponse: any) => {
  chrome.storage.sync.get(['enable', 'pos'], async function (result) {
    if (!result.enable) {
      return
    }

    const _pos = result.pos

    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ['normal', 'panel', 'popup'],
      },
      function (windows) {
        windows.forEach(window => {
          window.tabs?.forEach(tab => {
            const foundPos = _pos.find((item: Pos) => item.url.split('#')[0] === tab.url?.split('#')[0])
            if (foundPos && tab.id) {
              chrome.tabs.sendMessage(tab.id, {
                posY: foundPos.y * (foundPos.scale || 1),
              })
            }
          })
        })
      },
    )

    const _index = _pos.findIndex((item: Pos) => item.url.split('#')[0] === sender.tab.url.split('#')[0])
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

chrome.storage.onChanged.addListener((changes: Record<string, any>, areaName: string) => {
  const { pos } = changes
  if (!pos) return
  const { newValue, oldValue } = pos
  if (!newValue || !oldValue) return
  // find the item that has different value of the key 'y' in newValue and oldValue
  const diff = newValue.find((item: Pos) =>
    oldValue.find((oldItem: Pos) => oldItem.url === item.url && oldItem.y !== item.y),
  )
  if (!diff) return
  const { url, y, scale } = diff
  updatePos({ posY: y, scale }, { tab: { url } }, null)
})
