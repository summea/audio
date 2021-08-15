# Changelog
A place to keep track of changes for this audio project.

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
