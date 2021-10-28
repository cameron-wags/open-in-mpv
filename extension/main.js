const settings = {
  mpvPath: 'streamlink',
  mpvArgs: [
    // {
    //   name: 'no-border',
    //   value: null
    // },
    {
      name: 'player',
      value: 'mpv'
    }
    // {
    //   name: 'autofit',
    //   value: '60%'
    // },
    // {
    //   name: 'hwdec',
    //   value: 'auto'
    // }
  ]
}

// Store user options in encoded format
const encoded = {
  prefix: null,
  suffix: null
}

function encodeSettings (settings) {
  encoded.prefix = 'mpv://' + btoa(settings.mpvPath) + '_'
  encoded.suffix = settings.mpvArgs.reduce((acc, cur) => {
    acc += '_' + btoa(cur.name) + '_'

    if (cur.value !== null) {
      acc += btoa(cur.value)
    }

    return acc
  }, '')
}

function playLink (info, tab) {
  if (encoded.prefix === null || encoded.suffix === null) {
    encodeSettings(settings)
  }

  const mpvUrl = encoded.prefix + btoa(info.linkUrl) + encoded.suffix

  // Chrome falls back to the OS to handle unknown(to it) protocols prior to navigating.
  // Therefore we can just redirect the current tab to this url without fear of disrupting it.
  chrome.tabs.update(tab.id, {
    url: mpvUrl
  })
}

chrome.runtime.onInstalled.addListener(function (details) {
  encodeSettings(settings)
  chrome.contextMenus.create({
    contexts: ['link'],
    enabled: true,
    title: 'Open in MPV',
    type: 'normal',
    visible: true,
    onclick: playLink
  })
})
