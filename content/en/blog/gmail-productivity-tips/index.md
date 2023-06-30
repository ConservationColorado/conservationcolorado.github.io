---
title: "Gmail: Search Operators, Undo Send, and Filters"
description: "Productivity tips to help you get the most out of your Google mailbox!"
excerpt: ""
date: 2023-06-30T11:11:41-06:00
lastmod: 2023-06-30T11:11:41-06:00
weight: 50
images: ["main.jpg"]
categories: ["Guides"]
tags: ["google", "productivity", "email"]
contributors: ["Oliver Abdulrahim"]
toc: true
---

{{< alert icon="☀️" text="The main audience of this post is anyone who uses Gmail." />}}

## Looking for something? Search it!

Ever tried to find an email that someone sent you a long time ago,
but you can't exactly remember what was in it? You're in luck!
Each {{< glossary-tooltip id="search-operator" >}} listed below can
help you find a specific message or set of emails across your entire
mailbox.

### Search operator reference

To use these, simply enter the operator along with its required
arguments in the Gmail search bar.

#### With specific people

| __Operator__   | __What it does__                                  | __Example__                  |
|----------------|---------------------------------------------------|------------------------------|
| `to:`          | Matches emails you've sent to that address        | `to:info@conservationco.org` |
| `from:`        | Matches emails you've received from that address  | `from:example@gmail.com`     |
| `cc:`, `bcc:`  | Matches emails where that address received a copy | `bcc:oliver`                 |

#### In a specific place

| __Operator__   | __What it does__                                                                                     | __Example__           |
|----------------|------------------------------------------------------------------------------------------------------|-----------------------|
| `in`           | Matches a label like `chats`, `anywhere`, `inbox`, `trash`, `spam`, `important`, `unread`, `starred` | `in:my-amazing-label` |

You can generally use operators `in`, `label`, and `is` interchangeably!

#### From a specific time

| __Operator__   | __What it does__             | __Example__        |
|----------------|------------------------------|--------------------|
| `before:`      | Messages before a given date | `before:2021`      |
| `after:`       | Messages after a given date  | `after:2023-01-01` |

These operators accept arguments in date formats like:

* `YYYY`
* `YYYY-MM`
* `YYYY-MM-DD`
* `MM-DD-YYYY`
* `DD-MM-YYYY`

#### With specific attachments

| __Operator__   | __What it does__                                                                                      | __Example__      |
|----------------|-------------------------------------------------------------------------------------------------------|------------------|
| `has:`         | Matches messages with a `attachment`, `drive`, `presentation`, `document`, `spreadsheet` or `youtube` | `has:attachment` |
| `filename:`    | Matches messages with an attachment of a given name or type                                           | `filename:pdf`   |

#### Word matching

| __Operator__   | __What it does__                                          | __Example__               |
|----------------|-----------------------------------------------------------|---------------------------|
| `AROUND`       | Match messages with these terms *n* words near each other | `coupon AROUND 100 tacos` |
| `""`           | Match messages with this exact phrase                     | `"free shawarma"`         |
| `+`            | Include only messages that match what follows             | `+coupon`                 |
| `-`            | Exclude all messages that match what follows              | `-bill`, `-in:spam`       |

#### General use filters

| __Operator__   | __What it does__                                      | __Example__                 |
|----------------|-------------------------------------------------------|-----------------------------|
| `OR`           | Include messages that match multiple operators        | `label:spam OR label:trash` |
| `()`           | Include messages with all these search terms          | `subject:(cafe restaurant)` |

### Examples

You can combine operators together or use them individually. Here are
some quick examples.

| __Example__                                                    | __What it does__                                                     |
|----------------------------------------------------------------|----------------------------------------------------------------------|
| `subject:(invoice OR receipt) has:attachment after:2023-06-01` | Finds all emails containing this month's invoices                    |
| `before:2023-06-01 after:2023-01-01 from:someone@example.org`  | Finds all emails in the first half of 2023 sent by a specific person |
| `is:unread -label:archived -label:spam`                        | All unread messages, excluding archived and spam emails              |

You can even bookmark any of these to jump to them easily later!
After executing the search, press `⌃ Ctrl + D` (Windows & Linux) or
`⌘ Cmd + D` (macOS) to save it in your browser.

## Sent a message accidentally? Undo it!

If you sent a message before finishing it, made a typo, or you sent
it to the wrong person, you can unsend that email! Look for this
button in the bottom of your screen on mobile and desktop.

![Undo button appearance within Gmail](undo.png)

There's an unsend period after you click send. Update the length of
that time with this setting:

* In Gmail, click ⚙️ Settings, then the "See all settings" button
* In the "General tab", look for the section "Undo Send"
* Pick an undo period (30 seconds is the longest option)
* Click "Save changes"

## Filtering messages automagically

If you have a system you use to label messages, or you're always
forwarding a specific type of message to others, you can use
filters to automatically accomplish this and more!

For example, you could categorize all messages with articles
and news into your "Read later" label.

Follow these steps to create a filter:

1. In Gmail click on "🔍 Search in mail"
2. Type what messages you want to apply your filter to. You can
use [search operators](#search-operator-reference) here just
like any other search!
3. To the right of the search bar, click on "Show search options"
4. Click "Create filter"
5. Update the options that appear.
    * For example, you could check "Apply the label" and combine
  this with "Skip the Inbox (Archive it)" to keep your inbox clear
6. Click "Create filter". All done!
