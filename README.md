# Chrome extension to open video links with mpv
Adds a context menu option so that youtube can be browsed normally as well.
It might not work for most sites, but it works for youtube.

## Dependencies
 - [mpv](https://mpv.io)
 - [youtube-dl](https://github.com/ytdl-org/youtube-dl/releases)
 - [mpv-handler](https://github.com/akiirui/mpv-handler/)

mpv-handler isn't technically a dependency, as long as _something_ registers itself as the handler for the protocol mpv-handler implements.

## Acknowledgements
This extension piggy-backs off of [akiirui's userscript](https://github.com/akiirui/userscript/tree/play-with-mpv-handler) and [mpv-handler](https://github.com/akiirui/mpv-handler/), which were the inspiration for this project.
