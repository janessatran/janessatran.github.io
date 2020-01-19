---
layout: post
title: New Year, New The(me)
date: 2020-01-19
tags: [Post]
categories: learning_log
---

I have a habit of changing up my theme quite a bit, if you haven't already noticed. If you knew me in real life, this would come as no surprise. I often rearrange my spaces (apartment, desk setup), change my phone screens seasonally (I actually really look forward to this), and on the worst days will change my outfits three times before leaving the house! (Jeez...). I think this theme will be around for a bit, though. It's clean, it's functional, and most importantly... IT HAS SOME *ACCESSIBILITY FEATURES INTEGRATED*!! I'm really excited about it. I really am!!

# Accessible features of my new theme
If you're unfamiliar with the concept of accessible web design, it's essentially about addressing the issues of creating websites that are accessible (usable) for users despite how that user accesses the internet. You can [read more about web accessibility here](https://www.w3.org/WAI/fundamentals/accessibility-intro/) if you are interested in learning more!

I'm quite new to learning about accessibility, but thought what better way to start learning than to try to integrate accessible features myself right? Right! I'm a learn-by-doing kind of person, which is why I created this theme, [Laloyd](https://github.com/janessatran/laloyd), which enabled me to put into practice some of the things I have learned so far about accessibility.  What **things** in particular? I'm glad you asked!

## Semantic HTML
In creating Laloyd, I employed the practice of writing structural, semantic HTML. Semantic HTML means using the proper HTML elements for their correct purpose. A **semantic element** clearly describes meaning to the browser and developer. For example: `<form>`, `<nav>`, and `<article>`, are **semantic elements** that clearly define it's contents in that you can expect what is within them. On the other hand, `<div>`, and `<span>`, are **non-semantic elements** because they tell us nothing about what content might lie within.

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

In this theme, I added titles to anchor tags to indicate where the link would redirect the user to.

<figure>
  <img src="/assets/photos/title_attribute_anchors.png" alt="Example of title attribute on anchor tag">
  <figcaption>Example of tooltip provided by defined "title" attributes in anchor elements. </figcaption>
</figure>

## Skip Links
Additionally, web design focused on accessibility considers that a user may navigate through a webpage in different ways such as with a mouse, keyboard, or screen-reader. Sighted users navigating through a web page with a mouse often scroll through the page to get to the main content, but users navigating through the keyboard or screen-reader will have to tab through a lot of content before getting to the actual text of the page. To alleviate this issue, the "skip link" was invented to enable users to skip to the main content of the page.

In this theme, I added a hidden skip link that becomes visible when the link is focused. This provides a shorcute for users who want to just skip to the main content, making the website easier and quicker for users (especially those with disabilities).

<figure>
  <img src="/assets/photos/skip_link.gif" alt="Example of skip link">
  <figcaption>Example of "Skip to main content link".</figcaption>
</figure>

## High Contrast Colors and Syntax Highlighting
Color contrast is another important aspect of web accessibility, but it is also significant for scenarios of low-light environments, old screens, and visual impairment. The Web Content Accessibility Guidelines outlines the following conditions for color accessibility:
- 4.5:1 contrast between the non-link text color and the background.
- A 4.5:1 contrast between the link text color and the background.
- A 3:1 contrast between the link text color and the surrounding non-link text color.

In creating this theme, I used [this tool, ColorSafe](http://colorsafe.co/) to ensure the colors were up to these guidelines. I also selected a syntax highlighter from [this list of accessible syntax highlights](https://github.com/mpchadwick/pygments-high-contrast-stylesheets).

## Focus States
**Focus states** apply to interactive components of a website and communicates when a user has highlighted an element using a keyboard or voice. They are important because they can indicate to the use where they are on the page. Most browsers show focus states, but some are easier to see than others.

In this theme, I used the `:focus` selector in CSS to define a style change that happens when an element has focus.

```css
a:hover, a:focus {
  color: #ff0000;
  background: linear-gradient(to bottom, transparent 0%, transparent 0%, #ffe0e0 0%, #ffe0e0 100%);
}

```

# Conclusion
In creating this theme, I've found that integrating accessible features can begin with just a few small changes in the ways we write / design websites. While there are definitely many more ways I can improve [Laloyd](https://github.com/janessatran/laloyd) to make it more accessible, I hope that these few considerations makes any impact at all for user accessibility. I learned a lot in this exercise to create an accessible theme, and I hope you learned something from this write-up too.
