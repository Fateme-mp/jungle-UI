const forest = document.getElementById("forest");
const rocks = document.getElementById("rocks");
const water = document.getElementById("water");
const birdRight = document.getElementById("bird-right");
const birdLeft = document.getElementById("bird-left");
const text = document.getElementById("text");
const btn = document.getElementById("btn");
const owl = document.querySelector(".owl");
const lion = document.querySelector(".lion");
const rain = document.querySelector(".rain");
const sharkBig = document.querySelector(".shark-big");
const fishes = document.querySelectorAll(".fish");
const section = document.querySelector(".sec");
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const stars = document.querySelector("#stars");
const clouds = document.querySelectorAll(".cloud");
const fishContainer = document.querySelector(".fish-container");
const sharkContainer = document.querySelector(".shark-container");
const rainContainer = document.querySelector(".rain-container");
const hook = document.querySelector(".hook");
const hookImage = document.querySelector(".hook-image");
const body = document.querySelector("body");
let lastScrollTime = Date.now();

const sectionTop = section.offsetTop;
const sectionHeight = section.offsetHeight;
const windowHeight = window.innerHeight;
const middlePoint = (sectionTop + sectionHeight) / 2;
let fishCreated = false;
let fishRight;
let fishLeft;

const triggerPoint = document.body.scrollHeight * 0.8;
let sharkCreated = false;

const audioJungle = new Audio("assets/audio/natural-water-and-birds.mp3");
const audioRain = new Audio("assets/audio/rain-in-jungle.mp3");
const audioSplash = new Audio("assets/audio/water-splash.mp3");
const audioUnderwater = new Audio("assets/audio/under-water-sounds.mp3");
const audioExitWater = new Audio("assets/audio/short-splash.mp3");

const now = new Date();
// const hour = now.getHours();
const hour = 9;
const minutes = now.getMinutes();

const apiKey = "2bc9ea7383d2c1930dc8c6773b773f22";
const city = "Sari";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=fa&units=metric`;

document.addEventListener("DOMContentLoaded", () => {
  let weatherMain = "overcast";

  // استعلام وضعیت هوا
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("وضعیت هوا", data);
      weatherMain = data.weather[0].main.toLowerCase();
      applyWeatherUI(weatherMain);
      setupAudioPlayer(weatherMain);
    })

    .catch((error) => {
      console.log("خطا در دریافت اطلاعات هوا:", error);
      applyWeatherUI(weatherMain);
      setupAudioPlayer(weatherMain);
    });

  moveSunAndMoon();
  // flyBirds();
});

function applyWeatherUI(weatherMain) {
  let isDay;
  if (hour >= 6 && hour < 18) {
    isDay = true;
  } else {
    isDay = false;
  }
  sun.style.display = "none";
  moon.style.display = "none";
  stars.style.display = "none";

  clouds.forEach((cloud) => {
    cloud.style.display = "none";
    cloud.classList.remove("gray-cloud");
  });

  if (weatherMain.includes("clear") && isDay) {
    sun.style.display = "block";
  } else if (weatherMain.includes("clear") && !isDay) {
    moon.style.display = "block";
    stars.style.display = "block";
    body.style.background = "#212d65";
  } else if (weatherMain.includes("clouds") && isDay) {
    sun.style.display = "block";
    clouds.forEach((cloud) => (cloud.style.display = "block"));
    moveCloudWithSpeed();
  } else if (weatherMain.includes("clouds") && !isDay) {
    moon.style.display = "block";
    stars.style.display = "block";
    body.style.background = "#212d65";
    clouds.forEach((cloud) => {
      cloud.style.display = "block";
      cloud.classList.add("night-cloud");
    });
    moveCloudWithSpeed();
  } else if (weatherMain.includes("overcast") && isDay) {
    clouds.forEach((cloud) => {
      cloud.style.display = "block";
      cloud.classList.add("gray-cloud");
    });
    body.style.background =
      "linear-gradient(to bottom, #8daec4, #a3bed0, #c1d3dd)";
    moveCloudWithSpeed();
  } else if (weatherMain.includes("overcast") && !isDay) {
    clouds.forEach((cloud) => {
      cloud.style.display = "block";
      cloud.classList.add("night-cloud");
    });
    body.style.background =
      "linear-gradient(to bottom, #212d65, #1b2447, #212d65)";
    moveCloudWithSpeed();
  } else if (weatherMain.includes("rain") && isDay) {
    body.style.background =
      "linear-gradient(to bottom, #8daec4, #a3bed0, #c1d3dd)";
    birdRight.style.display = "none";
    birdLeft.style.display = "none";
    setInterval(createDrops, 30);
  } else if (weatherMain.includes("rain") && !isDay) {
    body.style.background =
      "linear-gradient(to bottom, #212d65, #1b2447, #212d65)";
    birdRight.style.display = "none";
    birdLeft.style.display = "none";
    setInterval(createDrops, 30);
  } else {
    if (isDay) {
      sun.style.display = "block";
    } else {
      moon.style.display = "block";
      stars.style.display = "block";
      body.style.background = "#212d65";
    }

    clouds.forEach((cloud) => (cloud.style.display = "block"));
    moveCloudWithSpeed();
  }
}

// تنظیم حرکت خورشید در طول روز و حرکت ماه در طول شب
function moveSunAndMoon() {
  if (hour >= 6 && hour <= 18) {
    lion.style.display = "block";
    owl.style.display = "none";

    //تعداد دقایق گذشته از 6 صبح تا الان(کل بازه 12 ساعت = 720 دقیقه)
    const totalMinutes = (hour - 6) * 60 + minutes;
    const progress = Math.min(totalMinutes / 720, 1);

    // محاسبه مکان خورشید
    const top = 140 - Math.sin(progress * Math.PI) * 140;
    const left = 100 - progress * 100; // از راست (100%) به چپ (0%)

    sun.style.top = `${top}px`;
    sun.style.left = `${left}%`;
    sun.style.transform = `translateX(-50%)`;
  } else {
    lion.style.display = "none";
    owl.style.display = "block";
    rocks.style.zIndex = "-1";

    let totalMinutes;
    if (hour >= 18 && hour <= 23) {
      totalMinutes = (hour - 18) * 60 + minutes;
    } else {
      totalMinutes = (hour + 6) * 60 + minutes;
    }

    const progress = Math.min(totalMinutes / 720, 1);
    const top = 140 - Math.sin(progress * Math.PI) * 140;
    const left = progress * 100;

    moon.style.top = `${top}px`;
    moon.style.left = `${left}%`;
    moon.style.transform = "translateX(-50%)";
  }
}

// پخش صدای طبیعت
audioJungle.loop = true;
audioRain.loop = true;
audioExitWater.loop = false;
audioUnderwater.loop = true;

let isPlaying = false;
let splashPlayed = false;
let currentAudio = audioJungle;

function setupAudioPlayer(weatherMain) {
  const audioPlay = document.getElementById("audio-play");

  currentAudio = weatherMain.includes("rain") ? audioRain : audioJungle;

  currentAudio.volume = 0.5;

  audioPlay.addEventListener("click", () => {
    if (!isPlaying) {
      currentAudio.play();
      isPlaying = true;
    } else {
      currentAudio.pause();
      isPlaying = false;
    }
  });
}

//حرکت عناصر بر اساس اسکرول
window.addEventListener("scroll", function () {
  let value = window.scrollY;

  forest.style.top = value + "px";
  rocks.style.top = value + "px";
  water.style.top = value + "px";
  sun.style.marginTop = value + "px";
  moon.style.marginTop = value + "px";
  lion.style.marginTop = value + "px";
  // birdRight.style.marginTop = value + "px";

  birdRight.style.transform = `translate(${value * 1.2}px, ${
    value * -0.5
  }px) rotate(${value * 0.1}deg)`;
  birdLeft.style.transform = `translate(${value * -1}px, ${value * 0.5}px)`;

  fishes.forEach((fish) => {
    fish.style.marginTop = value + "px";
  });

  clouds.forEach((cloud) => {
    cloud.style.marginTop = value + "px";
  });

  if (scrollY > 80) {
    text.classList.add("show");
    btn.classList.add("show");
  } else {
    text.classList.remove("show");
    btn.classList.remove("show");
  }

  //کنترل صدای طبیعت بر اساس اسکرول
  const splashPoint = section.getBoundingClientRect().top;
  const volume = Math.min(1, Math.max(0, 0.5 - scrollY / splashPoint));
  currentAudio.volume = volume;

  if (scrollY >= splashPoint && !splashPlayed) {
    currentAudio.pause();
    isPlaying = false;

    audioSplash.currentTime = 0;
    audioSplash.volume = 0.6;
    audioSplash.play();
    splashPlayed = true;

    audioSplash.addEventListener(
      "ended",
      function () {
        audioUnderwater.currentTime = 0;
        audioUnderwater.volume = 0.4;
        audioUnderwater.play();

        currentAudio = audioUnderwater;
        isPlaying = true;
      },
      { once: true }
    );
  }

  if (scrollY < splashPoint && splashPlayed) {
    splashPlayed = false;
    audioUnderwater.pause();
    isPlaying = false;

    audioExitWater.currentTime = 0;
    audioExitWater.volume = 0.6;
    audioExitWater.play();

    audioExitWater.addEventListener(
      "ended",
      () => {
        audioJungle.currentTime = 0;
        audioJungle.volume = 0.5;
        audioJungle.play();

        currentAudio = audioJungle;
        isPlaying = true;
      },
      { once: true }
    );
  }

  //کنترل بارش باران
  if (value >= sectionTop) {
    rainContainer.style.display = "none";
  } else {
    rainContainer.style.display = "block";
  }

  // حرکت ماهی ها زمانی که اسکرول به 50 درصد متن رسید
  if (value + windowHeight >= middlePoint && !fishCreated) {
    createFishes();
  }
  if (fishCreated) {
    const position = value + windowHeight - middlePoint;

    fishRight.style.right = position * 1.2 + "px";
    fishLeft.style.left = position * 1.2 + "px";

    if (position * 1.2 > window.innerWidth + 150) {
      fishRight.remove();
      fishLeft.remove();

      fishCreated = false;
    }
  }

  //زمانی که اسکرول به 80 درصد صفحه رسید
  if (value + innerHeight >= triggerPoint && !sharkCreated) {
    sharkCreated = true;
    createShark();
  }

  //زمانی که اسکرول 10 ثانیه متوقف می ماند
  // clearTimeout(scrollTimeout);

  // moveHookTo(0, 8);

  // scrollTimeout = setTimeout(() => {
  //   moveHookTo(maxHeight, 1);
  // }, 10000);
  lastScrollTime = Date.now();
  moveHookTo(0, 8);
});

//حرکت ابرها در آسمان
function moveCloud(cloud, speed) {
  let left = parseInt(window.getComputedStyle(cloud).left) || 0;

  setInterval(() => {
    left += speed;

    if (left > window.innerWidth + 200) {
      left = -200;
    }

    cloud.style.left = left + "px";
  }, 50);
}

function moveCloudWithSpeed() {
  clouds.forEach((cloud) => moveCloud(cloud, 1));
}

// حرکت ماهی های رودخانه
function moveFishLeftToRight(fishId, speed) {
  const fish = document.getElementById(fishId);
  let position = parseInt(window.getComputedStyle(fish).left);

  setInterval(() => {
    position += speed;

    if (position > window.innerWidth + 80) {
      position = -80;
    }

    fish.style.left = position + "px";
  }, 20);
}

// اجرای حرکت برای هر ماهی از چپ‌ به راست
moveFishLeftToRight("fish1", 0.8);
moveFishLeftToRight("fish5", 1.1);
moveFishLeftToRight("fish6", 0.9);
moveFishLeftToRight("fish7", 1.2);

//ایجاد ماهی های وسط متن
function createFishes() {
  fishRight = document.createElement("img");
  fishLeft = document.createElement("img");

  fishRight.src = "assets/images/fish-right.png";
  fishLeft.src = "assets/images/fish-left.png";
  fishRight.alt = "fish";
  fishLeft.alt = "fish";
  fishRight.classList.add("fish-right");
  fishLeft.classList.add("fish-left");

  fishContainer.appendChild(fishRight);
  fishContainer.appendChild(fishLeft);

  fishCreated = true;
}

//تابع ایجاد کوسه در 80 درصد اسکرول صفحه
function createShark() {
  const sharkSmall = document.createElement("img");
  sharkSmall.src = "assets/images/shark-small.png";
  sharkSmall.alt = "shark";
  sharkSmall.classList.add("shark-small");

  sharkContainer.appendChild(sharkSmall);

  const midPoint = window.innerWidth / 2 - 100;
  let sharkPosition = -160;
  let goingRight = true;
  let speed = 2;

  let moveShark = setInterval(() => {
    if (goingRight) {
      sharkPosition += speed;
    } else {
      sharkPosition -= speed * 3;
    }

    sharkSmall.style.right = sharkPosition + "px";

    if (goingRight && sharkPosition >= midPoint) {
      goingRight = false;
      sharkSmall.style.transform = "scaleX(-1)";
      sharkBigMove(); //آغاز حرکت کوسه بزرگ
    }

    if (!goingRight && sharkPosition <= -200) {
      clearInterval(moveShark);
      sharkSmall.remove();
      sharkCreated = false;
    }
  }, 20);
}

//حرکت کوسه ی بزرگ انتهای صفحه
function sharkBigMove() {
  let sharkPosition = -140;
  speed = 2;

  let moveBigShark = setInterval(() => {
    sharkPosition += speed;

    sharkBig.style.left = sharkPosition + "px";
    if (sharkPosition >= window.innerWidth) {
      clearInterval(moveBigShark);
    }
  }, 20);
}

//پخش صدای شیر با کلیک روی تصویر
lion.addEventListener("click", () => {
  lion.src = "assets/images/lion-roar.png";
  lion.classList.add("fade-out");
  const audio = new Audio("assets/audio/lion-roaring.mp3");
  audio.volume = 0.7;
  audio.play();

  audio.addEventListener("ended", () => {
    lion.src = "assets/images/lion.png";
  });
});

//پخش صدای جغد با کلیک روی تصویر
owl.addEventListener("click", () => {
  const audio = new Audio("assets/audio/owl-sound.mp3");
  audio.volume = 0.7;
  audio.play();
});

//بارش باران
function createDrops() {
  for (let i = 0; i < 3; i++) {
    const drop = document.createElement("div");
    drop.classList.add("drop");

    drop.style.left = Math.random() * window.innerWidth + "px";
    drop.style.animationDuration = 0.5 + Math.random() * 0.7 + "s";

    rainContainer.appendChild(drop);

    setTimeout(() => {
      drop.remove();
    }, 1500);
  }
}

//حرکت قلاب
let maxHeight = window.innerHeight * 0.8;
let hookHeight = 0;
let heightInterval = null;

function moveHookTo(targetHeight, step) {
  clearInterval(heightInterval);

  if (targetHeight > 0) {
    hook.style.display = "block";
    hookImage.style.display = "block";
  }

  heightInterval = setInterval(() => {
    if (hookHeight === targetHeight) {
      clearInterval(heightInterval);

      if (targetHeight === 0) {
        hook.style.display = "none";
        hookImage.style.display = "none";
      }
      return;
    }

    if (hookHeight < targetHeight) {
      hookHeight += step;
      if (hookHeight > targetHeight) hookHeight = targetHeight;
    } else {
      hookHeight -= step;
      if (hookHeight < targetHeight) hookHeight = targetHeight;
    }

    hook.style.height = hookHeight + "px";
  }, 20);
}

//بررسی توقف اسکرول هر یک ثانیه
setInterval(() => {
  let now = Date.now();
  let diff = (now - lastScrollTime) / 1000;

  if (diff >= 10) {
    moveHookTo(maxHeight, 1);
    lastScrollTime = Date.now();
  }
}, 1000);

// function flyBirds(){
//   let position = -100
//   let angle = 0;

//   setInterval(() => {
//    position += 2;
//    angle += 0.1;

//    let flyUpDown = Math.sin(angle) * 20;

//    if(position > window.innerWidth + 100){
//     position = -100;
//    }

//    birdRight.style.transform = `translate(${position * 1.2}px, ${position * -0.5}px)`;
//   } , 20);
// }
