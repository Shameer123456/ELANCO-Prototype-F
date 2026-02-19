import { initMap } from "./map.js";
initMap();
import { initChatbot } from "./ui/chatbot.js";
// import { initMap } from "./map/initMap.js";  // your existing map init

// Example handlers – you wire these into your actual map + marker layer
function handleChatAction(action) {
  if (action.type === "filterRisk") {
    // TODO: call your marker filter function
    // e.g., setRiskFilter(action.value)
    console.log("Filter risk:", action.value);
  }
  if (action.type === "resetView") {
    // TODO: map.setView([54.5, -3.2], 6);
    console.log("Reset view");
  }
  if (action.type === "zoomTo") {
    // TODO: map.setView([action.value.lat, action.value.lng], action.value.zoom);
    console.log("Zoom to:", action.value);
  }
}

initChatbot({ onAction: handleChatAction });

// initMap();  // your existing call
