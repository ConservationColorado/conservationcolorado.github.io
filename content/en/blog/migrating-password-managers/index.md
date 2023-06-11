---
title: "How We Migrated Password Managers"
description: "Moving from LastPass to Bitwarden in 2023"
excerpt: ""
date: 2023-06-08T23:46:13-06:00
lastmod: 2023-06-08T23:46:13-06:00
draft: false
weight: 100
images: [ "bitwarden.png" ]
categories: [ "Security" ]
tags: [ "passwords", "password managers", "security", "Bitwarden", "LastPass", "Google Passwords" ]
contributors: [ "Oliver Abdulrahim" ]
toc: true
mermaid: true
---

{{< alert icon="☀️" text="The main audience of this post is organization administrators." />}}

In this article, I'll talk retrospectively about our organization's recent migration from
LastPass to Bitwarden. I'll talk about why we made the change and how we did it.

We've decided to open source this information to fill in gaps we found in documentation online.
Plus, we're a big fan of password managers and want to make great security accessible!

These steps apply to any other password manager your organization may want to use, whether 
you're switching providers like we did or starting to use a password manager for the first
time. 

You won't want to *pass* on this one!

## Why the migration?

LastPass had a security breach in November 2022. While not the first security incident they
faced, or even the first they faced that year, this breach stood out because of its high
level of severity and specific impact on us. When we learned about this in January 2023, we
knew we needed to use a different tool to secure our organizational secrets.

## Quick background on how most password managers work

Terms you need to know before we discuss what happened and how we’ll respond are:
*vault*, *entry*, *encrypt/decrypt*, and *main password*. We’ll discuss each.

LastPass stores your data in a vault. This vault belongs only to you (ideally!). You can
(also ideally!) only access this vault through LastPass, for example, using a LastPass
browser extension, web app, or mobile app. LastPass also keeps a backup of your vault on
their servers.

Your vault stores everything that belongs to you as entries, which are the individual
items that you have stored on LastPass. These are commonly passwords, but you can also
store notes, addresses, credit card numbers, files, and so on.

Parts of entries in your vault are encrypted. When data is encrypted, it’s scrambled in a
special way to make it more secure. Encrypted data is hidden to anyone without the one key
that can unscramble or decrypt the data.

The key that decrypts your LastPass entries is your main password. This is what you use
to log into your account. When you enter your main password, LastPass
[does a few transformations](https://en.wikipedia.org/wiki/PBKDF2) to make a potentially
weaker password more difficult to guess by force. That said, the only thing protecting
your entries themselves is your main password. This is important later!

## About the LastPass breach

### What happened?

Now that you have some background details, here’s what happened in November 2022. An
attacker accessed and downloaded a backup of all LastPass customer data. LastPass has not
shared exact dates; we don’t know when this transfer occurred, or what time period those
backups were a snapshot of.

It’s safest to assume that if you used LastPass in 2022 or earlier, at an organization or
otherwise, yes, you were affected.

### What was stolen?

Broadly, two types of data:

1. Data related to you or your organization
    * Names of people and organizations
    * Billing addresses associated with your account
    * Telephone numbers associated with your business account
    * Email addresses associated with your account
    * Locations (via IP addresses) where you previously used LastPass from
2. Second, vault data for all LastPass users
    * This does NOT mean that passwords stored in your vault are directly accessible.
    * Remember that parts of LastPass entries (such as passwords) are encrypted against your
      main password.

### What can attackers do with it?

Attackers can use data related to who you are for targeted phishing attacks and social
engineering.

They also have a stolen snapshot of all LastPass vault data. Critically, since that data
totally offline, security measures normally in place when accessing LastPass are bypassed.
This includes any limits on how many failed login attempts they can make. Normally, after
8 invalid attempts, LastPass temporarily suspends your account. Second- or multi-factor
authentication you use to verify yourself when accessing LastPass is also moot.

The only thing protecting your stolen vault is the strength of your main password. Though
unlikely, anyone with your stolen vault could brute-force this password. LastPass's
password hashing function would slow them down; by how much depends on your
[iteration settings](https://security.stackexchange.com/a/267278).

LastPass also revealed that they never encrypted URLs in your vault. This allows
attackers to categorize entries and divert resources to entries containing logins to
specific sites, such as banks, payroll, and other accounts known to hold sensitive
information. Remember that attackers also stole personal information such as email
addresses, which may correspond to usernames to your accounts.

## How we responded

{{< mermaid class="bg-light text-center" >}}
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#A5D555',
      'primaryTextColor': '#969696',
      'tertiaryColor': '#C4D7A4',
      'taskTextClickableColor': '#969696',
      'taskBkgColor': '#FFFFFF',
      'activeTaskBkgColor': '#C4D7A4',
      'activeTaskBorderColor': '#0',
      'tertiaryColor': '#C4D7A4'
    }
  }
}%%

gantt
title Timeline Of Migration From LastPass
axisFormat %m-%d
tickInterval 1week
Secure data              :active, e0, 2023-01-23, 6d
Research services        :active, e1, 2023-01-24, 10d
Pilot alternatives       :active, e2, 2023-01-25, 9d
Propose Bitwarden        :milestone, e3, 2023-02-03, 1d
Set up & test Bitwarden  :active, e4, 2023-02-07, 15d
Launch Bitwarden         :milestone, e5, 2023-02-27, 1d
Bitwarden help desks     :active, e6, 2023-02-27, 10d

      click e0 href "#secured-our-data"
      click e1 href "#identified-a-replacement"
      click e2 href "#identified-a-replacement"
      click e3 href "#identified-a-replacement"
      click e4 href "#set-up-bitwarden"
      click e5 href "#launch"
      click e6 href "#launch"

{{< /mermaid >}}

### Secured our data

When we heard about the breach in January 2023, our primary objective was to make the
stolen data useless to potential attackers. That meant changing login information and
adding second factor authentication, starting with high value accounts.

This was obviously painful, but it was the only way for us to regain control of the
situation. We set aside time for this over the course of one week.

In situations like this, keep your staff informed. Remember that you serve them! Empathize
with the fact that internet security is not at the top of most people's interesting
activity list. Keep your discussions clear and actionable! Avoid jargon -- it's easy to
miscommunicate with. People don't need to know about PBKDFs and related varieties, or how
LastPass should have long ago introduced a more
[memory-hard key derivation function](https://en.wikipedia.org/wiki/Argon2). Spare those
details ;)

Even if you work in a technical setting, strive to make working with your organization's
security policies simple. Make yourself available to answer questions, whether at help
desks, info sessions, or chat spaces.

Regular conversations about security benefit you in situations like this. Share and
discuss plenty of resources like the following:

* Your time and availability you've set aside to help staff on this specific issue
* What services you expect people to reset first
* Relevant parts of your organization's security policy
* What makes a good password
* How to use a password generator
* How to update passwords on a particular service

### Identified a replacement

While resetting passwords, we also tested and compared many of the popular password
management services over the course of that week.

Here's our selected comparison of password managers. We tested other password managers
that we didn't include below. Note that we weighted some of our requirements, like the
security model of the service, more heavily than others, like free tier availability.

| Service name    | 1Password | Bitwarden | LastPass |
|-----------------|:---------:|:---------:|:--------:|
| Plan name       | Business  |   Teams   |  Teams   |
| Cost ($/u/mo)   |   $8.00   |   $3.00   |  $4.00   |
| Discount?       |    50%    |    25%    |    0%    |
| UI / UX         |    ★★★    |    ★★     |    ★★    |
| User grouping   |     ☑     |     ☑     |    ☐     |
| Free tier       |     ☐     |     ☑     |    ☑     |
| Guest accounts  |    20     |     0     |    0     |
| Send data       |     ☐     |     ☑     |    ☐     |
| Sharing entries |     ☑     |     ☑     |    ☑     |
| Zero knowledge  |     ☑     |     ☑     |    ☐     |
| Browser addon   |     ☑     |     ☑     |    ☑     |
| Import          |     ☑     |     ☑     |    ☑     |
| Export          |     ☑     |     ☑     |    ☑     |
| Open source     |     ☐     |     ☑     |    ☐     |

Ultimately, we went with [Bitwarden](https://bitwarden.com/), which met all of our
requirements and desired features at the best price!

### Set up Bitwarden

A new password manager (or new anything!) is a good opportunity to form new habits.

We took advantage of this to standardize how our data was stored. We exported all our
LastPass data, sorted through it, and imported it into Bitwarden, following new naming
and grouping conventions.

There were a few benefits to this:

* Staff are responsible only for importing their own data, not organizational data
* Minimize duplication of data when we actually onboard staff
* Easy onboarding process for new staff moving forward, as people gain access to shared
  items via groups rather than individual sharing
* Better organization of data and more clear ownership moving forward

### Planned the migration from all angles

We planned this step carefully to avoid losing data and to ensure that people have 
continuous access to the secrets they need to do their work! We identified the what, who,
and who of other password managers in use at your organization.

Our password management scenario was challenging. We never had a password manager used
organization-wide. As a result, we had five total scenarios:

1. LastPass Teams users (on our paid plan)
2. LastPass Individual users (free plans)
3. Google Password Manager users
4. Multi-password-manager users
5. Password manager non-users

Moving to Bitwarden presented an opportunity to unify where we store our secure data, with
these key benefits:

* Staff can access to tools shared across our organization
* Staff can share and receive secure data across the organization
* Staff can share, generate, and automatically fill out passwords, which makes good
  password practices easier (going back to making the easiest choice the also most secure
  one)
* No more loss of access when people leave staff
* Increased auditability of our secrets

### Created onboarding materials

With our current password manager scenario understood, we documented how we expected people to
move to our new provider, what actions they needed to take by when, and what data they where
responsible for migrating over.

Internally, we shared an easy-to-follow guide with a decision chart that staff could follow to
get to the right help materials.

{{< mermaid class="bg-light text-center" >}}
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#C4D7A4',
      'lineColor': '#A1A1A1',
      'arrowheadColor': 'A1A1A1'
    }
  }
}%%
graph TD

Q[What password manager are you currently using?]
Q --> LP0[LastPass Teams] --> G0[Guide]
Q --> LP1[LastPass Individual] --> G1[Guide]
Q --> GP[Google Passwords] --> G2[Guide]
Q --> NP[No password manager] --> G3[No data to import!]
{{< /mermaid >}}

In these guides, alongside technical information on the how, we also included some anticipated
questions:

* What data am I [the user] responsible for importing?
* How can I find out if I’m part of a LastPass organization?

I've included some migration steps for you below!

### Sample migration guides

#### Migration steps for LastPass

Follow these steps if you’re using LastPass as part of Conservation Colorado’s team 
organization.
1. Log into your LastPass vault in your web browser
2. On the bottom left, select Advanced Options
3. Under “Manage your vault”, click “Export”. You may have to enter your LastPass main password
   to continue
4. LastPass will send you an email requesting you to authorize this process
5. Once you’ve confirmed the export, return to LastPass
6. Return to Advanced Options > Manage your vault and click “Export” once more
7. Depending on your browser:
    * Your data will printed to the screen in a .csv format (common), OR
    * Your data will automatically save as a .csv (uncommon)
8. If your data was printed in your browser, highlight and copy it, otherwise continue
    * Select all: `⌘ Cmd + A (macOS)` or `⌃ Ctrl + A` (Windows & Linux)
    * Copy text: `⌘ Cmd + C (macOS)` or `⌃ Ctrl + C` (Windows & Linux)
9. Log in to the Bitwarden web vault at this link
10. Select Tools > Import data
11. Under “Select the format”, choose “LastPass (csv)”
12. Enter your data depending on how you’ve got it formatted:
    * If you copied the text, paste it into the box. Paste text: `⌘ Cmd + V (macOS)` or
      `⌃ Ctrl + V` (Windows & Linux)
    * If you downloaded the .csv, click “Choose File” and add that file
13. Click “Import data” to start importing!
14. Confirm the import worked by navigating to Vaults > My vault in Bitwarden
15. When you’re done, clear your imported data from your computer:
    * If you copied the text to your clipboard, copy some other text to replace it, or log out
      and log back into your operating system
    * If you downloaded the file, delete it permanently with the following shortcut in your 
      file viewer (Finder on macOS, Explorer on Windows) with `⌘ Cmd + ⌥ Option + ⌫ Backspace`
      (macOS) or `⇧ Shift + Delete` (Windows & Linux)
    * Alternatively, you can delete that file then empty your Trash or Recycle Bin.
16. Uninstall the LastPass extension
    * If you’re using Google Chrome, navigate to `chrome://extensions/`

**Note:** Importing your vault data does not check whether what you’re importing already exists
in your vault. If you import multiple files or import files with items already in your vault, 
this will create duplicates.

#### Migration steps for Google Passwords

Follow these steps if you’re using Google Password Manager on your Google Workspace account.
1. Log into Google Password Manager in your web browser
2. Click the gear icon in the top right to access the settings menu
3. Uncheck “Offer to save passwords” and “Auto sign-in”
4. Under “Export passwords”, click “Export”, then confirm it
5. Google may prompt you to enter your password
6. Once you confirm your identity, your browser will download a file called 
   `Google Passwords.csv`. This file has all your passwords.
7. Log in to the Bitwarden web vault at this link
8. Select Tools > Import data
9. Under “Select the format”, choose “Chrome (csv)”
10. Click “Choose File” and add the file you just downloaded from Google
11. Click “Import data” to start importing!
12. Confirm the import worked by navigating to Vaults > My vault in Bitwarden
13. When you’re done, permanently delete `Google Passwords.csv` with the following shortcut
    in your file viewer (Finder on macOS, Explorer on Windows). 
      * `⌘ Cmd + ⌥ Option + ⌫ Backspace` (macOS) 
      * `⇧ Shift + Delete` (Windows & Linux)
      * Alternatively, you can delete that file then empty your Trash or Recycle Bin.

**Note:** Importing your vault data does not check whether what you’re importing already exists in your vault. If you import multiple files or import files with items already in your vault, this will create duplicates.

### Launch!

When you're ready, work out a launch date and make your announcement! This is where your
prep work will pay off.

Processes like this work best when you communicate regularly and clearly. We set aside help 
desk time over the first two weeks to specifically assist our staff in migrating their data.
We also took this time to ensure everyone had two-factor authentication and recovery methods
set up. Of course, we also sent out these instructions for users who preferred to 
self-service.

Overall, the work we did coming up to this made the launch go smoothly!

We waited a few months of use on Bitwarden before we deleted and closed out our LastPass 
accounts.

## Conclusion

Whether you're starting up using one for the first time or migrating to a different tool,
I hope this retrospective overview about our recent password manager migration is helpful!
If you have any questions, please [contact us](/contact) or leave a comment below.

We're always looking for passionate people who want to make real change for Colorado’s 
environment and communities! If you're interested in working for us, view all of our 
current openings by [visiting our jobs page](https://conservationco.org/jobs/)!
