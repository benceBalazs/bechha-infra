<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	export let source: string;
	export let startTime: number;
	export let endTime: number;
	// Format time in mm:ss
	const formatTime = (milliseconds: number) => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	// Update the time display
	const updateTimeDisplay = (video: any, timeDisplay: any) => {
		const current = Math.max(0, video.currentTime * 1000 - startTime);
		const duration = endTime - startTime;
		timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
	};

	// Toggle play/pause
	const togglePlayPause = (video: any, playPauseButton: any) => () => {
		if (video.paused || video.ended) {
			video.play();
			playPauseButton.textContent = 'Pause';
		} else {
			video.pause();
			playPauseButton.textContent = 'Play';
		}
	};

	const seekVideo = (video: any, progressContainer: any) => (e: any) => {
		const rect = progressContainer.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const width = rect.width;
		const percentage = offsetX / width;
		const time = startTime / 1000 + percentage * (endTime / 1000 - startTime / 1000);
		video.currentTime = Math.min(time, video.duration);
	};

	// Update progress bar
	const updateProgressBar = (video: any, progressBar: any) => {
		const progress =
			((video.currentTime - startTime / 1000) / (endTime / 1000 - startTime / 1000)) * 100;
		progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
	};

	const loadMetadata = (video: any, progressBar: any, timeDisplay: any) => () => {
		video.currentTime = startTime / 1000;
		updateProgressBar(video, progressBar);
		updateTimeDisplay(video, timeDisplay);
	};

	const timeUpdate = (video: any, progressBar: any, timeDisplay: any) => () => {
		if (video.currentTime >= endTime / 1000) {
			video.currentTime = startTime / 1000;
		}
		updateProgressBar(video, progressBar);
		updateTimeDisplay(video, timeDisplay);
	};
	const cleanup = () => {
		console.log('onDestroy');
		const video: any = document.getElementById('videoPlayer');
		const playPauseButton: any = document.getElementById('playPauseButton');
		const progressContainer: any = document.getElementById('progressContainer');
		const progressBar: any = document.getElementById('progressBar');
		const timeDisplay: any = document.getElementById('timeDisplay');
		const dialog = document.getElementById('detailModal');
		playPauseButton.removeEventListener('click', togglePlayPause(video, playPauseButton));

		video.currentTime = 0;
		video.pause();
		playPauseButton.textContent = 'Play';

		video.removeEventListener('loadedmetadata', loadMetadata(video, progressBar, timeDisplay));

		// Update time and progress bar
		video.removeEventListener('timeupdate', timeUpdate(video, progressBar, timeDisplay));

		progressContainer.removeEventListener('click', seekVideo(video, progressContainer));
		if (dialog) {
			dialog.removeEventListener('close', cleanup);
			dialog.removeEventListener('cancel', cleanup);
			dialog.removeEventListener('open', initialize);
		}
	};

	const initialize = () => {
		const dialog = document.getElementById('detailModal');
		if (dialog) {
			dialog.addEventListener('open', initialize);
			dialog.addEventListener('close', cleanup);
			dialog.addEventListener('cancel', cleanup);
		}

		const video: any = document.getElementById('videoPlayer');
		const playPauseButton: any = document.getElementById('playPauseButton');
		const progressBar: any = document.getElementById('progressBar');
		const progressContainer: any = document.getElementById('progressContainer');
		const timeDisplay: any = document.getElementById('timeDisplay');

		// Initialize video
		video.addEventListener('loadedmetadata', loadMetadata(video, progressBar, timeDisplay));

		// Update time and progress bar
		video.addEventListener('timeupdate', timeUpdate(video, progressBar, timeDisplay));

		// Progress bar click event
		progressContainer.addEventListener('click', seekVideo(video, progressContainer));

		video.currentTime = startTime / 1000;
		playPauseButton.textContent = 'Pause';
		video.play();
		// Play/pause button event
		playPauseButton.addEventListener('click', togglePlayPause(video, playPauseButton));
	};

	onDestroy(cleanup);
	onMount(() => {
		initialize();
		const dialog = document.getElementById('detailModal') as any;
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.attributeName === 'open') {
					if (dialog.hasAttribute('open')) {
						initialize();
					} else {
						cleanup();
					}
				}
			}
		});
		observer.observe(dialog, { attributes: true });
	});
</script>

<div class="video-container">
	<video id="videoPlayer" src={source} preload="metadata">
		<track kind="captions" />
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
