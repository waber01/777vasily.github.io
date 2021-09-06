ig.module
("game.entities.ui.btns.exit-btn").requires
('impact.entity',"game.entities.ui.btns.button-base").defines(function()
{EntityExitBtn=EntityButtonBase.extend({collides:ig.Entity.COLLIDES.NEVER,type:ig.Entity.TYPE.NONE,checkAgainst:ig.Entity.TYPE.NONE,size:{x:112,y:101},upImage:new ig.Image("media/images/ui/btns/exit_btn_up.png"),downImage:new ig.Image("media/images/ui/btns/exit_btn_up.png"),init:function(x,y,settings)
{this.parent(x,y,settings);this.offset.x=(112*0.5)-(this.size.x*0.5);this.offset.y=(101*0.5)-(this.size.y*0.5);this.currentImage=this.upImage;},changeImage:function($value,$playTween)
{switch($value)
{case"up":this.currentImage=this.upImage;if($playTween===true)
TweenMax.to(this,this.scaleTime,{scaleX:1,scaleY:1,ease:Back.easeOut});break;case"down":this.currentImage=this.downImage;if($playTween===true)
TweenMax.to(this,this.scaleTime,{scaleX:this.scaledX,scaleY:this.scaledY,ease:Back.easeOut});break;}},onPressed:function()
{this.parent();this.changeImage("down",true);ig.game.handleEvent("exitBtnClicked");},onMouseOver:function()
{this.changeImage("down",true);},onMouseOut:function()
{this.changeImage("up",true);},update:function()
{this.parent();if(this.isScaledDown&&this.focused===false)
{this.changeImage("up",true);this.isScaledDown=false;}},draw:function()
{this.parent();var ctx=ig.system.context;ctx.save();var iWidthHalf=(this.size.x*0.5);var iHeightHalf=(this.size.y*0.5);var translateX=this.pos.x+ iWidthHalf;var translateY=this.pos.y+ iHeightHalf;ctx.translate(translateX,translateY);var SX=this.scaleX;var SY=this.scaleY;ctx.scale(SX,SY);var drawX=-iWidthHalf- this.offset.x;var drawY=-iHeightHalf- this.offset.y;ctx.drawImage(this.currentImage.data,drawX,drawY);ctx.restore();}});});