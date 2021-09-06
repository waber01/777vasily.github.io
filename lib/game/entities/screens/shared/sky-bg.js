ig.module("game.entities.screens.shared.sky-bg").requires("impact.entity").defines(function() {
	EntitySkyBG = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		ignoreUpdate: true,
		size: {
			x: 768,
			y: 1154
		},
		offset: {
			x: 0,
			y: 0
		},
		scale: {
			x: 1,
			y: 1
		},
		animSheet: new ig.AnimationSheet("media/images/sky_bg.png", 768, 1154),
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = -900;
			this.addAnim("idle", 1, [0]);
			this.currentAnim = this.anims.idle;
		},
		draw: function() {
			this.parent();
		},
		kill: function() {
			this.parent();
		}
	});
});