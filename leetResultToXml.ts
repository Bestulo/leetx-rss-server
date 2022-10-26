import { TorrentDetails } from "https://deno.land/x/leetx@v1.0.0/types/TorrentDetails.ts";

const searchedString = "The Matrix";

// const torrents = await fullSearch(searchedString);

export default function leetResultToXml(
  leetResult: TorrentDetails[],
  {
    baseUrl,
    queryUrl,
  }: {
    baseUrl: string;
    queryUrl: string;
  }
) {
  const time = leetResult[0].time;

  // Dec. 22nd '21 to date, grab month, day and year
  function parseDate(date: string) {
    const [month, day, year] = date
      .replace(",", "")
      .replace("'", "")
      .replace(".", "")
      .split(" ");

    // remove letters from day
    const dayNumber = day.replace(/\D/g, "");
    // original: Dec. 22nd '21
    // parsedString: 22/Dec/21
    // date: 2021-12-21T23:00:00.000Z
    return new Date(`${dayNumber}/${month}/${year}`);
  }

  // console.log(torrents.map((torrent) => torrent.name));

  const xmlStart = `<?xml version="1.0" encoding="UTF-8"?>
	<feed xmlns="http://www.w3.org/2005/Atom">
		<title>1337x RSS - ${searchedString}</title>
		<id>${baseUrl}</id>
		<link rel="alternate" href="${queryUrl}" />
		<link href="${baseUrl}" rel="self" />
	
		<updated>${new Date().toISOString()}</updated>
		<author>
			<name>Besto's Magic 1337x RSS Hub</name>
		</author>`;

  const xmlEnd = `</feed>
	`;

  const torrentRSSFeed = leetResult.map((torrent) => {
    const xmlFeed = `		<entry>
      <title>${torrent.name}</title>
      <link rel="alternate" type="text/html" href="${torrent.url}"/>
      <id>${torrent.url}</id>
      <published>${parseDate(time).toISOString()}</published>
      <updated>${parseDate(time).toISOString()}</updated>
      <category term="${torrent.category}"/>
      <content type="html"><![CDATA[${torrent.description?.replaceAll(
        "\n",
        ""
      )}]]></content>
    </entry>`;
    return xmlFeed;
  });
  return new TextEncoder().encode(
    [xmlStart, ...torrentRSSFeed, xmlEnd].join("\n")
  );
}

// Deno.writeFileSync(
//   "torrents.xml",
//   new TextEncoder().encode([xmlStart, ...torrentRSSFeed, xmlEnd].join("\n"))
// );

/*
Known errors:
Self reference doesn't match document location -- can't solve until self hosting
Two entries with the same value for atom:updated -- can't fix cuz 1337x doesn't have precision of over a day for dates
Not stored as XML file -- can't fix until self hosting to set MIME type
*/
