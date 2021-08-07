// ref: https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines
//   /JavaScript
let currentSongIndex = 0;
let songs = [];
let albumList = document.getElementById('albumList');
let songList = document.getElementById('songList');
let albumListOpen = false;
let playButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>';
let pauseButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/></svg>';
let randomButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-diamond" viewBox="0 0 16 16"><path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>';
let data = [];
let currentAudioLoaded = false;
let randomButtonEnabled = false;
let repeatOneButtonEnabled = false;
let currentAlbum = 0;
let currentSong = 0;

window.onload = function() {
  // Get song data
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Request
  const request = new Request('albums.json');
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Could not get song data.');
      }
    })
    .then(response => {
      data = response;
      albums = data['albums'];
      let i = 0;
      albums.forEach(album => {
        let li = document.createElement('li');
        let link = document.createElement('a');
        let linkText = document.createTextNode(album.name);
        link.id = 'album_' + i;
        link.href = album.url;
        link.className = 'album';
        link.append(linkText);
        link.addEventListener('click', event => {
          event.preventDefault();
          openAlbum(event, link.id);
        });
        li.append(link);
        albumList.querySelector('ul').append(li);
        i++;
      });
    })
    .catch(error => {
        console.error(error);
    });
}

let audioState = 'stopped';
let currentAudioTime = 0;
let currentAudioTimeLength = 0;
let currentAudioTitle = document.getElementById('currentAudioTitle');
let currentAudioTitleValue = '';
let currentAudioTimeBox = document.getElementById('currentAudioTimeBox');
let currentAudioTimeLengthBox = document.getElementById('currentAudioTimeLengthBox');
let currentAudioLoading = false; 
let audioPlayer = document.getElementById('audioPlayer');
let audioPlayerSlider = document.getElementById('audioPlayerSlider');
let play = document.getElementById('play');
let prev = document.getElementById('prev');
let next = document.getElementById('next');
let random = document.getElementById('random');
let repeatOne = document.getElementById('repeatOne');
let firstPlay = true;

let playPromise;

function getCurrentSongTime() {
  currentAudioTime = audioPlayer.currentTime;
  audioPlayerSlider.value = currentAudioTime;
  currentAudioTimePieces = convertSecToMin(currentAudioTime);
  let minutesWithPadding = currentAudioTimePieces.minutes;
  if (currentAudioTimePieces.minutes < 10) {
    minutesWithPadding = "0" + currentAudioTimePieces.minutes;
  }
  let secondsWithPadding = currentAudioTimePieces.seconds;
  if (currentAudioTimePieces.seconds < 10) {
    secondsWithPadding = "0" + currentAudioTimePieces.seconds;
  }
  currentAudioTimeBox.innerHTML = minutesWithPadding+":"+secondsWithPadding;
}

function getSongLength() {
  currentAudioTimeLength = audioPlayer.duration;
  audioPlayerSlider.max = currentAudioTimeLength;
  currentAudioTimeLengthPieces = convertSecToMin(currentAudioTimeLength);
  let minutesLengthWithPadding = currentAudioTimeLengthPieces.minutes;
  if (currentAudioTimeLengthPieces.minutes < 10) {
    minutesLengthWithPadding = "0" + currentAudioTimeLengthPieces.minutes;
  }
  let secondsLengthWithPadding = currentAudioTimeLengthPieces.seconds;
  if (currentAudioTimeLengthPieces.seconds < 10) {
    secondsLengthWithPadding = "0" + currentAudioTimeLengthPieces.seconds;
  }
  currentAudioTimeLengthBox.innerHTML = minutesLengthWithPadding+":"+secondsLengthWithPadding;
  return currentAudioTimeLength;
}

function playbackTimeUpdate(playFromTime) {
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
play.addEventListener('click', event => {
  if (firstPlay) {
    if (randomButtonEnabled) {
      loadRandomSong();
    } else {
      loadFirstAvailableSong(event); 
    }
    firstPlay = false;
  }
  if (!currentAudioLoaded) {
    currentAudioLoading = true;
    currentAudioTitle.innerHTML = currentAudioTitleValue
        + '<br>' + 'Loading audio...';
    return false;
  }
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  let timeChecking;
  if (audioState === 'stopped' || audioState === 'paused') {
    audioPlayer.currentTime = currentAudioTime;
    audioState = 'playing';
    // ref: https://developers.google.com/web/updates/2017/06/
    //   /play-request-was-interrupted
    playPromise = audioPlayer.play();
    // ref: https://developer.mozilla.org/en-US/docs/Web/API
    //   /WindowOrWorkerGlobalScope/setInterval
    timeChecking = setInterval(getCurrentSongTime, 1000);
    // ref: Example from Chrome audio player
    play.innerHTML = pauseButton;
  } else {
    audioPlayer.currentTime = currentAudioTime;
    audioState = 'paused';
    audioPlayer.pause();
    clearInterval(timeChecking);
    play.innerHTML = playButton;
  }
});

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
document.addEventListener('keydown', getKeyboardKey);

function getKeyboardKey(event) {
  if (event.code === 'ArrowLeft') {
    const clickEvent = new Event('click');
    currentAudioTime = 0;
    prev.dispatchEvent(clickEvent);    
  } else if (event.code === 'ArrowRight') {
    const clickEvent = new Event('click');
    currentAudioTime = 0;
    next.dispatchEvent(clickEvent);    
  }
}

function loadRandomSong() {
  randomSong = getRandomSong();
  currentAlbum = randomSong['albumId'];
  currentSong = randomSong['songId'];
  currentSongIndex = currentSong;
  audioPlayer.src = data['albums'][randomSong['albumId']]['songs'][randomSong['songId']].url;
  currentAudioTitleValue = data['albums'][randomSong['albumId']]['songs'][randomSong['songId']].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
}

function loadSameSong() {
  getSameSong();
}

function loadNextSong() {
  getNextSong();
  audioPlayer.src = data['albums'][currentAlbum]['songs'][currentSongIndex].url;
  currentAudioTitleValue = data['albums'][currentAlbum]['songs'][currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
}

function loadPrevSong() {
  getPrevSong();
  audioPlayer.src = data['albums'][currentAlbum]['songs'][currentSongIndex].url;
  currentAudioTitleValue = data['albums'][currentAlbum]['songs'][currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
}

function loadFirstAvailableSong() {
  currentAlbum = 0;
  currentSong = 0;
  currentSongIndex = 0;
  audioPlayer.src = data['albums'][currentAlbum]['songs'][currentSongIndex].url;
  currentAudioTitleValue = data['albums'][currentAlbum]['songs'][currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
}

function loadClickedSong(event) {
  songIdPieces = event.target.id.split('_');
  // Note: the id from the event is actually a string
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Number
  currentSongIndex = Number.parseInt(songIdPieces[1]);
  audioPlayer.src = songs[currentSongIndex].url;
  currentAudioTitleValue = songs[currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
}

// Get length of current song once song can be played without buffering
// ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
//   /canplaythrough_event
audioPlayer.addEventListener('canplaythrough', event => {
  if (currentAudioLoaded) {
    getSongLength();
    currentAudioLoading = false;
    return true;
  }
  currentAudioLoaded = true;
  const clickEvent = new Event('click');
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
});

audioPlayer.addEventListener('ended', event => {
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

prev.addEventListener('click', event => {
  event.preventDefault();
  if (repeatOneButtonEnabled) {
    loadSameSong();
  } else if (randomButtonEnabled) {
    audioState = 'stopped';
    loadRandomSong();
  } else {
    loadPrevSong();
  }
  const clickEvent = new Event('click');
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
});

next.addEventListener('click', event => {
  event.preventDefault();

  if (repeatOneButtonEnabled) {
    loadSameSong();
  } else if (randomButtonEnabled) {
    audioState = 'stopped';
    loadRandomSong();
  } else {
    loadNextSong();
  }
  const clickEvent = new Event('click');
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
});

random.addEventListener('click', event => {
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

repeatOne.addEventListener('click', event => {
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

function convertSecToMin(seconds) {
  let result = {
    "minutes": 0,
    "seconds": 0
  }
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Math
  result.minutes = Math.floor(seconds / 60);
  result.seconds = Math.floor(seconds);
  if (result.minutes > 0) {
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    //   /Reference/Operators/Remainder
    result.seconds = Math.floor(Math.round(seconds) % 60);
  }
  return result; 
}

function getPrevSong() {

  if ((currentSongIndex - 1) >= 0) {
    currentSongIndex--;
  } else {
    currentSongIndex = 0;
    if ((data['albums'][currentAlbum]['songs'].length- 1) >= 0) {
        currentSongIndex = data['albums'][currentAlbum]['songs'].length - 1;
    }
  }
  currentAudioTime = 0;
  audioState = 'paused';
}

function getNextSong() {
  if ((currentSongIndex + 1) < data['albums'][currentAlbum]['songs'].length) {
    currentSongIndex++;
  } else {
    currentSongIndex = 0;
  }
  currentAudioTime = 0;
  audioState = 'paused';
}

function getSameSong() {
  currentAudioTime = 0;
  audioState = 'paused';
}

function getClickedSong(event) {
  songIdPieces = event.target.id.split('_');
  // Note: the id from the event is actually a string
    loadSameSong();
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Number
  currentSongIndex = Number.parseInt(songIdPieces[1]);
  audioPlayer.src = songs[currentSongIndex].url;
  currentAudioTitleValue = songs[currentSongIndex].name;
  currentAudioTitle.innerHTML = currentAudioTitleValue;
  const clickEvent = new Event('click');
  audioState = 'paused';
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
}

function openAlbum(event, albumId) {
  albumListOpen = true;
  albumIdPieces = albumId.split('_');
  songs = data["albums"][albumIdPieces[1]]['songs'];
  songList.innerHTML = '<ol></ol>';
  let i = 0;
  songs.forEach(song => {
    let li = document.createElement('li');
    let link = document.createElement('a');
    let linkText = document.createTextNode(song.name);
    link.id = 'song_' + i;
    link.href = song.url;
    link.className = 'song';
    link.append(linkText);
    link.addEventListener('click', event => {
      event.preventDefault();
      getClickedSong(event);
    });
    li.append(link);
    songList.querySelector('ol').append(li);
    i++;
  });
}

function getRandomSong() {
  let totalAlbums = data['albums'].length;
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Math/random
  let randomAlbumId = Math.floor(Math.random() * totalAlbums);
  let totalSongsOnAlbum = data['albums'][randomAlbumId]['songs'].length;
  randomSongId = Math.floor(Math.random() * totalSongsOnAlbum);
  return {'albumId': randomAlbumId, 'songId': randomSongId};
}
