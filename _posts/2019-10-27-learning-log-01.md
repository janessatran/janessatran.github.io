---
layout: post
title: Learning Log (01)
date: 2019-10-27
tags: [Post]
categories: learning_log
---
## I get paid to write code?!
Last week was my first week working as a professional jr. software engineer and it was GREAT. I really like the people I work with, really enjoy working in Rails (I'm full-stack btw, Ruby just holds a special place in my heart ❤️), and I just love that I get to spend most of my days now thinking about code. I feel incredibly fortunate. 

Now that I am working full-time in this role, though, I've been thinking about how I will continue to go about my days of learning and improving my programming skills outside of the 9-5. I'll dive in next to what I've come up with so far.

## General Learning Goals

I'd like to improve in the following areas:

**Full-stack web development:**
 1. Ruby on Rails
 2. General front-end, including CSS and React

**General programming:**
 1. Object oriented programming (Reading POODR by Sandi Metz)?
 2. General development methodologies / best practices (Reading The Pragmatic Programmer by Andrew Hunt and Davis Thomas)
  
Currently, my plan is to continue creating side projects to understand how things get made. I don't want to focus on creating anything original because it would take me a really long time to think of something and start. Instead, I'd like to just focus on building things from scratch, learning new things, and recording the new things I learn in learning logs on this blog. I'm sharing what I'm learning on this blog *primarily* to have a log to look back on myself, but also because I think writing out what I'm learning on a public platform will encourage me to really understand what I'm learning. On that note... 

## Learning Log #01
So I started a new rails project that is essentially a photo-sharring app that enables a user to upload a picture with a caption. It uses [Cloudinary](https://cloudinary.com/) for storing pictures and [Pusher](pusher.com) to update the feed in real time. I'm hoping to integrate the [Devise](https://github.com/plataformatec/devise) gem for authentication, since my first rails app just used sessions and cookies. And I'm also hoping to create the front-end with [react-rails](https://github.com/reactjs/react-rails).

### Things I've learned this week
#### How to store credentials (like API keys/secrets) safely using environment variables.
We can use the gem [dotenv](https://github.com/bkeepers/dotenv), which loads environment variables from the `.env` file and creates an array `ENV` in development. You place your `.env` file in `.gitnignore`, which is a file that Git uses to determine which files/directories to ignore before you make a commit. 
#### What scaffolding is in Rails and when to use it.
Scaffolding in Ruby on Rails refers to the auto-generation of a Model, Views, and Controller for a table (such as Users). For example, using the command `rails generate scaffold User" would create a full CRUD (create, read, update, delete) web interface for the Users table. Basically, it's a quick way to autogenerate a lot of things you might need when creating a new data table in a project. It's not always necessary, though, because you may not need the full CRUD functionality. (PS, I'm not using scaffolding to create my photosharing project!)

Other things I've learned from work...

#### What is HAML?
[HAML](http://haml.info/about.html), which stands for HTML Abstraction Markup Language, is a markup language that’s used to cleanly and simply describe the HTML of any web document without the use of inline code. 
#### What is coffeescript? 
[Coffeescript](https://coffeescript.org/#introduction) is a programming language that compiles to JavaScript. It adds syntactic sugar inspired by Ruby, Python and Haskell in an effort to enhance JavaScript's brevity and readability. (source: [Wikipedia](https://en.wikipedia.org/wiki/CoffeeScript))






  
