---
layout: post
title: Learning Log (03) - Rails AntiPatterns, Model layer code
date: 2019-11-10
tags: [Post]
categories: learning_log
---
Today I started reading a book called "Rails AntiPatterns, Best Practice Ruby on Rails Refactoring". My goal with reading this book is to  get a better sense of how to write more organized, clean code that makes sense to other people and is easier to maintain. In this post, I will share what I learned today from the book!

## Follow the Law of Demeter, aka, "use only one dot".

This law describes the concept that an object can call methods on a related object, but it should not reach through that object to call a method on a third related object.

Example: Say that you have created a Rails app with different models like the following...

```ruby
class Library < ActiveRecord::Base
  has_many :books
  has_one :address
end

class Book < ActiveRecord::Base
  belongs_to :library
  has_one :genre
end

class Address < ActiveRecord::Base
  belongs_to :library
end
```
If we were to show a view of the data above (a book of a specific genre, available at a specific library, which is at a specific address) it might look something like:

```
# library_books.html.erb

<%= @book.genre %>
<%= @book.library.name %>
<%= @book.library.address.street %>
<%= @book.library.address.city %>
<%= @book.library.address.state %>
<%= @book.library.address.zip_code %>
```

This violates the Law of Demeter because we have to access information through associations of other models (we don't just use one "dot"). This is not ideal because the list of dependencies makes the code more fragile in the case that one of the association's changes. For example, what would happen if we wanted to change `address` to `location`? We'd have to go through our code and find every call to `address` and change it! I mean, it's possible, but kind of a lot of work. 

Luckily, Rails enables us to easily address this concern with the `delegate` method. In short, delegation allows us to use methods of one object from another by "delegating" them from one class to another. 

```ruby
class Library < ActiveRecord::Base
  has_many :books
  has_one :address

  delegate :city, :street, :state, :zip_code, to: :address
end

class Book
  belongs_to :library
  has_one :genre

  delegate :name, :city, :street, :state, :zip_code, to: :library, prefix: 'library'
end

class Address < ActiveRecord::Base
  belongs_to :library
end
```

Looking at the `Library` model, we've set up a delegation such that we can now call `:city, :street, :state, :zip_code` from a `Library` object directly. The `delegate`method passes all those method calls to `address`, which we have through the `has_one` association.  If we call `current_library.street`, for example, it will be translated to `current_library.address.street` since we've delegated `street` to call `address`. 

Another way to think about this, if the above doesn't make sense, is reading it like: "hey `Book` objects, if you get a call to `:street`, we are delegating it to `Library`". 

## Push all calls to find() into Finders in the Model

In short, don't have any logic in the presentation layer (views). 

Example: say you want to display a page of users of your application by order of last name.

```haml
-# index.haml

#user-list
  %h1 Users
  - User.order(:last_name).each do |u|
    %li link_to u.profile, u.full_name
```

Instead of having the logic directly in the view, it's better to put it in the Controller and Model. If we wanted to list the users by order of last name again, we would need to repeat this logic and repeating code is not ideal (more about the DRY concept can be found [here](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). 

```ruby
class UsersController < ApplicationController
  def index
    @users = User.ordered_by_last_name
  end
end
```
We can use a `scope`, which enables us to specify commonly-used queries as method calls on objects: 

```ruby
class User < ActiveRecord::Base
  scope :ordered_by_last_name, -> { order(title: asc) }
end
```
Now, in our view, we can do:

```ruby
-# index.haml

#user-list
  %h1 Users
  - @users.each do |u|
    %li link_to u.profile, u.full_name
```

## Keep Finders in Their Own Model
Finder are calls that query the database. For example, say we have a model `User` and `Orders` and wanted to **find** all of a user's orders that have just been created. That query finder would look something like:

```ruby
class UsersController < ApplicationController
  def index
    @user = User.find(params[:id])
    @orders = @user.orders.where(status: created, created_at 2.days.ago)
  end
end
```
We can improve this code by moving the finder (of created orders) inside the `Order` model.  This will make the `UsersController` thinner and clarify what it's doing with a semantic method name defined in the `Orders` model. 

```ruby
class UsersController < ApplicationController
  def index
    @user = User.find(params[:id])
    @recently_created_orders = @user.find_created_orders
  end 
end

class User < ActiveRecord::Base
  has_many :orders

  def find_created_orders
    orders.where(status: created, created_at 2.days.ago)
  end
end
```
But.. wait!! We can improve this even more. Active Record associations give us a proxy class that act like arrays and lets us access methods on the target class. This means that if we had a method like `Order.recently_created` we could use it through our associations, `user.orders.recently_created`. 

```ruby
class UsersController < ApplicationController
  def index
    @user = User.find(params[:id])
    @recently_created_orders = User.recently_created_orders
  end 
end

class User < ActiveRecord::Base
  has_many :orders

  def recently_created_orders
    orders.recently_created
  end
end

class Order < ActiveRecord::Base
  belongs_to :user

  def self.recently_created
    (status: created, created_at 2.days.ago)
  end
end
 ```
This finder object pattern helps keep the model logic strictly related to a class' behavior, unlike before when we had a query for `Order` in our `User` controller. It also helps keep the controller's skinny. 
