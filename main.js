
function playLink(info, tab) {
    let mpvUrl = 'mpv://' + btoa(info.linkUrl) + "/?quality=best&cookies=no"

    // Chrome falls back to the OS to handle unknown(to it) protocols prior to navigating.
    // Therefore we can just redirect the current tab to this url without fear of disrupting it.
    chrome.tabs.update(
        tab.id, {
        url: mpvUrl
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
