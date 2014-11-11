html5-videoplayer
=================

HTML5 Video Player

Basic Implementation of a custom HTML5 Video Player

HTML STRUCTURE

<code>
<div class="video">
  <video data-videoid="">
    <source src="" type="video/mp4">
    <p>Your browser doesn't support HTML5 video.</p>
  </video>
  <div class="video-controls">
      <button type="button" class="play-pause">Play</button>
      <div class="progress-container">
        <span class="current-time"></span>
      <div class="progress-bar">
        <div class="button-holder">
          <div class="progress-button"></div>
        </div>
      </div>
        <span class="duration"></span>
      </div>
      <button type="button" class="mute">Mute</button>
      <button type="button" class="fullscreen">Full-Screen</button>
    </div>
</div>
</code>
