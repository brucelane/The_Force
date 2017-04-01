# Music visualization shader for the 2017 W3C contest

This is a shader created specially for the [W3C contest](https://www.w3.org/2017/WWW26/contests.html) by Bruce Lane.

The WebGL Fragment Shader receives uniform variables to bring interactivity:
- It is audio-reactive: a Fast Fourier Transform is calculated from the sound spectrum at each animation frame (uniform: bands).
- Rotation with mouse (uniform: mouse)
- Time-based animation (uniform: time)

The music is [Batchass - Spidermoon](https://soundcloud.com/batchass/spidermoon)

The live-coding environment is created by Shawn Lawson and modifyed by Bruce Lane for the W3C contest:
- load sound on startup
- load this specific shader on startup

The rest of this document is from the original repository:

# The Force

Life creates it, makes it grow. Its energy surrounds us and binds us. Luminous beings are we, not this crude matter. You must feel the Force around you; here, between you, me, the tree, the rock, everywhere, yes.

Force felt by [Obi-Wan Codenobi](http://shawnlawson.com) for use in live-coding performances with [The Wookie](http://ryanrosssmith.com). Together they travel as [_The Rebel Scum_](http://codenobiandwookie.com).

## API
If you're looking or which functions are built-in, then give the wiki [API](./wiki/API) a look.

### Additionally helpful to know

- [The_Force/shaderExperiments](./shaderExperiments) contains several examples to get you started
- [Workshop Notes](https://github.com/shawnlawson/The_Force_Workshop) contains some hand-written information and a few more example shaders
- [The_Force/help](./help) contains helpful documents, including **instructions to run local/offline (it's easy!)**
- line in and microphone only work in Google Chrome, and requires HTTPS
- <kbd>ctrl</kbd>+<kbd>shift</kbd> will toggle text visibility
- backbuffer is a copy of the previous frame's frontbuffer
- 512 fft in row 0; waveform in row 1
- keyboard data in row 0 of texture (`channel0`) - not recently tested
- open file is not totally safe; it's only checking for filename extension ".frag"
- images save as .png


## To Do 

- fix popup menu styling
- fill in more help window
- DnD into text editor window
- more 2D textures
- video input
- webcam 
- cubemap input


## Sources

* https://github.com/ajaxorg/ace
* http://darsa.in/fpsmeter/ also https://github.com/darsain/fpsmeter
* http://jquery.com
* http://www.flaticon.com
* https://github.com/eligrey/FileSaver.js
* https://github.com/eligrey/canvas-toBlob.js
* https://github.com/marmorkuchen-net/osc-js
