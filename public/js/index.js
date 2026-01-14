const socket = io();

/* ------------------ MAP Initializing ------------------ */
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "omni hospital"
}).addTo(map);

/* ------------------ GEOLOCATION ------------------ */
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => console.log(err),
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}

/* ------------------ MARKERS ------------------ */
const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected",(id,message)=>{
    if(markers[id]){
        map.removelayer(markers[id]);
        delete markers[id];
    }
    alert(message);

})
