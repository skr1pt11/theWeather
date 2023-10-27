let link =
  "http://api.weatherapi.com/v1/current.json?key=78639203c6474634883125836230510";

const root = document.querySelector("#root"),
  popup = document.querySelector("#popup"),
  textInput = document.querySelector("#text-input"),
  form = document.querySelector("#form"),
  closeBtn = document.querySelector(".popup-close");

let store = {
  city: "Los Angeles",
};

let fetchData = async () => {
  try {
    let result = await fetch(`${link}&q=${store.city}`);
    let data = await result.json();

    //Удобная деструктуризация

    const {
      current: {
        temp_c: tempereture,
        cloud: cloudcover,
        humidity,
        pressure_mb: pressure,
        uv: uvIndex,
        vis_km: visability,
        is_day: isDay,
        wind_kph: winSpeed,
        condition: { text: textOfWeather },
      },
      location: { localtime: observationTime },
    } = data;

    store = {
      ...store,
      isDay,
      tempereture,
      textOfWeather,
      observationTime,
      properties: {
        cloudcover: {
          title: "cloudcover",
          value: `${cloudcover}%`,
          icon: `cloud.png`,
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: `humidity.png`,
        },
        pressure: {
          title: "pressure",
          value: `${pressure}km/h`,
          icon: `gauge.png`,
        },
        uvIndex: {
          title: "uvIndex",
          value: `${uvIndex}%`,
          icon: `uv-index.png`,
        },
        winSpeed: {
          title: "winSpeed",
          value: `${winSpeed} / 100`,
          icon: `wind.png`,
        },
        visability: {
          title: "visability",
          value: `${visability} %`,
          icon: `visibility.png`,
        },
      },
    };
    renderComponent();
  } catch (err) {
    if (err.name === "TypeError") {
      alert("Ошибка, проверьте ссылку");
    }
  }
};

let getImage = (textOfWeather) => {
  const value = textOfWeather.toLowerCase();
  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "clear":
      return "clear.png";
    case "cloud":
      return "cloud.png";
    case "fog":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    default:
      return "the.png";
  }
};

let renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
   <div class="property-icon">
     <img src="./img/icons/${icon}" alt="">
   </div>
   <div class="property-info">
     <div class="property-info__value">${value}</div>
     <div class="property-info__description">${title}</div>
   </div>
 </div>`;
    })
    .join("");
};

let markup = () => {
  let { city, observationTime, tempereture, textOfWeather, isDay, properties } =
    store;
  let containerClass = isDay == 1 ? `is-day` : "";
  return `<div class="container ${containerClass}">
   <div class="top">
     <div class="city">
       <div class="city-subtitle">Weather Today in</div>
         <div class="city-title" id="city">
         <span>${city}</span>
       </div>
     </div>
     <div class="city-info">
       <div class="top-left">
       <img class="icon" src="./img/${getImage(textOfWeather)}" alt="" />
      <div class="description">${textOfWeather}</div>
     </div>
   
     <div class="top-right">
       <div class="city-info__subtitle">${observationTime}</div>
       <div class="city-info__title">${tempereture}°</div>
     </div>
   </div>
 </div>
<div id="properties">${renderProperty(properties)}</div>
</div>`;
};

let renderComponent = () => {
  root.innerHTML = markup();

  const cityTarget = document.querySelector("#city");

  cityTarget.onclick = () => {
    popup.classList.toggle("active");
  };
};

closeBtn.onclick = () => {
  popup.classList.toggle("active");
  document.querySelector("#text-input").value = "";
};

form.onsubmit = (event) => {
  event.preventDefault();
  if (!store.city) return;
  fetchData();
  popup.classList.toggle("active");
  document.querySelector("#text-input").value = "";
};

textInput.oninput = (event) => {
  store = {
    ...store,
    city: event.target.value,
  };
};

fetchData();
