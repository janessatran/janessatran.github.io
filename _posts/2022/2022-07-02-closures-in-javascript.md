---
layout: post
title: Understanding Closures
author: Janessa
date: 2022-07-02
tags: [javascript]
---

If you were to ask me last week about closures in JavaScript...

<img src="https://miro.medium.com/max/1200/1*UDzgsQXxvWyJ0NQ8xp27ZA.jpeg" />

But today is not last week, and today, we are learning about how closures work!

## What is a Closure?

To start, what even is a closure?

A closure is an inner function that has access to variables and parameters of its outer function, _even after the outer function has returned._

Simple enough! But why do we care?

## When is a Closure useful?

Closures are useful to create private variables or functions in JavaScript.

Consider this example where we have some private variable and function that we want to be able to maniuplate/use but not have publicly accessible.

```javascript
let counter = (() => {
  let privateCounter = 0;

  const changeBy = (value) => {
    // this is a closure
    privateCounter += value;
  };

  return {
    increment: () => changeBy(1),
    decrement: () => changeBy(-1),
    value: () => privateCounter,
  };
})();

console.log(counter.value());
counter.increment();
counter.increment();
console.log(counter.value());
counter.decrement();
console.log(counter.value());
```

The variable `privateCounter` and function `changeBy()` are private, but `increment()`, `decrement()`, and `value()` are public because we've returned them from our counter function.

> 📝 The example above is a **named immediately-invoked function**. As the name describes, these are functions that are immediately invoked. They are useful because they don't pollute the global object. In other words, you don't create more variables that are globally accessible than necessary.

## How do Closures work?

It's important to understand a few _other_ concepts when understanding how closures work.

A **Lexical Environment** is a map between identifiers (local variable names) and values. It's part of every execution context (the state of the stack frame).

Every function in JavaScript maintains reference to its outer lexical environment. This enables code inside a function to "see" variables declared outside the function, regardless of when it's called.

When a function is called by another function, it creates a chain of environments called a scope chain. Let's look at an example to see how it works.

```javascript
let globalVar = "global";

function outer() {
  let outerVar = "outer";

  function inner() {
    let innerVar = "inner";

    console.log(innerVar); // prints 'inner'
    console.log(outerVar); // prints 'outer'
    console.log(globalVar); // prints 'global'
  }

  console.log(globalVar); // prints 'global'
  console.log(outerVar); // prints 'outer'
  inner();
}

outer();
console.log(outerVar); // prints 'global'
```

The `inner` function can access the variables in it's own scope, the `outer` function's scope, as well as the global scope.
The `outer` function can access variables defined in it's own scope and the global scope.

The lexical scope looks like this:

```javascript
Global {
  outer {
    inner
  }
}
```

Relating this back to our `counter()` example above, because of JavaScript's lexical scoping, the three public functions `increment()`, `decrement()`, and `value()` (which share the same lexical environment) each have access to `privateCounter` and `changeBy()`. These functions can remember the variables from the place where it was defined (within the `counter()` function), no matter where it is executed. So when we call `counter.increment()` later on, this closure still has access to the `privateCounter` within it's lexical scope!

## How do closures get used in real life?

The encapsulation that closures provide can come in handy with keeping private information secure.

Take this example with authorizing acess to an API based on an auth key:

```javascript
const api = () => {
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

  let requestAuthorization = (key) => {
    checkAuthKey(key);
  };

  return {
    requestAuthorization,
  };
};

let a = api();
a.requestAuthorization("test"); // Invalid authorization
a.requestAuthorization("authKey"); // Authorizing access
```

We can keep the `authKey` private within our `api()` while still checking for authorization!

## Circling back

Does it make sense now? I hope so! All in all, closures enable us associate the lexical environment to a function that we can then call later, to manipulate things within that lexical environment. One of the ways this is useful is that we can emulate private methods/variables which is useful to restrict access to code and also manage our global namespace!

I started with a meme, so it feels only right to end with one.

<center>
	<img src="https://i.imgur.com/KGgYGks.jpg" style="margin: 0 auto;" />
</center>
