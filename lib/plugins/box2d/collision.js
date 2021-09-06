ig.module('plugins.box2d.collision').requires('plugins.box2d.entity','plugins.box2d.game').defines(function(){ig.Box2DEntity.inject({init:function(x,y,settings){this.parent(x,y,settings);if(!ig.global.wm){this.body.entity=this;}}});ig.Box2DGame.inject({checkEntities:function(){},loadLevel:function(data){this.parent(data);var listener=new b2.ContactListener();listener.Add=function(point)
{var a=point.shape1.GetBody().entity,b=point.shape2.GetBody().entity;if(!a||!b)
{return;}
else
{if(a.checkAgainst&b.type)
{a.check(b);}
if(b.checkAgainst&a.type)
{b.check(a);}
if(point.normal.y)
{a.collideWith(b,'y');b.collideWith(a,'y');}
else
{a.collideWith(b,'x');b.collideWith(a,'x');}}};ig.world.SetContactListener(listener);}});});