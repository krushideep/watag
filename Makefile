.PHONY: help build clean demo demo-video demo-gif package install

DIST_DIR    := dist
DIST_ZIP    := $(DIST_DIR)/watag.zip
DEMO_DIR    := demo
RECORDING   := $(DEMO_DIR)/recording/main

help:
	@echo "Targets:"
	@echo "  make build       Package the extension into $(DIST_ZIP)"
	@echo "  make clean       Remove build artifacts (dist/, demo scratch dirs)"
	@echo "  make install     Install demo dependencies (npm install in demo/)"
	@echo "  make demo        Record a fresh demo video via Playwright"
	@echo "  make demo-video  Concat recorded clips into demo/demo.mp4"
	@echo "  make demo-gif    Encode demo/demo.mp4 into demo/demo.gif"
	@echo "  make package     Alias for build"

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
