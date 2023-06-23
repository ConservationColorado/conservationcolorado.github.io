---
title: "Google Forms or Asana Forms?"
description: "Which form tool should you use to gather input?"
excerpt: ""
date: 2023-06-23T15:31:50-06:00
lastmod: 2023-06-23T15:31:50-06:00
weight: 50
images: []
categories: []
tags: []
contributors: ["Oliver Abdulrahim"]
pinned: false
homepage: false
toc: true
mermaid: true
---

## About Google Forms

Using g forms doesn't cost any money.

## About Asana Forms

## Which should you use?

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
flowchart TD
  start -->|Yes| sign
  start -->|No| data
  sign  -->|No| a-forms
  sign  -->|Yes| g-forms
  data  -->|Record-keeping| g-forms
  data  -->|Actionable steps| a-forms

  start[Will users of your form need to upload files?]
  sign[OK if users have to sign into Google to use the form?]
  data[What will you use your data for?]
  g-forms[Google Forms]
  a-forms[Asana Forms]
{{< /mermaid >}}
