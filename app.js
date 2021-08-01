// ref: https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines
//   /JavaScript
let currentSongIndex = 0;
let songs = [];
let albumList = document.getElementById('albumList');
let songList = document.getElementById('songList');
let albumListOpen = false;
let playButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>';
let pauseButton = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/></svg>';
let data = [];
let currentAudioLoaded = false;

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
        link.id = i;
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
let currentAudioTimeBox = document.getElementById('currentAudioTimeBox');
let currentAudioTimeLengthBox = document.getElementById('currentAudioTimeLengthBox');
let audioPlayer = document.getElementById('audioPlayer');
let audioPlayerSlider = document.getElementById('audioPlayerSlider');
let play = document.getElementById('play');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

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
  if (!albumListOpen) {
    return false;
  }
  audioPlayer.src = songs[currentSongIndex].url;
  if (!currentAudioLoaded) {
    currentAudioTitle.innerHTML = songs[currentSongIndex].name
        + '<br>' + 'Loading audio...';
    return false;
  }
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
    play.innerHTML = playButton;
  } else {
    audioPlayer.currentTime = currentAudioTime;
    audioState = 'paused';
    audioPlayer.pause();
    clearInterval(timeChecking);
    play.innerHTML = pauseButton;
  }
  currentAudioTitle.innerHTML = songs[currentSongIndex].name;
});

// Get length of current song once song can be played without buffering
// ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
//   /canplaythrough_event
audioPlayer.addEventListener('canplaythrough', event => {
  if (currentAudioLoaded) {
    return true;
  }
  getSongLength();
  currentAudioLoaded = true;
  const clickEvent = new Event('click');
  audioState = 'paused';
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
});

audioPlayer.addEventListener('ended', event => {
  getNextSong();
  audioPlayer.play();
});

prev.addEventListener('click', event => {
  getPrevSong();
  audioPlayer.play();
});

next.addEventListener('click', event => {
  getNextSong();
  audioPlayer.play();
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
  if ((currentSongIndex - 1) > 0) {
    currentSongIndex--;
  } else {
    currentSongIndex = 0;
    if ((songs.length - 1) > 0) {
        currentSongIndex = songs.length - 1;
    }
  }
  currentAudioTime = 0;
  const clickEvent = new Event('click');
  audioState = 'paused';
  play.dispatchEvent(clickEvent);
}

function getNextSong() {
  if ((currentSongIndex + 1) < songs.length) {
    currentSongIndex++;
  } else {
    currentSongIndex = 0;
  }
  currentAudioTime = 0;
  const clickEvent = new Event('click');
  audioState = 'paused';
  play.dispatchEvent(clickEvent);
}

function getClickedSong(event) {
  // Note: the id from the event is actually a string
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
  //   /Global_Objects/Number
  currentSongIndex = Number.parseInt(event.target.id);
  const clickEvent = new Event('click');
  audioState = 'paused';
  currentAudioTime = 0;
  play.dispatchEvent(clickEvent);
}

function openAlbum(event, albumId) {
  albumListOpen = true;
  songs = data["albums"][albumId]['songs'];
  songList.innerHTML = '<ul></ul>';
  let i = 0;
  songs.forEach(song => {
    let li = document.createElement('li');
    let link = document.createElement('a');
    let linkText = document.createTextNode(song.name);
    link.id = i;
    link.href = song.url;
    link.className = 'song';
    link.append(linkText);
    link.addEventListener('click', event => {
      event.preventDefault();
      getClickedSong(event);
    });
    li.append(link);
    songList.querySelector('ul').append(li);
    i++;
  });
}
