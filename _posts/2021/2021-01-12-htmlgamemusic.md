---
layout: post
title: Adding Music to the Game
author: Janessa
date: 2021-01-12
tags: [Game Dev]
category: Tech
---
*This is the third post in my series on learning html game development. You can find the other posts [here](/tags/#Game%20Dev)!*

While I don't play a lot of video games, video game music is honestly one of my favorite genres of music. I find it really great to work to (because it's upbeat/not distracting) and I also think sometimes it can really complete a game. To no surprise, I was pretty excited about this next feature which involves adding background music to the different game states (these starts are menu, play, and win)! If you'd like to learn how I did it, continue reading!

## Getting the music

The first thing we need to do is obtain audio files which we can then load into the game. The website I used to download free audio is [playonloop.com](https://www.playonloop.com/). They have a section for royalty-free music and allow people to download free short versions of the audio. Once you download your audio files, move them into the development repo (I put mine under `/audio`) for easy access.

## Adding the music to our game

### Menu Music

The first audio file we are going to add to our game is the one that plays while the player is on the menu page. We load our files, like our other assets, inside the `preload` method for each state class.

Read in audio files in `preload` method:

```js
MenuState.preload = function () {
    this.game.load.audio('music', 'audio/menu-music.wav')
        ...
}
```

Then, in the `create` method, create the audio and play it. We set `this.music.loop` to true to enable the music to play continuously.

```js
MenuState.create = function () {
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    this.music.play();
  ...
}
```

Since the music is playing continuously, however, we want to ensure that we stop the music before we change states so that the music doesn't overlap.

```js
MenuState.start = function () {
    this.game.state.start('play', true, false, {level: 0})
    this.music.pause();
}
```

### Playing Music

Next, we set up the music that plays while the game is being played. I wanted to keep the music continuous playing regardless of the level, so I had to create a variable to check if the music was already playing since music gets added at each level. I set this up by creating a flag in `init()` to keep track if the background music is playing, and then pass along the value every time a new level is created.

Set the variable:
```js
PlayState.init = function (data) {
    this.bgMusicPlaying = data.bgMusicPlaying || false;
};
```

Check if music is playing via our variable `this.bgMusicPlaying`, if not, play it and set the variable:
```js
PlayState._loadLevel = function (data) {
    if (this.bgMusicPlaying === false) {
        this.music = this.game.add.audio('background');
        this.music.loop = true;
        this.music.play();
        this.bgMusicPlaying = true;
    }
}
```

Additionally, whenever we call restart (the hero dies, or the game advances to the next level), we pass `this.bgMusicPlaying` to ensure that we don't add another layer of music if it's already playing.
```js
this.game.state.restart(true, false, { level: this.level, bgMusicPlaying: this.bgMusicPlaying});
```

Finally, when the game is over, we transition to the win state, so we want to ensure that the music stops playing before we move on. We do this by checking if the next level is the last level, and if it is, pause the music.

```js
PlayState._nextLevel = function(){
    if (this.hero.dying) {
        this.game.state.restart(true, false, { level: this.level, bgMusicPlaying: this.bgMusicPlaying});
    }
    else if (this.level + 1 == LEVEL_COUNT) {
        this.fade();
        this.music.pause();
    }
    else {
        this.game.state.restart(true, false, { level: this.level + 1, bgMusicPlaying: this.bgMusicPlaying});
    }
};
```

### Win State Music

Lastly, we add music to the game for when the player has finished the game. It involves the same steps we've already gone over, but repetition never hurts so I'll state the steps again!


Load the asset in `preload`
```js
WinState.preload = function () {
    this.game.load.audio('music', 'audio/win-music.wav')
        ...
}
```

Add the audio to the game in `create` and set it to play on loop
```js
WinState.create = function () {
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    this.music.play();
        ...
}
```

Pause the music when moving to another state
```js
WinState.restart = function () {
    this.game.state.start('menu');
    this.music.pause();
}
```

## Summary

And there we have it! Each state in the game now has background music 😃 You can check it out yourself [here](https://janessatran.github.io/html5game/).  If you have any suggestions or questions, feel free to reach out! Thanks for reading!
