---
layout: post
title: Adding the Ability to High Jump
author: Janessa
date: 2021-01-14
tags: [Game Dev]
category: Tech
---

*Psst! This is the fourth post in my series on learning html game development. You can find the other posts [here](https://www.janessatran.com/tags/#game-dev)!*


This next section is going to cover how I added the ability to "high jump" (or fly, because you can technically continue to stay in the air 😂) into the game. This was probably one of the trickier features for me to figure out how to implement, partially due to my lack of experience with playing games and not knowing what a "high jump" even is. Nevertheless... let's get into how to add this feature!

## Enabling Flappy Bird Mode

In this game, a "high jump" is essentially having the ability to jump while you are already jumping. Theoretically, this means you can continuously jump while already "jumping", emulating a flappy-bird-like flying motion. Jumping is initiated when the user presses the up-arrow key. In order to add a "high jump", then, we need to check if the player is already jumping to boost it.

We can do this by making use of a method called `downDuration` from  `Phaser.Key`.

This method takes a parameter to define the duration within which a key is considered to have just been pressed. For example, if we pass in `downDuration(200)`, it will check if the last key pressed was less than 200 ms ago, if so, return true.

<img src="https://i.imgur.com/YiTcmet.png" alt="Image of Phaser Docs">
Source: [https://phaser.io/docs/2.6.2/Phaser.Key.html#duration](https://phaser.io/docs/2.6.2/Phaser.Key.html#duration)

We can use this to check whether or not the additional jump (resulting from pressing the "up" key again after already having pressed it), was done within a short enough time frame that we can make the sprite "high jump".

We've already defined the signal event in `PlayState.init()` so we can modify it to add in this feature:

```js
PlayState.init = function (data) {
   ...
    // Subscribe key to signal (event)
    const JUMP_HOLD = 200;
    this.keys.up.onDown.add(function () {
        if (this.keys.up.downDuration(JUMP_HOLD)) {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        }
        else {
            this.hero.stopHighJump();
        }
    }, this)
    ...
};
```

We also modify the `Hero` class `jump` method, which previously set the y-velocity only if `canJump` was true (when the body of the sprite is touching the platform sprites).

The modification involves making it so that if `this.highJumping` is true, it will *also* set the y velocity.

*Note:* *a negative velocity means the sprite will move in the opposite direction.*

```js
Hero.prototype.jump = function () {
    const JUMP_SPEED = 400;
    let canJump = this.body.touching.down; // check if a body is touching another body
    if (canJump || this.highJumping) {
        this.body.velocity.y = -JUMP_SPEED;
        this.highJumping = true;
    }
    return canJump;
}
```

Lastly, we want to ensure that the high jump only works if the body is already jumping. If it's not already jumping (which we know from our signal event on the up-arrow key), we want to stop the high jump.

We create a method `stopHighJump` that we call in the initialization of our `PlayState` to set `highJumping` to false, preventing the body from continuously increasing in velocity:


```js
Hero.prototype.stopHighJump = function () {
    this.highJumping = false;
}
```

## Jump-tastic!

There you have it, the ability to high jump! Let me know if you are able to win the game without collecting any coins or killing any spiders 😉

- **Source code**: [Add high jump ability commit](https://github.com/janessatran/html5game/commit/17ffabc93a08845db41fa84be25380a906f71f7b)
- **Link to game**: [Adventures of Leat](https://janessatran.github.io/html5game/)

