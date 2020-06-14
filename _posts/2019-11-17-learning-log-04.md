---
layout: post
title: Learning Log (04) - Rails AntiPatterns, Using modules and classes
author: Janessa
date: 2019-11-17
tags: [Post]
categories: learning_log
---
Good morning my fellow readers! I'm continuing to go through Rails AntiPatterns and have more things I'd like to share as I'm learning. This post will be about how to simplify Models using modules and classes.

### TL;DR
If you don't want to read the entire thing, this is what I've learned in a nutshell...
To simplify Models:
1. Identify if your description of a Model/Class requires you use "and" or "or". If it does, delegate the responsibility of some of the methods to a new class. 
- You can use the `delegate` method to do this. More on that [here](https://apidock.com/rails/Module/delegate).
- You can also use the `composed_of` method to do this. More on that [here](https://apidock.com/rails/ActiveRecord/Aggregations/ClassMethods/composed_of).
  - When you use composition, you create a value object. A **value object** represents an entity that is equal based on value (two different objects with equal attribute values are considered equal objects). Primitive objects in Ruby such as `Symbol`, `String`, `Integer`, etc are examples of value objects.
2. You can use **modules** to extract behavior into separate files and then `include` or `extend` them into your classes as necessary. Modules have two main purposes:
- One, **namespacing** - a way of bundling logically related objects together into a single namespace, which helps with possible clashing of the same class names(an example of a namespace/module is `ActiveRecord::Base`). 
- Two, **mixins** - providing multiple inheritance of a module through including or extending them into other classes.
  - When you `include` a module, the module methods are instance methods.
  - When you `extend` a module, the module methods are class methods. 
3. Try to avoid large transaction blocks in Controllers and Models, use [validations](https://guides.rubyonrails.org/active_record_validations.html) such as `presence: true` and [callbacks](https://guides.rubyonrails.org/active_record_callbacks.html) such as `before_save` in your Models instead. 


# How to use Modules/Classes to clean up Models! 
### Delegate Responsibility to New Classes
Say we have a model `Purchase` . It has methods to return purchases by different criteria and export purchases in different formats:
```ruby
class Purchase < ActiveRecord::Base
  belongs_to :customer
  has_many :items

  def find_returned_credit_card_purchases
    # ...
  end

  def find_completed_cash_purchases
    # ...
  end

  def to_xml
    # ...
  end

  def to_json
    # ...
  end

  def to_csv
    # ...
  end
end
```
If we think about how to describe this class, we can see that it violates the Single Responsibility Principle. 

"The Single Responsibility Principle (SRP), in short, states that a class should only be responsible for one thing."

You can check if your class design is in violation of this rule by asking yourself how you'd describe it and see if you need the words "and" or "or" to fully relay the functionality. For our `Purchase` class, we're doing two things: 1) creating methods to make more advanced search queries, and 2) creating methods to export data in various formats. 

We want to move the export methods out of the `Purchase` class because they're not really part of a `Purchase` object. 
```ruby
# app/models/purchase.rb
class Purchase < ActiveRecord::Base
  belongs_to :customer
  has_many :items
  delegate :to_xml, :to_csv, :to_pdf, to: 'converter'

  def find_returned_credit_card_purchases
    # ...
  end

  def find_completed_cash_purchases
    # ...
  end

  def converter
    PurchaseConverter.new(self)
  end
end
 ```
```ruby
# app/models/purchase_converter.rb
class OrderConverter
  attr_reader :purchase

  def intialize(purchase)
    @purchase = purchase
  end

  def to_xml
    # ...
  end

  def to_json
    # ...
  end

  def to_csv
    # ...
  end
end
```
In our refactoring, we moved the conversion methods into a new class `OrderConverter` and used delegations to enable us to call `@purchase.to_pdf`, which also follows the Law of Demeter!

Another way to separate responsibility to separate classes is through the use of **composition.** 

#### Rails `composed_of` method

This method "adds reader and writer methods for manipulating a value object".

The `composed_of` method takes three main options:

1. the name of the method that will reference the new object
2. the name of the object's class (`:class_name`)
3. the mapping of database columns to attributes on the object (`:mapping`)

For example:  if we had a `Company` model that comprised of an `address`, among other things, we could define a composition in our class like so:
```ruby
class Company < ActiveRecord::Base
  composed_of :address, 
              :mapping => [%w(address_street street), %w(address_city city)]
end
```
This would give us an `Address` class that looks like the following:
```ruby
class Address
  attr_reader :street, :city

  def initialize(street, city)
    @street, @city = street, city
  end

  # we can define more methods like the ones below to compare these objects
  def close_to?(other_address)
    city == other_address.city
  end

  def ==(other_address)
    city == other_address.city && street == other_address.street
  end
end
```
Now, when t we set a `Company` object's address with a street and city, we can obtain the `address` like:
```ruby
company.address_street = "Cedar Grove"
company.address_city = "Portland"
company.address # => Address.new("Cedar Grove", "Portland")
```
#### A lil note: the difference between Value Objects and Entity Objects

Most objects we deal with, such as if we were to instantiate our `Company` class, would be considered an entity object. We could have two instances of `Company` with the same values in each attribute, but they would still be considered not equal because they are distinct objects. 

On the other hand, our `Address` class describes a Value object.  Value objects are compared by value, so if we had two instances of `Address` with the same values for each attribute, we would consider those objects equal because their attribute values match.

### Use Modules

Modules allow you to extract behavior into separate files. If you had an `Order` class, for example, and had methods for finding all the others, searching against all the orders, and exporting all the orders into various data formats, you could move those methods into modules to organize the functionality better.  If you did this, you could result in creating the following module files:

1. `lib/order_state_finders.rb`
2. `lib/order_searchers.rb`
3. `lib/order_exporters.rb`

More on modules!

They have two primary purposes:

1. Namespacing - a way of bundling logically related objects together
2. Mixins - Ruby's way of providing multiple inheritance

**Namespacing**

Namespacing helps with the possibility of clashing names among various classes. For example, if we were to create a new gem with `bundle gem sufjan_stevens`, we would get a default file with a module in it:
```ruby
require "sufjan_stevens/version"

module SufjanStevens
  ...
end
```
If we were to make a new class, we could put it in the `SufjanStevens` namespace:
```ruby
module SufjanStevens
  class Song
  end
end
```
Now, if we were to make another gem that also had a `Song` class, we could distinguish between the two by using the namespace `SufjanStevens::Song.new`. 

Psst... we see this in rails with `ActiveRecord::Base`, the module being named `ActiveRecord`.

**Mixins**

If you have methods that need to be accessed across different classes, instead of repeating those methods in each class, you can abstract them into a module and **include** or **extend** the modules in each class. 

#### A lil note on `include` vs `extend`:

When you **include** a module in a class, those methods that get called on the class are instance methods. When you **extend** a module in a class, those methods become class methods.

### Avoid large transaction blocks in Controllers and Models

Active Record supplies built-in transactions such as **validations**, which allow you to ensure that only valid data is stored in your database, and **callbacks**, which allows you to trigger logic before or after an alteration of an object's state. Employ these instead of create a block of transactions to run to avoid complexity!
