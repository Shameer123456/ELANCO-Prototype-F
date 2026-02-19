import { initMap } from "./map.js";
import { mockFarms } from "./data.js";

const map = initMap();

//elements for the side panel
const panel = document.getElementById("right-panel");
const closeBtn = document.getElementById("close-panel");
const titleEl = document.getElementById("panel-title");
const ownerEl = document.getElementById("panel-owner");
const riskEl = document.getElementById("panel-risk");

//helper functions for side panel
function openPanel(farm) {

  titleEl.textContent = farm.name;
  ownerEl.textContent = farm.owner;
  riskEl.textContent = farm.riskLevel.toUpperCase();
  
  //colour class for risk text
  riskEl.className = ""; 
  riskEl.classList.add(farm.riskLevel); 

  //shows panel
  panel.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
  panel.classList.add("hidden");
});

//show panel
const farmMarkers = [];

// loop through data.js and marks pins
mockFarms.forEach(farm => {
  
  // pick the pin colour based on the risk level
  let pinColor = "#0b5cab"; 
  if (farm.riskLevel === "low") pinColor = "#1f9d55";
  if (farm.riskLevel === "medium") pinColor = "#f0b429";
  if (farm.riskLevel === "high") pinColor = "#d64545";

  // draw a custom svg pin so we can use our colours
  const customIcon = L.divIcon({
    className: "custom-pin",
    html: `
      <svg width="28" height="42" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 24 12 24s12-15.75 12-24C24 5.373 18.627 0 12 0zm0 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z" fill="${pinColor}"/>
      </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42], 
  });

  const marker = L.marker(farm.location, { icon: customIcon }).addTo(map);

  //when clicked open panel and zoom in
  marker.on("click", () => {
    openPanel(farm);
    map.flyTo(farm.location, 14, { duration: 1.5 }); 
  });

  //save marker and its risk in array
  farmMarkers.push({
    marker: marker,
    riskLevel: farm.riskLevel
  });
});

//filter logic
const filterCheckboxes = document.querySelectorAll('#risk-filters input[type="checkbox"]');

function updateFilters() {
  const activeFilters = [];
  filterCheckboxes.forEach(box => {
    if (box.checked) {
      activeFilters.push(box.value);
    }
  });

  //loop all saved markers 
  farmMarkers.forEach(item => {
    if (activeFilters.includes(item.riskLevel)) {
      if (!map.hasLayer(item.marker)) {
        item.marker.addTo(map);
      }
    } else {
      if (map.hasLayer(item.marker)) {
        item.marker.remove();
      }
    }
  });
}

filterCheckboxes.forEach(box => {
  box.addEventListener("change", updateFilters);
});

//search logic
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  searchResults.innerHTML = "";

  if (query.length === 0) {
    searchResults.classList.add("hidden");
    return;
  }

  const matches = mockFarms.filter(farm => 
    farm.name.toLowerCase().includes(query) || 
    farm.id.toLowerCase().includes(query)
  );

  // populate the dropdown
  if (matches.length > 0) {
    searchResults.classList.remove("hidden"); 
    
    matches.forEach(farm => {
      const li = document.createElement("li");
      li.textContent = `${farm.name} (${farm.id})`;
      
      // handle user clicking a search result
      li.addEventListener("click", () => {
        searchInput.value = farm.name;
        searchResults.classList.add("hidden");
        
        openPanel(farm);
        map.flyTo(farm.location, 14, { duration: 1.5 });
      });
      
      searchResults.appendChild(li);
    });
  } else {
    searchResults.classList.add("hidden"); 
  }
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.add("hidden");
  }
});