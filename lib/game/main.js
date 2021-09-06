ig.module(
	"game.main"
).requires(
	"impact.game",
	"impact.font",
	"game.utils.utils",
	"game.preloader",
	"game.entities.screens.screen-title",
	"game.entities.screens.screen-game",
	"game.entities.screens.shared.sky-bg",
	"game.entities.screens.shared.cloud",
	"game.entities.ui.white-box",
	"game.levels.empty",
	"plugins.box2d.game",
	"plugins.box2d.collision",
	"plugins.box2d.debug"
).defines(function() {
	ig.SCREENS = {
		"SCREEN_TITLE": 0,
		"SCREEN_GAME": 1,
		"SCREEN_LEADERBOARDS": 3
	};
	FlappyBirdGame = ig.Box2DGame.extend({
		clearColor: "#000000",
		isShaking: false,
		drawPhysics: false,
		gravity: 50,
		screenOffset: {
			x: 0,
			y: 0
		},
		username: "",
		bestScore: 0,
		currentScore: 0,
		bestScoreIsNew: false,
		userScoreObject: null,
		lastsScoresIndex: 1,
		usersScores: null,
		fontFlyer60: new ig.Font("media/images/fonts/font_60.png"),
		r: null,
		autoSort: true,
		stageWidth: 0,
		stageHeight: 0,
		lastWidth: 0,
		lastHeight: 0,
		isChangeInSize: false,
		isOrientationWrong: false,
		orientationChangeImage: new ig.Image("media/images/orientation-wrong.jpg"),
		whiteScreenAlpha: 0,
		blackScreenAlpha: 0,
		canInteract: true,
		screenIndex: -1,
		currentScreen: null,
		isPaused: false,
		isMuted: false,
		pageShow: function() {},
		pageHide: function() {},
		init: function() {
			ig.System.drawMode = ig.System.DRAW.AUTHENTIC;
			//this.getLeaderboards(1);
			ig.soundJockey.addSound("SFX");
			ig.game.createBox2DWorld();
			this.stageWidth = ig.system.realWidth;
			this.stageHeight = ig.system.realHeight;
			ig.input.initMouse();
			ig.input.bind(ig.KEY.MOUSE1, "leftMouse");
			ig.input.bind(ig.KEY.SPACE, "leftMouse");
			this.gotoScreen(ig.SCREENS.SCREEN_TITLE);
		},
		createBox2DWorld: function() {
			var boundingBox = new b2.AABB();
			boundingBox.lowerBound.Set(-1000, -1000);
			boundingBox.upperBound.Set(99999, 99999);
			var gravity = new b2.Vec2(0, this.gravity);
			ig.world = new b2.World(boundingBox, gravity, true);
			this.debugCollisionRects = true;
			this.debugDrawer = new ig.Box2DDebug(ig.world);
			this.loadLevel(LevelEmpty);
		},
		handleEvent: function($type) {
			if (this.canInteract) {
				switch ($type) {
					case "shakeScreen":
						this.shakeScreen();
						break;
					case "startBtnClicked":
						this.canInteract = false;
						this.gotoScreen(ig.SCREENS.SCREEN_GAME);
						break;
					case "playBtnClicked":
						this.canInteract = false;
						this.gotoScreen(ig.SCREENS.SCREEN_GAME);
						break;
					case "submitBtnClicked":
						if (ig.game.username != "") {
							this.canInteract = false;
							this.currentScreen.createEndScreen();
						}
						break;
					case "exitBtnClicked":
						this.canInteract = false;
						this.gotoScreen(ig.SCREENS.SCREEN_GAME);
						break;
					case "upArrowBtnClicked":
						this.lastScoresIndex = this.lastScoresIndex - 10;
						if (this.lastScoresIndex <= 1)
							this.lastScoresIndex = 1;
						//this.getLeaderboards(this.lastScoresIndex);
						break;
					case "downArrowBtnClicked":
						this.lastScoresIndex = this.lastScoresIndex + 10;
						//this.getLeaderboards(this.lastScoresIndex);
						break;
					default:
						//console.log("EVENT NOT REGISTERED: " + $type);
						break;
				}
			}
		},
		delayInteraction: function($delayTime) {
			if ($delayTime === 0)
				$delayTime = 0.5;
			ig.game.canInteract = false;
			TweenMax.delayedCall($delayTime, this.enableInteraction);
		},
		enableInteraction: function() {
			ig.game.canInteract = true;
		},
		handleSound: function($soundName) {
			var randomNum = 0;
			switch ($soundName) {
				case "click":
					ig.soundJockey.playSound("SFX", "click");
					break;
				case "hit":
					ig.soundJockey.playSound("SFX", "hit");
					break;
				case "medal":
					ig.soundJockey.playSound("SFX", "medal");
					break;
				case "point":
					ig.soundJockey.playSound("SFX", "point");
					break;
				case "rollover":
					ig.soundJockey.playSound("SFX", "rollover");
					break;
				case "thud":
					ig.soundJockey.playSound("SFX", "thud");
					break;
				case "woosh":
					ig.soundJockey.playSound("SFX", "woosh");
					break;
				case "fart":
					randomNum = ig.getRandomRange(0, 9);
					switch (randomNum) {
						case 0:
							ig.soundJockey.playSound("SFX", "gas1");
							break;
						case 1:
							ig.soundJockey.playSound("SFX", "gas2");
							break;
						case 2:
							ig.soundJockey.playSound("SFX", "gas3");
							break;
						case 3:
							ig.soundJockey.playSound("SFX", "gas4");
							break;
						case 4:
							ig.soundJockey.playSound("SFX", "gas5");
							break;
						case 5:
							ig.soundJockey.playSound("SFX", "gas6");
							break;
						case 6:
							ig.soundJockey.playSound("SFX", "gas7");
							break;
						case 7:
							ig.soundJockey.playSound("SFX", "gas8");
							break;
						case 8:
							ig.soundJockey.playSound("SFX", "gas9");
							break;
						case 9:
							ig.soundJockey.playSound("SFX", "gas18");
							break;
					}
					break;
			}
		},
		gotoScreen: function($screenIndex) {
			TweenMax.killAll();
			this.blackScreenAlpha = 0.01;
			TweenMax.to(this, 0.25, {
				delay: 0,
				blackScreenAlpha: 1,
				ease: Quad.easeInOut,
				onCompleteScope: this,
				onComplete: this.initNewScreen,
				onCompleteParams: [$screenIndex]
			});
		},
		initNewScreen: function($screenIndex) {
			this.killCurrentScreen();
			this.loadNewScreen($screenIndex);
		},
		killCurrentScreen: function() {
			if (this.currentScreen != null) {
				this.currentScreen.kill();
				this.currentScreen = null;
			}
		},
		loadNewScreen: function($screenIndex) {
			this.screenIndex = $screenIndex;
			switch (this.screenIndex) {
				case ig.SCREENS.SCREEN_TITLE:
					this.currentScreen = ig.game.spawnEntity(EntityScreenTitle, 0, 0);
					break;
				case ig.SCREENS.SCREEN_GAME:
					this.currentScreen = ig.game.spawnEntity(EntityScreenGame, 0, 0);
					break;
				case ig.SCREENS.SCREEN_LEADERBOARDS:
					this.currentScreen = ig.game.spawnEntity(EntityScreenLeaderboards, 0, 0);
					break;
			}
			TweenMax.to(this, 0.25, {
				blackScreenAlpha: 0,
				ease: Quad.easeInOut,
				onComplete: this.currentScreen.start,
				onCompleteScope: this.currentScreen
			});
		},
		update: function() {
			this.stageWidth = ig.system.realWidth;
			this.stageHeight = ig.system.realHeight;
			if (this.isPaused === true)
				ig.world.Step(0, 5);
			if (this.isPaused === false)
				ig.world.Step(ig.system.tick, 6);
			this.sortEntities();
			this.parent();
			this.isChangeInSize = this.lastWidth != ig.system.realWidth;
			this.lastWidth = ig.system.realWidth;
		},
		shakeScreen: function() {
			this.isShaking = true;
			var whiteBox = ig.game.spawnEntity(EntityWhiteBox, 0, 0);
			whiteBox.flash();
			var randomX = ig.getRandomRange(-10, 10);
			var randomY = ig.getRandomRange(-10, 10);
			TweenMax.to(this.screenOffset, 0.05, {
				x: randomX,
				y: randomY
			});
			randomX = ig.getRandomRange(-10, 10);
			randomY = ig.getRandomRange(-10, 10);
			TweenMax.to(this.screenOffset, 0.05, {
				delay: 0.1,
				x: randomX,
				y: randomY
			});
			randomX = ig.getRandomRange(-10, 10);
			randomY = ig.getRandomRange(-10, 10);
			TweenMax.to(this.screenOffset, 0.05, {
				delay: 0.15,
				x: randomX,
				y: randomY
			});
			randomX = ig.getRandomRange(-10, 10);
			randomY = ig.getRandomRange(-10, 10);
			TweenMax.to(this.screenOffset, 0.05, {
				delay: 0.2,
				x: randomX,
				y: randomY
			});
			TweenMax.to(this.screenOffset, 0.05, {
				delay: 0.25,
				x: 0,
				y: 0,
				onCompleteScope: this,
				onComplete: this.turnOffShake
			});
		},
		turnOffShake: function() {
			this.isShaking = false;
		},
		draw: function() {
			var ctx = ig.system.context;
			if (this.isShaking) {
				ctx.save();
				ctx.translate(this.screenOffset.x, this.screenOffset.y);
			}
			this.parent();
			if (this.isShaking)
				ctx.restore();
			if (this.drawPhysics)
				this.debugDrawer.draw();
			if (this.blackScreenAlpha > 0) {
				ctx.globalAlpha = this.blackScreenAlpha;
				ctx.fillRect(0, 0, ig.system.realWidth, ig.system.realHeight);
				ctx.globalAlpha = 1;
			}
		},
		returnedScores: function($scores) {
			ig.game.userScoreObject = $scores;
		}
	});
	ig.deploy = function() {
		ig.main("#canvas", FlappyBirdGame, 60, GameStartup.targetWidth, GameStartup.targetHeight, 1, Preloader);
	};
	var canvas = ig.$('#canvas');
	ig.handleStageTouch = function(event) {
		ig.soundJockey.playSound("SFX", "silence");
		canvas.removeEventListener('touchstart', ig.handleStageTouch, false);
	};
	canvas.addEventListener('touchstart', ig.handleStageTouch, false);
	ig.LoadManager = {
		prepLevelResources: function($screenIndex) {},
		checkForSoundToLoad: function($screenIndex) {
			switch ($screenIndex) {
				case ig.SCREENS.SCREEN_TITLE:
					ig.soundJockey.addSound("SFX");
					break;
			}
		},
		getSoundDataForScene: function($screenIndex) {}
	}
});