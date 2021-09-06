ig.module(
	"game.entities.screens.screen-end"
).requires(
	"game.entities.screens.end.medal",
	"game.entities.ui.btns.play-btn",
	"impact.entity"
).defines(function() {
	//Screen End
	EntityScreenEnd = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		size: {
			x: 668,
			y: 407
		},
		animSheet: new ig.AnimationSheet("media/images/end/end_bg.png", 668, 407),
		medal: null,
		playBtn: null,
		newIconImage: new ig.Image("media/images/end/new_icon.png"),
		showNew: false,
		targetPos: {
			x: 47,
			y: -1154
		},
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = 100;
			this.addAnim("idle", 0.1, [0]);
			this.medal = ig.game.spawnEntity(EntityMedal, this.pos.x + 104, this.pos.y + 153);
			this.playBtn = ig.game.spawnEntity(EntityPlayBtn, this.pos.x + 175, this.pos.y + 484);
		},
		show: function() {
			TweenMax.to(this.targetPos, 0.75, {
				y: 130,
				ease: Back.easeOut
			});
		},
		showNewIcon: function() {
			ig.game.bestScoreIsNew = false;
			this.showNew = true;
			ig.game.handleSound("medal");
		},
		draw: function() {
			this.parent();
			ig.game.fontFlyer60.draw(ig.game.currentScore, this.pos.x + 510, this.pos.y + 130, ig.Font.ALIGN.CENTER);
			ig.game.fontFlyer60.draw(ig.game.bestScore, this.pos.x + 510, this.pos.y + 290, ig.Font.ALIGN.CENTER);
			if (this.showNew) {
				var ctx = ig.system.context;
				ctx.save();
				ctx.drawImage(this.newIconImage.data, this.pos.x + 343, this.pos.y + 210);
				ctx.restore();
			}
		},
		update: function() {
			this.pos = this.targetPos;
			this.parent();
			this.medal.pos.x = this.pos.x + 104;
			this.medal.pos.y = this.pos.y + 153;
			this.playBtn.tweenXPos = this.pos.x + 175;
			this.playBtn.tweenYPos = this.pos.y + 484;
		},
		kill: function() {
			this.medal.kill();
			this.medal = null;
			this.playBtn.kill();
			this.playBtn = null;
			this.parent();
		}
	});
});