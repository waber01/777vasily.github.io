ig.module('game.utils.utils').requires('impact.game', 'impact.impact').defines(function() {
	"use strict";
	ig.getRandomRange = function($minNum, $maxNum) {
		return (Math.floor(Math.random() * ($maxNum - $minNum + 1)) + $minNum);
	};
	ig.shuffleArray = function(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	ig.getAngleBetweenPoints = function($x1, $y1, $x2, $y2) {
		var dx = $x2 - $x1;
		var dy = $y2 - $y1;
		return Math.atan2(dy, dx);
	};
	ig.inFocus = function(entity) {
		return ((entity.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) && ((ig.input.mouse.x + ig.game.screen.x) <= entity.pos.x + entity.size.x) && (entity.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) && ((ig.input.mouse.y + ig.game.screen.y) <= entity.pos.y + entity.size.y))
	};
});