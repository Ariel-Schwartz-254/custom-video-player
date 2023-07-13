const htmlElements = {
    player : document.querySelector('.player'),
    video : document.querySelector('video'),
    progressRange : document.querySelector('.progress-range'),
    progressBar : document.querySelector('.progress-bar'),
    playBtn : document.getElementById('play-btn'),
    volumeIcon : document.getElementById('volume-icon'),
    volumeRange : document.querySelector('.volume-range'),
    volumeBar : document.querySelector('.volume-bar'),
    currentTime : document.querySelector('.time-elapsed'),
    duration : document.querySelector('.time-duration'),
    speed : document.querySelector('.player-speed'),
    fullscreenBtn : document.querySelector('.fullscreen'),
};

// Play & Pause ----------------------------------- //
function showPlayIcon() {
    const { playBtn } = htmlElements;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');  
}

function showPauseIcon() {
    const { playBtn } = htmlElements;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
}

function playVideo() {
    htmlElements.video.play();
    showPauseIcon();
}

function pauseVideo() {
    htmlElements.video.pause();
    showPlayIcon();
}

function togglePlay() {
    htmlElements.video.paused ? playVideo() : pauseVideo();
}

// On Video End, show play button icon
htmlElements.video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //
function calculateMinutes(totalTime) {
    let minutes = Math.floor(totalTime / 60);
    minutes < 10 ? minutes = `0${minutes}` : false;
    return minutes;
}

function calculateSeconds(totalTime) {
    let seconds = Math.floor(totalTime % 60);
    seconds < 10 ? seconds = `0${seconds}` : false;
    return seconds;
}

function updateCurrentTime() {
    const { video, currentTime } = htmlElements;
    const minutes = Math.floor(video.currentTime / 60);
    const seconds = calculateSeconds(video.currentTime);
    currentTime.textContent = `${minutes}:${seconds} /`;
}

function updateProgress() {
    const { video, progressBar } = htmlElements;
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    updateCurrentTime()
}

function updateDuration() {
    const { video, duration } = htmlElements;
    const minutes = Math.floor(video.duration / 60);
    const seconds = calculateSeconds(video.duration);
    duration.textContent = ` ${minutes}:${seconds}`;
}

// Click to seek within the video
function setProgress(e) {
    const { progressRange, video } = htmlElements;
    const newTime = e.offsetX / progressRange.offsetWidth;
    video.currentTime = newTime * video.duration;
    updateProgress();
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function displayNewVolume() {
    const { volumeBar, video } = htmlElements;
    volumeBar.style.width = `${video.volume * 100}%`;
}

function changeVolumeIcon(){
    const { volume } = htmlElements.video;
    const { volumeIcon } = htmlElements;
    htmlElements.volumeIcon.classList = 'fas';
    volume > 0.7 ? volumeIcon.classList.add('fa-volume-up') : false;
    volume < 0.7 && volume > 0 ? volumeIcon.classList.add('fa-volume-down') : false;
    volume === 0 ? volumeIcon.classList.add('fa-volume-mute'): false;
    volume ? volumeIcon.title = 'Mute' : volumeIcon.title = 'Unmute';
}

function changeVolume(e) {
    const { video, volumeRange } = htmlElements;
    lastVolume = video.volume;
    let newVolume = e.offsetX / volumeRange.offsetWidth;
    // Rounding volume up or down
    newVolume < 0.1 ? newVolume = 0 : false;
    newVolume > 0.9 ? newVolume = 1 : false;
    video.volume = newVolume;
    displayNewVolume();
    changeVolumeIcon();
}

function muteVolume() {
    const { video } = htmlElements;
    lastVolume = video.volume;
    video.volume = 0;
    displayNewVolume();
    changeVolumeIcon();
}

function unmuteVolume() {
    htmlElements.video.volume = lastVolume;
    displayNewVolume();
    changeVolumeIcon();
}

function toggleMute() {
    htmlElements.video.volume > 0 ? muteVolume() : unmuteVolume();
}

// Change Playback Speed -------------------- //
function changeSpeed() {
    const { video, speed } = htmlElements;
    video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //
/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    htmlElements.video.classList.add('video-fullscreen');
}
  
/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    htmlElements.video.classList.remove('video-fullscreen');
}

function toggleFullscreen() {
    document.fullscreenElement ? closeFullscreen() : openFullscreen(player);
}

// Event Listeners
htmlElements.playBtn.addEventListener('click', togglePlay);
htmlElements.video.addEventListener('click', togglePlay);
htmlElements.video.addEventListener('timeupdate', updateProgress);
htmlElements.video.addEventListener('canplay', updateProgress);
htmlElements.video.addEventListener('canplay', updateDuration);
htmlElements.progressRange.addEventListener('click', setProgress);
htmlElements.volumeRange.addEventListener('click', changeVolume);
htmlElements.volumeIcon.addEventListener('click', toggleMute);
htmlElements.speed.addEventListener('change', changeSpeed);
htmlElements.fullscreenBtn.addEventListener('click', toggleFullscreen);