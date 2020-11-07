---
layout: post
title: Decorator Pattern in Ruby on Rails
author: Janessa
date: 2020-11-06
tags: [Ruby on Rails, Design Patterns]
category: Tech
---

## What is the Decorator Pattern?

It allows us to add functionality to an object of a class without affecting other instances of that class. The term "decorator" originates from the pattern of adding additional behavior onto a single object, among all the instances of the class you have a "decorated" instance.

## How do we use that in Ruby on Rails?

A common requirement in projects is to alter data in a model for the view layer. For example, say you have a `User` model with attributes `first_name` and `last_name` and you want to display the full name of the user in the view.

In order to keep presentation logic out of the views and models*, which should always be the goal,* you can add it into a decorator class instead. This simplifies our views which should exclude logic as much as possible, and models which should not know about presentation. Then, we can decorate our instances as we need.

## How do you implement the Decorator Pattern?

<ins>View Logic:</ins>

Let's say we have a `User` class and an `Article` class. In two separate views, the `User` show page and `Article` index, we display the full name of the user by combining the `user.first_name` and `user.last_name`

On the user's profile page:

```ruby
# apps/views/users/show.html.haml

%h1.name-display
  = @user.first_name + " " + @user.last_name

```
In the index page of articles:

```ruby
# apps/views/articles/index.html.haml

%h1= @article.title
.author Written By #{@article.user.first_name + " " + @article.user.last_name}
```

<ins>Code Smell:</ins>

Right away, we should detect a code smell! Firstly, we're repeating code in multiple places. Secondly, we're manipulating data directly in the view which we should **avoid.** Remember, the view should just be there and display things.

<ins>The Solution:</ins>

We can add a decorator pattern to improve this!

- Define a subdirectory, `app/decorators`
- Define a file, `app/decorators/user_decorator.rb`

In this file we can define a `name_display` method which will contain the string manipulation logic to show the full name of the user.  The class will inherit from `SimpleDelegator`, a native Ruby class that provides the means to delegate all supported methods calls to the object passed into the constructor.


```ruby
# app/decorators/user_decorator.rb

class UserDecorator < SimpleDelegator
  def name_display
    #{first_name last_name}
  end
end
```


## Implementing the Decorator into our Views

Now we can use our decorators to simplify our views. First in the user's profile page:

```ruby
# apps/views/users/show.html.haml

%h1.name-display
  = UserDecorator.new(@user).name_display

```

Then in the article index page:

```ruby
# apps/views/articles/index.html.haml

%h1= @article.title
.author Written By #{UserDecorator.new(@article.user).name_display}
```

## Alternative: Using the Draper Gem

If you don't want to create your own decorator class from scratch, you can also use the [Draper Gem](https://github.com/drapergem/draper).

With Draper, you could write a Decorator Class like:

```ruby
# app/decorators/user_decorator.rb

class UserDecorator < Draper::Decorator
  delegate_all

  def name_display
    #{object.first_name object.last_name}
  end
end
```

Then, you would call `decorate` in your controller like so:

```ruby
# app/controllers/users_controller.rb

def show
  @user = User.find(params[:id]).decorate
end
```

And in your views:

```ruby
# app/views/users/show.html.haml

%h1.name-display
  = @user.name_display
```
