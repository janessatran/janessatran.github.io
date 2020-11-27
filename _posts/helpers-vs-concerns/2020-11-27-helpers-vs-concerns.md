---
layout: post
title: Helpers vs. Concerns in Rails
author: Janessa
date: 2020-11-27
tags: [Ruby on Rails]
category: Tech
---

# What is a helper?
In Rails, a helper is a method that is used in our Rails views to share reused code across them.

### When should I create a helper method?
When we have logic that produces bits of html, such as formatting a string or conditionally rendering page elements, we can consider using a helper method to clean up we code.

### How do I write a helper method?
Helpers are modules that fall under `app/helpers` in our Rails project. Within the module, we can define methods that will be available in all our views.

For example, say we have a `User` model with attributes `first_name` and `last_name` and we'd like to display a `user`'s full name in a view. We could write a helper to re-use:

```ruby
# app/helpers/user_helper.rb

module UserHelper
  def name_display(user)
    #{user.first_name user.last_name}
   end
end

```

In our view:

```ruby
# app/views/users/index.haml


%h1 Users Index

%ul
  - User.all.each do |user|
    %li= name_display(user)

```

### Can we use them in controllers?
If we're using Rails 5+, we can use helpers in our controller with the `helpers` object. Note that it is possible, but it's not super common.

```ruby
# app/controllers/users_controller.rb

class UsersController < ApplicationController

  def show
   @user = User.find(params[:id])
   @user_name = helpers.name_display(@user)
  end

end

```

# What is a concern?
Concerns are modules that inherit from `ActiveSupport::Concern` and can be included in controllers or models. The main difference between concerns and regular modules are convenient features such as `#included` and `class_methods`. The `included` block is  called whenever a module is “included” into another class or module. It usually includes important class methods / callbacks that we want shared across the models using the concern.

### When should I create a concern?
1. When we have some sort of functionality that is shared across different models. For example, say we have an `#archive` function which sets `archived_at` for `User` and `Post`. Instead of writing that method in both models, we can write a concern and `include Archivable` instead.
2. When we have some sort of functionality that is shared across different controllers. For example, say we are using the [pundit gem](https://github.com/varvet/pundit) to handle authorization in an application that enables users to make posts, comment on posts, and like posts. Say we want to skip authorization in actions related to `Posts` and `Comments`. We could write a concern that gets included in both controllers.

### How do I write a concern?
Concerns live in either `app/controllers/concerns` or `app/models/concerns`.
Below, I will demonstrate how to write the concerns for the scenarios discussed above.

#### Model Concerns
**Concern:** multiple models can be archived by setting the `archived_at` attribute on the model. We can write an `Archivable` concern and include it in the necessary models.

The concern:

```ruby
# app/models/archivable.rb

module Archivable
  extend ActiveSupport::Concern

  included do
    scope :unarchived, -> { where(archived_at: nil) }
    scope :archived, -> { where.not(archived_at: nil) }
  end

  def archive
    self.archived_at = Time.now
    save validate: false
  end

  def archived?
    !archived_at.nil?
  end
end

```

Including it in `User`:

```ruby
# app/models.user.rb

class User < ApplicationRecord
 include Archivable

 ...
end

```

And again in `Post`:

```ruby
# app/models.post.rb

class Post < ApplicationRecord
 include Archivable

 ...
end

```

Now, we can call  the methods defined in the module for instances of `User` and `Post`, such as `User.last.archive`.

#### Controller Concerns
**Concern:** multiple controllers should skip authorization (via pundit). Instead of calling the same callbacks twice, we define a concern and include it in the controller.

The concern:
```ruby
# app/controllers/concerns/skip_authorization.rb

module SkipAuthorization
  extend ActiveSupport::Concern

  included do
  skip_after_action :verify_authorized
    skip_after_action :verify_policy_scoped
  end
end

```

Including it in our `posts_controller`:

```ruby
# app/controllers/posts_controller.rb

class PostsController < ApplicationController
  include SkipAuthorization

  ...
end

```
And again in `comments_controller`:

```ruby
# app/controllers/comments_controller.rb

class CommentsController < ApplicationController
  include SkipAuthorization

  ...
end

```


# What's the difference between a helper and a concern?

To state it simply, **helpers** contain methods to be used in views. **Concerns** contain methods to be included in controllers/models.


## Additional Resources
 - [Disambiguting Rails Helpers](https://thoughtbot.com/blog/disambiguate-rails-helpers)
 - [Rails Concerns](https://api.rubyonrails.org/classes/ActiveSupport/Concern.html)
