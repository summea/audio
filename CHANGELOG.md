# Changelog
A place to keep track of changes for this audio project.

## [Upcoming]
### Changed
- Moved volume slider to center area for now (Issue #124)

### Fixed
- Adjusted center alignment of play button

## [1.7.0] - 2023-08-16
### Added
- Song download button for albums list (Issue #111)
- Volume slider especially meant for desktop devices (Issue #123)

### Changed
- Used circular icons for song download icons (Issue #113)
- Went back to single-column layout for album song lists (Issue #115)
- Hide album song list box until an album is open (Issue #117)
- Updated song database output file
- Used icons for "random" and "repeat one" buttons

### Fixed
- Issue where clicking on album and pressing play had wrong index (Issue #118)

## [1.6.0] - 2022-03-12
### Added
- Feature test to ensure that audio player play button starts song play and to see if the audio player slider bar moves (Issue #99)
- Feature test to check that pushing "random" button and then "play" button causes a song to start playing (Issue #102)
- Two column approach for album song list (Issue #105)

### Changed
- Updated some code formatting conventions
- Removed column gap in CSS for album song list (Issue #107)

### Fixed
- Bug: Disappearing album images on first page load on Safari browser on mobile (Issue #69)
- Bug: Unable to move slider for first song on Safari browser (Issue #98)

## [1.5.2] - 2021-09-23
### Fixed
- Bug: Song duration length not very accurate at times (Issue #97)

## [1.5.1] - 2021-09-23
### Fixed
- Bug: Unable to move slider handle on audio player (Issue #96)

## [1.5.0] - 2021-09-23
### Added
- Song countdown time as per J's suggestion (Issue #54)
- Swipe feature for albums list (Issue #82)
- Unit test for `convertSecToMin()` (Issue #91)
- Utility related module (Issue #92)
- Package files
- Unit tests for `getCurrentSongTimeDisplay()` (Issue #93)
- Unit tests for `getCurrentSongTimeLengthDisplay()` (Issue #94)

### Changed
- Reduced length of some variable names
- Broke out `getCurrentSongTime()` to `modules/utility.js` as `getCurrentSongTimeDisplay()` and `getCurrentSongTimeLengthDisplay()` functions
- Some variable naming in `app.js` for now to hopefully make it simpler

### Fixed
- Bug related to unintentional play/pause when clicking on song in "Song List" (Issue #83)
- NaN bug related to countdown time getting to 0 or maybe lower (Issue #84)
- Bug related to losing previous song stack when random mode on (Issue #85)
- Bug related to which current album is currently selected which affected how many songs could be played on a given album (Issue #87)
- Bug related to clicking "previous" button and staying on same current album (Issue #88)
- Center alignment issue with "Random" and "Repeat" items (Issue #89)

## [1.4.1] - 2021-09-07
### Added
- Feature to load linked song and song title for ?songId=n value (Issue #76)

### Fixed
- Problem where ?songId=n was not loading on mobile (Issue #80)

## [1.4.0] - 2021-09-06
### Added
- Alt tag information for album images
- Lazy loading for offscreen album images
- Added feature where you can go to a specific album and song via query parameters in URL (Issue #55)
- Added SQLite database (locally) for album and song data (Issue #74)
- Added feature to be able to click to prev/next song after using ?songId=n in URL (Issue #78)
- Added unique ids for songs (Issue #75)

### Changed
- Reduced image size to 100x100px for album images to hopefully help reduce load time
- Updated `albums.json` to use new, smaller album images

### Fixed
- Issue where page would jump to top when pressing play/pause button (Issue #71)
- Issue where page would jump to top when pressing prev/next album buttons (Issue #73)
- Issue where pushing pause button (after song has played and gone to another song) would not pause song for the first click attempt (Issue #44)

## [1.3.0] - 2021-08-26
### Added
- Initial idea for album carousel (Issue #56)
- Prev/next buttons for album carousel (Issue #57)
- Feature to show only a certain number of albums at a time but to also allow for scrolling left/right (Issue #58)
- Animation when clicking prev/next album buttons (Issue #59)
- Feature to prevent ability from going way left or way right on album carousel when clicking through albums (Issue #62)

### Changed
- Positioned prev/next album buttons on left/right side of album carousel (Issue #61)
- Renamed "Repeat One" button to "Repeat" for now (Issue #64)

### Fixed
- Issue where song clicked from album list was not playing on mobile (Issue #63)

## [1.2.1] - 2021-08-14
### Fixed
- Some CSS related issues on mobile web version
- Some local variable definition issues

## [1.2.0] - 2021-08-14
### Added
- Feature to use album song numbers for list of songs displayed for a given album (Issue #49)
- Settings variable for albums.json link (Issue #52)

### Changed
- The app.js structure so that it now uses a module type of approach

### Fixed
- Issue where when clicking a specific song of an opened album, the 0,0 (first album, first song) would unexpectedly play (Issue #50)
- Issue where song length calculation was wrong on mobile web version (Issue #51)

### Removed
- Old `songs.json` data file

## [1.1.0] - 2021-08-07
### Added
- Feature to play first song of first album if no album selected and random mode not on (Issue #48)
- Features to be able to use right and left arrow keys to act as next and prev actions (Issues #46, #47)
- Feature to play next song on album if starting with random mode on and then turning random mode off and clicking/pushing next (Issue #43)

### Fixed
- Swapped order of play and pause buttons to match normal usage -- somewhat based on Chrome audio player example but also on other usage experience (Issue #45)

## [1.0.0] - 2021-08-05
### Added
- Repeat-one song feature (Issue #42)

### Fixed
- When random mode is on and song gets to end, it should go to another random song (Issue #41)
- When repeat-one mode is on and pressing next/prev buttons, song should just repeat (Issue #37)

- ref: https://keepachangelog.com/en/1.0.0/
