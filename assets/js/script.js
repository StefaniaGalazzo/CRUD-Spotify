const myUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

/* actions on song (play|pause|next|prev) */
const playBtn = document.querySelectorAll(".playBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let currentSongIndex = 0; // indice della canzone corrente
let isPlaying = false;
let songToPlay;

let trackDuration;
let isTrackChanged = false;
/* * */

let arrayAlbums = [];
let arraySongs = [];

window.onload = () => {
  helloSpoty();
  Promise.all([getData("alt-j"), getData("queen"), getData("dua-lipa")]).then(
    () => {
      handleNavigation();
      playBtn.forEach(
        (btn) =>
          (btn.onclick = () =>
            handlePlayClick(arraySongs[currentSongIndex], btn))
      );
      prevBtn.onclick = () => handlePrevNextClick(false);
      nextBtn.onclick = () => handlePrevNextClick(true);
    }
  );
};

//recupero i dati dall API e li uso per riempire gli array
function getData(query) {
  fetch(`${myUrl}[${query}]`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      handleCreateArrays(data);
      handlePrintData();
    })
    .catch((error) => console.error("Errore durante la fetch:", error));
}

/*** HANDLE SONG with the actionBar (play|pause|next|prev) ***/
function initializeAudio(crrSng) {
  if (!songToPlay || songToPlay.src !== crrSng.preview) {
    songToPlay = new Audio(crrSng.preview);
    songToPlay.onended = function () {
      isPlaying = false;
    };
  }
}
function handlePlayClick(crrSng, btn) {
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

//
// create array and put datas in local storage
function handleCreateArrays(data) {
  createArrayAlbums(data);
  createArraySongs(data);
  localStorage.setItem("arraySongs", JSON.stringify(arraySongs));
  localStorage.setItem("arrayAlbums", JSON.stringify(arrayAlbums));
}
function createArrayAlbums(data) {
  for (let i = 0; i < data.data.length; i++) {
    let album = data.data[i].album;
    const isExistingAlbum = arrayAlbums.some(
      (alb) => alb.id.toString() === album.id.toString()
    );
    if (!isExistingAlbum) arrayAlbums.push(album);
  }
}
function createArraySongs(data) {
  for (let i = 0; i < data.data.length; i++) {
    let song = data.data[i];
    const isExistingSong = arraySongs.some(
      (sng) => sng.id.toString() === song.id.toString()
    );
    if (!isExistingSong) arraySongs.push(song);
  }
}

// stampo in home page
function handlePrintData() {
  printAlbums();
  printSideList();
  printSongs();
  printJumbo();
}
function printAlbums() {
  const containerBuonasera = document.getElementById("containerBuonasera");
  containerBuonasera.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const newCard = document.createElement("div");
    newCard.classList.add("col-4");
    newCard.innerHTML = `
          <div class="albumCard card overflow-hidden border-0 mb-3" style="max-width: 540px" data-id=${arrayAlbums[i].id}>
              <div class="row g-0">
                  <div class="col overflow-hidden" style="max-width: 80px">
                  <img
                      src="${arrayAlbums[i].cover_small}"
                      alt="img-album"
                      width="100%"
                  />
                  </div>
                  <div class="col-md-8 text-white">
                  <div class="card-body px-3 p-2">
                      <p class="card-text">
                          <small>${arrayAlbums[i].title}</small>
                      </p>
                  </div>
                  </div>
              </div>
          </div>`;
    containerBuonasera.appendChild(newCard);
  }
  const albumCards = document.querySelectorAll(".albumCard");
  albumCards.forEach((el) => {
    const dataId = el.getAttribute("data-id");
    // console.log(el, "EL");
    el.onclick = () => {
      goOnPage("album", dataId);
    };
  });
}
function printSideList() {
  const containerSideList = document.getElementById("containerSideList");
  containerSideList.innerHTML = "";
  for (let i = 0; i < arrayAlbums.length; i++) {
    const newItem = document.createElement("li");
    newItem.classList.add("my-2");

    newItem.innerText = `${arrayAlbums[i].title}`;

    containerSideList.appendChild(newItem);
  }
}
function printSongs() {
  const containerAltroPiace = document.getElementById("containerAltroPiace");
  containerAltroPiace.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const newCard = document.createElement("div");
    newCard.classList.add("col");
    newCard.innerHTML = `
                  <div class="cardPlay card h-100 p-3 border-0 bg-dark-grey">
                    <img
                      src="${arraySongs[i].album.cover}"
                    />
                    <div class="card-body pt-3 p-0">
                      <h6 class="card-title text-white">${arraySongs[i].title}</h6>
                      <p class="card-text">
                        Album: ${arraySongs[i].album.title}
                      </p>
                      <p class="mt-auto card-text">
                      ${arraySongs[i].duration}sec
                      </p>
                      <div class='audioWrapper'>
                       <audio controls>
                         <source src="${arraySongs[i].preview}" type="audio/mp3">
                         Your browser does not support the audio element.
                       </audio>
                      </div>
                    </div>
                  </div>
      `;
    containerAltroPiace.appendChild(newCard);
  }
}
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

// cambio pagina
function goOnPage(page, id) {
  window.location.href = `${page}.html?id=${id}`;
}
// navigazione tra pagine - accedo alla history di navigazione (torno indietro o vado avanti nelle pagine visitate)
function handleNavigation() {
  const goBackBTN = document.getElementById("goBack");
  const goForwardBTN = document.getElementById("goForward");
  goBackBTN.onclick = goBack;
  goForwardBTN.onclick = goForward;
}
function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}

function nascondiColonna() {
  let mainRightOpened = document.getElementById("mainRightOpened");
  let colCentral = document.querySelector(".col-8");
  mainRightOpened.style.display = "none";
  colCentral.classList.add("col-10");
}
document.addEventListener("DOMContentLoaded", function () {
  let rightColumn = document.getElementById("mainRightOpened");
  let centerColumn = document.querySelector(".col-8");
  let peopleIcon = document.getElementById("peopleIcon");

  function mostraColonnaDestra() {
    rightColumn.style.display = "block";
    centerColumn.classList.remove("col-10");
    centerColumn.classList.add("col-8");
  }
  peopleIcon.addEventListener("click", mostraColonnaDestra);
});

// buongiorno e buonasera!
function helloSpoty() {
  const textHello = document.getElementById("helloSpotify");
  let oraCorrente = new Date().getHours();
  oraCorrente < 17
    ? (textHello.innerText = "Buongiorno")
    : (textHello.innerText = "Buonasera");
}
