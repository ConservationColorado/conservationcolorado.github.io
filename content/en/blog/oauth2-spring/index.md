---
title: "Spring OAuth Client With A Test-Driven Approach"
description: "Implementing a Spring OAuth2.0 client application, taking a test-driven approach."
excerpt: ""
date: 2023-06-26T22:17:37-06:00
lastmod: 2023-06-26T22:17:37-06:00
weight: 50
images: []
categories: []
tags: []
contributors: []
toc: true
---

## Dependencies you'll need to include

* web test Client
* webflux
* oauth2 client spring security

## Basic OAuth2.0 login

First, let's define a class to contain these authentication tests.

```kotlin
@SpringBootTest
@AutoConfigureWebTestClient
internal class AuthenticationTests(
    @Autowired private val client: WebTestClient,
)
```

We'll use Spring's reactive test client, but if you're working with classic
Spring Web, you can use `WebClient`.

First, we should expect that anyone can access public pages on the Spring server
without needing to log in. You may have other pages to add to this test. For now,
I'll test the base URL at `/` and the error page at `/error`. 

```kotlin
@Test
internal fun `should allow access to public pages`() {
    client
        .get()
        .uri("/")
        .exchange()
        .expectStatus().isOk
    client
        .get()
        .uri("/error")
        .exchange()
        .expectStatus().isOk
}
```

Running this now will obviously fail, because we haven't done any configuration!
Let's add some to make this test pass.

First, define a `SecurityWebFilterChain` bean. You can place this in any class
annotated with `@Configuration`. Convention dictates you use a class named
`SecurityConfiguration`, or `SecurityConfig` in a package called `config`, but
this is not a requirement for it to work!

```kotlin
@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) =
    http.authorizeExchange {
            it.pathMatchers("/", "/error").permitAll()
        }
```

@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) =
    http.authorizeExchange {
            it.pathMatchers("/", "/error").permitAll()
              .anyExchange().authenticated()
        }

Then, we should also expect that 
    @Test
    internal fun `should redirect unauthenticated requests`() {
        client
            .get()
            .uri("/user/me")
            .exchange()
            .expectStatus().is3xxRedirection
    }

    @Test
    internal fun `should allow access to protected pages with authentication`() {
        client
            .mutateWith(mockOidcUser())
            .get()
            .uri("/user/me")
            .exchange()
            .expectStatus().isOk
    }

}

internal fun mockOidcUser(): SecurityMockServerConfigurers.OidcLoginMutator =
    SecurityMockServerConfigurers
        .mockOidcLogin()
        .idToken { it.claim("name", "Mock User") }

## Minimum viable example

Here's the minimum configuration needed for an OAuth client application in Kotlin:

```kotlin
@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) =
    http.authorizeExchange {
            it.pathMatchers("/", "/error").permitAll()
              .anyExchange().authenticated()
        }
        .oauth2Login()
        .build()
```

And here's the equivalent Java code:

```java
@Bean
internal SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    http.authorizeExchange((authSpec) -> 
            authSpec.pathMatchers("/", "/error").permitAll()
                .anyExchange().authenticated();
        )
        .oauth2Login()
        .build();
    return http.build();
}
```

## Customizing OAuth2.0 Success Behavior

You may want to send the user-agent back to another URI, for example, your front
end application where the request originated.

You can do this by adding a success handler, which intercepts all successful OAuth
login attempts.

Here's how you can update your configuration to include that handler (Kotlin):

```kotlin
@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) {
    http.authorizeExchange {
             it.pathMatchers("/", "/login", "/error").permitAll()
               .anyExchange().authenticated()
        }
        .oauth2Login {
             it.authenticationSuccessHandler(successHandler)
        }
        .build()
```

And the equivalent Java code:

```java



```

## Adding a basic CORS configuration

You'll need to allow requests from your front end application.

```kotlin

<config here>

```

## Next steps for production

You'll want to add some configuration on authentication failure. Perhaps
send the user back to an error page.



