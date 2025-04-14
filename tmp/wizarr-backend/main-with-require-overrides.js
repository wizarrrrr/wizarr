
/**
 * IMPORTANT: Do not modify this file.
 * This file allows the app to run without bundling in workspace libraries.
 * Must be contained in the ".nx" folder inside the output path.
 */
const Module = require('module');
const path = require('path');
const fs = require('fs');
const originalResolveFilename = Module._resolveFilename;
const distPath = __dirname;
const manifest = [{"module":"@wizarrrrr/async","exactMatch":"libs/async/src/index.js","pattern":"libs/async/src/index.ts"},{"module":"@wizarrrrr/authjs-koa","exactMatch":"libs/authjs-koa/src/index.js","pattern":"libs/authjs-koa/src/index.ts"},{"module":"@wizarrrrr/plex-sdk","exactMatch":"libs/plex-sdk/src/index.js","pattern":"libs/plex-sdk/src/index.ts"},{"module":"@wizarrrrr/typeorm-adapter","exactMatch":"libs/typeorm-adapter/src/index.js","pattern":"libs/typeorm-adapter/src/index.ts"},{"module":"@wizarrrrr/typeorm-simple-query-parser","exactMatch":"libs/typeorm-simple-query-parser/src/index.js","pattern":"libs/typeorm-simple-query-parser/src/index.ts"},{"module":"@wizarrrrr/wizarr-sdk","exactMatch":"libs/wizarr-sdk/src/index.js","pattern":"libs/wizarr-sdk/src/index.ts"}];

Module._resolveFilename = function(request, parent) {
  let found;
  for (const entry of manifest) {
    if (request === entry.module && entry.exactMatch) {
      const entry = manifest.find((x) => request === x.module || request.startsWith(x.module + "/"));
      const candidate = path.join(distPath, entry.exactMatch);
      if (isFile(candidate)) {
        found = candidate;
        break;
      }
    } else {
      const re = new RegExp(entry.module.replace(/\*$/, "(?<rest>.*)"));
      const match = request.match(re);

      if (match?.groups) {
        const candidate = path.join(distPath, entry.pattern.replace("*", ""), match.groups.rest + ".js");
        if (isFile(candidate)) {
          found = candidate;
        }
      }

    }
  }
  if (found) {
    const modifiedArguments = [found, ...[].slice.call(arguments, 1)];
    return originalResolveFilename.apply(this, modifiedArguments);
  } else {
    return originalResolveFilename.apply(this, arguments);
  }
};

function isFile(s) {
  try {
    return fs.statSync(s).isFile();
  } catch (_e) {
    return false;
  }
}

// Call the user-defined main.
require('./apps/wizarr-backend/src/main.js');
