// script for the <div id="mainActions"> in all html pages
import { getDataAlbum } from "./album.js";

const isHomePage = window.location
  .toString()
  .toLowerCase()
  .includes("index.html");
const isAlbumPage = window.location
  .toString()
  .toLowerCase()
  .includes("album.html");

const baseURL = "https://striveschool-api.herokuapp.com/api/deezer/";
const queryURL = `${baseURL}search?q=`;

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
  if (isHomePage) {
    playBtn.forEach(
      (btn) =>
        (btn.onclick = () => {
          handlePlayClick(arraySongs[currentSongIndex]);
        })
    );
    prevBtn.onclick = () => handlePrevNextClick(false);
    nextBtn.onclick = () => handlePrevNextClick(true);
  }
  if (isAlbumPage) {
    getDataAlbum()
      .then((initialTrack) => {
        console.log(initialTrack[currentSongIndex], "initial track album");
        playBtn.forEach(
          (btn) =>
            (btn.onclick = () => {
              handlePlayClick(initialTrack[currentSongIndex]);
            })
        );
        prevBtn.onclick = () =>
          handlePrevNextClick(false, initialTrack[currentSongIndex]);
        nextBtn.onclick = () =>
          handlePrevNextClick(true, initialTrack[currentSongIndex]);
      })
      .catch((error) => {
        console.error("Errore durante il recupero dei dati dell'album:", error);
      });
  }
});

/*** HANDLE SONG with the actionBar (play|pause|next|prev) ***/
function initializeAudio(crrSng) {
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
    playPauseIcons(isPlaying);
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
    isPlaying = true;
  } else {
    playPauseIcons(isPlaying);
    songToPlay.pause();
    isPlaying = false;
  }
}
function handlePrevNextClick(isNext, firstTrack) {
  if (isPlaying) {
    playPauseIcons(isPlaying);
    songToPlay.pause();
    isPlaying = false;
  }
  currentSongIndex =
    (currentSongIndex + (isNext ? 1 : -1) + arraySongs.length) %
    arraySongs.length;
  if (isHomePage) {
    printJumbo(arraySongs[currentSongIndex]);
    printActionBarSideLeft(arraySongs[currentSongIndex]);
  }
  if (isAlbumPage) {
    console.log(firstTrack, "first track prevnext");
    printJumbo(firstTrack);
    printActionBarSideLeft(firstTrack);
  }
  initializeAudio(arraySongs[currentSongIndex]);
  isTrackChanged = true;
  // aziona la traccia solo se in riproduzione
  if (isPlaying) {
    playPause();
    playPauseIcons(isPlaying);
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
  }
  if (isTrackChanged) {
    songTrackBar(songToPlay);
    songTimeDuration(songToPlay);
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
  if (isHomePage) crrSng ? "" : (crrSng = arraySongs[0]);
  const jumboTitle = document.getElementById("jumboTitle");
  const imgsCover = document.querySelectorAll(".imgsCover");
  const type = document.querySelectorAll(".type");
  const artist = document.querySelectorAll(".artist");
  jumboTitle.innerText = crrSng?.title || crrSng?.album.title;
  type.forEach((el) => {
    el.innerText = crrSng?.type || crrSng?.album.type;
  });
  artist.forEach((el) => {
    el.innerText = isHomePage
      ? crrSng?.artist?.name
      : `${crrSng?.artist?.name}  •  ${crrSng?.release_date.replaceAll(
          "-",
          "/"
        )}  •  ${crrSng?.nb_tracks} brani, ${(crrSng?.duration / 60)
          .toFixed(2)
          .padEnd(4, "0")}min `;
  });
  imgsCover.forEach((el) => {
    el.setAttribute("src", crrSng?.album?.cover || crrSng?.cover);
  });
  if (isAlbumPage) {
    const imgsArtist = document.querySelector(".imgsArtist");
    imgsArtist.setAttribute("src", crrSng?.artist?.picture_small);
  }
  //separare la print dell'actionbar oltre a condizionare la printjumbo in base alla pagina
  // print actionbar side left
  printActionBarSideLeft(crrSng);
}
function printActionBarSideLeft(crrSng) {
  const songTitleActionBar = document.getElementById("songTitleActionBar");
  const artistTitleActionBar = document.getElementById("artistTitleActionBar");
  // songTitleActionBar.innerText = "";
  // artistTitleActionBar.innerText = "";
  if (isHomePage) {
    songTitleActionBar.setAttribute("title", `${crrSng?.title}`);
    songTitleActionBar.innerText = crrSng?.title;
    artistTitleActionBar.innerText = crrSng?.artist?.name;
  }
  if (isAlbumPage) {
    console.log(crrSng, "crrsong printsidelefttt albumpage");
    songTitleActionBar.innerText = crrSng?.title;
    artistTitleActionBar.innerText = crrSng?.artist?.name;
  }
}
export {
  queryURL,
  baseURL,
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
  printActionBarSideLeft,
};
