ig.module(
	"game.entities.screens.game.feather"
).requires(
	"impact.entity"
).defines(function() {
	//Feather
	EntityFeather = ig.Entity.extend({
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
		featherAnimSheet1: new ig.AnimationSheet("media/images/flappy/feather_1.png", 16, 17),
		featherAnimSheet2: new ig.AnimationSheet("media/images/flappy/feather_2.png", 18, 16),
		featherAnimSheet3: new ig.AnimationSheet("media/images/flappy/feather_3.png", 11, 8),
		featherAnimSheet4: new ig.AnimationSheet("media/images/flappy/feather_4.png", 8, 9),
		featherNum: 0,
		targetAngle: 0,
		targetX: 0,
		targetY: 0,
		currentAlpha: 1,
		init: function(x, y, settings) {
			this.zIndex = 50;
			this.featherNum = settings.featherNum;
			switch (this.featherNum) {
				case 1:
					this.animSheet = this.featherAnimSheet1;
					this.size.x = 16;
					this.size.y = 17;
					break;
				case 2:
					this.animSheet = this.featherAnimSheet2;
					this.size.x = 18;
					this.size.y = 16;
					break;
				case 3:
					this.animSheet = this.featherAnimSheet3;
					this.size.x = 11;
					this.size.y = 8;
					break;
				case 4:
					this.animSheet = this.featherAnimSheet4;
					this.size.x = 8;
					this.size.y = 9;
					break;
			}
			this.addAnim("idle", 0.1, [0]);
			this.parent(x, y, settings);
			this.targetX = this.pos.x + 50;
			this.targetY = this.pos.y + 50;
		},
		float: function() {
			var randomTime = ig.getRandomRange(50, 200) * 0.01;
			this.targetAngle = ig.getRandomRange(-1080, 1080).toRad();
			var randomX = this.pos.x + ig.getRandomRange(-250, -200);
			var randomY = this.pos.y + ig.getRandomRange(10, 150);
			TweenMax.to(this.currentAnim, 0.5, {
				delay: 5,
				alpha: 0,
				onCompleteScope: this,
				onComplete: this.kill
			});
			TweenMax.to(this.currentAnim, randomTime, {
				angle: this.targetAngle
			});
			TweenMax.to(this, randomTime, {
				targetX: randomX,
				targetY: randomY
			});
		},
		update: function() {
			this.pos.x = this.targetX;
			this.pos.y = this.targetY;
			this.parent();
		},
		draw: function() {
			this.parent();
		},
		kill: function() {
			this.parent();
		}
	});
});