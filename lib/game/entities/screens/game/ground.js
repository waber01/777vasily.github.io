ig.module("game.entities.screens.game.ground").requires("impact.entity", "plugins.box2d.entity").defines(function() {
	EntityGround = ig.Box2DEntity.extend({
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		markToKill: false,
		size: {
			x: 1605,
			y: 86
		},
		offset: {
			x: 0,
			y: 0
		},
		animSheet: new ig.AnimationSheet("media/images/game/ground.png", 1605, 86),
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = -100;
			this.addAnim("idle", 1, [0]);
			this.currentAnim = this.anims.idle;
			if (!ig.global.wm) {
				this.body.entity = this;
			}
		},
		createBody: function() {
			var bodyDef = new b2.BodyDef();
			bodyDef.position.Set((this.pos.x + (this.size.x / 2)) * b2.SCALE, (this.pos.y + (this.size.y / 2)) * b2.SCALE);
			this.body = ig.world.CreateBody(bodyDef);
			var shapeDef = new b2.PolygonDef();
			shapeDef.SetAsBox(this.size.x / 2 * b2.SCALE, this.size.y / 2 * b2.SCALE);
			shapeDef.m_userData = "GROUND";
			shapeDef.filter.groupIndex = 2;
			shapeDef.restitution = 0;
			shapeDef.density = 0;
			shapeDef.friction = 10;
			this.body.m_angularDamping = 0;
			this.body.CreateShape(shapeDef);
			this.body.SetMassFromShapes();
			this.body.PutToSleep();
		},
		collideWith: function(other, axis) {},
		updatePosition: function($moveX) {
			var posVec = this.body.GetPosition();
			posVec.x = posVec.x - $moveX * b2.SCALE;
			this.body.SetXForm(posVec, 0);
		},
		update: function() {
			this.parent();
			if (this.markToKill == true) {
				this.kill();
			}
		}
	});
});