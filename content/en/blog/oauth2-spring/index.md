---
title: "Spring OAuth Client With A Test-Driven Approach"
description: "Implementing a Spring OAuth2.0 client application, taking a test-driven approach."
excerpt: ""
date: 2023-06-26T22:17:37-06:00
lastmod: 2023-06-26T22:17:37-06:00
weight: 50
images: ["main.jpg"]
categories: ["OAuth2.0 Series"]
tags: ["guide", "test-driven-development", "TDD", "OAuth", "OAuth2.0", "OpenID Connect", "security", "authentication", "authorization", "authorization code flow", "authorization code flow with PKCE", "PKCE", "software development", "Spring Security", "Spring Boot", "Spring", "client-application"]
contributors: ["Oliver Abdulrahim"]
toc: true
---

## Background

When I first implemented an OAuth2.0 {{< glossary-tooltip id=client-application >}}
at our organization, configuring our reactive Spring application correctly and securely
took lots of time to figure out! This is the guide I wish that I had when I was doing
that work.

In this post, I'll take a test-driven approach to setting up a reactive OAuth2
client. Much of the configuration is the same as classic Spring Web, but exact class
names and testing differ slightly between the two frameworks.

If you prefer to jump straight in, I've included two GitHub repositories
to help you get started: one written in Kotlin, and the other in Java. Both use
Maven for dependency management.

* [kotlin-oauth2-client-starter](https://github.com/ConservationColorado/kotlin-oauth2-client-starter)
| [Dependency Graph](https://github.com/ConservationColorado/kotlin-oauth2-client-starter/network/dependencies?q=spring)
| [MIT License](https://github.com/ConservationColorado/kotlin-oauth2-client-starter/blob/main/LICENSE)
* [java-oauth2-client-starter](https://github.com/ConservationColorado/java-oauth2-client-starter)
| [Dependency Graph](https://github.com/ConservationColorado/java-oauth2-client-starter/network/dependencies?q=spring)
| [MIT License](https://github.com/ConservationColorado/java-oauth2-client-starter/blob/main/LICENSE)

## OAuth2.0 login

I'll start with implementing an OAuth client with basic login, which will
allow you to request OpenID Connect scopes like `openid`, `profile`,
`email` as well as OAuth2 scopes specific to your provider.

I'll assume you have the below dependencies added to your project and build
system. If you're using [start.spring.io](https://start.spring.io/) or
IntelliJ's Spring project creator, include these:

* Spring Reactive Web
* Spring Security
* Spring Security OAuth 2 Client

### Set up your provider

#### Acquire a `client_id` and `client_secret`

I've discussed this in a
[previous article](http://localhost:1313/blog/getting-started-with-implementing-oauth2.0/#how-to-implement-oauth-into-your-application),
but you'll want to register your application with an OAuth2.0 / OIDC 1.0
provider like Google, GitHub, Okta, or Microsoft.

Exact steps may differ. Ultimately, acquire a `client_id` and `client_secret`
from your provider, and set your `redirect_uri` as
`<your base url>/login/oauth2/code/google`.

#### Add your OAuth provider details to `application.yml`

The simplest way to set up your provider is by adding configuration to
`./src/resources/application.yml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            client-id: ${CLIENT_ID}
            client-secret: ${CLIENT_SECRET}
            authorization-grant-type: authorization_code
            scope:
              - openid
              - profile
              - email
```

In this example, I've used Google as the provider. You could also define
more than one provider at once! Check the
[Spring documentation](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/oauth2/client/CommonOAuth2Provider.html)
for more details.

I've defined some base OpenID Connect scopes, but you can add more
OAuth scopes as needed.

This configuration also assumes that you're supplying your `client_id`
and `client_secret` via environment variables as is best practice.

### Basic Authentication tests

Let's define what behavior we expect from our server with some tests.
First, let's define an authentication test container class.

```kotlin
@SpringBootTest
@AutoConfigureWebTestClient
internal class AuthenticationTests(
    @Autowired private val client: WebTestClient,
)
```

Here, I've called for Spring to inject and configure a reactive web test
client, but if you're working with classic Spring Web, you can use
[`MockMvc`](https://docs.spring.io/spring-framework/docs/6.0.10/javadoc-api/org/springframework/test/web/servlet/MockMvc.html),
then optionally annotate your test classes with
[`AutoConfigureMockMvc`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/AutoConfigureMockMvc.html).

It's fair to expect that our server to redirect unauthorized attempts to
protected endpoints to our provider's OAuth login page. Let's add simple
tests to do that.

```kotlin
@Test
internal fun `should not allow unauthenticated access to protected endpoint`() {
    client
        .get()
        .uri("/user/me")
        .exchange()
        .expectStatus().is3xxRedirection
}

@Test
internal fun `should redirect unauthenticated access to Google login URI`() {
    client
        .get()
        .uri("/user/me")
        .exchange()
        .expectHeader().valueEquals("Location", "/oauth2/authorization/google");
}
```

These tests actually pass without us having to do anything else!

You might have expected the first test to fail with a `404 Not Found` as
we haven't yet defined a `/user/me` endpoint --- I did! However, we have
`spring-boot-starter-oauth2-client` in the classpath, and we have
configured our client settings.

This gives Spring Security everything it needs to set up our OIDC
login with the secure default of `302` redirecting all unauthenticated
requests. Doing this for every such request, whether or not that endpoint
exists gives would-be attackers no additional information about what
endpoints your server has or does not have.

Test-driven development is great for isolating the moving parts in
situations like this. Spring Security does a ton of autoconfiguration.
Taking this approach can help us better understand what's going on
behind the scenes.

Next, let's actually implement that `/user/me` endpoint.

### Add `/user/me` tests and endpoint

To prove that our OAuth configuration actually works, let's add an
endpoint that returns the currently authenticated user's name.

How can we test for that? Well, first, we need to mock up an authenticated
user. We'll use
[utilities provided by Spring Security Test](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/test/web/reactive/server/SecurityMockServerConfigurers.html).

```kotlin
internal const val MOCK_USER_FULL_NAME = "Perry The Platypus"

internal fun mockOidcUser() =
    SecurityMockServerConfigurers
        .mockOidcLogin()
        .idToken { it.claim("name", MOCK_USER_FULL_NAME) }
```

Great, now we can mock up authenticated requests in our tests! Since
we expect to reuse that mock user's name again in our tests,
I've defined it as a `const`.

Let's think up a contract for our `/user/me` endpoint. I want it
to return an object containing the user's full name. Let's define
a data class to encapsulate that.

```kotlin
data class Name(val data: String)
```

Next, let's write up a test to define exactly what we expect from
`GET /user/me`.

```kotlin
@Test
internal fun `should return authenticated user's full name`() {
    val expected = MOCK_USER_FULL_NAME
    val actual = client
        .mutateWith(mockOidcUser())
        .get()
        .uri("/user/me")
        .exchange()
        .expectBody<Name>()
        .returnResult()
        .responseBody
        ?.data
    assertEquals(expected, actual)
}
```

Let's reuse that mock user to also expect authenticated users can
access that protected endpoint.

```kotlin
@Test
internal fun `should allow authenticated access to protected endpoint`() {
    client
        .mutateWith(mockOidcUser())
        .get()
        .uri("/user/me")
        .exchange()
        .expectStatus().isOk
}
```

Currently, our two new tests fail, as we haven't defined that
endpoint yet!

{{< test-results >}}
ERROR --- [main] o.s.t.w.reactive.server.ExchangeResult: Request details for assertion failure:

> GET /user/me
< 404 NOT_FOUND Not Found

java.lang.AssertionError: Status expected:<200 OK> but was:<404 NOT_FOUND>
Expected :200 OK
Actual   :404 NOT_FOUND
{{< /test-results >}}

### Implement user controller

Great Let's make a simple REST controller class.

```kotlin
@RestController
@RequestMapping("/user")
class UserController 
```

Then add the `/user/me` endpoint...

```kotlin
@GetMapping("/me")
fun getCurrentUsersName(@AuthenticationPrincipal user: OidcUser) =
    Mono.just(
        ResponseEntity.ok(
            Name(user.idToken.claims["name"].toString())
        )
    )
```

We have a few options to retrieve the currently authenticated user.
Here, I've opted for the simplest, the
[`AuthenticationPrincipal`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/annotation/AuthenticationPrincipal.html)
annotation.

All our tests now pass --- excellent!

Check out that server endpoint in the browser at
`http://localhost:8080/user/me`, and the generic
login page at `http://localhost:8080/login`.

### Session cookies set by Spring

After you log in, look closely at the cookies your app stores in
the browser.

| Name    | Value       | Domain    | Path | Expires | HttpOnly |
|---------|-------------|-----------|------|---------|:--------:|
| SESSION | a5fcd8ef... | localhost | /    | Session |     ✓    |

Spring Security sets a session token that allows you to stay
authenticated. This cookie is only accessible by network requests
and is much more secure than sending actual access tokens to the
browser environment. I discussed this in more detail
[in a previous article](/blog/getting-started-with-implementing-oauth2.0/#flow-finishes-on-a-secure-back-channel).

## Next steps for production

Excellent --- we've successfully implemented a very simple OAuth
client application.

Follow these next steps to get your application more ready for a
production setting!

### Define a `SecurityWebFilterChain` bean

To further customize your server's security rules, define a
[`SecurityWebFilterChain`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/server/SecurityWebFilterChain.html)
bean. This is the Spring Security component that processes every incoming
request made to your server against rules that you set up. It's a critical
part of user {{< glossary-tooltip id=authentication >}} and
{{< glossary-tooltip id=authorization >}}, later CORS and CSRF
configuration we'll add, and defines how you want your server to handle
security-related success and failure.

You can place this bean in any class annotated with
[`Configuration`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html). Convention dictates you use a class named `SecurityConfiguration`, or
`SecurityConfig` in a package called `config`, but this is not a requirement
for it to work!

{{< alert icon="☀️" >}}

Annotate the class containing this bean with
[`@EnableWebFluxSecurity`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/reactive/EnableWebFluxSecurity.html),
which tells Spring to use WebFlux for Spring Security!

{{< /alert >}}

Below is the equivalent configuration for what Spring Security had
set up automatically.

```kotlin
@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) =
    http
        .authorizeExchange { it.anyExchange().authenticated() }
        .oauth2Login { }
        .build()
```

Note the empty block passed into the `oauth2Login` call. You can
add additional configuration here later.

Our tests still pass after these changes, so we haven't broken anything
that we know about ;)

### Configure an endpoint allowlist

In production, you'll likely have endpoints you want to specifically
allow. Let's update our `SecurityWebFilterChain` definition to accomplish
this.

```kotlin
@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) =
    http
        .authorizeExchange {
             it.pathMatchers("/", "/login", "/error").permitAll()
               .anyExchange().authenticated()
        }
        // other configuration omitted
```

### Customizing OAuth2.0 success and failure behavior

After your server completes the flow, you may want to send the user-agent
back to another URI. For example, back to your front end application or
where the request originated.

You can do this by adding a success handler, which intercepts all
successful OAuth login attempts. Here's an example.

```kotlin
@Component
class OAuth2LoginSuccessHandler : ServerAuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        webFilterExchange: WebFilterExchange,
        authentication: Authentication
    ): Mono<Void> {
        redirectUser(webFilterExchange.exchange.response)
        // here's where you could store the user in a repository
        return Mono.empty()
    }

    private fun redirectUser(response: ServerHttpResponse) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT
        response.headers.location = URI.create("your-url")
    }

}
```

It may help to pass in your URLs as environment variables to increase
parity between your development and production environments.

Add that handler to your configuration as shown below.

```kotlin
@Autowired
private val successHandler: OAuth2LoginSuccessHandler

@Bean
internal fun securityWebFilterChain(http: ServerHttpSecurity) = 
    http
        .oauth2Login {
             it.authenticationSuccessHandler(successHandler)
        }
        // other configuration omitted
```

You'll also want to add some configuration on authentication failure,
perhaps sending the user-agent back to a helpful error page.

### Add a basic CORS configuration

If your front end application needs to log in or log out users
(you'd do this via a `POST` request to your Spring server), you'll
need to configure your back end to allow requests from that origin.

Spring Security automatically configures some sensible defaults for your
application, which disallows cross-origin mutating requests. I'll
further discuss how you can implement these changes in a future article.

### CSRF configuration

If your back end allows users to mutate the application state, you'll
want to protect authenticated users from cross-site request forgery
(CSRF) attacks. Here, an attacker uses the user's authentication to
execute unwanted requests on their behalf.

To prevent this, set a cookie with a unique CSRF token. Set that cookie
as `HttpOnly` to make it inaccessible from JavaScript. Then, require
that token on all `PUT` and `POST` requests.

Spring has some great built-in functions to help you do this. Again,
I'll discuss this further in a future article.

### Implement a logout system

You'll want to implement a proper logout system that invalidates the
currently authenticated user's session.

Here's a rather simple example.

```kotlin
@RestController
@RequestMapping("/oauth2/logout")
class LogoutController {
    @PostMapping
    fun logout(session: WebSession) = session.invalidate()
}
```

### Implement PKCE flow to prepare for OAuth2.1

Currently, our application uses the classic authorization code flow.
This is already very secure; with the advent of OAuth2.1 in the near
future, all applications using this flow will need to implement the
PKCE step as well.

In a future article, I'll discuss how you can do this with Spring
Security.

## Conclusion

I hope you found this test-driven overview of implementing a Spring
OAuth client application helpful! Take your time with this topic. You
want to get production application security right!

In a future article, I'll further discuss configuring CORS and CSRF,
again taking a test-driven approach.

Thanks for reading!

--- Oliver Abdulrahim
