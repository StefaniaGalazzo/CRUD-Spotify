import * as actionsBar from "./actionsBar.js";

let arrayAlbums = [];
let arraySongs = [];

document.addEventListener("DOMContentLoaded", function () {
  helloSpoty();
  Promise.all([getData("alt-j"), getData("queen"), getData("dua-lipa")]).then(
    () => {
      handleNavigation();
    }
  );
});

//recupero i dati dall API e li uso per riempire gli array
function getData(query) {
  fetch(`${actionsBar.myUrl}[${query}]`, {
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
  actionsBar.printJumbo();
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

document.addEventListener("DOMContentLoaded", function () {
  const mainRightOpened = document.getElementById("mainRightOpened");
  const closeBtn = document.querySelector(".closeBtn");
  const peopleIcon = document.getElementById("peopleIcon");
  closeBtn.onclick = nascondiColonna;
  peopleIcon.onclick = mostraColonnaDestra;

  function nascondiColonna() {
    mainRightOpened.style.right = "-60%";
    setTimeout(() => {
      mainRightOpened.style.display = "none";
    }, 300);
  }
  function mostraColonnaDestra() {
    mainRightOpened.style.display = "block";
    mainRightOpened.style.right = "0";
  }
});

// buongiorno e buonasera!
function helloSpoty() {
  const textHello = document.getElementById("helloSpotify");
  let oraCorrente = new Date().getHours();
  oraCorrente < 17
    ? (textHello.innerText = "Buongiorno")
    : (textHello.innerText = "Buonasera");
}
