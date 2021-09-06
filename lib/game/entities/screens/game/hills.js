ig.module("game.entities.screens.game.hills").requires("impact.entity").defines(function() {
	EntityHills = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		ignoreUpdate: true,
		size: {
			x: 1151,
			y: 394
		},
		offset: {
			x: 0,
			y: 0
		},
		animSheet: new ig.AnimationSheet("media/images/game/hills.png", 1151, 394),
		init: function(x, y, settings) {
			this.zIndex = -500;
			this.addAnim("idle", 0.1, [0]);
			this.parent(x, y, settings);
		},
		updatePosition: function($moveX) {
			this.pos.x = this.pos.x - $moveX;
		},
		draw: function() {
			this.parent();
		},
		kill: function() {
			this.parent();
		}
	});
});