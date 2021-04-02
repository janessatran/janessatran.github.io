---
layout: post
title: Adding a door animation and camera fade
author: Janessa
date: 2021-01-16
tags: [Game Dev]
category: Tech
---

*This is the sixth post in my series on learning html game development. You can find the other posts [here](https://www.janessatran.com/tags/#game-dev)!*

This post brings us to an end of my series on adding features to Adventures of Leat. The final features I will discuss include an animation effect I added to when Leat enters a door with a key, as well as a camera fade that occurs when transitioning to the  win screen. As always, if you're interested in learning how I implemented these features, just keep reading!

## Subtle Animations to Improve Realism

Outside the land where Leat lives, when you open a door you have to actually go through the door before you enter into a new space. In the game, I emanate this illusion of realism by adding an animation which turns the door black while Leat walks through.  

The parts of the code that are relevant for implementing this functionality include the door sprite, which is loaded in the `PlayState` class as `this.door` , as well as the method which handles the event `PlayState._onHeroVsDoor`. 

First, we want to add an animation to our door sprite. In `PlayState.create` we add:

```js
this.door.animations.add('open', [1,2], 8)
```

The arguments provided in this line of code do the following:

- `open`: the unique name which we will use to reference the animation when we want to play it
- `[1,2]`: the frames we will play from the sprite sheet (pictured below)
- `8`: the rate in frames per second we will play the animation frames


<center><img src="https://i.imgur.com/MGkFN8t.png" alt="sprite sheet of door"></center>

Next, we will modify the event handler `PlayState._onHeroVsDoor` to play the animation and add a time event which allows the entire animation to play before loading the next level by adding a delay.

```js
PlayState._onHeroVsDoor = function (hero, door) {
     this.door.animations.play('open')
     this.game.time.events.add(100, this._nextLevel, this);
 }
```

That's it! Now, when Leat enters the door with a key, the open door animation will play and make it look like they are actually going through the door 😃

<center><img src="https://i.imgur.com/1Af2fQ2.gif" alt="door entering animation effect"></center>

## Savoring Victory

> "Savoring is the capacity to notice, appreciate and intensify the positive aspects of our lives."

Before ending the game and displaying the win screen, I wanted to add a way to enable the player to intentionally savor the moment of completing the game. In order to create this, I added a camera effect which fades the screen black before it eventually fades back to normal on the Win Screen. 

To add this, we make use of `game.camera` which is automatically created when we initiatialize our `game` object. The camera is the view into our world. I'll include a description from the Phaser documentation itself, as I think the description is pretty good.

<center><img src="https://i.imgur.com/8qOG4aK.png" alt="screenshot of Phaser camera documentation"></center>

[https://phaser.io/docs/2.6.2/Phaser.Camera.html](https://phaser.io/docs/2.6.2/Phaser.Camera.html)


There are a few things we will need to add in order to implement the camera fade effect, so I will summarize them before jumping into the code. We will need:

- a new function `PlayState.fade` which will execute the camera fading
- a new function `PlayState.transitionToWinState` which will handle the change in state to the win state
- a modification to `PlayState.create` to handle the fade completion
- a modification to `PlayState._nextLevel` to call our fade function if the player has completed all the levels

To create a fade effect, we use the `fade` function and specify the color and duration of the fade in milliseconds. 

```js
PlayState.fade = function () {
     this.game.camera.fade(0x000000, 2000);
}
```

We also want to set up a handler for what happens after the fade completes, which in this instance is to transition to the Win State. Within `Phaser.Camera` is an event handler method called `onFadeComplete` which we will use. In `Phaser.create`, we set this up with this line of code:

```js
Phaser.create = function () {
     ...
     this.game.camera.onFadeComplete.add(this.transitionToWinState, this);
     ...
}
```

This means we also need to set up our event handler for transitioning to the Win State! 

```js
PlayState.transitionToWinState = function () {
     this.game.state.start('win', true, false, { coins: this.coinPickupCount})
}
```

Lastly, we need to set up the call to fade the camera when the player is on the final level. This is handled in `PlayState._nextLevel`, so we will modify the conditional to call `this.fade()`.

```js
PlayState._nextLevel = function(){
    if (this.hero.dying) {
        this.game.state.restart(true, false, { level: this.level, bgMusicPlaying: this.bgMusicPlaying});
    }
    else if (this.level + 1 == LEVEL_COUNT) {
	      // last level, make camera fade before transitioning!
        this.fade();
        this.music.pause();
    }
    else {
        this.game.state.restart(true, false, { level: this.level + 1, bgMusicPlaying: this.bgMusicPlaying});
    }
};
```


And it looks like...

<center><img src="https://i.imgur.com/G1QUHLw.gif" alt="camera fade effect turning screen black before showing win screen"></center>

## That's a wrap!

If you've been following me along on my HTML Game Dev learning experience, thanks a bunch! I hope you found some value in this posts and if you've played my game, I hope you had fun!!

- **Source code**: [Add door animation](https://github.com/janessatran/html5game/commit/78fcdc69c6aaa19d45f799575a2c6f1dc19f35a8); [Add camera fade effect](https://github.com/janessatran/html5game/commit/98d7316d3d8c0fa63fb2d887c0f2e2ae46a134aa)
- **Link to game**: [Adventures of Leat](https://janessatran.github.io/html5game/)
