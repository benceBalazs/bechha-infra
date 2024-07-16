<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    const video:any = document.getElementById("videoPlayer");
    const playPauseButton: any = document.getElementById("playPauseButton");
    const progressBar: any = document.getElementById("progressBar");
    const progressContainer: any = document.getElementById("progressContainer");
    const timeDisplay: any = document.getElementById("timeDisplay");

      // Define the start and end time in seconds
    const startTime = 30; // start time in seconds
    const endTime = 40; // end time in seconds

    // Update the time display
    const updateTimeDisplay = () => {
      const current = Math.max(0, video.currentTime - startTime);
      const duration = endTime - startTime;
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    };

    // Format time in mm:ss
    const formatTime = (seconds:any) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Toggle play/pause
    const togglePlayPause = () => {
      if (video.paused || video.ended) {
        video.play();
        playPauseButton.textContent = "Pause";
      } else {
        video.pause();
        playPauseButton.textContent = "Play";
      }
    };

    // Update progress bar
    const updateProgressBar = () => {
      const progress = ((video.currentTime - startTime) / (endTime - startTime)) * 100;
      progressBar.style.width = `${progress}%`;
    };

    // Seek video
    const seekVideo = (e:any) => {
      const rect = progressContainer.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = offsetX / width;
      video.currentTime = startTime + percentage * (endTime - startTime);
    };

    // Initialize video
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = startTime;
      updateTimeDisplay();
    });

    // Update time and progress bar
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
      updateProgressBar();
      updateTimeDisplay();
    });

    // Play/pause button event
    playPauseButton.addEventListener("click", togglePlayPause);

    // Progress bar click event
    progressContainer.addEventListener("click", seekVideo);
  });
</script>

<div class="video-container">
  <video
    id="videoPlayer"
    src="http://localhost:3000/videoplayer/00100_c6a1c82d-eea3-4ded-9926-c155dd9ea5af"
    preload="metadata">
    <track kind="captions">
  </video>
  <div class="controls">
    <button id="playPauseButton">Play</button>
    <div class="progress-container" id="progressContainer">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    <div class="time-display" id="timeDisplay">00:00 / 00:00</div>
  </div>
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 100%;
    background-color: #000;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  video {
    width: 100%;
    height: auto;
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .progress-container {
    flex-grow: 2;
    margin: 0 10px;
    background-color: #444;
    height: 8px;
    cursor: pointer;
    border-radius: 4px;
    position: relative;
  }
  .progress-bar {
    background-color: #ff6347;
    height: 100%;
    width: 0;
    border-radius: 4px;
  }
  .controls button {
    background-color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    color: #000;
  }
  .controls button:hover {
    background-color: #ddd;
  }
  .time-display {
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
  }
</style>