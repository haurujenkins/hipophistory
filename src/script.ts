type HipHopEvent = {
    title: string;
    description: string;
};

type YearData = {
    year: number;
    events: HipHopEvent[];
};

let currentYear: number = 1980;
let maxYear: number = 2023;

async function loadYear(year: number) {
    try {
        const response = await fetch(`data/${year}.json`);
        if (!response.ok) throw new Error(`Failed to load data for year ${year}`);
        const data: YearData = await response.json();
        renderYear(data);
    } catch (err) {
        console.warn(`Error loading data for year ${year}:`, err);
    }
}

function renderYear(data: YearData) {
    const container = document.getElementById("timeline");
    if (!container) return;

    const section = document.createElement("div");
    section.className = "year-section";
    section.setAttribute("data-year", data.year.toString());

    const title = document.createElement("div");
    title.className = "year-title";
    title.textContent = data.year.toString();
    section.appendChild(title);

    data.events.forEach(event => {
        const eventEl = document.createElement("div");
        eventEl.className = "event";
        eventEl.innerHTML = `<h3 id="event-title">${event.title}</h3><p>: ${event.description}<p>`;
        section.appendChild(eventEl);
    });

    const sentinel = document.createElement("div");
    sentinel.className = "sentinel";
    section.appendChild(sentinel);

    container.appendChild(section);
    observer.observe(sentinel);

    setTimeout(() => section.classList.add("visible"), 50);
}

const observer = new IntersectionObserver((entries)=> {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const section = entry.target.parentElement;
            if (!section) return;
            const yearAttr = section.getAttribute("data-year");
            if (!yearAttr) return;
            const year = parseInt(yearAttr);
            const nextYear = year + 1;
            if (nextYear <= maxYear) {
                observer.unobserve(entry.target);
                loadYear(nextYear);
            }
        }
    });
}, {
    rootMargin: "0px 0px 300px 0px",
});

window.addEventListener("DOMContentLoaded", () => {
    loadYear(currentYear);
});