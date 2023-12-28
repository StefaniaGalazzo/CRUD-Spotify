let pageURL = window.location.search;
const productId = new URLSearchParams(pageURL).get("id");
myUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/" + productId;

let newArrayAlbums = localStorage.getItem("arrayAlbums");
newArrayAlbums = JSON.parse(newArrayAlbums);

window.onload = () => {
  getDataAlbum();
  handleNavigation();
  printSideList(newArrayAlbums);
  populateSongsList();
};

function getDataAlbum() {
  fetch(myUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "io sono l'array album");
      populateHero(data);
      populateSongsList(data);
      populateArtistLikes(data);
    })
    .catch((error) => console.error("Errore durante la fetch:", error));
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

function populateHero(data) {
  let containerHero = document.getElementById("hero-artist");
  containerHero.innerHTML = "";
  let newArtist = `
  <img
  src="${data.picture_big}"
  alt="img-artist"
  width="100%"
  />
<div class="text-hero">
  <div class="bi bi-patch-check text-white"> Verified Artist</div>
  <h1 class="text-white">${data.name}</h1>
  <div class="fw-bold mt-3 text-white">
    <span class="numeriascoltatori">${data.nb_fan}</span> ascoltatori
    mensili
  </div>
</div>`;
  containerHero.innerHTML = newArtist;
}

// va fatta un'altra chiamata per popolare le songs

function populateSongsList(data) {
  let urlSongs = data.tracklist;
  fetch(urlSongs, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "io sono l'array album");
      generateSongsList(data);
      printActionBar(data.data[0]);
    })
    .catch((error) => console.error("Errore durante la fetch:", error));
}

function printActionBar(data) {
  // print actionbar side left
  console.log(data, "prtinactionbarrr");
  const imgsCover = document.querySelectorAll(".imgsCover");
  imgsCover.forEach((el) => {
    el.setAttribute("src", data.album.cover_small);
  });
  const songTitleActionBar = document.getElementById("songTitleActionBar");
  const artistTitleActionBar = document.getElementById("artistTitleActionBar");
  songTitleActionBar.setAttribute("title", `${data.title}`);
  songTitleActionBar.innerText = data.title;
  artistTitleActionBar.innerText = data.artist.name;
}

function generateSongsList(data) {
  let containerArtistSongs = document.getElementById("containerArtistSongs");
  containerArtistSongs.innerHTML = "";
  for (let i = 0; i < data.data.length; i++) {
    let durationInMinutes = data.data[i].duration / 60;
    let durationTwoDecimals = durationInMinutes.toFixed(2);
    let durationFourNumbers =
      durationTwoDecimals.toString().length < 4
        ? durationTwoDecimals.toString().padEnd(4, "0")
        : durationTwoDecimals;
    let newSong = `
  <li class="list-group-item d-flex mb-3 align-items-center">
  <div
    class="overflow-hidden rounded ms-4 me-5"
    style="max-width: 80px; max-height: 80px"
  >
    <img
      src="${data.data[i].album.cover_small}"
      class="rounded"
      alt="img-album"
      width="auto"
      height="80px"
    />
  </div>
  <p class="mb-0 me-5 col-5">${data.data[i].title}</p>
  <p class="mb-0">${data.data[i].rank}</p>
  <p class="mb-0 ms-auto">${durationFourNumbers}</p>
</li>
`;
    containerArtistSongs.innerHTML += newSong;
  }
}

function populateArtistLikes(data) {
  let artistLikes = document.getElementById("artistLikes");
  artistLikes.innerText = `Di ${data.name}`;
}

function nascondiColonna() {
  const mainRightOpened = document.getElementById("mainRightOpened");
  mainRightOpened.style.display = "none";

  const colCentral = document.querySelector(".col-8");
  colCentral.classList.add("col-10");
}
document.addEventListener("DOMContentLoaded", function () {
  let rightColumn = document.getElementById("mainRightOpened");
  let centerColumn = document.querySelector(".col-8");

  let peopleIcon = document.getElementById("peopleIcon");

  function mostraColonnaDestra() {
    // Mostra la colonna destra
    rightColumn.style.display = "block";

    // Ripristina le dimensioni della colonna centrale
    centerColumn.classList.remove("col-10");
    centerColumn.classList.add("col-8");
  }

  // Aggiungi un gestore di eventi per il click sull'icona delle persone
  peopleIcon.addEventListener("click", mostraColonnaDestra);
});
