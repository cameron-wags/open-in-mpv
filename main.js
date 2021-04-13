
function playLink(info, tab) {
    console.log(tab)
    console.log(info)
    console.log('Got link: ' + info.linkUrl)

    let mpvUrl = 'mpv://' + btoa(info.linkUrl) + "/?quality=best&cookies=no"

    chrome.tabs.create({
        active: true,
        url: mpvUrl,
        index: tab.index // add 1 instead to open to the right of the current tab
    })
}

chrome.contextMenus.onClicked.addListener(playLink)

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'Open in MPV',
        type: 'normal',
        id: 'MPV' + '_id',
        contexts: ['link'],
    });
});
