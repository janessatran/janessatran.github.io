---
layout: post
title: Useful Rails Console Commands
author: Janessa
date: 2021-02-03
tags: [Ruby on Rails]
category: Tech
---

I work a lot with the rails console and learned a few cool things you can do inside the console that I wanted to share with you all.  

*(Also, if you're unfamiliar with the **rails console**, it's a command that lets you interact with your Rails application from the command line.)*

## Useful Things You Can Do In Rails Console

**To clear the console:** `CMD + R`

**To list available methods on an object:** `ls`

**Reload console:** `reload!`

**View method's source:** `show-source object`

**Shortcut for value of last successful expression: `_`**

**To view all commands available from the pry gem, in the console type** `help`

This is useful when you run a command and then you decide you want to reference it. Instead of typing the entire command again or going back to assign it to some variable, you can just use `_`.

**To access high level methods in the application** such as path helpers or HTTP methods, you can call those methods on `app`: 

```ruby
app.root_path
app.get(app.root_path)) 
```

Similarly, you can call `helper`  to get access to view helpers defined by you and also by rails (such as `link_to`)