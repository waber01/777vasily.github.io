ig.module(
	"game.entities.screens.title.flappy-no-physics"
).requires(
	"impact.entity"
).defines(function() {
	//Flappy No Physics
	EntityFlappyNoPhysics = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		ignoreUpdate: true,
		size: {
			x: 124,
			y: 97
		},
		offset: {
			x: 0,
			y: 0
		},
		scale: {
			x: 1,
			y: 1
		},
		animSheet: new ig.AnimationSheet("media/images/flappy/flappy_flap.png", 124, 97),
		bobbingOffset: 0,
		init: function(x, y, settings) {
			this.addAnim("flapSlow", 0.07, [0, 1, 2, 3, 4, 5, 6, 7]);
			this.currentAnim = this.anims.flapSlow;
			this.parent(x, y, settings);
		},
		bobUp: function() {
			TweenMax.to(this, 0.35, {
				bobbingOffset: -2,
				onCompleteScope: this,
				onComplete: this.bobDown,
				ease: Quad.easeInOut
			});
		},
		bobDown: function() {
			TweenMax.to(this, 0.35, {
				bobbingOffset: 2,
				onCompleteScope: this,
				onComplete: this.bobUp,
				ease: Quad.easeInOut
			});
		},
		update: function() {
			this.parent();
			this.pos.y = this.pos.y + this.bobbingOffset;
		},
		draw: function() {
			this.parent();
		},
		kill: function() {
			this.parent();
		}
	});
});