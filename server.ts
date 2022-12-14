import fullSearch from "https://deno.land/x/leetx@v1.0.0/mod.ts";
import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import leetResultToXml from "./leetResultToXml.ts";

const app = new Application();

app.use(async (ctx) => {
  // url will be like this: example.com/search?query=the+matrix
  const searchedString = ctx.request.url.searchParams.get("query");
  // parse the query string
  const parsedSearchedString = searchedString
    ? decodeURIComponent(searchedString).replaceAll("+", " ")
    : null;
  if (!parsedSearchedString) {
    ctx.response.body =
      "No search query provided; please add ?query=your+search+query to the url";
    // add a 400 status code
    ctx.response.status = 400;
    return;
  }
  // search it
  const torrentDetails = await fullSearch(parsedSearchedString);
  // convert it to xml
  const xml = leetResultToXml(torrentDetails, {
    baseUrl: "https://bestulo-leetx-rss-server.deno.dev/",
    queryUrl: `https://bestulo-leetx-rss-server.deno.dev/search?query=${parsedSearchedString
      .split(" ")
      .join("+")}`,
    // capitalize first letter of each word for the title
    searchedString: parsedSearchedString
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
  });
  // set the content type to application/rss+xml
  ctx.response.headers.set("Content-Type", "application/rss+xml");
  // send the xml
  ctx.response.body = xml;
});

await app.listen({ port: 8000 });
