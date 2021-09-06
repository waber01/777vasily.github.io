ig.module(
	"game.entities.screens.screen-game"
).requires(
	"game.entities.screens.screen-end",
	"game.entities.screens.game.ground",
	"game.entities.screens.game.hills",
	"game.entities.screens.game.flappy",
	"game.entities.screens.game.tree",
	"impact.entity"
).defines(function() {
	//Screen Game
	EntityScreenGame = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		gravityFactor: 0,
		size: {
			x: 0,
			y: 0
		},
		displayScore: false,
		playedHitSound: false,
		devTarget: null,
		screenName: null,
		screenEnd: null,
		showTutorial: true,
		stopMoving: false,
		gameSpeed: 5,
		treeStartingXPos: 1000,
		treeSpacing: 600,
		getReadyYPos: -200,
		getReadyImage: new ig.Image("media/images/game/get_ready_text.png"),
		tapImage: new ig.Image("media/images/game/tap_text.png"),
		skyBG: null,
		flappy: null,
		hills1: null,
		hills2: null,
		ground1: null,
		ground2: null,
		ground3: null,
		tree1: null,
		tree2: null,
		tree3: null,
		cloud1: null,
		cloud2: null,
		cloud3: null,
		cloud4: null,
		init: function(x, y, settings) {
			ig.game.currentScore = 0;
			this.parent(x, y, settings);
			this.skyBG = ig.game.spawnEntity(EntitySkyBG, 0, 0);
			this.hills1 = ig.game.spawnEntity(EntityHills, 0, ig.game.stageHeight - 394);
			this.hills2 = ig.game.spawnEntity(EntityHills, this.hills1.pos.x + 1151, ig.game.stageHeight - 394);
			this.ground1 = ig.game.spawnEntity(EntityGround, 0, ig.game.stageHeight - 86);
			this.ground2 = ig.game.spawnEntity(EntityGround, this.ground1.pos.x + 1605, ig.game.stageHeight - 86);
			this.ground3 = ig.game.spawnEntity(EntityGround, this.ground2.pos.x + 1605, ig.game.stageHeight - 86);
			var randomY = 0;
			var treeSettings = {
				"treeNum": 1
			};
			randomY = ig.getRandomRange(1000, 500);
			this.tree1 = ig.game.spawnEntity(EntityTree, this.treeStartingXPos, -randomY, treeSettings);
			treeSettings = {
				"treeNum": 2
			};
			randomY = ig.getRandomRange(1000, 500);
			this.tree2 = ig.game.spawnEntity(EntityTree, this.treeStartingXPos + this.treeSpacing, -randomY, treeSettings);
			treeSettings = {
				"treeNum": 3
			};
			randomY = ig.getRandomRange(1000, 500);
			this.tree3 = ig.game.spawnEntity(EntityTree, this.treeStartingXPos + (this.treeSpacing * 2), -randomY, treeSettings);
			this.flappy = ig.game.spawnEntity(EntityFlappy, 181, 538);
			var cloudSettings = {
				"cloudNum": 1
			};
			this.cloud1 = ig.game.spawnEntity(EntityCloud, 100, 100, cloudSettings);
			cloudSettings = {
				"cloudNum": 2
			};
			this.cloud2 = ig.game.spawnEntity(EntityCloud, 300, 200, cloudSettings);
			cloudSettings = {
				"cloudNum": 3
			};
			this.cloud3 = ig.game.spawnEntity(EntityCloud, 500, 10, cloudSettings);
			cloudSettings = {
				"cloudNum": 4
			};
			this.cloud4 = ig.game.spawnEntity(EntityCloud, 700, 250, cloudSettings);
			TweenMax.to(this, 0.75, {
				getReadyYPos: 378,
				ease: Back.easeOut
			});
		},
		updateCloud: function($cloudNum) {
			var randomY = ig.getRandomRange(-10, 650);
			var currentCloud = null;
			switch ($cloudNum) {
				case 1:
					currentCloud = this.cloud1;
					break;
				case 2:
					currentCloud = this.cloud2;
					break;
				case 3:
					currentCloud = this.cloud3;
					break;
				case 4:
					currentCloud = this.cloud4;
					break;
			}
			currentCloud.needsReposition = false;
			currentCloud.pos.x = 800;
			currentCloud.pos.y = randomY;
		},
		playCollisionSound: function() {
			if (this.playedHitSound === false) {
				ig.game.handleSound("hit");
				this.playedHitSound = true;
			} else {
				ig.game.handleSound("thud");
			}
		},
		flappyHit: function($objectName) {
			switch ($objectName) {
				case "tree":
					this.playCollisionSound();
					this.stopMoving = true;
					break;
				case "ground":
					this.playCollisionSound();
					if (ig.game.currentScore > ig.game.bestScore) {
						ig.game.bestScoreIsNew = true;
						ig.game.bestScore = ig.game.currentScore;
					}
					this.stopMoving = true;
					this.createNameScreen();
					break;
				case "treeSensor":
					ig.game.handleEvent("scoredAPoint");
					ig.game.currentScore++;
					break;
			}
		},
		createNameScreen: function() {
			ig.game.handleEvent("endGame");
			this.displayScore = false;
			this.createEndScreen();
			ig.game.delayInteraction(0);
		},
		killNameScreen: function() {
			if (this.screenName != null) {
				this.screenName.kill();
				this.screenName = null;
			}
		},
		createEndScreen: function() {
		//	ig.game.submitScore();
			this.displayScore = false;
			this.killNameScreen();
			this.screenEnd = ig.game.spawnEntity(EntityScreenEnd, 50, -407);
			this.screenEnd.show();
			ig.game.delayInteraction(0);
			if (ig.game.bestScoreIsNew)
				this.screenEnd.showNewIcon();
		},
		updateTreePosition: function($treeNum) {
			var currentTree = null;
			var xPos = 0;
			switch ($treeNum) {
				case 1:
					currentTree = this.tree1;
					xPos = this.tree3.pos.x + this.treeSpacing;
					break;
				case 2:
					currentTree = this.tree2;
					xPos = this.tree1.pos.x + this.treeSpacing;
					break;
				case 3:
					currentTree = this.tree3;
					xPos = this.tree2.pos.x + this.treeSpacing;
					break;
			}
			var randomY = ig.getRandomRange(-500, 100);
			currentTree.body.SetXForm(new b2.Vec2(xPos * b2.SCALE, randomY * b2.SCALE), 0);
			currentTree.sensor.canHit = true;
		},
		start: function() {
			ig.game.delayInteraction(0);
		},
		startGame: function() {
			ig.game.handleEvent("startGame");
			this.displayScore = true;
			this.showTutorial = false;
			this.flappy.startGame();
		},
		update: function() {
			this.parent();
			if (!this.stopMoving) {
				if (this.cloud1 != null) {
					this.cloud1.pos.x = this.cloud1.pos.x - (this.gameSpeed * 0.75);
				}
				if (this.cloud2 != null) {
					this.cloud2.pos.x = this.cloud2.pos.x - (this.gameSpeed * 0.75);
				}
				if (this.cloud3 != null) {
					this.cloud3.pos.x = this.cloud3.pos.x - (this.gameSpeed * 0.75);
				}
				if (this.cloud4 != null) {
					this.cloud4.pos.x = this.cloud4.pos.x - (this.gameSpeed * 0.75);
				}
				if (this.hills1 != null) {
					if (this.hills1.pos.x <= -1151) {
						this.hills1.pos.x = this.hills2.pos.x + 1151;
					}
					this.hills1.updatePosition(this.gameSpeed * 0.5);
				}
				if (this.hills2 != null) {
					if (this.hills2.pos.x <= -1151) {
						this.hills2.pos.x = this.hills1.pos.x + 1151;
					}
					this.hills2.updatePosition(this.gameSpeed * 0.5);
				}
				var groundVec = null;
				if (this.ground1 != null) {
					if (this.ground1.pos.x <= -1605) {
						groundVec = this.ground3.body.GetPosition();
						this.ground1.body.SetXForm(new b2.Vec2(groundVec.x + (1605) * b2.SCALE, groundVec.y), 0);
					}
					this.ground1.updatePosition(this.gameSpeed);
				}
				if (this.ground2 != null) {
					if (this.ground2.pos.x <= -1605) {
						groundVec = this.ground1.body.GetPosition();
						this.ground2.body.SetXForm(new b2.Vec2(groundVec.x + (1605) * b2.SCALE, groundVec.y), 0);
					}
					this.ground2.updatePosition(this.gameSpeed);
				}
				if (this.ground3 != null) {
					if (this.ground3.pos.x <= -1605) {
						groundVec = this.ground2.body.GetPosition();
						this.ground3.body.SetXForm(new b2.Vec2(groundVec.x + (1605) * b2.SCALE, groundVec.y), 0);
					}
					this.ground3.updatePosition(this.gameSpeed);
				}
				if (!this.showTutorial) {
					if (this.tree1 != null)
						this.tree1.updatePosition(this.gameSpeed);
					if (this.tree2 != null)
						this.tree2.updatePosition(this.gameSpeed);
					if (this.tree3 != null)
						this.tree3.updatePosition(this.gameSpeed);
				}
			}
		},
		draw: function() {
			if (this.displayScore) {
				ig.game.fontFlyer60.draw(ig.game.currentScore, ig.game.stageWidth * 0.5, 100, ig.Font.ALIGN.CENTER);
			}
			if (this.showTutorial) {
				var ctx = ig.system.context;
				ctx.save();
				ctx.drawImage(this.getReadyImage.data, 125, this.getReadyYPos);
				ctx.drawImage(this.tapImage.data, 349, 532);
				ctx.restore();
			}
			this.parent();
		},
		kill: function() {
			if (this.cloud1 != null) {
				this.cloud1.kill();
				this.cloud1 = null;
			}
			if (this.cloud2 != null) {
				this.cloud2.kill();
				this.cloud2 = null;
			}
			if (this.cloud3 != null) {
				this.cloud3.kill();
				this.cloud3 = null;
			}
			if (this.cloud4 != null) {
				this.cloud4.kill();
				this.cloud4 = null;
			}
			if (this.screenName != null) {
				this.screenName.kill();
				this.screenName = null;
			}
			if (this.screenEnd != null) {
				this.screenEnd.kill();
				this.screenEnd = null;
			}
			this.skyBG.kill();
			this.skyBG = null;
			this.flappy.kill();
			this.flappy = null;
			this.hills1.kill();
			this.hills1 = null;
			this.hills2.kill();
			this.hills2 = null;
			this.ground1.kill();
			this.ground1 = null;
			this.ground2.kill();
			this.ground2 = null;
			this.ground3.kill();
			this.ground3 = null;
			this.tree1.kill();
			this.tree1 = null;
			this.tree2.kill();
			this.tree2 = null;
			this.tree3.kill();
			this.tree3 = null;
			this.parent();
		}
	});
});