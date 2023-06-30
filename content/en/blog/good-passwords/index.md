---
title: "Creating Good, Secure Passwords"
description: "Use these tips to stay secure online"
excerpt: ""
date: 2023-06-15T12:53:00-06:00
lastmod: 2023-06-15T12:53:00-06:00
draft: false
weight: 50
images: ["main.jpg"]
categories: ["Security"]
tags: ["passwords", "password-manager", "Bitwarden", "security", "best-practices", "secrets-management", "online-safety"]
contributors: ["Oliver Abdulrahim"]
pinned: false
homepage: false
toc: true
---

{{< alert icon="☀️" text="The main audience of this post is anyone who uses passwords." />}}

In this article, we'll discuss how you can easily create good passwords so that you can
stay secure online!

## What makes a good password?

A good {{< glossary-tooltip id=password >}} has a combination of strength, length, and
uniqueness.

* Strong: non-repeating, non-consecutive characters
* Length: more characters is better!
* Unique: never reused across different sites

## Tips for creating a main password for your password manager

We use Bitwarden {{< glossary-tooltip id=password-manager >}} at our organization, though
every password manager has this concept. Since your Bitwarden
{{< glossary-tooltip id=main-password >}} protects all your other passwords, it's very
important that you select a good one!

Here are some recommendations to help you get started.

### Pick a new password you haven't used anywhere else

Remember that this password will protect all your secure data! Do not use a password that
you’ve used anywhere else.

### Select a few random words

A password with truly random words (3 to 5, more is better) like…

<div align="center">
<pre>silica xerox spruce festival working</pre>
</div>

…or something similar is memorable for a person and at the same time *very* difficult for
a computer to guess.

If it helps, you can start with 3 random words, then add a 4th and 5th word over time as
you memorize the start of your password.

### A note on phrases as passwords

Song lyrics and idioms as passwords are OK, but keep in mind that people have shared
experiences and tend to select phrases that are very common. This is why truly random
words are a more secure option.

## Tips for creating other passwords

For most passwords other than your Bitwarden main password, don’t come up with a
password on your own. Instead, use Bitwarden’s password generator and store that
password in your vault!

The password generator will help you automatically fulfill all the good password
requirements we talked about earlier: strength, length, and uniqueness. Here’s how you
can use it.

### Bitwarden: Automatically generate

You'll need the Bitwarden extension installed to follow these steps
([Firefox](https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/),
[Chrome](https://chrome.google.com/webstore/detail/bitwarden-free-password-m/nngceckbapebfimnlniiiahkandclblb)).

1. Right click anywhere on the a web page
2. In the context menu that appears, click "Bitwarden" > "Generate password (copied)"
3. To use that password, paste it from your clipboard with `⌘ Cmd + V (macOS)` or
   `⌃ Ctrl + V` (Windows & Linux)

Once you submit that password on a web page, Bitwarden will offer to save it for you.
If you already have an entry for that site, Bitwarden will ask of you want to update
the information you have saved. Take advantage of this feature to automatically store
that password in a vault entry!

### Bitwarden: Manually generate

You can also manually access the generator by logging into your account on the web or
using the browser extension.

* In the web vault, click “Tools” and then the “Generator” tab
* In the browser extension, open the extension and click “Generator”
* You may need to change the generator’s settings to accommodate the password
requirements for the site you’re making a password for
* You should generate passwords with an absolute minimum length of 15
characters
