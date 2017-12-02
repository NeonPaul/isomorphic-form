import Bucket from "./index";
const Busboy = require("busboy");
const Url = require("url");

export default req => {
  if (req.method === "GET") {
    const { query } = Url.parse(req.url);
    return Promise.resolve(Bucket.fromString(query));
  } else if (req.method === "POST") {
    const bucket = new Bucket();
    const busboy = new Busboy({ headers: req.headers });
    const promise = new Promise(resolve =>
      busboy.on("finish", () => {
        resolve(bucket);
      })
    );

    busboy.on("field", (name, value) => {
      bucket.append(name, value);
    });

    req.pipe(busboy);

    return promise;
  }

  return null;
};
