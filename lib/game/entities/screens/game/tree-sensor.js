ig.module("game.entities.screens.game.tree-sensor").requires("impact.entity", "plugins.box2d.entity").defines(function() {
	EntityTreeSensor = ig.Box2DEntity.extend({
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		markToKill: false,
		size: {
			x: 10,
			y: 400
		},
		offset: {
			x: 0,
			y: 0
		},
		canHit: true,
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = 0;
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
			shapeDef.m_userData = "TREE_SENSOR";
			shapeDef.filter.groupIndex = 2;
			shapeDef.restitution = 0;
			shapeDef.density = 0;
			shapeDef.friction = 0;
			shapeDef.isSensor = true;
			this.body.m_angularDamping = 0;
			this.body.CreateShape(shapeDef);
			this.body.SetMassFromShapes();
			this.body.PutToSleep();
		},
		collideWith: function(other, axis) {},
		update: function() {
			this.parent();
			if (this.markToKill == true) {
				this.kill();
			}
		}
	});
});