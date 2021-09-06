ig.module(
	"game.entities.screens.game.tree"
).requires(
	"game.entities.screens.game.tree-sensor",
	"impact.entity",
	"plugins.box2d.entity"
).defines(function() {
	EntityTree = ig.Box2DEntity.extend({
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		markToKill: false,
		markToReset: false,
		isAvailableFromPool: true,
		size: {
			x: 192,
			y: 1231
		},
		offset: {
			x: 0,
			y: 0
		},
		treeNum: 0,
		sensor: null,
		treeTopImage: new ig.Image("media/images/game/tree.png"),
		treeBottomImage: new ig.Image("media/images/game/tree.png"),
		init: function(x, y, settings) {
			this.treeNum = settings.treeNum;
			this.parent(x, y, settings);
			this.zIndex = -150;
			if (!ig.global.wm) {
				this.body.entity = this;
			}
		},
		createBody: function() {
			var bodyDef = new b2.BodyDef();
			bodyDef.position.Set((this.pos.x + (this.size.x / 2)) * b2.SCALE, (this.pos.y + (this.size.y / 2)) * b2.SCALE);
			this.body = ig.world.CreateBody(bodyDef);
			var topShapeDef = new b2.PolygonDef();
			topShapeDef.density = 0;
			topShapeDef.restitution = 0;
			topShapeDef.friction = 0;
			topShapeDef.isSensor = true;
			var width = 125 / 2 * b2.SCALE;
			var height = 1210 / 2 * b2.SCALE;
			var xPos = 10 * b2.SCALE;
			var yPos = 0;
			var angle = 0;
			topShapeDef.SetAsOrientedBox(width, height, new b2.Vec2(xPos, yPos), angle);
			this.body.CreateShape(topShapeDef);
			var bottomShapeDef = new b2.PolygonDef();
			bottomShapeDef.density = 0;
			bottomShapeDef.restitution = 0;
			bottomShapeDef.friction = 0;
			bottomShapeDef.isSensor = true;
			width = 125 / 2 * b2.SCALE;
			height = 1231 / 2 * b2.SCALE;
			xPos = 19 * b2.SCALE;
			yPos = 1491 * b2.SCALE;
			angle = 0;
			bottomShapeDef.SetAsOrientedBox(width, height, new b2.Vec2(xPos, yPos), angle);
			this.body.CreateShape(bottomShapeDef);
			this.body.SetMassFromShapes();
			this.sensor = ig.game.spawnEntity(EntityTreeSensor, this.pos.x + 174, this.pos.y + 1367);
		},
		collideWith: function(other, axis) {
			if (other instanceof EntityFlappy) {
				//console.log();
			}
		},
		updatePosition: function($moveX) {
			var posVec = this.body.GetPosition();
			posVec.x = posVec.x - ($moveX * b2.SCALE);
			this.body.SetXForm(posVec, 0);
			var sensorPosVec = new b2.Vec2((this.pos.x + 192) * b2.SCALE, (this.pos.y + 1367) * b2.SCALE);
			this.sensor.body.SetXForm(sensorPosVec, 0);
		},
		update: function() {
			this.parent();
			if (this.markToKill == true)
				this.kill();
			if (this.pos.x <= -211)
				ig.game.currentScreen.updateTreePosition(this.treeNum);
		},
		draw: function() {
			this.parent();
			var ctx = ig.system.context;
			ctx.save();
			ctx.drawImage(this.treeTopImage.data, this.pos.x, this.pos.y);
			ctx.restore();
			ctx.save();
			ctx.translate(this.pos.x + 19, this.pos.y + 2700);
			ctx.scale(1, -1);
			ctx.drawImage(this.treeBottomImage.data, 0, 0);
			ctx.restore();
		},
		kill: function() {
			this.sensor.kill();
			this.sensor = null;
			this.parent();
		}
	});
});