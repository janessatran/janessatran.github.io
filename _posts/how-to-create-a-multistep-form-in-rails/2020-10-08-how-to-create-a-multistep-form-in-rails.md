---
layout: post
title: "How to create a multi-step form in Ruby on Rails"
author: Janessa
date: 2020-10-08
tags: [Ruby on Rails]
category: Tech
---

Recently at work, I had to implement a sign-up form for user subscriptions. At first glance, it seemed really straightforward: create a form where a user enters their information and upon successful submission, decrease the number of subscription licenses associated with that user's account. Unsurprisingly, however, there were a lot of other requirements I had to meet and implementing this functionality turned out to be more complicated than I was expecting. For the sake of future me, and for the sake of whoever else might need to do something similar, I wanted to write out my approach to implementing the feature in this post. First things first, let's make sure we understand all the requirements... I'll list them all below!

## The Requirements to be met

- User gets an email with a link they can go to in order to make a subscription.
- The link includes a query parameter that ties the subscription to an account (which holds X number of licenses for subscriptions).
- On the sign-up form, if the user already exists in the system by checking their email redirect the user to log in before continuing so we have access to their other information for the next part of the form (first name, last name, organizations).
- If the user already exists, disable the user from editing their first_name, last_name, etc from this form to keep data accurate.
- If the user does not exist, send the user an email to confirm their account in addition to creating the subscription.
- After successful completion of the sign-up, reduce the number of licenses on the account.

## Models
For context, these are the models that I am working with and the relevant data attributes for each:

- `User` model: a user has an `email`, `first_name`, `last_name`, has many `accounts`
- `Account` model: an account has N number of `licenses` for subscriptions, has many organizations
- `Organization` model: has a name, belongs to `accounts` and has many `users`


## The Solution

From the list of requirements, it is clear that a simple form wont suffice. The approach I took instead was to create a multi-step form where the first step of the form validates the `email` and the second step of the form validates the rest of the information about the `User`. Since we need to validate parts of the same object at different times, I also created two new objects that inheret from `ActiveModel::Model` to be able to add validations on the separate concerns.

In this post, I will explain to you how I created a multi-step form in Ruby on Rails.

## The Tutorial 

First, we will create the model classes to implement our validations. We need one class to validate the user account via `email` and another to validate the user details such as `first_name` and `last_name`. 

These classes will be used in each step of our form to validate the data at each step (but not necessarily write the data to the database until all validations are complete): 
  1. Step 1 - Validate Email of User
  2. Step 2 - Validate Details of User

One way to do this is to create a class which inherets from `ActiveModel::Model`. This enables us to validate the object and plug it into a Rails form.

### The User Accounts Form Model

First, create the `UserAccountForm` class:

```ruby
class UserAccountForm 
  include ActiveModel::Model

  attr_accessor :email, :user, :account_uuid
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL }

  def user
    User.find_by(email: email)
  end

  def account
    Account.where(uuid: account_uuid).first
  end
end

```

### The User Accounts Form Controller

Then, create the `UserAccountsController`:

```ruby
class UserAccountsController < ApplicationController
  def new
    # the :account_uuid is passed in the request parameters from the sign-up link
    @user_account = UserAccountForm.new(account_uuid: params[:account_uuid])
    # if a user is currently logged in, skip to the next part of the form
    # passing their email and user_id through the request with query params
    if current_user
      params = {
        user_profile_form: {
          mail: current_user.email,
          user_id: current_user.id,
          account_uuid: @user_account.account_uuid
        }
      }
      redirect_to new_user_profile_path params
    else
      render :new
    end
  end

  def create
    @user_account = UserAccount.new(user_account_params)

    if @user_account.user.present? && @user_account.user != current_user
      # If we find a user with this email and that user is not currently
      # logged in, we redirect them to log in before continuing
      notice = "Looks like there's already an account associated with this email. Please log in to continue."
      redirect to new_user_session_path, notice: notice

    elsif @user_account.valid? && @user_account.user.present && @user_account  user == current_user

      # Instead of persisting the values to the `User` object,
      # we pass them through to the next part of the form
      # to fill out hidden fields for those attributes
      params = {
        user_profile_form: {
          email: @user_account.email,
          user_id: @user_account.user.id,
          account_uuid: @user_account.account_uuid
         }
      }
      redirect_to new_user_profile_path params
    else
      render :new
    end
  end

  private

  def user_account_params
    params.require(:user_account_form).permit(:account_uuid, :email)
  end
end

```

### The User Accounts Form View
Next, we create the User Accounts Form view. In the example below, I am using haml.

```haml
# /app/views/user_accounts/new.html.haml

%h1 Subscription - Sign Up
  = simple_form_for(@user_account, url: user_accounts_path) do |f|
    = f.error_notification
    = f.input :account_uuid, as: :hidden
    = f.input :email, placeholder: "Email"
    %p.hint Please use the same email address you've used for other products on this site.

    = f.button :submit, "Next"


```

### The User Profile Form Model
Now we move on to creating the classes for the next step of the form, the User Profile. 

```ruby
class UserProfileForm
  include ActiveModel::Model

  attr_accessor :first_name, :last_name, :email, :organization, :account_uuid

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates :organization, presence: true
  validates :account_uuid, presence: true
end

```

### The User Profile Controller

The User Profile controller differs slightly from the User Account controller because it is the last step in our form. We will need to use the parameters passed in the request from the `UserAccountController` to fill in the hidden form fields so that the data can be submitted in the final request. I've created a helper method `set_inputs` that will create instance variables that I can access in my view to set the input values if we find any data on the user.

```ruby
class UserProfileController < ApplicationController
  before_action :set_inputs # our function to set the hidden field inputs

  def new
    @user_profile = UserProfileForm.new
    render :new
  end

  def create 
    @user_profile = UserProfileForm.new(user_profile_params)

    if !@user_profile.valid?
      render :new, alert: "Some required fields are missing"
    else
      if @user
        SubscriptionUser.create!(user: @user, account: @account )
    else
      # we put it in a transaction because we do not want to create the subscription unless the user creation succceeds
    User.transaction do
        begin
          if @user.nil?
            @new_user = true
            @user = User.create!(
              email: user_profile_params[:email],
              first_name: user_profile_params[:first_name],
              last_name: user_profile_params[:last_name],
            )
            NewUserMailer.send_new_user_email(@user).deliver_later
          end
          @subscribed_user = SubscriptionUser.create!(
            user: @user,
            account: @account,
            organization: user_profile_params[:organization]
          )
        rescue ActiveRecord::RecordInvalid
          render :new, notice: "An issue occurred with creating your subscription and we were unable to save it. Please refresh and try again.."
        else
          if @new_user
            notice = "Please check your email to confirm your email address and set your password."
            redirect_to new_user_session_path, notice: notice
          else
            notice = "Success! Your subscription has been created."
            redirect_to root_path, notice: notice
          end
        end
      end
      end
    end
  end

  private

  def set_inputs
    @user = current_user ? current_user : nil # if there is a user logged in, set our @user object to the current_user, otherwise set it to nil
    @email = user_profile_params[:email]
    @first_name = current_user&.first_name # &. is the safe navigation operator, it will only make the `first_name` call if current_user is not nil
    @last_name = current_user&.last_name
    @account = Account.find_by(uuid: user_profile_params[:account_uuid])

    if @user.present?
      # We want to filter our selection options for the Organization field by the user's organizations if they are logged in
      @organization_options = @user.organizations.map { |org| [org.id, org.name] }
    else
      # If the user is not logged in, we will show all the organizations
      @organization_options = Organization.all.map { |org| [org.id, org.name] }
  end

  def user_profile_params
    params.require(:user_profile_form).permit(
      :user_id,
      :email,
      :first_name,
      :last_name,
      :organization,
      :account_uuid
    )
  end

end
```

### The User Profile Form View

```ruby
# /app/views/user_profiles/new.html.haml

%h1 Subscription - User Details
= simple_form_for(@user_profile, url: user_profiles_path) do |f|
  = f.error_notification
  = f.input :email, label: false, input_html: { value: @email, hidden: true }
  = f.input :account_uuid, label: false, input_html: { value: @account&.uuid, hidden: true }
  = f.input :first_name, placeholder: 'First name', input_html: { value: @first_name, readonly: @first_name.present? ? true : false }
  = f.input :last_name, placeholder: 'Last name', input_html: { value: @last_name, readonly: @last_name.present? ? true : false }
  = f.select :organization, options_for_select(@organization)

  = f.button :submit, "Submit"

```

## Routing
Last, but not least, we need to add our routes:

```ruby
Rails.application.routes.draw do
  resources :user_accounts, only: %i[new create]
  resources :user_profiles, only: %i[new create]
end
```
