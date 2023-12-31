import * as actionsBar from "./actionsBar.js";

let pageURL = window.location.search;
const productId = new URLSearchParams(pageURL).get("id");

const baseURL = "https://striveschool-api.herokuapp.com/api/deezer/";
const albumURL = `${baseURL}album/${productId}`;

let newArrayAlbums = localStorage.getItem("arrayAlbums");
newArrayAlbums = JSON.parse(newArrayAlbums);

document.addEventListener("DOMContentLoaded", function () {
  getDataAlbum();
  handleNavigation();
  printSideList(newArrayAlbums);
});

// entrando nella pagina album creo url con id album e faccio get con  newArraySongs.album.tracklist

function getDataAlbum() {
  return new Promise((resolve, reject) => {
    fetch(albumURL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data, "data almbum");
        // console.log(data.tracks.data[0], "data.tracks.data[0] return");
        actionsBar.printJumbo(data);
        actionsBar.printActionBarSideLeft(data.tracks.data[0]);
        populateSongsList(data);
        resolve(data.tracks.data); // Risolvi la promise con i dati desiderati
      })
      .catch((error) => {
        console.error("Errore durante la fetch:", error);
        reject(error); // Respinta della promise in caso di errore
      });
  });
}

// accedo alla history di navigazione (torno indietro o vado avanti nelle pagine visitate)
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

function printSideList(array) {
  const containerSideList = document.getElementById("containerSideList");
  containerSideList.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const newItem = document.createElement("li");
    newItem.classList.add("my-1");
    newItem.innerText = `${array[i].title}`;
    containerSideList.appendChild(newItem);
  }
}

function toBlur(img) {
  const imgBlur = document.querySelector("#imgBlurred");
  imgBlur.setAttribute("src", `${img}`);
}
// cambio pagina
function goOnPage(page, id) {
  window.location.href = `${page}.html?id=${id}`;
}
function populateSongsList(data) {
  let containerAlbumSongs = document.getElementById("containerAlbumSongs");
  containerAlbumSongs.innerHTML = "";
  // console.log(data.tracks.data[0], "io dovrei essere il primo brano album")
  for (let i = 0; i < data.tracks.data.length; i++) {
    let durationInMinutes = data.tracks.data[i].duration / 60;
    let durationTwoDecimals = durationInMinutes.toFixed(2);
    let durationFourNumbers =
      durationTwoDecimals.toString().length < 4
        ? durationTwoDecimals.toString().padEnd(4, "0")
        : durationTwoDecimals;
    let newSong = `
  <div class="col-1 d-flex justify-content-end fs-6">
    <p>${i + 1}</p>
  </div>
  <div class="col-5">
    <h6 class="text-white">
      ${data.tracks.data[i].title}
    </h6>
    <p class="artistLink fs-11px" data-id=${data.artist.id}>
      ${data.tracks.data[i].artist.name}
    </p>
  </div>
  <div class="col-3 d-flex justify-content-end">
    <p>${data.tracks.data[i].rank}</p>
  </div>
  <div class="col-3 d-flex justify-content-end pe-5">
    <p>${durationFourNumbers}</p>
  </div>
  `;
    containerAlbumSongs.innerHTML += newSong;
  }
  const artistLink = document.querySelectorAll(".artistLink");
  artistLink.forEach((el) => {
    const dataId = el.getAttribute("data-id");
    el.onclick = () => {
      goOnPage("artist", dataId);
    };
  });
}
export { getDataAlbum };
