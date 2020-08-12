---
layout: post
title: Learning Log (02) - `chmod` and binary
author: Janessa
date: 2019-11-03
tags: [Post]
category: Tech
---
Hello again, friend! I'm learning a lot of new things in my new role and it's great!! One of the things that stands out from last week that I learned was about permission settings on files and the unix command `chmod`, as well as how binary works in general. This post will be a summary of those key things. 

### What is binary?
A binary number is a number expressed in the base-2 numeral system (aka binary numeral system), which uses only two symbols: zero and one. BUilding binary numbers looks like: 

|2...|2^6|2^5|2^4|2^3|2^2|2^1|2^0|
|----|---|---|---|---|---|---|---|
|... |64 |32 |16 |8  |4  |2  |1  |

So the columns of the numbers starts with one's, then two's, four's, etc, whereas with the traditional base-10 system the columns are one's, 10's, and 100's, etc. I am not sure if that explanation makes sense to anyone else, so here is another example of how to represent the same number in the different systems. 

#### Representing 203 in binary and the traditional numeral system (base 10):
To represent the number "402" in the base-10 system, we'd parse out the one's, ten's, and hundred's column and it would look like: 

|10^2|10^1|10^0|
|----|----|----|
| 2  |  0 |  3 |

In other words, `2 * (10^2) + 0 * (10^1) + 3 * (10^0) = 203`. 

To represent the same number in the base-2 system, we'd parse out the one's, two's, four's, etc... 

|2^7|2^6|2^5|2^4|2^3|2^2|2^1|2^0|
|---|---|---|---|---|---|---|---|
|1  |1  |0  |0  |1  |0  |1  |1  |

In other words, `(2^7) + (2^6) + (2^3) + (2^2) + (2^1) + (2^0) = 128 + 64 + 8 + 2 + 1 = 203`.

Cool beans. But why does any of that matter? This matters because we can use octal notation to change/set permissions for files using `chmod` (we can also use symbols). Octal numbers are derived from converting the binary numbers to base-8, using the digits 0 to 7. I'll get into the permission settings next!

### Unix `chmod` command and file permissions
On unix OS, each file has a set of flags associated with them to show who can access the file and how. You can see these flags by typing `ls -la` in your terminal. The output looks something like:
```
drwxr-xr-x   28 janessatran  staff     952 Oct 26 17:24 .
drwxr-xr-x    3 janessatran  staff     102 Oct 26 16:57 ..
-rw-r--r--    1 janessatran  staff       9 Oct 26 16:58 .browserslistrc
-rw-r--r--    1 janessatran  staff     126 Oct 31 19:38 .env
drwxr-xr-x   12 janessatran  staff     408 Oct 31 20:09 .git
-rw-r--r--    1 janessatran  staff     714 Oct 26 18:35 .gitignore
-rw-r--r--    1 janessatran  staff      11 Oct 26 16:57 .ruby-version
-rw-r--r--    1 janessatran  staff    2077 Oct 31 19:37 Gemfile
-rw-r--r--    1 janessatran  staff    7078 Oct 29 18:23 Gemfile.lock
-rw-r--r--    1 janessatran  staff     374 Oct 26 16:57 README.md
-rw-r--r--    1 janessatran  staff     227 Oct 26 16:57 Rakefile
drwxr-xr-x   11 janessatran  staff     374 Oct 26 16:57 app
-rw-r--r--    1 janessatran  staff    2203 Oct 29 18:25 babel.config.js
drwxr-xr-x   10 janessatran  staff     340 Oct 26 16:58 bin
drwxr-xr-x   20 janessatran  staff     680 Oct 26 18:34 config
-rw-r--r--    1 janessatran  staff     130 Oct 26 16:57 config.ru
drwxr-xr-x    5 janessatran  staff     170 Oct 26 17:08 db
drwxr-xr-x    4 janessatran  staff     136 Oct 26 16:57 lib
drwxr-xr-x    4 janessatran  staff     136 Oct 26 16:58 log
drwxr-xr-x  781 janessatran  staff   26554 Oct 29 18:25 node_modules
-rw-r--r--    1 janessatran  staff     522 Oct 29 18:25 package.json
-rw-r--r--    1 janessatran  staff     224 Oct 26 16:58 postcss.config.js
drwxr-xr-x   10 janessatran  staff     340 Oct 26 18:19 public
drwxr-xr-x    3 janessatran  staff     102 Oct 26 16:57 storage
drwxr-xr-x   12 janessatran  staff     408 Oct 26 16:57 test
drwxr-xr-x    9 janessatran  staff     306 Oct 26 18:17 tmp
drwxr-xr-x    3 janessatran  staff     102 Oct 26 16:57 vendor
-rw-r--r--    1 janessatran  staff  315951 Oct 29 18:25 yarn.lock
```

The flags are in the left-most column with the d's, r's, x's, etc. The first character of that string represents the file type. The dash, "-", indicates a regular file, "d", indicates a directory, "l" indicates a symbolic link. If we take the public folder as an example,`drwxr-xr-x`, we can tell from the first character that it's a directory type file. The next three characters represent the persmisison of the file's owner. In this example, the next three characters are `rwx`, the owner may **r**ead, **w**rite, or **x**ecute the directory. The next three characters after that represent the group member permissions. And the next three after that are the global permissions. Respectively, those permissions are: group can read and execute, others can read and excute. 

#### Using the `chmod` command
Good stuff. So how do we actually change the file permissions? Well, now that we understand the different permission levels (read, write, and execute) and also understand binary notation, we can take the binary representation of the permissions we want to set, convert it to octal notation, and use those as our flags to set the permissions on a file (for users, groups, and others)!

Here's a handy table you can use of the binary-to-octal conversion for each permission setting:

|Binary|Octal|Permission|
|------|-----|----------|
|000	 | 0	 | —        |
|001 	 | 1   | –x       |
|010	 | 2	 | -w-      |
|011	 | 3   | -wx      |
|100	 | 4	 | r–       |
|101   | 5   | r-x      |
|110	 | 6	 | rw-      |
|111	 | 7	 | rwx      |

So, if I wanted to give each group read, write, execute access to my file, I'd use the command `chmod 777 filename`.  NEAT!!! 
