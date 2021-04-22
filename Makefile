
INSTALL = /usr/local/bin
DOTDESKTOP = ~/.local/share/applications
MIME = ~/.config

build: clean
	@echo building
	@go build -o open-in-mpv app/openMpv.go

clean:
	@echo cleaning open-in-mpv
	@rm -f open-in-mpv

install: build
	@echo installing to ${INSTALL}
	@mkdir -p ${INSTALL}
	@cp -f open-in-mpv ${INSTALL}
	@chmod 755 ${INSTALL}/open-in-mpv
	@chmod u+s ${INSTALL}/open-in-mpv

uninstall:
	@echo removing ${INSTALL}/open-in-mpv
	@rm -f ${INSTALL}/open-in-mpv

desktop:
	@echo registering handler for mpv:// urls
	@cp -f linux/open-in-mpv.desktop ${DOTDESKTOP}
	@chmod 644 ${DOTDESKTOP}/open-in-mpv.desktop
	@xdg-mime default open-in-mpv.desktop x-scheme-handler/mpv

.PHONY: build clean install uninstall
