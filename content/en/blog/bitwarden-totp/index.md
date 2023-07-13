---
title: "Using Bitwarden As An Authenticator App"
description: "How to use Bitwarden to replace authenticator apps on your phone."
excerpt: ""
date: 2023-07-11T16:28:25-06:00
lastmod: 2023-07-11T16:28:25-06:00
weight: 50
images: ["main.jpg"]
categories: []
tags: ["Bitwarden", "TOTP", "two-factor-authentication", "security", "password-managers", "2FA"]
contributors: ["Oliver Abdulrahim"]
toc: true
mermaid: true
---

{{< alert icon="☀️" text="The main audience of this post is anyone who uses Bitwarden or authenticator apps." />}}

## Introduction

Do you have a work-related authenticator app on your phone? Perhaps you have more than
one: Google Authenticator, Salesforce Authenticator, Microsoft Authenticator, the list
goes on! You may even use Apple's iCloud Keychain or a desktop app on Windows.

Authenticator apps are a form of {{< glossary-tooltip id=2fa >}} that help you generate a timed 6-digit code called a
{{< glossary-tooltip id=totp >}} (TOTP). You use this code alongside a password to verify yourself when
you log into an account.

__Did you know that you can use Bitwarden password manager to generate those codes for you
instead of standalone authenticator apps?__

__Why it matters:__ This is very convenient, secure, and saves you from getting locked out of your accounts if you
don't have your phone. It's also a great way to keep your work things separate from your personal
device.

Don't use two-factor-authentication? Now's a great time to start!

In this article, I'll discuss that 6-digit code along with steps you can take to get your
Bitwarden serving them up!

__[Click here to jump to the tutorial portion of this article.](#tutorial)__

## About the Time-Based One-Time Password (TOTP)

{{< totp-simulator >}}

### So, what's a TOTP?

Now that you know what they look like, what is a TOTP?

You can think of a TOTP as a short-lived password. That's the "time-based" part of the name. "One-time" refers to the
fact that the code is always changing; the one you have now is different from the code that you'll have the next time it
resets.

This ephemerality makes TOTPs more secure! If anyone happens to swipe your current code, it's not  useful for very long,
and is not useful without your primary password.

### How do you get one?

The super formal name for an app that generates these codes is "Time-Based One-Time Password
(TOTP) client". For conciseness, I'll continue to say "authenticator app" or just "app" to
mean the same thing as TOTP client. Bitwarden password manager's TOTP client is the focus of
this article.

### How does an authenticator app work?

When you set up two-factor authentication with a site, you and that site keep a
{{< glossary-tooltip id=shared-secret >}}. Phone-based authenticator apps get a hold of this secret by having you scan a
QR code with your phone's camera. This is a clever way to deliver the secret, which is a long string of random letters
and numbers, without making you manually type it into your phone.

That said, we won't scan any QR codes today! When we set up Bitwarden password manager to generate
TOTPs, we'll copy and paste the shared secret directly into your vault entry for that site. I'll
show you how in a bit.

{{< alert icon="☀️" text="Tip: If you're having trouble getting a valid TOTP from your app, check to make sure that the device you're generating the code on has the correct current date and time set. These must be accurate!" />}}

### Are authenticator apps cross-compatabile?

You may ask: there are so many authenticator apps --- don't I need to use that company's
authenticator app for their service? This is a great question, and the answer is *no*!

Sites that support TOTP second-factor authentication follow the same protocol
([RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)). This commonality is what makes
authenticator apps generally cross-compatable.

This means that you can use Bitwarden password manager to replace your authenticator apps (in
almost all cases!).

### Advanced details

{{% hidden-section %}}

#### QR code URI scheming

If you're curious, those shared secret QR codes use the `otpauth://`
[URI scheme](https://css-tricks.com/create-url-scheme/). This tells your phone to open a compatible
authenticator app when scanned.

#### Shared secret generation

The shared secret is generated with a hashing function, typically a variant of an HMAC. This is
important because we need unique secrets so that no two users can derive the same TOTP at a given time.
Note that this means that your device needs the correct system time set to generate a valid code (for
phones and laptops, this is no problem).

TOTPs are generated via *symmetric* cryptography, as both the user and the site use the same key.
The RFC I linked above recommends this algorithm generate a new code every 30 seconds. This provides
good usability --- you can type 6 numbers in a few seconds --- balanced with codes that are short-lived
enough to not get easily reused by an attacker.

#### Potential risks with TOTP authentication

Although this method is convenient, like any code authentication, TOTPs are valid for a set period. If
stolen, an attacker can use them until expiry.

Also, if the shared secret is stolen, then the attacker can use it to generate new, valid codes until
that secret is invalidated. The attacker can steal the secret either from the server storing it on the
provider's end, or from the application storing it, like your unlocked authenticator app.

{{% /hidden-section %}}

## Tutorial

### Why you should do this

* You can easily authenticate yourself with sites using Bitwarden
* You can generate new codes from anywhere you can log into Bitwarden
* You avoid getting locked out if you don't have your phone
* After you finish setting up, you can delete your work-related standalone authenticator apps

### Video Demo

{{< video ratio="1x1" attributes="controls muted" webm-src="videos/tutorial.webm" mp4-src="videos/tutorial.mp4" >}}

### Steps

1. Open Bitwarden. You can follow these steps from the website, browser extension, desktop app, or phone app
2. Find and open the entry for the site you want to add 2FA to
3. Open that site and log into it
4. The exact next steps will depend on that particular site. See the above video for a live example. Here are some
   general steps:
    * Go to your account settings
    * Find the security section
    * Click add two-factor authentication
    * Select authenticator app
5. You may have to enter your password again, then you should see a QR code
6. Click "Can't Scan QR Code" or similar, which will then display your shared secret
7. Copy this secret to your clipboard
8. Paste it into the "Authenticator key (TOTP)" section of your Bitwarden entry for that site
9. Save that entry
10. Click the three-dots button on that entry, then click "Copy verification code"
11. Back in the site settings, paste in the code that Bitwarden generates and click verify

That's all! It's a good idea to keep at least one other 2FA method as a back-up.
If the site you just set up 2FA on allows you, generate recovery codes and also store them
in Bitwarden (a good place is the Notes section for that entry)

{{< alert icon="⚠️" text="Caution: Always have a back-up method of getting into your account. For example, if you use email 2FA to log into Bitwarden, don't rely only on Bitwarden's TOTP to get into your email account. Add a second 2FA method for getting into either Bitwarden or your email. This avoids a situation of circular dependencies, where you would need Bitwarden to log into your email and your email to log into Bitwarden!" />}}

{{< alert icon="☀️" text="Tip: Very rarely, some sites don't show a \"Can't Scan\" button below the QR code. In this case, you'll need to decode the QR image to get your shared secret." />}}

### Getting your codes post-setup

You can always copy the code as we did above by clicking on that entry in Bitwarden, then selecting "Copy verification
code".

However, there's an easier way with the Bitwarden browser extension:

1. Open the site you want to log into
2. When prompted to enter a code from your authenticator app, right click anywhere on the page and select Bitwarden >
   Copy verification code > that entry's name. This will copy the code to your clipboard. If your vault is locked,
   you'll be prompted to unlock it before you can select this.
3. Paste the code into the site
4. You're in!

## Bonus: Diagram Lifecycle of a TOTP

{{< mermaid class="bg-light text-center" >}}
---

title: Lifecycle of a TOTP

---
%%{
init: {
   'theme': 'base',
   'themeVariables': {
      'primaryColor': '#C4D7A4',
      'lineColor': '#A1A1A1',
      'secondaryColor': 'lightgrey',
      'arrowheadColor': '#A1A1A1'
   }
}
}%%
flowchart TD

subgraph b[Your Favorite Website]
   wtime[Current system time] --> whash
   wsec[Shared secret] --> whash
   whash[Hashing function] --> wotp
   wotp[Generate a code] --> valid
   valid[Are the codes the same?]
   valid -->| Yes |yes
   valid -->| No |no
   yes[Authenticated!]
   no[Denied!]
   style yes fill:#77dd77
   style no fill:#dd7777
end

subgraph a[Your Authenticator App]
   psec[Shared secret] --> phash
   ptime[Current system time] --> phash
   phash[Hashing function] --> potp
   potp[Generate a code] --> | You input that code: 123456 | valid
end
{{< /mermaid >}}
