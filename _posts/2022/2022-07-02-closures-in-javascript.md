---
layout: post
title: Understanding Closures
author: Janessa
date: 2022-07-02
tags: [javascript]
---

If you were to ask me last week about closures in JavaScript...

<img src="https://miro.medium.com/max/1200/1*UDzgsQXxvWyJ0NQ8xp27ZA.jpeg" />

Let's change that!

## What is a Closure?

A closure is a function that remembers its outer variables and can access them.

How?

Functions remember where they were created using a hidden `[[Environment]]` property (aka the lexical environment), and then their code can access outer variables.

When a variable is updated, it's updated in the Lexical Environment where it lives. This is how we're able to update variables within a function from outside of it!

Let's take a look at how this works with an example.

## Example please!

Open up the inspector and run this in the console.

```javascript
function makeCounter() {
  let count = 0;
  return function () {
    return count++;
  };
}
```

If we call the outer function, it will just call the inner function.

Enter this into the console and you will see, `makeCounter()`:

```
makeCounter()
ƒ () {
  return count++;
}
```

Calling `makeCounter()` increments the `count` variable, but `count` isn't within the scope of the inner function. What happens then? When the code wants to access a variable, the inner lexical environment is searched first, then the outer one, then the more outer one, until it reaches the global one.

The lexical environment of the outer function includes `count`, so the innter function will access `count` through there.

```javascript
let counter = makeCounter();
counter(); // 0
counter(); // 1
counter(); // 2
counter(); // 3
```

### How is this useful?

This is useful to encapsulate private information. For example, let's say we have an API that requires authorization.

```javascript
function authChecker() {
  const authKey = "authKey"; // lets say this is encrypted
  let authorize = () => {
    console.log("Authorizing access");
  };

  let checkAuthKey = (key) => {
    if (key === authKey) {
      authorize();
    } else {
      console.log("Invalid authorization key");
    }
  };

  let validateRequest = (key) => {
    checkAuthKey(key);
  };

  return { validateRequest };
}
let a = authChecker();
a.validateRequest("test"); // Invalid authorization
a.validateRequest("authKey"); // Authorizing access
```

We want to be able to access the `authKey` when we call `validateRequest()`, but not have that variable public. This can be resolved by using closure functions!

### Circling back

All in all, closures are inner functions with access to the variables/params of the outer function, even after the outer function is closed.

Closure functions are able to access this data after the outer function is closed because of it’s lexical environment, which has references to it’s outer lexical environment.

This is useful for several reasons including keeping sensitive information private.

<center>
	<img src="https://i.imgur.com/KGgYGks.jpg" style="margin: 0 auto;" />
</center>
