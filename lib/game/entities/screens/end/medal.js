ig.module(
	"game.entities.screens.end.medal"
).requires(
	"impact.entity"
).defines(function() {
	EntityMedal = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		ignoreUpdate: true,
		size: {
			x: 0,
			y: 0
		},
		offset: {
			x: 0,
			y: 0
		},
		scale: {
			x: 1,
			y: 1
		},
		animSheet: new ig.AnimationSheet("media/images/end/medals.png", 184, 174),
		init: function(x, y, settings) {
			this.zIndex = 300;
			this.addAnim("idle", 0.1, [3]);
			this.addAnim("bronze", 0.1, [0]);
			this.addAnim("silver", 0.1, [1]);
			this.addAnim("gold", 0.1, [2]);
			this.parent(x, y, settings);
			if (ig.game.currentScore <= 0)
				this.currentAnim = this.anims.idle;
			if (ig.game.currentScore >= 1 && ig.game.currentScore <= 10)
				this.currentAnim = this.anims.bronze;
			if (ig.game.currentScore >= 11 && ig.game.currentScore <= 20)
				this.currentAnim = this.anims.silver;
			if (ig.game.currentScore >= 21)
				this.currentAnim = this.anims.gold;
		},
		draw: function() {
			this.parent();
		},
		kill: function() {
			this.parent();
		}
	});
});