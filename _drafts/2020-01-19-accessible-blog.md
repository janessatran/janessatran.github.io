---
layout: post
title: New Year, New The(me)
date: 2020-01-19
tags: [Post]
categories: learning_log
---

# Hello, 2020! Switching things up in this new decade
I have a habit of changing up my theme quite a bit, if you haven't already noticed. If you knew me in real life, this would come as no surprise. I often rearrange my spaces (apartment, desk setup), change my phone screens seasonally (I actually really look forward to this), and on the worst days will change my outfits three times before leaving the house! (Jeez...). I think this theme will be around for a bit, though. It's clean, it's functional, and most importantly... IT HAS SOME *ACCESSIBILITY FEATURES INTEGRATED*!! I'm really excited about it. I really am!!

# Accessible features of my new theme
If you're unfamiliar with the concept of accessible web design, it's essentially about addressing the issues of creating websites that are accessible (usable) for users despite how that user accesses the internet. You can [read more about web accessibility here](https://www.w3.org/WAI/fundamentals/accessibility-intro/) if you are interested in learning more! 

I'm quite new to learning about accessibility, but thought what better way to start learning than to try to integrate accessible features myself right? Right! I'm a learn-by-doing kind of person, which is why I created this theme, [Laloyd](https://github.com/janessatran/laloyd), which enabled me to put into practice some of the things I have learned so far about accessibility.  What **things** in particular, you ask? 

## Semantic HTML
In creating Laloyd, I employed the practice of writing structural, semantic HTML. Semantic HTML means using the proper HTML elements for their correct purpose. A **semantic element** clearly describes meaning to the browser and developer. For example: `<form>`, `<nav>`, and `<article>`, are **semantic elements** that clearly define it's contents. On the other hand, `<div>`, and `<span>`, are **non-semantic elements** because they tell us nothing about the content within them. 

### Using Elements As Intended
In practicing writing semantic HTML, it's encouraged to use elements such as `<div>` and `<span>` for layout purposes only, and to never use these kinds of elements in place of a more semantically meaningful one (like using styled `<div>` as a button instead of just using `<button>`.) Assistive technology such as screen-readers benefit from semantic HTML because it gives the user context of the page contents when read allowed. With the button example mentioned, a screen-reader would gain much more meaning from a `<button>` element because they would understand it's interactable, as opposed to if it were identified as a `<div>` which is not. 

In creating this theme, I used semantic markup in creating the navigation by:
- Wrapping the navigation items in a `<nav>` element.
- Using an unordered list `<ul>` to convey that the menu items are not in a specific order.

### Using Heading Tags in Meaningful Order
Another part of writing semantic HTML involves using heading tags in an order that correctly shows the document structure and relationship between different parts of of the page. This means that `<h1>` should be used for main headings, followed by `<h2>` and so on. 

This bit mostly is up to the user of the theme, since headings are often created in the content of the post.

### Adding Titles to Anchor Tags
Another way to make a website more accessible is by adding titles to anchor tags `<a href="" title="Where it goes to">`. The `title` attribute specifices extra information and often shows a tooltip text when the mouse moves over the element. 

In this theme, I added tags to anchor tags to indicate where the link would redirect the user to. 


## Skip Links

## High Contrast Colors and Syntax Highlighting

## Focus States
