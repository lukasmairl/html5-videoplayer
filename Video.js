/*
 * HTML5 Video Player
 *
 *
 */

var Video = function(container, options){

  this.container = container;
  this.progressBarDrag = false;
  this.volumeBarDrag = false;

  // default options
  // --------------------
  this.defaults = {
    video: 'video',
    playPause: '.play-pause',
    mute: '.mute',
    fullscreen: '.fullscreen',
    duration: '.duration',  
    currentTime: '.current-time',
    progressBarContainer: '.progress-bar',
    bufferBar: '.buffer-bar',
    volumeBar: '.volume-bar'
  };

  this.init(options);

};

Video.prototype = {

  /**
   * Initialize the video player and set some defaults
   * @param  {object} options List of key: value options
   * @return {void}
   */
  init: function(options){

    // merge options
    this.options = this._extend( this.defaults, options );

    //video controls
    this.video = this.container.querySelector(this.options.video);
    this.playPause = this.container.querySelector(this.options.playPause);
    this.mute = this.container.querySelector(this.options.mute);
    this.fullscreen = this.container.querySelector(this.options.fullscreen);
    this.duration = this.container.querySelector(this.options.duration);
    this.currentTime = this.container.querySelector(this.options.currentTime);
    this.progressBarContainer = this.container.querySelector(this.options.progressBarContainer);
    this.progressButton = this.progressBarContainer.querySelector(".progress-button");
    this.progressBar = this.progressBarContainer.querySelector(".progress");
    this.bufferBar = this.progressBarContainer.querySelector(".buffer-bar");
    this.volumeBar = this.container.querySelector(this.options.volumeBar);
    this.volume = this.volumeBar.querySelector(".volume");
    this.volumeButton = this.volumeBar.querySelector(".volume-button");
    
    //event listeners
    this.video.addEventListener('loadedmetadata', this.metaDataLoaded.bind(this));
    this.playPause.addEventListener('click', this.togglePlayPause.bind(this));
    this.mute.addEventListener('click', this.toggleMute.bind(this));
    this.fullscreen.addEventListener('click', this.toggleFullscreen.bind(this));
    this.video.addEventListener('timeupdate', this.timeUpdate.bind(this));
    this.video.addEventListener('ended', this.onVideoEnded.bind(this));
    
    //progress bar event listeners
    this.progressBarContainer.addEventListener('mouseup', this.onProgressBarMouseUp.bind(this));
    this.progressBarContainer.addEventListener('mousedown', this.onProgressBarMouseDown.bind(this));
    this.progressBarContainer.addEventListener('mousemove', this.onProgressBarMouseMove.bind(this));

    //volume bar event listeners
    this.volumeBar.addEventListener('mouseup', this.onVolumeBarMouseUp.bind(this));
    this.volumeBar.addEventListener('mousedown', this.onVolumeBarMouseDown.bind(this));
    this.volumeBar.addEventListener('mousemove', this.onVolumeBarMouseMove.bind(this));

    return this;
  },

  metaDataLoaded: function() {
    this.seekTimeUpdate();

    //video buffer state
    setTimeout(this.bufferBarUpdate.bind(this), 500);

    //set volume
    this.updateVolume(0, 0.7);
  },

  onVideoEnded: function() {
    this.video.paused = true;
  },

  timeUpdate: function() {
    this.seekTimeUpdate();
    this.progressBarUpdate();
  },

  onVolumeBarMouseDown: function(e) {
    this.volumeBarDrag = true;
    this.video.muted = false;
    this.updateVolume(e.pageX);
  },

  onVolumeBarMouseUp: function(e) {
    if(this.volumeBarDrag) {
      this.volumeBarDrag = false;
      this.updateVolume(e.pageX);
    }
  },

  onVolumeBarMouseMove: function(e) {
    if(this.volumeBarDrag) {
      this.updateVolume(e.pageX);
    }
  },

  onProgressBarMouseUp: function(e) {
    if(this.progressBarDrag) {
      this.progressBarDrag = false;
      this.currentPlayTimeUpdate(e.pageX);
    }
  },

  updateVolume: function(x, volume) {
    var percentage;

    if(volume) {
      percentage = volume * 100;
    } else {
      var position = x - $(".volume").eq(0).offset().left; //TODO FIX;
        percentage = 100 * position / $(".volume-bar").eq(0).width();  //TODO FIX;
      }

      if(percentage > 100) { percentage = 100; }
    if(percentage < 0) { percentage = 0; }

    this.volume.style.width = percentage+'%';
      this.volumeButton.style.left = percentage+'%';
      this.video.volume = percentage / 100;
  },

  onProgressBarMouseDown: function(e) {
    this.progressBarDrag = true;
    this.currentPlayTimeUpdate(e.pageX);
  },

  onProgressBarMouseMove: function(e) {
    if(this.progressBarDrag) {
      this.currentPlayTimeUpdate(e.pageX);
    }
  },

  togglePlayPause: function() {
    if( this.video.paused || this.video.ended ) {
      this.video.play();
      this.playPause.innerHTML = "Pause";
    } else {
      this.video.pause();
      this.playPause.innerHTML = "Play";
    }
  },

  toggleMute: function() {
    (this.video.muted) ? this.video.muted = false : this.video.muted = true;
  },

  toggleFullscreen: function() {
    if(this.video.requestFullScreen){
      this.video.requestFullScreen();
    } else if(this.video.webkitRequestFullScreen){
      this.video.webkitRequestFullScreen();
    } else if(this.video.mozRequestFullScreen){
      this.video.mozRequestFullScreen();
    }
  },

  seekTimeUpdate: function() {
    var curmins = Math.floor(this.video.currentTime / 60);
    var cursecs = Math.floor(this.video.currentTime - curmins * 60);
    var durmins = Math.floor(this.video.duration / 60);
    var dursecs = Math.floor(this.video.duration - durmins * 60);

    if(cursecs < 10) { cursecs = "0"+cursecs; }
    if(dursecs < 10) { dursecs = "0"+dursecs; }
    if(curmins < 10) { curmins = "0"+curmins; }
    if(durmins < 10) { durmins = "0"+durmins; }

    this.duration.innerHTML = durmins+":"+dursecs;
    this.currentTime.innerHTML = curmins+":"+cursecs;
  },

  progressBarUpdate: function() {
    var currentPosition = this.video.currentTime;
    var duration = this.video.duration;
    var percentage = 100 * currentPosition / duration;

    this.progressBar.style.width = percentage+"%";
    this.progressButton.style.left = percentage+"%";
  },

  currentPlayTimeUpdate: function(x) {
    var duration = this.video.duration; 
    var position = x - $(".progress").eq(0).offset().left; //TODO: FIX THIS this.progressBarContainer.offsetLeft; 
    var percentage = 100 * position / this.progressBarContainer.clientWidth;

    if(percentage > 100) { percentage = 100; }
    if(percentage < 0) { percentage = 0; }

    this.video.currentTime = duration * percentage / 100;
  },

  bufferBarUpdate: function() {
    var duration = this.video.duration;
    var currentBuffer = this.video.buffered.end(0);
    var percentage = 100 * currentBuffer / duration;

    this.bufferBar.style.width = percentage+"%";

    if( currentBuffer < duration ) {
      setTimeout(this.bufferBarUpdate.bind(this), 500);
    }
  },

  /**
   * Helper function. Simple way to merge objects
   * @param  {object} obj A list of objects to extend
   * @return {object}     The extended object
   */
  _extend: function(obj) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      var source = args[i];
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }

};