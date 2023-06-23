---
title: "Authorization Server"
description: "An OAuth component that authenticates the resource owner and the client application as well as issuing access tokens"
date: 2023-06-21T18:59:14-06:00
lastmod: 2023-06-21T18:59:14-06:00
images: []
---

An OAuth component that authenticates the [resource owner](#resource-owner)
and the [client application](#client-application), and issues
[access token](#access-token)s. It also handles the revocation of expired
tokens.

When using an [authorization provider](#authorization-provider) like
Google, Microsoft, or GitHub, the authorization server is external to the
application.
