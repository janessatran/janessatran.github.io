---
date: 2021-12-23
title: 'Proxy Servers'
---

During a project at work, my teammate and I were having issues trying to connect to an API that was behind a VPN. The question of whether or not our the request was going through a proxy server came up. I hadn't heard of a proxy server before so I thought I would write about what it is.

## What's a proxy server and how does it work?

A **proxy server** acts as a gateway between you and the internet.

The way it works is, when you send a web request your request goes to the proxy server first. Then, the proxy server makes your web request on your behalf and collects the response from the web server. When the request is intercepted by the proxy, it may forward the request and it may modify it. Finally, the proxy server returns you the web page data.

There are two main types, a **forward proxy** which handles requests from and to anywhere on the internet. There is also a **reverse proxy** which takes requests from the Internet and forwards them to servers in an internal network.

It offers a few benefits including:

- Privacy, allows you to surf internet anonymously.
- Speed, cache data to speed up common requests.
- Reduces bandwidth.
- Activity Logging.

## How does one identify if a request is coming from a proxy server?

There's not a 100% reliable way to tell, but the presence of any of the following headers is a strong indication that the request was routed from a proxy server:

```
via:
forwarded:
x-forwarded-for:
client-ip:
```

## Are there different types of proxies? What are they?

There are a few different types, but the most comment are:

1. **HTTP proxies**: You'd use these to access websites. These proxies only work with HTTP and HTTPs webpages. You can use this type of proxy to access geo-restricted content (although that may violate the user agreement with your content provider).
2. **SOCKS5 proxies**: Unlike HTTP proxies, these can be used to access video streaming services, file sharing sites, and games online.
3. **Transparent proxies**: These work without modifying the request and responses (which is why it's called transparent). You might have used a transparent proxy without realizing it. Employers, schools, libraries might set up a transparent proxy to filter user's content when they connect ot the internet or block users from accessing certain websites.
