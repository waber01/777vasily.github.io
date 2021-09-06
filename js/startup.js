var GameStartup = {
	targetWidth: 768,
	targetHeight: 1154,
	maxSupportedWidth: 768,
	resizeTimeout: 0,
	imagePath: "media/images/",
	hideAddressBar: function() {
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 0)
	},
	onPageLoad: function() {
		this.hideAddressBar();
		this.targetWidth = Math.round((this.targetHeight / window.innerHeight) * window.innerWidth);
	},
	init: function() {
		if (Modernizr.canvas) {
			var self = this;
			window.addEventListener('resize', function() {
				self.resizeGame()
			}, false);
			window.addEventListener('orientationchange', function() {
				self.resizeGame()
			}, false);
			window.addEventListener("load", function() {
				self.onPageLoad();
			}, false);
			document.ontouchmove = function(e) {
				e.preventDefault();
			};
			var x = setInterval(function() {
				if (ig && ig.deploy) {
					ig.deploy();
					self.resizeGame();
					clearInterval(x);
				}
			}, 250);
		} else {
			var wrapper = document.getElementById("wrapper");
			wrapper.innerHTML = "<img src='media/images/unsupported.png' />";
		}
	},
	resizeGame: function() {
		window.scrollTo(0, 0);
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		this.isDeviceLandscape = windowWidth > windowHeight;
		var wrapper = document.getElementById('wrapper');
		wrapper.style.maxWidth = "";
		this.targetWidth = Math.round((this.targetHeight / windowHeight) * windowWidth);
		var maxWidth = windowWidth;
		if (this.targetWidth > this.maxSupportedWidth) {
			maxWidth = (this.maxSupportedWidth / this.targetWidth) * windowWidth;
			wrapper.style.maxWidth = maxWidth + "px";
			wrapper.style.margin = "0 auto";
			this.targetWidth = this.maxSupportedWidth;
		}
		if ((typeof ig != "undefined") && (typeof ig.system != "undefined")) {
			ig.system.resize(this.targetWidth, this.targetHeight);
		};

		var gameCanvas = document.getElementById('canvas');
		gameCanvas.style.width = maxWidth + "px";
		gameCanvas.style.height = windowHeight + "px";
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(GameStartup.hideAddressBar, 500);
	}
};