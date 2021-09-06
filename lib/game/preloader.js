ig.module("game.preloader").requires("impact.game").defines(function() {
	ig.loaderImage = new Image();
	ig.loaderImage.src = "media/images/loader/loader_bg.png";
	Preloader = ig.Loader.extend({
		fakePercent: 0,
		tileXPos: 0,
		tileYPos: 0,
		rowCount: 0,
		update: function() {
			this.fakePercent = this.fakePercent + 0.5;
			if (this.fakePercent >= 100)
				this.fakePercent = 100;
		},
		draw: function() {
			this.update();
			var percentLoaded = this.status * 100;
			var RW = ig.system.realWidth;
			var RH = ig.system.realHeight;
			var ctx = ig.system.context;
			ctx.clearRect(0, 0, RW, RH);
			var s = ig.system.scale;
			var w = ig.system.realWidth * 0.2;
			var h = ig.system.realHeight * 0.05;
			var x = ig.system.realWidth * 0.5 - w / 2;
			var y = ig.system.realHeight * 0.5 - h / 2;
			ig.system.context.fillStyle = '#b1b1b1';
			ig.system.context.fillRect(170, 840, 425, 25);
			ig.system.context.fillStyle = '#333333';
			ig.system.context.fillRect(170, 840, 425 * percentLoaded * 0.01, 25);
			ctx.drawImage(ig.loaderImage, 0, 0);
		},
		end: function() {
			this.parent();
		}
	});
});