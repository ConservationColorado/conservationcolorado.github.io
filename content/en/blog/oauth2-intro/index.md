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

## About this article

{{< alert icon="☀️" text="The main audience of this post is developers and organization administrators." />}}

#### What I'll discuss

In this article, I'll talk about OAuth2.0 as a way for users to authorize your
application to access their data and act on their behalf.

#### What I'll save for later

In a future article, I'll also discuss OpenID Connect (OIDC), an
authentication extension on top of OAuth. You can use OIDC along with OAuth 
(they work great in combination!) to securely manage user accounts within your
application. This is a complex topic, so let's discuss it another time in more
focus.

#### What I won't discuss

We'll only talk about OAuth2.0 which, as the name suggests, is the second
revision of the OAuth specification. As OAuth1.0 is no longer used on the 
modern web, I'll use "OAuth" and "OAuth2.0" interchangeably.

## Why learn about OAuth?

If you're using modern APIs on behalf of users, you will likely need to
implement OAuth to get started. Even if you aren't in this category, OAuth
is a good technology to familiarize yourself with because:

1. OAuth is very widely used
2. OAuth provides a great user experience out of the box
3. You don't have to store passwords (though you will still manage secrets)
4. You can access specific user data without asking for any account-wide
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

Sound scary? Yeah. The early internet was an interesting place.

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

## What is OAuth, exactly?

As I touched on above, OAuth is a widely used *authorization* mechanism for
delegated access. 

If you've ever used a "Sign in with Google", "Sign in with Microsoft", or 
"Sign in with -some service name-" button to log on to a service, then you've
used OAuth! This allows you to grant that service access to parts of an account
you hold with another service, all without signing up with a new password.

A lot of "magic" happens behind the scenes in the most common 
{{< glossary-tooltip id=oauth-flow >}}s implemented in mobile and web apps.
This is the *authorization code flow*, with its close relative the 
*authorization code flow with proof key for code exchange* (PKCE, pronounced
'pixie' -- it's cute like that). While both flows achieve the same thing, and
one supersedes the other, it's worth knowing about both. I'll discuss the
history and motivation behind each.

While you can follow the OAuth specification and implement your own
authorization and resource servers, this article will discuss the more common
use case of implementing OAuth through an external authorization provider.
By the end of this article, you'll be ready to start implementing OAuth flows
in your application!

### OAuth important terms defined

There are several flows and lots of terms defined in the 
[OAuth2.0 specification](https://www.rfc-editor.org/rfc/rfc6749).

I've highlighted the most important of these in plain words so you can 
familiarize yourself. Hover over each concept to learn more.

#### General security terms
It's good to differentiate
{{< glossary-tooltip id="authentication" >}} and
{{< glossary-tooltip id="authorization" >}}. The former concerns *who* can
access something protected, and the latter is all about *what* things you're
permitted to access and to do within that system.

#### OAuth entities

Getting more OAuth-specific, the
{{< glossary-tooltip id="authorization-provider" >}} and
{{< glossary-tooltip id="authorization-server" >}} relate to the components
that verify if you're allowed to access the things you're asking for.

In contrast, the {{< glossary-tooltip id="resource-server" >}} is what keeps 
the data you're interested in accessing on behalf of the user. In many cases,
the authorization provider also manages the resource server. This is the case
in our example from earlier, Google maintains a user's identity *and* their
Google Photos data. On the topic of users, you may also hear about the 
{{< glossary-tooltip id="resource-owner" >}}, which just describes the user
themselves.

Your code fits into all of this as the
{{< glossary-tooltip id="client-application" >}}. This is what the user
consents to have do things on their behalf.

#### OAuth flow final steps

The final goal for your application at the end of the OAuth flow is to get
hold of an {{< glossary-tooltip id="access-token" >}}. This is what you'll
use to things on behalf of a user. In our example, Google would issue an
access token limited to the specific permissions granted to your app. Bear
in mind that this token is considered a secret!

The {{< glossary-tooltip id="redirect-uri" >}} is where the authorization
provider sends the user back upon successful completion of the OAuth flow.
This is typically back to your application.

## About the Authorization Code Flow

This flow requires your application to  client application with:
  * `client_id`
  * `client_secret`
  * `redirect_uri`
  * declared `scope` of data it asks users for
  *

## About the modified Authorization Code Flow with PKCE

This flow

## How to implement OAuth into your application

### Best practices and security trade-offs

https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics
Before I get into details, I wanted to discuss how as developers, we're
always balancing security with any number of other factors: usability, cost,
convenience, performance, flexiblity, risk, and so on.

Even though you don't handle usernames and passwords within an OAuth flow,
you're still handling secrets (tokens). You need to understand the risks
that introduces before you can build a secure application.

### Browsers are insecure

The authorization code flow is made to take advantage of the best parts
of each element of a full stack application. 

The flow starts on the front channel, typically accessed through a web
browser. This is a great place to get user input, as browsers are fast,
interactive, and user-friendly. At the same time, they're are also an 
insecure, leaky environment. Anywhere you put an access token, it's 
accessible to the browser's JavaScript engine.

### Finish the flow on a secure back channel

Since there's no secure API to to store secrets in a browser, the flow
ends on a secure back channel. This is a dynamic web server that you
create, with at least an authorization code exchange endpoint publicly
available on the Internet. Your authorizaion provider calls this endpoint
to finish exchanging the authorization code for tokens. 

Then, your back end server stores and manages the tokens.

### But what about the (deprecated) implicit flow?

You may have heard about the implicit OAuth flow. This flow was 
introduced as a workaround for applications that couldn't securely store
a `client_secret`, like single-page and mobile applications.

In the past, The PKCE version of
the flow makes trade-offs
meant for use when you have both a front channel
(typically a browser or mobile app) *and* a back channel (typically)

## Set up with your provider

OAuth is an open standard, so the general things you need to get are the
same across authorization providers, though the steps you take may differ.
I'll continue with our Google example.

### Create a project
These are the only steps that are very provider-dependent. For Google,
you'll need to 
[create a Google Cloud project on the web](https://support.google.com/cloud/answer/6158849?hl=en).

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

