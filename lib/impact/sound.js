ig.module('impact.sound').defines(function() {
	"use strict";
	ig.SoundManager = ig.Class.extend({
		clips: {},
		soundObjects: [],
		volume: 1,
		format: null,
		webAudioContext: null,
		init: function() {
			if (!ig.Sound.enabled || !window.Audio) {
				ig.Sound.enabled = false;
				return;
			}
			var probe = new Audio();
			for (var i = 0; i < ig.Sound.use.length; i++) {
				var format = ig.Sound.use[i];
				if (probe.canPlayType(format.mime)) {
					this.format = format;
					break;
				}
			}
			if (ig.Sound.iOSWebAudio) {
				this.format = {
					ext: 'mp3.jsound',
					mime: 'dataURI'
				};
			}
			if (!this.format) {
				ig.Sound.enabled = false;
			}
		},
		getAudioContext: function() {
			if (this.webAudioContext == null) {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.webAudioContext = new AudioContext();
			}
			return this.webAudioContext;
		},
		load: function(path, multiChannel, loadCallback) {
			var realPath = ig.prefix + path.replace(/[^\.]+$/, this.format.ext) + ig.nocache;
			if (ig.Sound.iOSWebAudio) {
				if (this.clips[path]) {
					return this.clips[path];
				}
				var ctx = this.getAudioContext();
				var waObj = {
					src: null,
					gainNode: null,
					data: "",
					loop: false,
					bufferData: null
				};
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						waObj.data = JSON.parse(xmlhttp.responseText).data;
						var arrayBuff = Base64Binary.decodeArrayBuffer(waObj.data);
						ctx.decodeAudioData(arrayBuff, function(audioData) {
							waObj.bufferData = audioData;
						});
						if (loadCallback) {
							loadCallback(path, true);
						}
					}
				}
				xmlhttp.open("GET", realPath, true);
				xmlhttp.send();
				this.clips[path] = waObj;
				return waObj;
			} else {
				if (this.clips[path]) {
					if (multiChannel && this.clips[path].length < ig.Sound.channels) {
						for (var i = this.clips[path].length; i < ig.Sound.channels; i++) {
							var a = new Audio(realPath);
							a.load();
							this.clips[path].push(a);
						}
					}
					return this.clips[path][0];
				}
				var clip = new Audio(realPath);
				if (loadCallback) {
					clip.addEventListener('canplaythrough', function cb(ev) {
						clip.removeEventListener('canplaythrough', cb, false);
						loadCallback(path, true, ev);
					}, false);
					clip.addEventListener('error', function(ev) {
						loadCallback(path, false, ev);
					}, false);
				}
				clip.preload = 'auto';
				clip.load();
				this.clips[path] = [clip];
				if (multiChannel) {
					for (var i = 1; i < ig.Sound.channels; i++) {
						var a = new Audio(realPath);
						a.load();
						this.clips[path].push(a);
					}
				}
				return clip;
			}
		},
		get: function(path) {
			if (ig.Sound.iOSWebAudio) {
				return this.clips[path];
			}
			var channels = this.clips[path];
			for (var i = 0, clip; clip = channels[i++];) {
				if (clip.paused || clip.ended) {
					if (clip.ended) {
						clip.currentTime = 0;
					}
					return clip;
				}
			}
			channels[0].pause();
			if (!ig.ua.IE9) {
				channels[0].currentTime = 0;
			}
			return channels[0];
		},
		setVolume: function(v) {
			this.volume = v;
			ig.music.setVolume(v);
			for (var i = 0; i < this.soundObjects.length; i++) {
				var s = this.soundObjects[i];
				if (s.currentClip) s.currentClip.volume = s.volume * this.volume;
			}
		},
		stopAll: function() {
			for (var i = 0; i < this.soundObjects.length; i++) {
				var s = this.soundObjects[i];
				s.stop();
			}
		}
	});
	ig.Music = ig.Class.extend({
		tracks: [],
		namedTracks: {},
		currentTrack: null,
		currentIndex: 0,
		random: false,
		_volume: 1,
		_loop: false,
		_fadeInterval: 0,
		_fadeTimer: null,
		_endedCallbackBound: null,
		init: function() {
			this._endedCallbackBound = this._endedCallback.bind(this);
			if (Object.defineProperty) {
				Object.defineProperty(this, "volume", {
					get: this.getVolume.bind(this),
					set: this.setVolume.bind(this)
				});
				Object.defineProperty(this, "loop", {
					get: this.getLooping.bind(this),
					set: this.setLooping.bind(this)
				});
			} else if (this.__defineGetter__) {
				this.__defineGetter__('volume', this.getVolume.bind(this));
				this.__defineSetter__('volume', this.setVolume.bind(this));
				this.__defineGetter__('loop', this.getLooping.bind(this));
				this.__defineSetter__('loop', this.setLooping.bind(this));
			}
		},
		add: function(music, name) {
			if (!ig.Sound.enabled) {
				return;
			}
			var path = music instanceof ig.Sound ? music.path : music;
			var track = ig.soundManager.load(path, false);
			if (ig.Sound.iOSWebAudio) {
				track.loop = this._loop;
			} else {
				track.loop = this._loop;
				track.volume = this._volume;
				track.addEventListener('ended', this._endedCallbackBound, false);
			}
			this.tracks.push(track);
			if (name) {
				this.namedTracks[name] = track;
			}
			if (!this.currentTrack) {
				this.currentTrack = track;
			}
		},
		next: function() {
			if (!this.tracks.length) {
				return;
			}
			this.stop();
			this.currentIndex = this.random ? Math.floor(Math.random() * this.tracks.length) : (this.currentIndex + 1) % this.tracks.length;
			this.currentTrack = this.tracks[this.currentIndex];
			this.play();
		},
		pause: function() {
			if (!this.currentTrack) {
				return;
			}
			this.currentTrack.pause();
		},
		stop: function() {
			if (!ig.Sound.enabled || (ig.ua.mobile && !ig.Sound.iOSWebAudio)) {
				return;
			}
			if (!this.currentTrack) {
				return;
			}
			if (ig.Sound.iOSWebAudio) {
				if (this.currentTrack.src) {
					this.currentTrack.src.noteOff(0);
				}
			} else {
				this.currentTrack.pause();
				if (!ig.ua.IE9) {
					this.currentTrack.currentTime = 0;
				}
			}
		},
		play: function(name) {
			if (!ig.Sound.enabled || (ig.ua.mobile && !ig.Sound.iOSWebAudio)) {
				return;
			}
			if (name && this.namedTracks[name]) {
				var newTrack = this.namedTracks[name];
				if (newTrack != this.currentTrack) {
					this.stop();
					this.currentTrack = newTrack;
				}
			} else if (!this.currentTrack) {
				return;
			}
			if (ig.Sound.iOSWebAudio) {
				var ctx = ig.soundManager.getAudioContext();
				var waObj = this.currentTrack;
				waObj.src = ctx.createBufferSource();
				waObj.gainNode = ctx.createGain ? ctx.createGain() : ctx.createGainNode();
				waObj.src.buffer = waObj.bufferData;
				waObj.src.loop = true;
				waObj.src.connect(waObj.gainNode);
				waObj.gainNode.connect(ctx.destination);
				waObj.src.noteOn(0);
			} else {
				this.currentTrack.play();
			}
		},
		getLooping: function() {
			return this._loop;
		},
		setLooping: function(l) {
			this._loop = l;
			for (var i in this.tracks) {
				this.tracks[i].loop = l;
			}
		},
		getVolume: function() {
			return this._volume;
		},
		setVolume: function(v) {
			this._volume = v.limit(0, 1);
			for (var i in this.tracks) {
				this.tracks[i].volume = this._volume;
			}
		},
		fadeOut: function(time) {
			if (!this.currentTrack) {
				return;
			}
			clearInterval(this._fadeInterval);
			this.fadeTimer = new ig.Timer(time);
			this._fadeInterval = setInterval(this._fadeStep.bind(this), 50);
		},
		_fadeStep: function() {
			var v = this.fadeTimer.delta().map(-this.fadeTimer.target, 0, 1, 0).limit(0, 1) * this._volume;
			if (v <= 0.01) {
				this.stop();
				this.currentTrack.volume = this._volume;
				clearInterval(this._fadeInterval);
			} else {
				this.currentTrack.volume = v;
			}
		},
		_endedCallback: function() {
			if (this._loop) {
				this.play();
			} else {
				this.next();
			}
		}
	});
	ig.Sound = ig.Class.extend({
		path: '',
		volume: 1,
		currentClip: null,
		multiChannel: true,
		init: function(path, multiChannel) {
			if (!ig.ua.mobile || ig.Sound.iOSWebAudio) {
				this.path = path;
				this.multiChannel = (multiChannel !== false);
				this.load();
			}
		},
		load: function(loadCallback) {
			if (!ig.Sound.enabled) {
				if (loadCallback) {
					loadCallback(this.path, true);
				}
				return;
			}
			if (ig.ready) {
				ig.soundManager.load(this.path, this.multiChannel, loadCallback);
			} else {
				ig.addResource(this);
			}
		},
		play: function() {
			if (!ig.Sound.enabled || (ig.ua.mobile && !ig.Sound.iOSWebAudio)) {
				return;
			}
			if (ig.soundManager.soundObjects.indexOf(this) == -1) ig.soundManager.soundObjects.push(this);
			this.currentClip = ig.soundManager.get(this.path);
			if (ig.Sound.iOSWebAudio) {
				var ctx = ig.soundManager.getAudioContext();
				var waObj = this.currentClip;
				waObj.src = ctx.createBufferSource();
				waObj.gainNode = ctx.createGain ? ctx.createGain() : ctx.createGainNode();
				waObj.src.buffer = waObj.bufferData;
				waObj.src.connect(waObj.gainNode);
				waObj.gainNode.connect(ctx.destination);
				waObj.src.noteOn(0);
			} else {
				this.currentClip.volume = ig.soundManager.volume * this.volume;
				this.currentClip.play();
			}
		},
		stop: function() {
			if (this.currentClip) {
				if (ig.Sound.iOSWebAudio) {
					if (this.currentClip.src) {
						this.currentClip.src.noteOff(0);
					}
				} else {
					this.currentClip.pause();
					if (!ig.ua.IE9) {
						this.currentClip.currentTime = 0;
					}
				}
			}
		}
	});
	ig.SoundJockey = ig.Class.extend({
		sounds: {
			SFX: {
				loaded: false,
				mp3: 'media/audio/flatchy_audio.mp3',
				ogg: 'media/audio/flatchy_audio.ogg',
				sprite: {
					silence: [0.05, 0.1, true],
					click: [0.199522, 0.338452, true],
					hit: [1.876634, 2.310302, true],
					medal: [3.814293, 5.940653, true],
					point: [7.431227, 7.637241, true],
					rollover: [9.136471, 9.555857, true],
					thud: [11.077159, 11.438550, true],
					woosh: [12.979761, 13.118258, true],
					gas1: [14.637396, 15.004413, true],
					gas2: [16.500613, 16.913940, true],
					gas3: [18.438272, 18.855927, true],
					gas4: [20.374632, 20.682355, true],
					gas5: [22.201926, 22.558989, true],
					gas6: [24.083754, 24.421773, true],
					gas7: [25.930957, 26.295810, true],
					gas8: [27.813217, 28.085883, true],
					gas9: [29.610215, 29.995842, true],
					gas10: [31.525801, 31.784617, true]
				}
			}
		},
		currentVOName: "",
		isVitalVOPlaying: false,
		interval: 0,
		spooledVO: [],
		playingSounds: {},
		pausedVO: null,
		init: function() {
			ig.SoundJockey.format = (navigator.userAgent.match(/(iPad|iPhone|iPod|Safari|MSIE)/g) ? 'mp3' : 'ogg');
			this.interval = setInterval(this.checkDuration.bind(this), 200);
		},
		addSound: function(soundName) {
			if (this.sounds[soundName].loaded === true || this.sounds[soundName].loading === true) {
				return;
			}
			var soundData = this.sounds[soundName];
			soundData.timeout = 0;
			soundData.loaded = true;
			soundData.audioElement = document.createElement("audio");
			var soundURL = ig.SoundJockey.format == "mp3" ? soundData.mp3 : soundData.ogg;
			soundData.audioElement.setAttribute("id", soundName);
			soundData.audioElement.setAttribute('preload', 'auto');
			soundData.audioElement.setAttribute('src', soundURL);
			soundData.audioElement.addEventListener('error', function(e) {
				console.log("ERROR: " + e.target.error.code);
			});
			soundData.audioElement.addEventListener('canplaythrough', function(event) {
				soundData.loaded = true;
			});
			soundData.audioElement.load();
			soundData.loading = true;
			if (!ig.ua.IE9) {
				var x = setInterval(function() {
					if (soundData.loaded === true) {
						clearInterval(x);
						return;
					}
					if (soundData.audioElement.buffered.length > 0) {
						clearInterval(x);
					} else {
						soundData.audioElement.play();
					}
				}, 500);
			}
		},
		playSound: function(soundName, spriteName, onComplete) {
			var sound = this.sounds[soundName];
			if (sound.loading === true) {}
			if (!sound || !sound.loaded || !sound.sprite[spriteName]) {
				return;
			}
			if (spriteName != "silence") {
				this.stopVO(soundName);
			}
			this.playingSounds[soundName] = {
				sprite: spriteName,
				onComplete: onComplete
			};
			var start = 0;
			var duration = 0;
			var loop = false;
			var t = sound.sprite[spriteName];
			start = t[0];
			duration = t[1] - start;
			if (sound.audioElement.buffered.end(sound.audioElement.buffered.length - 1) >= start && sound.audioElement.duration != 100) {
				sound.audioElement.currentTime = start;
				sound.audioElement.volume = spriteName != "silence" ? 1 : 0;
				sound.audioElement.play();
			} else {
				sound.audioElement.volume = 0;
				sound.audioElement.play();
				setTimeout(function() {
					ig.soundJockey.playSound(soundName, spriteName, onComplete);
				}, 200);
			}
			if (spriteName != "silence") {
				this.currentVOName = spriteName;
			}
		},
		checkDuration: function() {
			for (var s in this.sounds) {
				if (!this.playingSounds[s]) {
					continue;
				}
				var sound = this.sounds[s];
				var spriteName = this.playingSounds[s].sprite;
				var endTime = sound.sprite[spriteName][1];
				if (sound.audioElement && sound.audioElement.currentTime > endTime) {
					var callback = this.playingSounds[s].onComplete;
					this.playingSounds[s] = null;
					if (ig.ua.iOS && this.spooledVO.indexOf(s) > -1) {
						this.playSound(s, "silence");
					} else {
						sound.audioElement.pause();
					}
					if (callback) {
						callback();
					}
				}
			}
		},
		stopVO: function(exception) {
			for (var s in this.sounds) {
				var sound = this.sounds[s];
				if (sound.audioElement && s != exception) {
					if (ig.ua.iOS && this.spooledVO.indexOf(s) > -1) {
						this.playSound(s, "silence");
					} else {
						if (sound.audioElement.currentSrc != "undefined") {
							if (sound.audioElement.currentTime) {
								if (!ig.ua.IE9) {
									sound.audioElement.currentTime = 1;
								}
							}
							sound.audioElement.pause();
						}
					}
				}
			}
			this.currentVOName = "";
		},
		killVO: function() {
			for (var s in this.sounds) {
				var sound = this.sounds[s];
				if (sound.audioElement) {
					if (sound.audioElement.currentTime) {
						if (!ig.ua.IE9) {
							sound.audioElement.currentTime = 1;
						}
					}
					sound.audioElement.pause();
				}
			}
			this.spooledVO = [];
			this.currentVOName = "";
		},
		pauseVO: function() {
			this.pausedVO = null;
			for (var s in this.playingSounds) {
				this.pausedVO = {
					name: s,
					sprite: this.playingSounds[s].sprite,
					onComplete: this.playingSounds[s].onComplete
				};
			}
			for (var s in this.sounds) {
				var sound = this.sounds[s];
				if (sound.audioElement) {
					if (sound.audioElement.currentTime) {
						if (!ig.ua.IE9) {
							sound.audioElement.currentTime = 1;
						}
						sound.audioElement.pause();
					}
				}
			}
			this.playingSounds = {};
		},
		resumeVO: function() {
			if (this.pausedVO) {
				this.playSound(this.pausedVO.name, this.pausedVO.sprite, this.pausedVO.onComplete);
			}
		},
		onSoundComplete: function(soundName, spriteName, loop) {
			if (loop) {
				this.playSound(soundName, spriteName);
			} else {
				var sound = this.sounds[soundName];
				if (sound.active === true) {
					this.playSound(soundName, "silence");
				} else {
					sound.audioElement.pause();
				}
				this.currentVOName = "";
			}
		},
		spoolUp: function(soundName, callback) {
			var sound = this.sounds[soundName];
			if (!sound.loaded) {
				return false;
			}
			this.spooledVO.push(soundName);
			sound.audioElement.volume = 0;
			var x = setInterval(function() {
				if (sound.audioElement.currentTime < 0.2) {
					sound.audioElement.play();
				} else {
					if (callback) {
						callback();
					}
					clearInterval(x);
				}
			}, 250);
		},
		getAudioDuration: function(soundName, spriteName) {
			var sound = this.sounds[soundName];
			if (!sound) {
				return 0;
			}
			var isSingleSound = sound.sprite === 'undefined';
			if (!isSingleSound) {
				var t = sound.sprite[spriteName];
				return Math.ceil(t[1] - t[0]);
			} else {
				return sound.duration;
			}
		}
	});
	ig.Sound.FORMAT = {
		MP3: {
			ext: 'mp3',
			mime: 'audio/mpeg'
		},
		M4A: {
			ext: 'm4a',
			mime: 'audio/mp4; codecs=mp4a'
		},
		OGG: {
			ext: 'ogg',
			mime: 'audio/ogg; codecs=vorbis'
		},
		WEBM: {
			ext: 'webm',
			mime: 'audio/webm; codecs=vorbis'
		},
		CAF: {
			ext: 'caf',
			mime: 'audio/x-caf'
		}
	};
	ig.Sound.use = [ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
	ig.Sound.channels = 2;
	ig.Sound.iOSWebAudio = ig.ua.iOS && ('webkitAudioContext' in window || 'AudioContext' in window);
	ig.Sound.enabled = true;
	ig.SoundJockey.format = "mp3";
});