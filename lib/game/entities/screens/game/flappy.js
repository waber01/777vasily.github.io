ig.module(
	"game.entities.screens.game.flappy"
).requires(
	"game.entities.screens.game.feather",
	"impact.entity",
	"plugins.box2d.entity"
).defines(function() {
	//player Flappy
	EntityFlappy = ig.Box2DEntity.extend({
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		markToKill: false,
		size: {
			x: 124,
			y: 97
		},
		offset: {
			x: 0,
			y: -5
		},
		animSheet: new ig.AnimationSheet("media/images/flappy/flappy_flap.png", 124, 97),
		bobUp: false,
		bobbingOffset: 0,
		currentAngle: 0,
		targetAngle: 0,
		ignoreCollision: false,
		hasHitGround: false,
		hasStarted: false,
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = 100;
			this.addAnim("idle", 0.1, [0]);
			this.addAnim("flapSlow", 0.07, [0, 1, 2, 3, 4, 5, 6, 7]);
			this.addAnim("flapFast", 0.04, [0, 1, 2, 3, 4, 5, 6, 7]);
			this.addAnim("dead", 0.01, [8]);
			this.currentAnim = this.anims.flapSlow;
			if (!ig.global.wm) {
				this.body.entity = this;
			}
			this.bobUp();
		},
		createBody: function() {
			var bodyDef = new b2.BodyDef();
			bodyDef.position.Set((this.pos.x + (this.size.x / 2)) * b2.SCALE, (this.pos.y + (this.size.y / 2)) * b2.SCALE);
			this.body = ig.world.CreateBody(bodyDef);
			var shapeDef = new b2.CircleDef();
			shapeDef.radius = 36 * b2.SCALE;
			shapeDef.m_userData = "FLAPPY";
			shapeDef.filter.groupIndex = 0;
			shapeDef.restitution = 0;
			shapeDef.density = 1;
			shapeDef.friction = 10;
			this.body.m_angularDamping = 0;
			this.body.CreateShape(shapeDef);
			this.body.SetMassFromShapes();
			this.body.PutToSleep();
		},
		startGame: function() {
			this.hasStarted = true;
			this.currentAnim = this.anims.flapFast;
			this.currentAnim.gotoFrame(5);
			this.body.WakeUp();
		},
		collideWith: function(other, axis) {
			if (other instanceof EntityTree) {
				if (!this.ignoreCollision) {
					var bodyVec = this.body.GetLinearVelocity();
					bodyVec.x = 0;
					this.body.SetLinearVelocity(bodyVec);
					ig.game.handleEvent("shakeScreen");
					ig.game.currentScreen.flappyHit("tree");
					this.ignoreCollision = true;
					this.currentAnim = this.anims.dead;
				}
			} else if (other instanceof EntityGround) {
				if (!this.ignoreCollision)
					ig.game.handleEvent("shakeScreen");
				if (!this.hasHitGround) {
					ig.game.currentScreen.flappyHit("ground");
					this.ignoreCollision = true;
					this.hasHitGround = true;
					this.currentAnim = this.anims.dead;
				}
			} else if (other instanceof EntityTreeSensor) {
				if (other.canHit) {
					ig.game.currentScreen.flappyHit("treeSensor");
					other.canHit = false;
				}
			}
		},
		fart: function() {
			ig.game.handleSound("fart");
			var numFeathers = ig.getRandomRange(5, 10);
			for (var i = 0; i < numFeathers; i++) {
				var randomFeatherNum = ig.getRandomRange(1, 4);
				var featherSettings = {
					"featherNum": randomFeatherNum
				};
				var feather = ig.game.spawnEntity(EntityFeather, this.pos.x, this.pos.y, featherSettings);
				feather.float();
			}
		},
		update: function() {
			this.parent();
			if (this.markToKill == true) {
				this.kill();
			}
			if (ig.input.pressed("leftMouse")) {
				if (ig.game.currentScreen.showTutorial) {
					ig.game.currentScreen.startGame();
				}
			}
			if (!this.ignoreCollision) {
				if (ig.input.pressed("leftMouse")) {
					if (this.pos.y >= 0) {
						var randomNum = ig.getRandomRange(1, 4);
						if (randomNum === 1)
							this.fart();
						else
							ig.game.handleSound("woosh");
						this.currentAnim.gotoFrame(5);
						this.body.SetLinearVelocity(new b2.Vec2(0, -40));
					}
				}
			}
			var currentPos = 0;
			if (this.hasStarted) {
				var ca = 0;
				if (!this.ignoreCollision) {
					var x1 = this.pos.x;
					var y1 = this.pos.y;
					var x2 = this.pos.x + this.body.GetLinearVelocity().x;
					var y2 = this.pos.y + this.body.GetLinearVelocity().y;
					ca = ig.getAngleBetweenPoints(x1, y1, x2, y2);
					if (ca <= 0)
						TweenLite.to(this, 0.1, {
							targetAngle: ca,
							ease: Sine.easeIn
						});
					else
						TweenLite.to(this, 0.2, {
							targetAngle: ca,
							ease: Sine.easeIn
						}); if (this.targetAngle <= -0.35)
						this.targetAngle = -0.35;
				} else {
					ca = (90).toRad();
					TweenLite.to(this, 0.1, {
						targetAngle: ca,
						ease: Sine.easeIn
					});
				}
				currentPos = this.body.GetPosition();
				this.body.SetXForm(currentPos, this.targetAngle);
			} else {
				currentPos = this.body.GetPosition();
				currentPos.y = currentPos.y + this.bobbingOffset * b2.SCALE;
				this.body.SetXForm(currentPos, this.targetAngle);
			}
		},
		bobUp: function() {
			TweenMax.to(this, 0.35, {
				bobbingOffset: -1,
				onCompleteScope: this,
				onComplete: this.bobDown,
				ease: Quad.easeInOut
			});
		},
		bobDown: function() {
			TweenMax.to(this, 0.35, {
				bobbingOffset: +1,
				onCompleteScope: this,
				onComplete: this.bobUp,
				ease: Quad.easeInOut
			});
		},
		draw: function() {
			this.parent();
		}
	});
});