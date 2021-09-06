var ImpactPool=function()
{this.pool=[];this.addObject=function($obj)
{this.pool.push($obj);return this;};this.getNextAvailableObject=function()
{var currentObj=null;for(var i=0;i<this.pool.length;i++)
{currentObj=this.pool[i];if(currentObj.isAvailableFromPool==true)
break;else
currentObj=null;}
return currentObj;};this.reset=function()
{this.pool=[];};return this;};