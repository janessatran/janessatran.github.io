---
layout: post
title: Sprucing up the Win Screen
author: Janessa
date: 2021-01-11
tags: [Game Dev]
category: Techß
---


If you've been following me along my journey of learning html game development, you know that I have been working on implementing additional features to my game [Adventures of Leat](https://janessatran.github.io/html5game). In this post, I will explain how I spruced up the Win State page using sprite sheet animations!

*If you haven't been following along or just have no idea what I am talking about, you can read the first part of this GameDev blog series in my [original post about learning game development]([https://www.janessatran.com/htmlgamedevelopment/](https://www.janessatran.com/htmlgamedevelopment/))*

## What do you mean by "sprucing up"?

If you play the game, you go around avoiding spiders, collecting keys to open doors, and collecting coins along the way. I wanted to add some pizzazz to the win screen by showing the tally of coins Leat collects at the end of the game, ideally with an animated coin to make it more exciting!

**The object is to go from this:**

<img src="[https://i.imgur.com/Ra31dBW.png](https://i.imgur.com/Ra31dBW.png)" alt="A screen that says 'You Won' and 'Press w to restart'">

**To this:**

<img src="https://i.imgur.com/IQefoql.gif" alt="A screen that says Yay! You Won 20 coins next to an animated image of ßa spinning coin">


## Passing coin data to `WinState`

First we need to be able to pass data about the number of collected coins from our `PlayState` to our `WinState`.  We can do this by passing a JSON object with our coin data that we've stored in `PlayState.coinPickupCount` to the function call that is made when we initialize our `WinState`:

```js
// start(key, clearWorld, clearCache, parameter)
// true - keep cache
// false - don't keep existing world objects
this.game.state.start('win', true, false, { coins: this.coinPickupCount})
```

We then need to modify `WinState` to handle this information. We do this by creating an `init()` function which takes an argument we've named `data`. Inside the function, we check if `data` is defined, and if it is we set `WinState.coinPickupCount` to the value `data.coins`.

```js
WinState.init = function (data) {
    if (data != undefined) {
        this.coinPickupCount = data.coins;
    } else {
        this.coinPickupCount = 0;
    }
};
```

Now our `WinState` has the data about the number of coins collected! We will now move onto how to add the animated coin image to the screen.

## Loading the Animated Coin Image

To add the animated coin image to the screen, we modify the `WinState.preload` function to load our sprite sheet with the animated coin. A **sprite sheet** is a bitmap image file that contains several smaller graphics in a tile grid arrangement.

Our coin sprite sheet contains 4 tiles with images of the coin at different angles:

<center><img src="https://i.imgur.com/aHTMPTf.png" alt="An image of 4 coins across a one row grid that display the coin from a different angle in each tile"></center>

<br>

```js
WinState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
}
```

### Why preload the assets?

You might be wondering why we preload the assets instead of just loading them when we use them. The short answer: best practice. Usually, a game may need to load a large number of assets for a scene. It may take some time to load them all, so preloading allows you to integrate a loading bar or some indicator to the player that the game is loading. In our case we do not have a wealth of assets, but we should follow the best practices in case we do eventually expand the game to include a lot of assets!


### Adding the animations to the sprite sheet

Lastly, in our `create` function we load the sprite sheet and add it to the page.

```js
let animatedCoinIcon = this.game.add.sprite(80, 215, 'coin')
```

Then, we set the **anchor**, which sets the origin point for the animation.

```js
 animatedCoinIcon.anchor.set(0.5, 0.5)
```

Now, we define an animation sequence for our `animatedCoinIcon` using the `animations.add` function:

```js
// add(name, frames, frameRate, loop, useNumericIndex) → {Phaser.Animation}
animatedCoinIcon.animations.add('rotate', [0,1,2,1], 6, true);
```

*Documentation on the add function can be found [here](https://phaser.io/docs/2.6.2/Phaser.AnimationManager.html#add).*

Lastly, we play the animation!

```js
animatedCoinIcon.animations.play('rotate')
```

All together this looks like:

```jsx
WinState.create = function () {
    this.game.add.image(0, 0, 'background');

        // Here we load the sprite sheet, which we've named coin in our preload function
    let animatedCoinIcon = this.game.add.sprite(80, 215, 'coin')
        // Next we set the anchor, aka the origin point
    animatedCoinIcon.anchor.set(0.5, 0.5)

        // add(name, frames, frameRate, loop, useNumericIndex) → {Phaser.Animation}
    animatedCoinIcon.animations.add('rotate', [0,1,2,1], 6, true);
    animatedCoinIcon.animations.play('rotate')

    let winLabel = this.game.add.text(80, 80, 'Yay!',
        {font: '50px Arial', fill: "#760e99"});
    let coinLabel = this.game.add.text(100, 200, 'You collected ' + this.coinPickupCount + ' coins. Nice job!',
        {font: '30px Arial', fill: "#760e99"});
}
```

## Woohoo!

There you have it! We now have a spruced up win page which tells the player how many coins they collected with a neat animation to jazz things up!
