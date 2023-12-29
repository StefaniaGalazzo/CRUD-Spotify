// script for the <div id="mainActions"> in all html pages

const myUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

const playBtn = document.querySelectorAll(".playBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let currentSongIndex = 0;
let isPlaying = false;
let songToPlay;

let trackDuration;
let isTrackChanged = false;
let arraySongs = localStorage.getItem("arraySongs");
arraySongs = JSON.parse(arraySongs);

document.addEventListener("DOMContentLoaded", function () {
  playBtn.forEach(
    (btn) =>
      (btn.onclick = () => handlePlayClick(arraySongs[currentSongIndex], btn))
  );
  prevBtn.onclick = () => handlePrevNextClick(false);
  nextBtn.onclick = () => handlePrevNextClick(true);
});

/*** HANDLE SONG with the actionBar (play|pause|next|prev) ***/
function initializeAudio(crrSng) {
  console.log(songToPlay, "songToPlay");
  console.log(crrSng, "crrSng");
  if (!songToPlay || songToPlay.src !== crrSng.preview) {
    songToPlay = new Audio(crrSng.preview);
    songToPlay.onended = function () {
      isPlaying = false;
    };
  }
}
function handlePlayClick(crrSng) {
  initializeAudio(crrSng);
  if (!isPlaying) {
    playPause();
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
    playPauseIcons(isPlaying);
    isPlaying = true;
  } else {
    playPauseIcons(isPlaying);
    songToPlay.pause();
    isPlaying = false;
  }
}
function playPauseIcons(isPlaying) {
  if (!isPlaying) {
    playBtn[0].classList.remove("bi-play-circle-fill");
    playBtn[1].classList.remove("bi-play-circle-fill");
    playBtn[0].classList.add("bi-pause-circle-fill");
    playBtn[1].classList.add("bi-pause-circle-fill");
  } else {
    playBtn[0].classList.remove("bi-pause-circle-fill");
    playBtn[1].classList.remove("bi-pause-circle-fill");
    playBtn[0].classList.add("bi-play-circle-fill");
    playBtn[1].classList.add("bi-play-circle-fill");
  }
}
function playPause() {
  if (isPlaying) {
    console.log("PAUSE");
    songToPlay.pause();
  } else {
    console.log("PLAY");
    songToPlay.play();
  }
}
function handlePrevNextClick(isNext) {
  playPauseIcons(isPlaying);

  if (isPlaying) {
    songToPlay.pause();
    isPlaying = false;
  }
  currentSongIndex =
    (currentSongIndex + (isNext ? 1 : -1) + arraySongs.length) %
    arraySongs.length;
  printJumbo(arraySongs[currentSongIndex]);
  initializeAudio(arraySongs[currentSongIndex]);
  isTrackChanged = true;
  // aziona la traccia solo se in riproduzione
  if (isPlaying) {
    playPause();
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
  }
  if (isTrackChanged) {
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
  }
}
function songTrackBar(track) {
  const barTrack = document.getElementById("barTrack");
  track.addEventListener("timeupdate", function () {
    barTrack.value = track.currentTime; // song value on play
  });
  track.addEventListener("loadedmetadata", function () {
    barTrack.value = 0;
    let trackDuration = track.duration; // song duration in sec
    barTrack.max = trackDuration; // set bar track max value
  });
}
function songTimeDuration(track) {
  const currentTimeIndicartor = document.getElementById("currentTime");
  const timeLeftIndicartor = document.getElementById("timeLeft");
  track.addEventListener("timeupdate", function () {
    const currentTime = track.currentTime;
    const timeLeft = trackDuration - currentTime;
    currentTimeIndicartor.innerText = formatTime(currentTime);
    timeLeftIndicartor.innerText = `-${formatTime(timeLeft)}`;
  });
  track.addEventListener("loadedmetadata", function () {
    currentTimeIndicartor.innerText = "00:00";
    timeLeftIndicartor.innerText = `-00:00`;
    trackDuration = track.duration;
  });
}
// time formatted in mm:ss
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
  return formattedTime;
}
function padZero(number) {
  return (number < 10 ? "0" : "") + number;
}
/* end handle actions on song */

function printJumbo(crrSng) {
  const jumboTitle = document.getElementById("jumboTitle");
  const imgsCover = document.querySelectorAll(".imgsCover");
  const type = document.querySelectorAll(".type");
  const artist = document.querySelectorAll(".artist");
  crrSng ? "" : (crrSng = arraySongs[0]);
  jumboTitle.innerText = crrSng.title;
  type.forEach((el) => {
    el.innerText = crrSng?.type;
  });
  artist.forEach((el) => {
    el.innerText = crrSng?.artist.name;
  });
  imgsCover.forEach((el) => {
    el.setAttribute("src", crrSng?.album.cover);
  });
  // print actionbar side left
  const songTitleActionBar = document.getElementById("songTitleActionBar");
  const artistTitleActionBar = document.getElementById("artistTitleActionBar");
  songTitleActionBar.setAttribute("title", `${crrSng?.title}`);
  songTitleActionBar.innerText = crrSng?.title;
  artistTitleActionBar.innerText = crrSng?.artist.name;
}

export {
  myUrl,
  playBtn,
  prevBtn,
  nextBtn,
  currentSongIndex,
  isPlaying,
  songToPlay,
  trackDuration,
  isTrackChanged,
  initializeAudio,
  handlePlayClick,
  handlePrevNextClick,
  printJumbo,
};
