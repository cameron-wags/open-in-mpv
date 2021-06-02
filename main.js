let settings = {
  mpvPath: 'mpv',
  mpvArgs: [
    {
      name: 'no-border',
      value: null
    },
    {
      name: 'ytdl-format',
      value: 'bestvideo+bestaudio/best'
    },
    {
      name: 'autofit',
      value: '60%'
    }
  ]
}

// Store user options in encoded format
let encoded = {
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

  let mpvUrl = encoded.prefix + btoa(info.linkUrl) + encoded.suffix

  // Chrome falls back to the OS to handle unknown(to it) protocols prior to navigating.
  // Therefore we can just redirect the current tab to this url without fear of disrupting it.
  browser.tabs.update(tab.id, {
    url: mpvUrl
  })
}

browser.runtime.onInstalled.addListener(function (details) {
  encodeSettings(settings)
  browser.menus.create({
    contexts: ['link'],
    enabled: true,
    title: 'Open in MPV',
    type: 'normal',
    visible: true,
    onclick: playLink
  })
})
