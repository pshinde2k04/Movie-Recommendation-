const API_KEY = "98ce38d0";
const resultDiv = document.getElementById("movieResult");
let history = JSON.parse(localStorage.getItem("history")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* --------------------- UI Helper --------------------- */
function activateButton(btn) {
  document.querySelectorAll('.nav-buttons button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function fadeInResult() {
  resultDiv.style.opacity = 0;
  resultDiv.style.animation = "";
  setTimeout(() => {
    resultDiv.style.animation = "fadeIn 0.6s ease forwards";
  }, 100);
}

/* --------------------- Search Movie --------------------- */
function searchMovie() {
  const movieName = document.getElementById("movieInput").value.trim();
  if (!movieName) return alert("Please enter a movie name!");

  fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        showMovie(data);
        history.push(data);
        localStorage.setItem("history", JSON.stringify(history));
      } else {
        resultDiv.innerHTML = "<h3>❌ Movie not found!</h3>";
      }
    })
    .catch(() => {
      resultDiv.innerHTML = "<h3>⚠️ Error fetching data!</h3>";
    });
}

/* --------------------- Show Movie --------------------- */
function showMovie(data) {
  fadeInResult();
  resultDiv.innerHTML = `
    <div class="movie-card">
      <img src="${data.Poster}" alt="${data.Title}">
      <h2>${data.Title}</h2>
      <h4>${data.Year}</h4>
      <p>${data.Plot}</p>
      <button onclick="addToFavorites('${data.Title}','${data.Poster}')">❤ Add to Favorites</button>
    </div>
  `;
}

/* --------------------- Favorites --------------------- */
function addToFavorites(title, poster) {
  favorites.push({ title, poster });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(`${title} added to favorites!`);
}

function showFavorites() {
  fadeInResult();
  resultDiv.innerHTML = "<h2>❤ Your Favorites</h2>";

  if (favorites.length === 0) {
    resultDiv.innerHTML += "<p>No favorites yet!</p>";
    return;
  }

  resultDiv.innerHTML += favorites.map((m, i) => `
    <div class="movie-card">
      <button class="remove-btn" onclick="removeFavorite(${i})">✖</button>
      <img src="${m.poster}" alt="${m.title}">
      <h3>${m.title}</h3>
    </div>
  `).join('');
}

function removeFavorite(i) {
  favorites.splice(i, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavorites();
}

/* --------------------- History --------------------- */
function showHistory() {
  fadeInResult();
  resultDiv.innerHTML = "<h2>📜 Watch History</h2>";

  if (history.length === 0) {
    resultDiv.innerHTML += "<p>No history found!</p>";
    return;
  }

  resultDiv.innerHTML += history.map((m, i) => `
    <div class="movie-card">
      <button class="remove-btn" onclick="removeHistory(${i})">✖</button>
      <h3>${m.Title}</h3>
    </div>
  `).join('');
}

function removeHistory(i) {
  history.splice(i, 1);
  localStorage.setItem("history", JSON.stringify(history));
  showHistory();
}

/* --------------------- Trending --------------------- */
function showTrending() {
  fadeInResult();
  const trending = ["Inception", "Joker", "Avengers", "Titanic", "Interstellar"];
  resultDiv.innerHTML = "<h2>🔥 Trending Movies</h2>";

  trending.forEach(name => {
    fetch(`https://www.omdbapi.com/?t=${name}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          resultDiv.innerHTML += `
            <div class="movie-card">
              <img src="${data.Poster}" alt="${data.Title}">
              <h3>${data.Title}</h3>
              <p>${data.Plot}</p>
            </div>
          `;
        }
      });
  });
}

/* --------------------- Surprise Movie --------------------- */
function surpriseMovie() {
  fadeInResult();
  const surpriseList = ["Gladiator", "Avatar", "The Matrix", "Forrest Gump", "The Dark Knight"];
  const random = surpriseList[Math.floor(Math.random() * surpriseList.length)];

  fetch(`https://www.omdbapi.com/?t=${random}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => showMovie(data));
}

/* --------------------- Theme Toggle --------------------- */
let isDark = true;

function toggleTheme() {
  if (isDark) {
    document.body.style.background = "linear-gradient(135deg, #ffffff, #dceeff)";
    document.body.style.color = "#111";
  } else {
    document.body.style.background = "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)";
    document.body.style.color = "#fff";
  }
  isDark = !isDark;
}
