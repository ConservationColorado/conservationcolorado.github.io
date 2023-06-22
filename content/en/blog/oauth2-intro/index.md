---
title: "Getting Started With Implementing OAuth2.0" 
description: "Introduction to OAuth2.0 and how you can implement it in your application securely."
excerpt: "" 
date: 2023-06-21T10:31:20-06:00
lastmod: 2023-06-21T10:31:20-06:00
weight: 50
images: [] 
categories: [] 
tags: [] 
contributors: ["Oliver Abdulrahim"]
toc: true 
---

{{< alert icon="☀️" text="The main audience of this post is developers and organization administrators." />}}

In this article, I'll discuss OAuth2.0 as a way for users to authorize your
application to act on their behalf.

This article *only* covers OAuth2.0, which, as the name suggests, is the second
revision of the OAuth specification. I'll use "OAuth" and "OAuth2.0"
interchangeably as OAuth1.0 is no longer used on the modern web.

OAuth is an *authorization* mechanism. In a future article, I'll also discuss
OpenID Connect (ODIC), an *authentication* extension on top of OAuth. You can
use OIDC along with OAuth (they work great in combination!) to securely manage
user accounts within your application.

OAuth is widely used on the web today. If you've ever used a "Sign in with
Google", "Sign in with Microsoft", or "Sign in with -some service name-"
button to log on to a website, then you've used OAuth, perhaps without even
knowing it!

A lot of "magic" happens behind the scenes in the most common OAuth *flow*
implemented in mobile and web apps. This is the *authorization code flow* and
the *authorization code flow with proof key for code exchange (PKCE)*. While 
both flows achieve the same thing and one supersedes the other, it's worth
knowing about both. By the end of this article, you'll be ready to start 
implementing OAuth in your application!

## OAuth jargon defined

There are several OAuth2.0 flows defined in the 
[specification](https://www.rfc-editor.org/rfc/rfc6749). I'll discuss the 
authorization code flow in plain terms.

Terms you'll need to know are 
{{< glossary-tooltip id="authentication" >}},
{{< glossary-tooltip id="authorization" >}},
{{< glossary-tooltip id="authorization-provider" >}},
{{< glossary-tooltip id="authorization-server" >}},
{{< glosasry-tooltip id="client-application" >}},
{{< glossary-tooltip id="resource-owner" >}},
{{< glossary-tooltip id="resource-server" >}},
{{< glosasry-tooltip id="access-token" >}},
{{< glossary-tooltip id=redirect-uri >}}.
Hover over each to learn more.

## Why learn about OAuth2.0?

If you're using modern APIs on behalf of users, you will need to implement
OAuth2.0; it's a great option to consider even if you don't because:

1. You'll have great user experience out of the box
2. You don't have to store passwords (though you will still manage secrets)
3. You can access specific user data without asking for any account-wide
   credentials

## What problems does OAuth solve?

### Sharing data before OAuth

Before OAuth, to share say, pictures stored in your Google Photos with another
service, you'd have to give them your credentials. That is, you would give
someone other than Google your Google username and password! 

This is bad because:

1. __You've shared a lot:__ Your username and password end up in someone else's
   hands. They can do anything with any part of your account --- you just
   wanted to share some photos!
2. __You can't revoke access:__ You can't stop any single service from
   accessing your account without changing your password. This affects any
   other service using the same credentials.

Sound scary? It is. The early internet was an interesting place.

### Sharing data after OAuth

OAuth came about in the mid-2000s as a method of *delegated access*. It aimed
to solve the above problems by allowing users to authorize services (like your
app!) to access data on their behalf, all without exchanging passwords. 

Now, as a user, you'd click to authorize a service to access your Google
Photos. Then, if everything checks out, Google gives that service a special
token it can use to access just your Google Photos (not your Gmail, your
Contacts, or anything else). 

This is great because:

1. __No more password sharing:__ You don't give away any sensitive information.
2. __You consent to exactly what to share:__ And you can revoke that consent at
   any time.
3. __Secure credential management:__ The service receives tokens directly from
   the authorization provider (Google, in our example).

## Security is all about trade-offs

Before I dig into the two flows, I wanted to discuss how as developers, we're
always balancing security with any number of other factors: usability, cost,
convenience, performance, flexiblity, risk, and so on.

The authorization code flow is meant for use when you have both a front channel
(typically a browser or mobile app) *and* a back channel (typically)

## Authorization Code Flow

As the original and most widely used OAuth mechanism, the authorization code
flow allows /swer 

## A note about the deprecated Implicit Flow

The implicit flow *only* uses a `client_id` without a `client_secret`. It
bypasses the last half that appears in the authorization code flow. 

### Inherently less secure

This makes it inherently

# Notes

Cross origin resource sharing: 

Oauth flow works by POST request over to the token endpoint with the
authorization code that it has, it gets back an access token. If your OAuth2.0
server is on a different domain than your app, that is a cross origin request.
That can only happen if the OAuth2.0 server says its ok. Prior to the
possiblity of CORS in modern browsers, there was no way to do the proper
authorization code flow in browser.

That's why the implicit flow came around. The implicit flow ONLY uses the
client ID, no client secret. More importantly, it returns the access token in
the redirect from the authorization server and bypasses the entire second step.

More direct. Why do we have the extra step? The simpler route of returning the
access token immediately in the redirect, there are a lot more ways for that to
go wrong. That redirect step can fail. The token can be intercepted easily. In
OAuth2, the access token can be used by anyone who has it.

In the Authorization code flow, there's additional step where you get a limited
authorization code, that you then have to POST the code to exchange it for an
access token.

How can you trust the network on the post request? No such thing as 100%
secure. Everything is about mitigating risk.

Cryptography is not perfectly secure. We use large enough numbers where it is
practically impossible and we can limit the easier attacks. There are more ways
to steal the token itself than intercepting the POST request.

Broswer extensions that can see the address bar. Browsers are now more
featureful. Intercepting the POST request is much more difficult.

The implicit flow was how we did OAuth2 in the browser. Browsers can now modify
the path URL in the address bar - session history management API.

Landscape has evolved and that is the main motivator for this change. Implicit
flow is a less than ideal solution.

Mobile app landscape is evolving. Public clients - the secret is not guaranteed
safe. PKCE (pixie) extension developed for doing OAuth in mobile. Instead of a
preconfigured secret, it makes up a new secret on the fly every time. A dynamic
secret. Make up a new secret, hash it, then does the OAuth flow with that
additional hash value and gets the access token in the back channel. Securely
do the authorization code flow without a secret to ensure that someone else
    couldn't intercept the code. (extension to oAuth2)

Created for mobile apps, but useful for any client. You can't store a secret,
but you still want to use the best flow, the authorization code flow. Browsers
can just use PKCE without change to the spec.

The authorization code flow and PKCE is the best security.

Is this something we should immediately go do? If y ou have apps with the
implicit flow, there's no new risk - there's always a risky situation. As long
as you are doing things properly, you're probably fine. But yes eventually you
should.

Use PKCE using forward.

Does that mean that my browser is 100% secure? Unfortunately, there isn't a
secure storage API in browsers. At the end of a flow, you have an access token.
There's no good way to store that in the browser. Anywhere you put it, it's
accessible to JavaScript on the page.

PKCE only protects the redirect step.

Until we have secure APIs in browsers to store secrets, this will always be the
case.

Serving from a dynamic web server: use the back channel for the API and do the
OAuth2 flow on the server. The server does the authorization code flow. It
exchanges the auth code for the access token. Keep it on the server, then just
maintain a session on the browser. Session cookies are very secure - HTTPONLY
and Secure. 

Browsers are great because they're interactive and fast, but they are NOT
secure and they're leaky. None of this is secure without HTTPS! Think of
security holistically. Content security policies, HSTS, OWASP. resource for web
app security

If you're dealing with a pure JavaScript app with no server side component, and
you're doing OAuth2.0 in the browser, you must read all those

## Implicit flow

## Authorization Code flow

### Proof key for code exchange

Additional security is provided by the proof key for code exchange (PKCE),
which helps prevent cross

## Authorization providers

## Authorization as a service

