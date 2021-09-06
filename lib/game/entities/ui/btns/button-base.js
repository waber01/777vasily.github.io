ig.module
("game.entities.ui.btns.button-base").requires
("impact.entity").defines(function()
{EntityButtonBase=ig.Entity.extend({gravityFactor:0,image:null,focused:false,isScaledDown:false,currentImage:null,scaleX:1,scaleY:1,scaledX:1.1,scaledY:1.1,scaleTime:0.25,tweenXPos:0,tweenYPos:0,init:function(x,y,settings)
{this.tweenXPos=x;this.tweenYPos=y;this.parent(x,y,settings);this.zIndex=900;},update:function()
{this.pos.x=this.tweenXPos;this.pos.y=this.tweenYPos;var f=ig.inFocus(this);if(f&&!this.focused)this.onMouseOver();if(!f&&this.focused)this.onMouseOut();if(ig.input.pressed("leftMouse")&&f)
this.onPressed();if(ig.input.state("leftMouse")&&f)
this.pressing();this.focused=f;},onPressed:function(event)
{ig.game.handleSound("click");this.isScaledDown=true;},pressing:function()
{this.isScaledDown=true;},onMouseOver:function()
{ig.game.handleSound("rollover");this.isScaledDown=true;},onMouseOut:function()
{this.isScaledDown=false;}});});