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
mermaid: true
---

## About this article

{{< alert icon="☀️" text="The main audience of this post is developers and organization administrators." />}}

### What I'll discuss

In this article, I'll talk about OAuth2.0 as a way for users to authorize your
application to access their data and act on their behalf.

### What I'll save for later

In a future article, I'll also discuss OpenID Connect (OIDC), an
authentication extension on top of OAuth. You can use OIDC along with OAuth
(they work great in combination!) to securely manage user accounts within your
application. This is a complex topic, so let's discuss it another time in more
focus.

### What I won't discuss

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

### Understanding OAuth's security trade-offs

Before I get into implementation details, I wanted to discuss how as
developers, we're always balancing security with any number of other
factors: usability, cost, convenience, performance, flexiblity, risk,
and so on.

Even though you don't handle usernames and passwords within an OAuth flow,
you're still handling secrets (tokens). You need to understand the risks
that introduces before you can build a secure application.

The authorization code flow is made to take advantage of the best parts
of each element of a full stack application.

### Flow starts on an insecure browser front channel

The flow starts on the front channel, typically accessed through a web
browser. This is a great place to get user input, as browsers are fast,
interactive, and user-friendly. At the same time, they're are also an
insecure, leaky environment. Anywhere you put an access token, it's
accessible to the browser's JavaScript engine.

### Flow finishes on a secure back channel

Since there's no secure API to to store secrets in a browser, the flow
ends on a secure back channel. This is a dynamic web server that you
create, with at least an authorization code exchange endpoint publicly
available on the Internet. Your authorizaion provider calls this endpoint
to finish exchanging the authorization code for tokens.

Then, your back end server stores, manages, and uses the tokens on behalf
of your front channel. To keep your user's authorization, set a session
cookie with the browser. These are very secure [with the `HttpOnly`
and `Secure` flags](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

There are a few advantages here:

1. Your users' access and refresh tokens never touch the browser
environment
2. Your business logic is nicely decoupled from your user interface
3. Your front end code and state management is simplified

### But what about the (deprecated) implicit flow?

You may have heard about the implicit grant OAuth flow. This flow was
introduced as a workaround with known security flaws (again, trade-offs!).
At the time that OAuth was introduced, browsers were unable to make
requests across domains (the authorization code flow requires a `POST`
request to exchange a code for a token). In other words, cross-origin
resource sharing (CORS) was not possible.

Applications that couldn't securely store a  `client_secret`, like
single-page and mobile applications, also defaulted to the implicit flow.

In 2023,
[you should *not* use the implicit flow](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#name-implicit-grant), as it is deprecated for the more
secure authorization code flow with PKCE.

### How does the PKCE flow solve problems with the implicit flow?

Instead of a preconfigured, agreed-upon `client_secret`, during the
PKCE, you'll make up a new secret on the fly every time you initiate
a flow. Then, you'll hash it and make the exchange then.

This protects the redirect step of the process. Here, the access token
is returned in a response to a `POST` request at the token exchange
endpoint. This is more secure than the implicit flow provides the token
in the final callback URL. URLs can end up in logs, bookmarks, browser
session synchronizations, and more. They're easier to tamper with than
network calls.

## Visual representations of OAuth

Here are some sequence diagrams to help you traverse each step of
the OAuth process.

### Authorization Code Flow

{{< mermaid class="bg-light text-center" >}}
---

title: Sequence Diagram For OAuth2.0 Authorization Code Flow

---
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
sequenceDiagram

    participant user as User
    participant fc   as Client Application (front channel)
    participant bc   as Client Application (back channel)
    participant auth as Authorization Server
    participant res  as Resource Server

    user->>fc:   Click OAuth sign-in button
    fc->>auth:   Authorization code request, initiating the flow
    auth->>user: HTTP 302 redirect to the provider's sign-in page
    user->>auth: Authenticate with provider and give consent
    auth->>fc:   Authorization code response
    fc->>bc:     Request to sign in user with the code
    bc->>auth:   Token exchange request with the code, client id & secret
    auth->>auth: Validates code, client secret
    auth->>bc:   Responds with tokens (access and refresh)
    bc->>bc:     Stores tokens, creates user if needed
    bc->>fc:     Respond with HTTPOnly session cookie
    user->>fc:   Hey, now do something on my behalf
    fc->>bc:     Request
    bc->>res:    Protected resource request with access token
    res->>bc:    Response with user data
    bc->>bc:     Compute
    bc->>fc:     Response

{{< /mermaid >}}

### Authorization Code Flow with PKCE

{{< mermaid class="bg-light text-center" >}}
---

title: Sequence Diagram For OAuth2.0 Authorization Code Flow With PKCE

---
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
sequenceDiagram

    participant user as User
    participant fc   as Client Application
    participant auth as Authorization Server
    participant res  as Resource Server

    user->>fc:   Click OAuth sign-in button
    fc->>fc:     Generate PKCE code challenge, verifier
    fc->>auth:   Request with code challenge
    auth->>user: HTTP 302 redirect to the provider's sign-in page
    user->>auth: Authenticate with provider and give consent
    auth->>fc:   Authorization code response
    fc->>auth:   Request with code and verifier to token exchange endpoint
    auth->>auth: Validates code, and PKCE
    auth->>fc:   Responds with tokens (access and refresh)
    fc->>fc:     Stores tokens locally
    user->>fc:   Hey, now do something on my behalf
    fc->>res:    Protected resource request with access token
    res->>fc:    Response with user data
    fc->>fc:     Compute
    fc->>user:   Indicate what happened

{{< /mermaid >}}

## How to implement OAuth into your application

### 1. Set up with your provider

OAuth is an open standard, so the general things you need to get are the
same across authorization providers, though the exact steps you take may
differ.

I'll continue with our Google example.

### 2. Gather your credentials and settings

These are the only steps that are very provider-dependent. For Google,
you'll need to
[create a Google Cloud project on the web](https://support.google.com/cloud/answer/6158849?hl=en).

Set up and register your client application and prepare your:

* `client_id` that identifies your unique app
* `client_secret`, which you'll never publicize
* `redirect_uri`, where the user ends up at the end of the flow
* `scope` of data you want to ask users for

### 3. Determine what flow you need to use

{{< mermaid class="bg-light text-center" >}}
---

title: Optimal Choice Of OAuth2.0 Flow By Application Type

---
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
flowchart TD
    Q[What type of application are you implementing OAuth2.0 into?]
    Q --> SPA[Single page app]
    Q --> MAP[Native app]
    Q --> JS[Pure JS web app]
    Q --> FS[Full stack web app]

    SPA & MAP & JS ==> PKCE
    FS == choose ==> PKCE & ACF

    ACF[Authorization Code Flow]
    PKCE[Authorization Code Flow with PKCE]
{{< /mermaid >}}

### 4. Find a library for your language and framework

You should use a library to make an OAuth client application. Don't roll
your own! For example, here at Conservation Colorado, we've used Spring
Security OAuth2. Here's a shortlist of client libraries:

| Language                           | Framework                                             | Dependency or library                                                                                                |
|------------------------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| JVM languages like Java and Kotlin | [Spring](https://spring.io/projects/spring-framework) | [Spring Security OAuth2.0 Client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html) |
| Python                             | [Flask](https://flask.palletsprojects.com/en/2.3.x/)  | [Flask OAuth Client](https://docs.authlib.org/en/latest/client/flask.html#flask-client)                              |
| JavaScript, TypeScript             | [Express](https://expressjs.com/)                     | [Passport](https://www.passportjs.org/)                                                                              |
| Go                                 | none required                                         | [Golang OAuth2](https://pkg.go.dev/golang.org/x/oauth2)                                                              |

For more libraries, check out the
[official OAuth documentation page](https://oauth.net/code/).
