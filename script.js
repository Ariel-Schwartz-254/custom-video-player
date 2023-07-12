const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen');

// Play & Pause ----------------------------------- //
function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');  
}

function showPauseIcon() {
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
}

function playVideo() {
    video.play();
    showPauseIcon();
}

function pauseVideo() {
    video.pause();
    showPlayIcon();
}

function togglePlay() {
    video.paused ? playVideo() : pauseVideo();
}

// On Video End, show play button icon
video.addEventListener('ended', showPlayIcon);

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
    const minutes = Math.floor(video.currentTime / 60);
    const seconds = calculateSeconds(video.currentTime);
    // console.log('min:', minutes, 'Seconds:', seconds);
    currentTime.textContent = `${minutes}:${seconds} /`;
}

function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    updateCurrentTime()
}

function updateDuration() {
    const minutes = Math.floor(video.duration / 60);
    const seconds = calculateSeconds(video.duration);
    // console.log('min:', minutes, 'Seconds:', seconds);
    duration.textContent = ` ${minutes}:${seconds}`;
}

// Click to seek within the video
function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    // console.log(newTime * video.duration);
    video.currentTime = newTime * video.duration;
    updateProgress();
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function displayNewVolume() {
    volumeBar.style.width = `${video.volume * 100}%`
}

function changeVolumeIcon(){
    volumeIcon.classList = 'fas';
    // volumeIcon.classList.add('fas');
    video.volume > 0.7 ? volumeIcon.classList.add('fa-volume-up') : false;
    video.volume < 0.7 && video.volume > 0 ? volumeIcon.classList.add('fa-volume-down') : false;
    video.volume === 0 ? volumeIcon.classList.add('fa-volume-mute'): false;
    video.volume ? volumeIcon.title = 'Mute' : volumeIcon.title = 'Unmute';
}

function changeVolume(e) {
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
    lastVolume = video.volume;
    video.volume = 0;
    displayNewVolume();
    changeVolumeIcon();
}

function unmuteVolume() {
    video.volume = lastVolume;
    displayNewVolume();
    changeVolumeIcon();
}

function toggleMute() {
    video.volume > 0 ? muteVolume() : unmuteVolume();
}

// Change Playback Speed -------------------- //
function changeSpeed() {
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
    video.classList.add('video-fullscreen');
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
    video.classList.remove('video-fullscreen');
}

function toggleFullscreen() {
    document.fullscreenElement ? closeFullscreen() : openFullscreen(player);
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
video.addEventListener('canplay', updateDuration);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);