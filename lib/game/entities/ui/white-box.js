ig.module
("game.entities.ui.white-box").requires
("impact.entity").defines(function()
{EntityWhiteBox=ig.Entity.extend({collides:ig.Entity.COLLIDES.NEVER,type:ig.Entity.TYPE.NONE,checkAgainst:ig.Entity.TYPE.NONE,gravityFactor:0,ignoreUpdate:true,size:{x:0,y:0},offset:{x:0,y:0},scale:{x:1,y:1},currentAlpha:0,init:function(x,y,settings)
{this.zIndex=9999;this.parent(x,y,settings);},flash:function()
{TweenMax.to(this,0.1,{currentAlpha:1});TweenMax.to(this,0.1,{delay:0.1,currentAlpha:0,onCompleteScope:this,onComplete:this.kill});},draw:function()
{this.parent();var ctx=ig.system.context;ctx.save();ctx.globalAlpha=this.currentAlpha;ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,ig.game.stageWidth,ig.game.stageHeight);ctx.restore();},kill:function()
{this.parent();}});});