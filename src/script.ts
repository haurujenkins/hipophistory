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
  section.style.opacity = "0";
  section.style.transform = "translateY(40px)";
  section.style.transition = "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)";

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

  // Lignes et boutons haut/bas sur une seule ligne verticale
  const lineButton = document.createElement("div");
  lineButton.className = "line-button";

  // Ligne verticale
  const line = document.createElement("div");
  line.className = "line unique";

  // Bouton haut
  const arrowUpBtn = document.createElement("button");
  arrowUpBtn.className = "arrow-button arrow-up";
  arrowUpBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 6L11 16M11 6L7 10M11 6L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrowUpBtn.title = "Aller à l'année précédente";
  arrowUpBtn.addEventListener("click", () => {
    arrowUpBtn.disabled = true;
    arrowUpBtn.classList.add("clicked");
    const prevYear = data.year - 1;
    if (prevYear >= 1979) {
      const prevSection = document.querySelector(`section.year-block[data-year='${prevYear}']`);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          arrowUpBtn.disabled = false;
          arrowUpBtn.classList.remove("clicked");
        }, 700);
      } else {
        loadYear(prevYear);
        setTimeout(() => {
          const prevSectionLoaded = document.querySelector(`section.year-block[data-year='${prevYear}']`);
          if (prevSectionLoaded) {
            prevSectionLoaded.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          arrowUpBtn.disabled = false;
          arrowUpBtn.classList.remove("clicked");
        }, 900);
      }
    } else {
      setTimeout(() => {
        arrowUpBtn.disabled = false;
        arrowUpBtn.classList.remove("clicked");
      }, 500);
    }
  });

  // Bouton bas
  const arrowDownBtn = document.createElement("button");
  arrowDownBtn.className = "arrow-button arrow-down";
  arrowDownBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 16L11 6M11 16L7 12M11 16L15 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrowDownBtn.title = "Aller à l'année suivante";
  arrowDownBtn.addEventListener("click", () => {
    arrowDownBtn.disabled = true;
    arrowDownBtn.classList.add("clicked");
    const nextYear = data.year + 1;
    if (nextYear <= maxYear) {
      const nextSection = document.querySelector(`section.year-block[data-year='${nextYear}']`);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          arrowDownBtn.disabled = false;
          arrowDownBtn.classList.remove("clicked");
        }, 700);
      } else {
        loadYear(nextYear);
        setTimeout(() => {
          const nextSectionLoaded = document.querySelector(`section.year-block[data-year='${nextYear}']`);
          if (nextSectionLoaded) {
            nextSectionLoaded.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          arrowDownBtn.disabled = false;
          arrowDownBtn.classList.remove("clicked");
        }, 900);
      }
    } else {
      setTimeout(() => {
        arrowDownBtn.disabled = false;
        arrowDownBtn.classList.remove("clicked");
      }, 500);
    }
  });

  // Placement : bouton bas, ligne, bouton haut
  lineButton.appendChild(arrowDownBtn);
  lineButton.appendChild(line);
  lineButton.appendChild(arrowUpBtn);

  chrono.appendChild(yearTitle);
  chrono.appendChild(lineButton);

  /*** Partie droite : événement principal + extra ***/
  const eventContainer = document.createElement("div");
  eventContainer.className = "event";
  eventContainer.style.opacity = "0";
  eventContainer.style.transform = "translateY(40px)";
  eventContainer.style.transition = "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)";

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
        // Afficher la section correspondante
        const section = document.querySelector(`section.year-block[data-year='${lastLoaded}']`) as HTMLElement;
        if (section) {
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
          // Afficher aussi le premier event
          const event = section.querySelector('.event') as HTMLElement;
          if (event) {
            event.style.opacity = "1";
            event.style.transform = "translateY(0)";
          }
        }
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
  // Animation du header
  const header = document.getElementById("site-header");
  if (header) {
    setTimeout(() => header.classList.add("visible"), 100);
  }
  setupScrollLoading();
});



