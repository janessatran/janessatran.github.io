---
layout: post
title: 100 Days Of Code (round 2) - Log
author: Janessa
date: 2022-07-17
tags: [100DaysOfCode]
---

## Day 1: July 17, 2022

**Today's Progress**: I read Chapter 7 of [Just JavaScript](https://justjavascript.com/), learning about Equality of Values. I also started learning how to use Inkscape as well as how to animate SVGs with JavaScript and CSS.

**Thoughts**: I really enjoy how interactive the reading is with Just JavaScript. Also, I can't help but notice how JS has so many quirks. For example, today I learned about the strict equality operator's special cases where `NaN === NaN` returns false and `0 === -0` returns true. What?!

Learning InkScape was not too difficult and pretty fun. I made a bat and I was prett happy with how it turned out. It's relatively easy to look things up for InkScape! The codepen I created was complaining about the SVG not being real HTML, and I learned it's because I had exported the image as an InkScape SVG instead of plain SVG, meaning it includes a few properties that are specific to InkScape and technically not HTML. I ended up keeping it as an InkScape SVG because without that type of export, the image didn't include the namespaces I was querying off of to select the pupils. I know I could add some selector classes off the plain SVG, but the effort was pretty manual so maybe I'll just do that next time 😆

**Link to work**: My notes are private, but the codepen is [here](https://codepen.io/janessatran/pen/dymNgBQ).

## Day 2: July 18, 2022

**Today's Progress**: Lots of reading today. I read Chapter 8 of [Just JavaScript](https://justjavascript.com/), about Properties. Also read [Fallacies of Distributed Systems](https://architecturenotes.co/fallacies-of-distributed-systems/) and [Things You Should Know About Databases](https://architecturenotes.co/things-you-should-know-about-databases/)

**Thoughts**: Not a ton of time to get into coding work but reading is still something!

The chapter on properties in the Just JavaScript book was really insightful in helping me realize the mental model I have around objects and properties. Again, I highly recommend this book! It's super interactive and helps you understand how you understand things, and helps you realize when your understanding of things might be a little wrong.

I enjoy how the Architecture Notes blog has a lot of visuals to supplement the articles. Sometimes I find the writing style a bit round-a-bout and distracting, but I learned a lot from it so far so that's what matters!

**Link to work**: No links

## Day 3: July 19, 2022

**Today's Progress**: Read about Mutations in Chapter 9 of [Just JavaScript](https://justjavascript.com/). I also started going through a tutorial to learn about WebRTC, which stands for Web Real-Time Communication and is a technology that allows you to stream audio/video media between browsers without an intermediary!

**Thoughts**: The mutations chapter felt super reptitive, because it was really similar to the last chapter about properties. Nonetheless, the practice of drawing out how each line of code is visually represented was actually _super_ helpful. While I was very tempted to skip all the drawings, I am glad I stuck it through and completed the chapter because it seems to be helping me cement a more solid understanding of how properties and changing values of properties/objects works in the JS universe!

As for the WebRTC tutorial, I haven't gotten very far yet but I have learned a bit about WebRTC and how it works! I also learned a few new postgres commands and a bit more about databases!

**Link to work**: No links, maybe soon once I go through the WebRTC application tutorial 😃

## Day 4: July 20, 2022

**Today's Progress**: Read about Prototypes in the FINAL CHAPTER of [Just JavaScript](https://justjavascript.com/).

**Thoughts**: I wish there was more to read/learn from Just JavaScript! I learned about prototypes, the prototype chain, and plan on revisiting my notes just to better cement the learnings in my brain. I really enjoyed this read and I'm considering picking up a course to continue this style of structured, self-paced learning. I've often gone the route of learn-by-doing which I think has worked really great, but I also think there's something to learning from experts before you start tinkering yourself.

**Link to work**: No links

## Day 5: July 21, 2022

**Today's Progress**: Went through Part 0 of [Fullstack Open 2022](https://fullstackopen.com/en/)

**Thoughts**: Part 0 was just about the fundamentals of web apps. Even though a lot of the information was familiar/known, I did learn a few things (like various buttons/features in the developer console)! So far I like how it's a mixture of reading and then applying the new information through some sort of activity. In this case, it was creating sequence diagrams for various actions on different types of web apps. I am curious to see if I get feedback on whether or not I did the exercises correctly (you submit your answers in a repo). I guess we will see!

**Link to work**: I'm adding the solutions to exercises in [this repo](https://github.com/janessatran/fullstack-course)

## Day 4: July 20, 2022

**Today's Progress**: Read about Prototypes in the FINAL CHAPTER of [Just JavaScript](https://justjavascript.com/).

**Thoughts**: I wish there was more to read/learn from Just JavaScript! I learned about prototypes, the prototype chain, and plan on revisiting my notes just to better cement the learnings in my brain. I really enjoyed this read and I'm considering picking up a course to continue this style of structured, self-paced learning. I've often gone the route of learn-by-doing which I think has worked really great, but I also think there's something to learning from experts before you start tinkering yourself.

**Link to work**: No links

## Day 6: July 22, 2022

**Today's Progress**: Went through Part 1a and 1b of [Fullstack Open 2022](https://fullstackopen.com/en/)

**Thoughts**: Part 1a and Part 1b consisted of an introduction to React and an introduction to JavaScript. It was mostly overview for me at this point, but still useful to concretize the information in my brain I suppose!

Also I plan on taking a break this weekend to celebrate another year around the sun! :)

**Link to work**: I've stored solutions to exercises in the various parts by commit [here](https://github.com/janessatran/fullstack-course)

## Day 7: July 25, 2022

**Today's Progress**: Went through Part 1c of [Fullstack Open 2022](https://fullstackopen.com/en/)

**Thoughts**: A lot of this is review material because it covered component states and event handlers. It was a little boring because it's all review.

**Link to work**: No links

## Day 8: July 26, 2022

**Today's Progress**: Started learning more about GraphQL by creating a new app with remix and vendure.

**Thoughts**: I read through [this article about GraphQL fundamentals](https://dev.to/michlbrmly/graphql-fundamentals-hands-on-30lk) and started up a storefront app using [Vendure](https://www.vendure.io/) and [this Remix storefront starter](https://github.com/vendure-ecommerce/storefront-remix-starter). I'm starting to gain familiarity with how to write queries, but still have a lot to learn because I don't really understand how to use the queries to load the data where I need it. I'm planning to read through [this article about Remix with Apollo GraphQL](https://layercode.com/community/remix-apollo-graphql) tomorrow. Hopefully it clears up some of my confusion! I'm trying to do something seemingly simple at the moment: query for a collection via name and use the assets within that collection to load on the homepage. Wish me luck!!

**Link to work**: Nothing pushed up yet, so no links!

## Day 9: July 27, 2022

**Today's Progress**: Completed the tutorial [Odyssey's Lift-Off Part 1 on GraphQL](https://www.apollographql.com/tutorials/) and read about Remix + Apollo GraphQL.

**Thoughts**: I read [the article about Remix + Apollo GraphQL](https://layercode.com/community/remix-apollo-graphql) that I had mentioned yesterday, but was still unsuccessful in undersatnding the GraphQL wrapper class in the Remix storefront starter. There's a lot of things in this tech stack that I'm unfamiliar with so I decided I should probably learn to walk before I try to run. 😂 As a result, I stumbled upon a tutorial to learn GraphQL and went through the first part to learn the basics. It was actually super super useful!! And it feels like a win from yesterday because I was going down a rabbit hole of trying to make an entire app with a new stack and I didn't even really understand the underlying bits. Well. You live and you learn. I'm learning!!!

**Link to work**: I forked the repo that I'm working through in the learning path. It can be found [here](https://github.com/janessatran/odyssey-lift-off-part1) if you are so inclined to look into it!

## Day 10: July 28, 2022

**Today's Progress**: Started going through part 2 of the tutorial about GraphQL.

**Thoughts**: Didn't have as much time today to study but started learning about the journey of a GraphQL query from the client, to server, and back to the client. Learned some details about how the server converts the query string into an abstract syntax tree, and about resolver functions which populate data for each field in the schema.

**Link to work**: No links

## Day 11: July 29, 2022

**Today's Progress**: Finished part 2 of the GraphQL tutorial, learning about Resolvers. Also completed part 3, learning about arguments in queries.

**Thoughts**: Now that I know more about resolvers and arguments, I'd like to try to go through the storefront code with the graphql wrapper (from previous days) to see if I can better understand the code. It's pretty late here now though so I'm going to go to bed and will hopefully get to that this weekend!

**Link to work**:

- [Repo for part 2, about resolvers](https://github.com/janessatran/odyssey-lift-off-part2).
- [Repo for part 3, about arguments](https://github.com/janessatran/odyssey-lift-off-part3)

## Day 12: July 30, 2022

**Today's Progress**: Took a break from the GraphQL tutorial to go back to the storefront app to see if I could get it to work. I did! I set up a new private repo with the server, client, and a somewhat detailed README to get things set up.

**Thoughts**: I was able to figure out how to set up the stripe integration for the app and to get the assets I wanted loaded on the homepage. It helped a lot that I learned a bit about GraphQL before attempting to work in this stack. I also got some help from my sister (which if you are reading this, thank you sister!!).

**Link to work**: No links, it's private for now until it gets to a place that is ready to be shared!
