# leetx-rss-server - A simple RSS server for 1337x

Simple RSS server that returns an rss+xml file upon request.

All requests must have `/search?query=keywords+like+this` after the base url.

Live Demo: https://bestulo-leetx-rss-server.deno.dev

### Known limitations

It only gets the first page per search result. This is a limitation imposed by https://github.com/Bestulo/leetx

When said module resolves this problem, this one will implement a solution for it. That depends on when I'm motivated to do that, which might be never, so you're welcome to do it yourself.

My idea is for it to have something like `?limit=50` for a result count, or `?page=2` for manual pagination.
