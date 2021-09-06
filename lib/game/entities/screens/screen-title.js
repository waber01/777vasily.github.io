ig.module(
	"game.entities.screens.screen-title"
).requires(
	"game.entities.ui.btns.start-btn",
	"game.entities.screens.title.flappy-no-physics",
	"impact.entity"
).defines(function() {
	//Screen Title
	EntityScreenTitle = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		size: {
			x: 0,
			y: 0
		},
		skyBG: null,
		startBtn: null,
		logoImage: new ig.Image("media/images/title/title_logo.png"),
		groundBG: new ig.Image("media/images/title/title_bg.png"),
		flappy: null,
		cloud1: null,
		cloud2: null,
		cloud3: null,
		cloud4: null,
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.skyBG = ig.game.spawnEntity(EntitySkyBG, 0, 0);
			this.startBtn = ig.game.spawnEntity(EntityStartBtn, 236, 850);
			this.flappy = ig.game.spawnEntity(EntityFlappyNoPhysics, 290, 538);
			var cloudSettings = {
				"cloudNum": 1
			};
			this.cloud1 = ig.game.spawnEntity(EntityCloud, 100, 100, cloudSettings);
			cloudSettings = {
				"cloudNum": 2
			};
			this.cloud2 = ig.game.spawnEntity(EntityCloud, 500, 200, cloudSettings);
			cloudSettings = {
				"cloudNum": 3
			};
			this.cloud3 = ig.game.spawnEntity(EntityCloud, 500, 10, cloudSettings);
			cloudSettings = {
				"cloudNum": 4
			};
			this.cloud4 = ig.game.spawnEntity(EntityCloud, -50, 250, cloudSettings);
			this.flappy.bobUp();
		},
		start: function() {
			ig.game.delayInteraction(0);
		},
		draw: function() {
			this.parent();
			var ctx = ig.system.context;
			ctx.save();
			ctx.drawImage(this.groundBG.data, 0, 716);
			ctx.drawImage(this.logoImage.data, 58, 357);
			ctx.restore();
		},
		update: function() {
			this.parent();
		},
		kill: function() {
			this.skyBG.kill();
			this.skyBG = null;
			this.cloud1.kill();
			this.cloud1 = null;
			this.cloud2.kill();
			this.cloud2 = null;
			this.cloud3.kill();
			this.cloud3 = null;
			this.cloud4.kill();
			this.cloud4 = null;
			this.startBtn.kill();
			this.startBtn = null;
			this.flappy.kill();
			this.flappy = null;
			this.parent();
		}
	});
});