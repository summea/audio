// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
import { settings } from "./modules/settings.js";
import {
  convertSecToMin,
  getCurrentSongTimeDisplay,
  getCurrentSongTimeLengthDisplay
} from "./modules/utility.js";

// ref: https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines 
//   /JavaScript
let currentSongIndex = 0;
let albums = [];
let songs = [];
let albumList = document.getElementById("albumList");
let songList = document.getElementById("songList");
let albumListOpen = false;
let playButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>';
let pauseButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/></svg>';
let randomButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-diamond" viewBox="0 0 16 16"><path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>';
let nextAlbumButtonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"> <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg>';
let prevAlbumButtonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16"> <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/></svg>';
let data = [];
let currentAudioLoaded = false;
let randomButtonEnabled = false;
let repeatOneButtonEnabled = false;
let currentAlbum = 0;
let currentSong = 0;
let currentSongId = 0;
let userClickedSongFromList = false;
let audioState = "stopped";
let currentAudioTimeLength = 0;
let currentAudioTitle = document.getElementById("currentAudioTitle");
let currentAudioTitleValue = "";
let currentAudioTimeBox = document.getElementById("currentAudioTimeBox");
let currentAudioTimeLengthBox = document.getElementById("currentAudioTimeLengthBox");
let currentAudioLoading = false;
let audioPlayer = document.getElementById("audioPlayer");
let audioPlayerSlider = document.getElementById("audioPlayerSlider");
let play = document.getElementById("play");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let random = document.getElementById("random");
let repeatOne = document.getElementById("repeatOne");
let nextAlbumButton = document.getElementById("nextAlbumButton");
let prevAlbumButton = document.getElementById("prevAlbumButton");
let firstPlay = true;
let playPromise;
let lastPlayedSongs = [];
// ref: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/location
let queryStringParams = new URLSearchParams(location.search);
let urlHadSongId = false;
let lastTouchX = 0;
let volume = document.getElementById("volume");

export function setup() {
  // ref: https://stackoverflow.com/a/53069733/1167750
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
  //   /input_event
  // ref: https://developer.mozilla.org/en-US/docs/Web/API
  //   /GlobalEventHandlers/oninput
  audioPlayerSlider.oninput = playbackTimeUpdate;

  prevAlbumButton.innerHTML = '<i class="bi bi-caret-left-fill"></i>'; 
  nextAlbumButton.innerHTML = '<i class="bi bi-caret-right-fill"></i>';

  if (queryStringParams.has("songId")) {
    urlHadSongId = true;
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
    //   /Global_Objects/Number
    currentSong = Number.parseInt(queryStringParams.get("songId"));
    currentSongId = Number.parseInt(queryStringParams.get("songId"));
    currentSongIndex = currentSong;
  }

  // Get song data
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Request
  const request = new Request(settings["albumsJsonPath"]);
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Could not get song data.");
      }
    })
    .then(response => {
      data = response;
      albums = data["albums"];
      let i = 0;
      albums.forEach(album => {
        let li = document.createElement("li");
        let albumDiv = document.createElement("div");
        albumDiv.className = 'albumDiv';
        let link = document.createElement("a");
        let linkText = album.name;
        let albumCoverImage = document.createElement("img");
        albumCoverImage.src = album["coverImage"];
        albumCoverImage.className = "albumCoverImage";
        // ref: https://developer.mozilla.org/en-US/docs/Web/Performance
        //   /Lazy_loading
        // The early album images should load first
        if (i > 2) {
          albumCoverImage.loading = 'lazy';
        }
        albumCoverImage.alt = linkText;
        link.appendChild(albumCoverImage);
        link.id = "album_" + album.id;
        link.href = album.url;
        link.className = "album";
        link.append(linkText);
        link.addEventListener("click", event => {
          event.preventDefault();
          openAlbum(event, link.id);
        });
        albumDiv.append(link)
        li.append(albumDiv);
        albumList.querySelector("ul").append(li);
        i++;
      });
    })
    .catch(error => {
        console.error(error);
    });

  if (currentSongId > 0) {
    // Get song data
    // ref: https://developer.okta.com/blog/2021/08/02/fix-common-problems-cors
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
    const request = new Request(settings["backendUrl"] + "/audio.php?songId=" + currentSongId, {mode: 'cors'});
    fetch(request)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Could not get song data.");
        }
      })
      .then(response => {
        audioPlayer.src = response.songUrl;
        currentAudioTitleValue = response.name;
        //currentAlbum = response.albumId;
        //currentSong = response.id;
        //currentSongIndex = response.albumSongNumber - 1;
        currentAudioTitle.innerHTML = currentAudioTitleValue;
        // ref: https://stackoverflow.com/a/49794011/1167750
        audioPlayer.load();
        getCurrentSongTimeLengthDisplay(audioPlayer.currentTime, audioPlayer.duration);
      })
      .catch(error => {
          console.error(error);
      });
  }
}

function playbackTimeUpdate(event) {
  let playFromTime = event.target.value;
  // ref: https://developers.google.com/web/updates/2017/06
  //   /play-request-was-interrupted
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      audioPlayerSlider.value = playFromTime;
      audioPlayer.currentTime = playFromTime;
    })
    .catch(error => {
    });
  }
}

// ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
play.addEventListener("click", event => {
  event.preventDefault();
  if (firstPlay) {
    if (randomButtonEnabled) {
      loadRandomSong();
    } else if (!userClickedSongFromList) {
      loadFirstAvailableSong(event); 
    }
    firstPlay = false;
  }
  if (!currentAudioLoaded) {
    currentAudioLoading = true;
    currentAudioTitle.innerHTML = currentAudioTitleValue
        + "<br>" + "Loading audio...";
    return false;
  }
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  let timeChecking;
  // In order to get song length of first song (album: 0, song: 0) on mobile
  getCurrentSongTimeLengthDisplay(audioPlayer.currentTime, audioPlayer.duration);
  if (audioState === "stopped" || audioState === "paused") {
    //audioPlayer.currentTime = currentAudioTime;
    audioState = "playing";
    // ref: https://developers.google.com/web/updates/2017/06/
    //   /play-request-was-interrupted
    playPromise = audioPlayer.play();
    // ref: https://developer.mozilla.org/en-US/docs/Web/API
    //   /WindowOrWorkerGlobalScope/setInterval
    timeChecking = setInterval(
      function() {
        audioPlayerSlider.value = audioPlayer.currentTime;
        currentAudioTimeBox.innerHTML =
          getCurrentSongTimeDisplay(audioPlayer.currentTime);
        currentAudioTimeLengthBox.innerHTML =
          getCurrentSongTimeLengthDisplay(
            audioPlayer.currentTime,
            audioPlayer.duration
          );
      },
      1000
    );
    // ref: Example from Chrome audio player
    play.innerHTML = pauseButton;
  } else {
    audioState = "paused";
    audioPlayer.pause();
    clearInterval(timeChecking);
    play.innerHTML = playButton;
  }
});

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
document.addEventListener("keydown", getKeyboardKey);

function getKeyboardKey(event) {
  if (event.code === "ArrowLeft") {
    const clickEvent = new Event("click");
    audioPlayer.currentTime = 0;
    prev.dispatchEvent(clickEvent);    
  } else if (event.code === "ArrowRight") {
    const clickEvent = new Event("click");
    audioPlayer.currentTime = 0;
    next.dispatchEvent(clickEvent);    
  } else if (event.code === "Space") {
    const clickEvent = new Event("click");
    play.dispatchEvent(clickEvent);
  }
}

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// ref: https://www.codicode.com/art
//   /easy_way_to_add_touch_support_to_your_website.aspx
document.addEventListener("touchmove", handleMove, false);

function handleMove(event) {
  let touches = event.changedTouches;
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Touch/target
  if (touches[0].target.className !== "albumCoverImage") {
    return false;
  }
  let scrollXDirection = 'ltr';
  if (lastTouchX > touches[0].clientX) {
    scrollXDirection = 'rtl';
  }

  let albums = albumList.getElementsByTagName('li');
  if (scrollXDirection === 'rtl') {
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
    //   /Keyframe_Formats
    // ref: https://www.designcise.com/web/tutorial
    //   /how-to-stop-on-the-last-frame-when-a-css-animation-ends
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist
    // ref: https://www.sitepoint.com/community/t
    //   /keyframes-how-to-prevent-animation-resetting-to-the-first-frame/249925
    if (albumsX > -100) {
      albumsX = -100;
      return false;
    }
    albumsX -= 5;
    albums[0].animate(
      {
        // from
        marginLeft: albumsX + "px",
      },
      {
        // to
        marginLeft: (albumsX + 10) + "px",
        duration: 300,
        fill: "forwards"
      }
    );
  } else {
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
    //   /Keyframe_Formats
    // ref: https://www.designcise.com/web/tutorial
    //   /how-to-stop-on-the-last-frame-when-a-css-animation-ends
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist
    // ref: https://www.sitepoint.com/community/t
    //   /keyframes-how-to-prevent-animation-resetting-to-the-first-frame/249925
    if (albumsX < -(albums.length * 100)) {
      albumsX = -(albums.length * 100);
      return false;
    }
    albumsX += 5;
    albums[0].animate(
      {
        // from
        marginLeft: albumsX + "px",
      },
      {
        // to
        marginLeft: (albumsX + 10) + "px",
        duration: 300,
        fill: "forwards"
      }
    );
  }

  lastTouchX = touches[0].clientX;
}

function loadRandomSong() {
  let randomSong = getRandomSong();
  currentAlbum = randomSong["albumId"];
  currentSong = randomSong["songId"];
  currentSongIndex = currentSong;
  audioPlayer.src =
    data["albums"][randomSong["albumId"]]["songs"][randomSong["songId"]].url;
  currentAudioTitleValue =
    data["albums"][randomSong["albumId"]]["songs"][randomSong["songId"]].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

function loadSameSong() {
  getSameSong();
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

function loadNextSong() {
  getNextSong();
  if (urlHadSongId) {
    urlHadSongId = false;
    currentAlbum = getCurrentAlbumIndex();
  }
  let currentAlbumIndex = getCurrentAlbumIndex();
  audioPlayer.src =
    data["albums"][currentAlbumIndex]["songs"][currentSongIndex].url;
  currentAudioTitleValue =
    data["albums"][currentAlbumIndex]["songs"][currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

function loadPrevSong() {
  getPrevSong();
  if (urlHadSongId) {
    urlHadSongId = false;
    currentAlbum = getCurrentAlbumIndex();
  }
  let currentAlbumIndex = getCurrentAlbumIndex();
  if (randomButtonEnabled) {
    audioPlayer.src =
      data["albums"][currentAlbumIndex]["songs"][currentSong].url;
    currentAudioTitleValue =
      data["albums"][currentAlbumIndex]["songs"][currentSong].name;
  } else {
    audioPlayer.src =
      data["albums"][currentAlbumIndex]["songs"][currentSongIndex].url;
    currentAudioTitleValue =
      data["albums"][currentAlbumIndex]["songs"][currentSongIndex].name;
  }
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

function loadFirstAvailableSong() {
  if (firstPlay) {
    if (!queryStringParams.has("songId")) {
      currentSong = 0;
      currentSongIndex = 0;
    }
  }
  if (currentSongId > 0) {
    // Get song data
    // ref: https://developer.okta.com/blog/2021/08/02/fix-common-problems-cors
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
    const request = new Request(
      settings["backendUrl"] + "/audio.php?songId=" + currentSongId, {
        mode: 'cors'
      }
    );
    fetch(request)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Could not get song data.");
        }
      })
      .then(response => {
        audioPlayer.src = response.songUrl;
        currentAudioTitleValue = response.name;
        currentAlbum = response.albumId;
        currentSong = response.id;
        currentSongIndex = response.albumSongNumber - 1;
        currentAudioTitle.innerHTML = currentAudioTitleValue;
        // ref: https://stackoverflow.com/a/49794011/1167750
        audioPlayer.load();
        getCurrentSongTimeLengthDisplay(
          audioPlayer.currentTime,
          audioPlayer.duration
        );
      })
      .catch(error => {
          console.error(error);
      });
  } else {
    currentAlbum = getCurrentAlbumIndex();
    if (urlHadSongId) {
      urlHadSongId = false;
    }
    audioPlayer.src =
      data["albums"][currentAlbum]["songs"][currentSongIndex].url;
    currentAudioTitleValue =
      data["albums"][currentAlbum]["songs"][currentSongIndex].name;
  }
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

function loadClickedSong(event) {
  let songIdPieces = event.target.id.split("_");
  if (urlHadSongId) {
    urlHadSongId = false;
    currentAlbum = getCurrentAlbumIndex();
  }
  // Note: the id from the event is actually a string
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Number
  currentSongIndex = Number.parseInt(songIdPieces[1]);
  audioPlayer.src = songs[currentSongIndex].url;
  currentAudioTitleValue = songs[currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  // ref: https://stackoverflow.com/a/49794011/1167750
  audioPlayer.load();
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
}

// Get length of current song once song can be played without buffering
// ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
//   /canplaythrough_event
audioPlayer.addEventListener("canplaythrough", event => {
  if (currentAudioLoaded) {
    audioPlayerSlider.max = audioPlayer.duration;
    getCurrentSongTimeLengthDisplay(
      audioPlayer.currentTime,
      audioPlayer.duration
    );
    currentAudioLoading = false;
    return true;
  }
  if (urlHadSongId) {
    audioState = "playing";
  }
  currentAudioLoaded = true;
  audioPlayerSlider.max = audioPlayer.duration;
  getCurrentSongTimeLengthDisplay(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
  currentAudioLoading = false;
  const clickEvent = new Event("click");
  audioPlayer.currentTime = 0;
  play.dispatchEvent(clickEvent);
});

audioPlayer.addEventListener("ended", event => {
  event.preventDefault();
  if (repeatOneButtonEnabled) {
    loadSameSong();
  } else if (randomButtonEnabled) {
    loadRandomSong();
  } else {
    loadNextSong();
  }
  audioPlayer.play();
});

prev.addEventListener("click", event => {
  event.preventDefault();
  if (repeatOneButtonEnabled) {
    loadSameSong();
  } else {
    loadPrevSong();
  }
  if (audioState === "playing") {
    audioState = "paused";
  }
  const clickEvent = new Event("click");
  audioPlayer.currentTime = 0;
  play.dispatchEvent(clickEvent);
});

next.addEventListener("click", event => {
  event.preventDefault();

  if (repeatOneButtonEnabled) {
    loadSameSong();
  } else if (randomButtonEnabled) {
    loadRandomSong();
  } else {
    loadNextSong();
  }
  if (audioState === "playing") {
    audioState = "paused";
  }
  const clickEvent = new Event("click");
  audioPlayer.currentTime = 0;
  play.dispatchEvent(clickEvent);
});

random.addEventListener("click", event => {
  event.preventDefault();
  if (randomButtonEnabled) {
    randomButtonEnabled = false;
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/className
    random.className = "randomDisabled";
  } else {
    randomButtonEnabled = true;
    random.className = "randomEnabled";
  }
});

repeatOne.addEventListener("click", event => {
  event.preventDefault();
  if (repeatOneButtonEnabled) {
    repeatOneButtonEnabled = false;
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/className
    repeatOne.className = "repeatOneDisabled";
  } else {
    repeatOneButtonEnabled = true;
    repeatOne.className = "repeatOneEnabled";
  }
});

// ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
volume.addEventListener("input", event => {
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
  //   /volume
  audioPlayer.volume = event.target.value / 100;
});

function getPrevSong() {
  audioPlayer.currentTime = 0;
  if (randomButtonEnabled) {
    if (lastPlayedSongs.length > 1) {
      lastPlayedSongs.pop();
    }
    currentAlbum = lastPlayedSongs[lastPlayedSongs.length-1].currentAlbum;
    currentSong = lastPlayedSongs[lastPlayedSongs.length-1].currentSong;
    return true;
  }
  if ((currentSongIndex - 1) >= 0) {
    currentSongIndex--;
  } else {
    currentSongIndex = 0;
    if ((data["albums"][currentAlbum]["songs"].length- 1) >= 0) {
        currentSongIndex = data["albums"][currentAlbum]["songs"].length - 1;
    }
  }
}

function getNextSong() {
  let currentAlbumIndex = getCurrentAlbumIndex();
  if ((currentSongIndex + 1) <
      data["albums"][currentAlbumIndex]["songs"].length) {
    currentSongIndex++;
  } else {
    currentSongIndex = 0;
  }
  audioPlayer.currentTime = 0;
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Array
  lastPlayedSongs.push({
    "currentAlbum": currentAlbumIndex,
    "currentSong": currentSongIndex
  });
}

function getSameSong() {
  audioPlayer.currentTime = 0;
}

// See Issue #79
function getCurrentAlbumIndex() {
  let foundIndex = 0;
  for (let i = 0; i < data["albums"].length; i++) {
    if (data["albums"][i].id == currentAlbum) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

function getClickedSong(event) {
  // Note: the id from the event is actually a string
  let songIdPieces = event.target.id.split("_");
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Number
  currentSongIndex = Number.parseInt(songIdPieces[1]);
  audioPlayer.src = songs[currentSongIndex].url;
  currentAudioTitleValue = songs[currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  userClickedSongFromList = true;
  loadClickedSong(event);
  if (audioState === "playing") {
    audioState = "paused";
  }
  const clickEvent = new Event("click");
  audioPlayer.currentTime = 0;
  play.dispatchEvent(clickEvent);
}

function openAlbum(event, albumId) {
  albumListOpen = true;
  songList.style = 'display: block;';
  let albumIdPieces = albumId.split("_");
  currentAlbum = albumIdPieces[1];
  let currentAlbumIndex = getCurrentAlbumIndex();
  songs = data["albums"][currentAlbumIndex]["songs"];
  songList.innerHTML = "<ol></ol>";
  let i = 0;
  songs.forEach(song => {
    let li = document.createElement("li");
    let link = document.createElement("a");
    let linkText = document.createTextNode(song.name);
    let downloadLink = document.createElement("a");
    let downloadLinkImg = document.createElement("i");
    link.id = "song_" + i;
    link.href = song.url;
    link.className = "song";
    link.append(linkText);
    link.addEventListener("click", event => {
      event.preventDefault();
      getClickedSong(event);
    });
    li.value = song.albumSongNumber;
    li.append(link);
    downloadLink.href = song.url;
    // ref: https://icons.getbootstrap.com/
    downloadLinkImg.className =
      "bi bi-arrow-down-circle songDownloadButton";
    downloadLink.append(downloadLinkImg);
    li.append(downloadLink);
    songList.querySelector("ol").append(li);
    i++;
  });
}

function getRandomSong() {
  let totalAlbums = data["albums"].length;
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Math/random
  let randomAlbumId = Math.floor(Math.random() * totalAlbums);
  let totalSongsOnAlbum = data["albums"][randomAlbumId]["songs"].length;
  let randomSongId = Math.floor(Math.random() * totalSongsOnAlbum);
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Array
  lastPlayedSongs.push({
    "currentAlbum": randomAlbumId,
    "currentSong": randomSongId
  });
  return {"albumId": randomAlbumId, "songId": randomSongId};
}

let albumsX = 0;

prevAlbumButton.addEventListener('click', function(event) {
  event.preventDefault();
  let albums = albumList.getElementsByTagName('li');
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
  //   /Keyframe_Formats
  // ref: https://www.designcise.com/web/tutorial
  //   /how-to-stop-on-the-last-frame-when-a-css-animation-ends
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist
  // ref: https://www.sitepoint.com/community/t
  //   /keyframes-how-to-prevent-animation-resetting-to-the-first-frame/249925
  if (albumsX > -100) {
    return false;
  }
  albumsX += 100;
  albums[0].animate(
    {
      // from
      marginLeft: albumsX + "px",
    },
    {
      // to
      marginLeft: (albumsX + 100) + "px",
      duration: 300,
      fill: "forwards"
    }
  );
});

nextAlbumButton.addEventListener('click', function(event) {
  event.preventDefault();
  let albums = albumList.getElementsByTagName('li');
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
  //   /Keyframe_Formats
  // ref: https://www.designcise.com/web/tutorial
  //   /how-to-stop-on-the-last-frame-when-a-css-animation-ends
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist
  // ref: https://www.sitepoint.com/community/t
  //   /keyframes-how-to-prevent-animation-resetting-to-the-first-frame/249925
  if (albumsX < 100 + (albums.length * -100)) {
    return false;
  }
  albumsX -= 100;
  albums[0].animate(
    {
      // from
      marginLeft: albumsX + "px",
    },
    {
      // to
      marginLeft: (albumsX + 100) + "px",
      duration: 300,
      fill: "forwards"
    }
  );
});
