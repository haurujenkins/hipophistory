type TimelineEvent = {
  title: string;
  description: string;
  image?: string;
};

type YearData = {
  year: number;
  events: TimelineEvent[];
};

let currentYear = 1979;
const maxYear = 1985;
const loadedYears = new Set<number>();
let observer: IntersectionObserver;


async function loadYear(year: number) {
    if (loadedYears.has(year)) return;
    loadedYears.add(year);
    try {
        const res = await fetch(`data/${year}.json`);
        const data: YearData = await res.json();
        renderYear(data);
    } catch (e) {
        console.warn(`Erreur en chargeant ${year} :`, e);
    }
    currentYear = year;
}

function renderYear(data: YearData) {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const section = document.createElement("section");
  section.className = "year-block";
  section.setAttribute("data-year", data.year.toString());

  // Ajout de la classe reverse une fois sur deux (ex: années paires)
  if (data.year % 2 === 1) {
    section.classList.add("reverse");
  }

  /*** Partie gauche : année + ligne + bouton ***/
  const chrono = document.createElement("div");
  chrono.className = "year-chronology";

  const yearTitle = document.createElement("div");
  yearTitle.className = "year-title";
  yearTitle.textContent = data.year.toString();

  const lineButton = document.createElement("div");
  lineButton.className = "line-button";

  const lineTop = document.createElement("div");
  lineTop.className = "line top";

  const plusBtn = document.createElement("button");
  plusBtn.className = "plus-button";
  plusBtn.textContent = "+";

  const lineBottom = document.createElement("div");
  lineBottom.className = "line bottom";

  lineButton.appendChild(lineTop);
  lineButton.appendChild(plusBtn);
  lineButton.appendChild(lineBottom);

  chrono.appendChild(yearTitle);
  chrono.appendChild(lineButton);

  /*** Partie droite : événement principal + extra ***/
  const eventContainer = document.createElement("div");
  eventContainer.className = "event";

  const firstEvent = data.events[0];

  if (firstEvent.image) {
    const img = document.createElement("img");
    img.src = firstEvent.image;
    img.alt = firstEvent.title;
    img.className = "event-image";
    eventContainer.appendChild(img);
  }

  const eventEl = document.createElement("div");
  eventEl.className = "event-el";

  const title = document.createElement("h2");
  title.className = "title";
  title.textContent = firstEvent.title;

  const desc = document.createElement("p");
  desc.className = "description";
  desc.textContent = firstEvent.description;

  eventEl.appendChild(title);
  eventEl.appendChild(desc);
  eventContainer.appendChild(eventEl);

  // Créer le conteneur des événements supplémentaires (masqué au départ)
  const extraContainer = document.createElement("div");
  extraContainer.className = "extra-events";
  extraContainer.style.display = "none";

  data.events.slice(1).forEach(event => {
    const extra = document.createElement("div");
    extra.className = "event";

    if (event.image) {
      const img = document.createElement("img");
      img.src = event.image;
      img.alt = event.title;
      img.className = "event-image";
      extra.appendChild(img);
    }

    const eventEl = document.createElement("div");
    eventEl.className = "event-el";

    const title = document.createElement("h2");
    title.className = "title";
    title.textContent = event.title;

    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = event.description;

    eventEl.appendChild(title);
    eventEl.appendChild(desc);
    extra.appendChild(eventEl);

    extraContainer.appendChild(extra);
  });

  // Interaction bouton "+" supprimée

  // Composer et afficher
  section.appendChild(chrono);
  section.appendChild(eventContainer);
  section.appendChild(extraContainer);
  timeline.appendChild(section);

  // Animation d'apparition fluide uniquement pour le premier event
  setTimeout(() => {
    eventContainer.classList.add("visible");
  }, 50);

  // Ajouter un nouveau sentinel après ce bloc
  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  sentinel.setAttribute("data-year", `${data.year}`);
  timeline.appendChild(sentinel);
  observer.observe(sentinel);

}

// Chargement progressif
function setupScrollLoading() {
    observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lastLoaded = parseInt(entry.target.getAttribute("data-year") || `${currentYear}`);
        const nextYear = lastLoaded + 1;
        if (nextYear <= maxYear) {
          loadYear(nextYear);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px 300px 0px" });

  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  sentinel.setAttribute("data-year", `${currentYear}`);
  document.getElementById("timeline")?.appendChild(sentinel);
  observer.observe(sentinel);

  loadYear(currentYear);
}

// Lancement initial
window.addEventListener("DOMContentLoaded", () => {
  setupScrollLoading();
});



