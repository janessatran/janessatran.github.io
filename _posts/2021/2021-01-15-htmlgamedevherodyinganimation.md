---
layout: post
title: Animating the Hero's Death
author: Janessa
date: 2021-01-15
tags: [Game Dev]
category: Tech
---

*This is the fifth post in my series on learning html game development. You can find the other posts [here](https://www.janessatran.com/tags/#game-dev)!*


This next section is going to cover how to add an animation that plays when the hero, Leat, dies by running into a spider.  Previous to this feature addition, running into a spider simply caused the level to reload. It's clear from the level-reload that something went wrong, but adding in an animation *before* that happens also clarifies that touching spiders is bad (at least in this game... and personally I would argue in real life but maybe I just really don't like spiders). If you're interested in how to add this feature to your game, just keep reading!

## Adding an animation to the Hero Sprite

To add an animation, we use the [add](https://phaser.io/docs/2.6.2/Phaser.AnimationManager.html#add) method from `Phaser.Animation`:

```js
add(name, frames, frameRate, loop, useNumericIndex) → {Phaser.Animation}
```

The `add()` method includes 5 arguments:

- **name**: unique identifier for animation sequence
- **frames**: an array of which tiles to use in the sprite sheet (image of sprite sheet below)
- **frameRate:** the frames per second rate for the animation
- **loop:** boolean identifying whether it should loop or just play once (defaults to false)
- **userNumericIndex:** boolean specifying if frames are given in numeric indexes or strings (default true)


<center>
    <div style="max-width:300px;margin:50px">
        <img src="https://i.imgur.com/SGRvvLx.png" alt="Sprite sheet of hero"><br><br>
        <caption>Pictured above is the Hero sprite sheet. For the dying animation, I chose to make use of the 5th and 6th tiles in this sprite sheet of the hero (indexed as 4 and 5 in the frames array).</caption>
    </div>
</center>


We implement this method in the constructor for the Hero Sprite, along with the other animations we already have.  We also create a variable to keep track of whether or not the player is dying, `this.dying`, to determine when to play the animation.

```js
function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.dying = false;
      ...
    this.animations.add('die', [5,4,5,4,5,4,5,4,5,4], 8)
}
```


The Hero dies when it touches a spider. We already have a method, `PlayState._onHeroVsEnemy` which handles this event, but we need to update it to call a new method we will create in the `Hero` class, which handles what happens when it dies.

This new method, `Hero.prototype.die` does a few things:

- disable physics operations on the sprite body
- set `this.dying` to true
- play the dying animation, and when the animation is complete, kill the hero.


```js
Hero.prototype.die = function () {
  // this removes the sprite from physics operations, so its not taken into account for collissions
    this.body.enable = false;
    this.dying = true;
    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
}
```

One new thing here is the use of the `onComplete` method, available through `Phaser.Signal`. It essentially executes the code defined within the function block when the animation completes.  This is perfect for our needs because we want to wait until the animation finishes before we kill the hero!

> [onComplete](https://phaser.io/docs/2.6.2/Phaser.Animation.html#onComplete): [Phaser.Signal]
>
> This event is dispatched when this Animation completes playback. If the animation is set to loop this is never fired, listen for onLoop instead.

As mentioned earlier, we call this new method when the hero touches a spider. To add this, alter `PlayState._onHeroVsEnemy` in the following ways:

- call `hero.die()`
- call time event to add a delay before next level loads, ensuring the animation plays through completely before loading the level

```js
PlayState._onHeroVsEnemy = function (hero, enemy) {
    // kill enemies when hero is falling aka stomping on the spider
    if (hero.body.velocity.y > 0) {
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();
    } else {
        // game over
        hero.die();
        this.sfx.stomp.play();
        this.game.time.events.add(500, this._nextLevel, this);
    }
}
```

The `time.events.add()` function is available through `Phaser.timer` and allows us to define an amount of time before an event occurs, in this case, loading the next level. You can read more about it [here]([https://phaser.io/docs/2.6.2/Phaser.Timer.html#add](https://phaser.io/docs/2.6.2/Phaser.Timer.html#add)).


## Modifying the update function
There is one more thing we need to update to ensure that the dying animation works properly. In the Hero class, we have a method `update` which gets called automatically by Phaser every frame.

> [update()](https://phaser.io/docs/2.6.2/Phaser.Sprite.html#update)
>
> Override this method in your own custom objects to handle any update requirements.
> It is called immediately after `preUpdate` and before `postUpdate`. Remember if this Game Object has any children you should call update on those too.

In the `update` method, we check which animation to play based on various conditions. This is all handled in another method called `_getAnimationName`.

```js
Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName)
    }
}
```

To add the dying animation, we update the method to set the animation name to `die` if `this.dying = true`.

```js
Hero.prototype._getAnimationName = function() {
    let name = 'stop'; // default animation

    if (this.dying) {
        name = 'die';
    }
    else if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling - y velocity is positive; not touching platform
    else if ( this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }
    return name;
}
```

### An Animated Death

Now when it's all put together, the hero does a sad dance before it ultimately dies and the level is reloaded.

<img src="https://i.imgur.com/C8fWxYY.gif" alt="A hero touches a spider and has a small seizure before dying">

Again, thanks for reading! Hope this helps you out.

- **Source code**: [Add hero dying animation (and experimental lose state)](https://github.com/janessatran/html5game/commit/2d818adcd358a5afa800e3f5c7f064707bb7ce84); [Add time event to improve death animation viewing](https://github.com/janessatran/html5game/commit/78fcdc69c6aaa19d45f799575a2c6f1dc19f35a8)
- **Link to game**: [Adventures of Leat](https://janessatran.github.io/html5game/)
