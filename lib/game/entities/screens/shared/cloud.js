ig.module
("game.entities.screens.shared.cloud").requires
("impact.entity").defines(function()
{EntityCloud=ig.Entity.extend({collides:ig.Entity.COLLIDES.NEVER,type:ig.Entity.TYPE.NONE,checkAgainst:ig.Entity.TYPE.NONE,gravityFactor:0,ignoreUpdate:true,size:{x:0,y:0},offset:{x:0,y:0},scale:{x:1,y:1},currentImage:null,cloudImage1:new ig.Image("media/images/clouds/cloud_01.png"),cloudImage2:new ig.Image("media/images/clouds/cloud_02.png"),cloudImage3:new ig.Image("media/images/clouds/cloud_03.png"),cloudImage4:new ig.Image("media/images/clouds/cloud_04.png"),cloudNum:0,needsReposition:false,init:function(x,y,settings)
{this.cloudNum=settings.cloudNum;switch(this.cloudNum)
{case 1:this.zIndex=-161;this.currentImage=this.cloudImage1;this.size={x:90,y:45};break;case 2:this.zIndex=-162;this.currentImage=this.cloudImage2;this.size={x:196,y:89};break;case 3:this.zIndex=-163;this.currentImage=this.cloudImage3;this.size={x:118,y:72};break;case 4:this.zIndex=-164;this.currentImage=this.cloudImage4;this.size={x:191,y:93};break;}
this.parent(x,y,settings);},update:function()
{this.parent();if(ig.game.screenIndex===ig.SCREENS.SCREEN_GAME)
{if(this.pos.x<=-this.size.x)
ig.game.currentScreen.updateCloud(this.cloudNum);}},draw:function()
{this.parent();var ctx=ig.system.context;ctx.save();ctx.scale(this.scale.x,this.scale.y);ctx.drawImage(this.currentImage.data,this.pos.x,this.pos.y);ctx.restore();},kill:function()
{this.parent();}});});