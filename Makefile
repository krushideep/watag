.PHONY: help build clean demo demo-video demo-gif package install store-assets

DIST_DIR    := dist
DIST_ZIP    := $(DIST_DIR)/watag.zip
DEMO_DIR    := demo
RECORDING   := $(DEMO_DIR)/recording/main
STORE_DIR   := store

help:
	@echo "Targets:"
	@echo "  make build         Package the extension into $(DIST_ZIP)"
	@echo "  make clean         Remove build artifacts (dist/, store PNGs, demo scratch dirs)"
	@echo "  make install       Install demo dependencies (npm install in demo/)"
	@echo "  make demo          Record a fresh demo video via Playwright"
	@echo "  make demo-video    Concat recorded clips into demo/demo.mp4"
	@echo "  make demo-gif      Encode demo/demo.mp4 into demo/demo.gif"
	@echo "  make store-assets  Regenerate Chrome Web Store screenshots + promo tile from demo/demo.gif"
	@echo "  make package       Alias for build"

# Zip up the extension source (manifest + scripts + icons) for distribution,
# e.g. uploading to the Chrome Web Store.
build:
	@mkdir -p $(DIST_DIR)
	@rm -f $(DIST_ZIP)
	@zip -r $(DIST_ZIP) \
		manifest.json background.js content.js content.css \
		popup.html popup.js popup.css icons \
		-x '*.DS_Store'
	@echo "Built $(DIST_ZIP)"

package: build

clean:
	rm -rf $(DIST_DIR)
	rm -rf $(DEMO_DIR)/.pw-profile $(DEMO_DIR)/.ext-copy $(DEMO_DIR)/recording $(DEMO_DIR)/demo.mp4
	rm -f $(STORE_DIR)/*.png

install:
	cd $(DEMO_DIR) && npm install

# Drives the real extension against demo/mock-whatsapp.html with Playwright
# and writes raw .webm clips to demo/recording/main/.
demo: install
	cd $(DEMO_DIR) && npm run record

# Concats the two largest clips (chat-list interaction + popup interaction,
# in recording order) into demo/demo.mp4, skipping the small idle blank tab
# clip Playwright records by default. Requires ffmpeg.
demo-video:
	@clips=$$(ls -S $(RECORDING)/*.webm | head -n 2); \
	if [ -z "$$clips" ]; then echo "No clips found in $(RECORDING) — run 'make demo' first."; exit 1; fi; \
	first=$$(ls -t $$clips | tail -n 1); \
	second=$$(ls -t $$clips | head -n 1); \
	echo "Concatenating $$first + $$second"; \
	ffmpeg -y -i "$$first" -i "$$second" \
		-filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[outv]" -map "[outv]" \
		-c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart $(DEMO_DIR)/demo.mp4
	@echo "Wrote $(DEMO_DIR)/demo.mp4"

# Encodes demo/demo.mp4 into demo/demo.gif for embedding in the README.
demo-gif:
	ffmpeg -y -i $(DEMO_DIR)/demo.mp4 \
		-vf "fps=14,scale=760:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer" \
		$(DEMO_DIR)/demo.gif
	@echo "Wrote $(DEMO_DIR)/demo.gif"

# Regenerates the Chrome Web Store screenshots (1280x800, no alpha) and the
# small promo tile (440x280) from demo/demo.gif + icons/icon128.png. Requires
# ffmpeg and ImageMagick (`magick`). These PNGs are build artifacts derived
# from demo.gif, so they aren't committed — regenerate them whenever
# demo.gif changes.
store-assets:
	@mkdir -p $(STORE_DIR)
	ffmpeg -y -ss 2.0 -i $(DEMO_DIR)/demo.gif -frames:v 1 \
		-vf "pad=1280:800:(1280-iw)/2:(800-ih)/2:color=#161f23" -pix_fmt rgb24 \
		$(STORE_DIR)/screenshot-1-flagging.png
	ffmpeg -y -ss 24.3 -i $(DEMO_DIR)/demo.gif -frames:v 1 \
		-vf "pad=1280:800:(1280-iw)/2:(800-ih)/2:color=#161f23" -pix_fmt rgb24 \
		$(STORE_DIR)/screenshot-2-categories.png
	magick -size 440x280 xc:'#161f23' \
		\( icons/icon128.png -resize 96x96 \) -gravity center -geometry +0-40 -composite \
		-gravity center -fill '#eef2f2' -font "/System/Library/Fonts/Supplemental/Arial Bold.ttf" -pointsize 34 -annotate +0+55 'WATag' \
		-gravity center -fill '#7d8a8d' -font "/System/Library/Fonts/Supplemental/Arial.ttf" -pointsize 15 -annotate +0+90 'for web.whatsapp.com' \
		-background '#161f23' -alpha remove -alpha off -depth 8 \
		$(STORE_DIR)/promo-tile-440x280.png
	@echo "Wrote $(STORE_DIR)/screenshot-*.png and $(STORE_DIR)/promo-tile-440x280.png"
