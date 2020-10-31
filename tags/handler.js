const fetch = require("node-fetch");
// don't cringe too hard at the code k
// also I'm not good with commenting so bear with me x
/**
 * @arg {String} source Each site requires different methods to pull images, this tells me which one to run
 * @arg {String} site Where to send a request to
 */
function request(source, site, regex) {
    return new Promise(
        function(resolve, reject) {
            let date = Date.now();
            switch (source) {
                case "reddit":
                    if (!site) reject({reason: "No subreddit supplied", message: "Couldn't do request because there wasn't a subreddit"});
                    function ExtractRedditUrl(body, tries) {
                        if (tries >= 10) return reject({reason: "retry limit exceeded", message: "Failed to find a suitable post", subbredit: site});
                        tries++;
                        // grabs a random post
                        let post = body[Math.floor(Math.random() *body.length)].data;
                        // checks if the post url ends with an image extension
                        switch ((/(\.jpg|\.png|\.gifv|\.mp4|\.gif|\.jpeg).test(post.url)) {
                            case true:
                                // resolves the payload with all the juicy data
                                let payload = {
                                    url: post.url,
                                    source: post.permalink,
                                    nsfw: true,
                                    tries: tries,
                                    time: `${((Date.now() - date) / 1000).toFixed(2)}s`
                                };
                                resolve(payload);
                            break;
                            default:
                                // self explanatory (hopefully)
                                switch (post.is_video) {
                                    case true:
                                        // tries to get another post if it's a video (this was used for discord and we can't embed videos)
                                        ExtractRedditUrl(body, tries);
                                    break;
                                    default:
                                        switch (post.media) {
                                            case null:
                                                // if media is null try again
                                                ExtractRedditUrl(body, tries);
                                            break;
                                            default:
                                                // if the media thumbnail is from gfycat try again (thumbnails from gfycat are really low res)
                                                switch (post.media.oembed.thumbnail_url.includes("gfycat")) {
                                                    case false:
                                                        // resolve payload
                                                        let payload = {
                                                            url: post.media.oembed.thumbnail_url,
                                                            source: post.permalink,
                                                            nsfw: true,
                                                            tries: tries,
                                                            time: `${((Date.now() - date) / 1000).toFixed(2)}s`
                                                        };
                                                        resolve(payload);
                                                    break;
                                                    // tries again
                                                    default: ExtractRedditUrl(body, tries);
                                                }
                                            break;
                                        }
                                    break;
                                }
                            break;
                        }
                    }
                    // just some randomness
                    let sortBy = ["best", "new", "top", "hot"], filter = sortBy[Math.floor(Math.random() *sortBy.length)];
                    let url = `https://reddit.com/r/${site}/${filter}.json?limit=15`;
                    fetch(url).then(async response => {
                        try {
                            // gets the json response
                            let body = await response.json();
                            // checks if the request responded with a 200 status code
                            if (response.status !== 200) reject(body);
                            ExtractRedditUrl(body.data.children, 0);
                        } catch (error) {
                            reject(error);
                        }
                    }).catch(error => {
                        // if the request fails reject
                        reject(error);
                    });
                break;
                
                case "other":
                    if (!site) reject({reason: "No url supplied", message: "Couldn't do request because there wasn't a url"});
                    if (!regex) reject({reason: "No regex supplied", message: "Couldn't do request because there wasn't a regular expression supplied"});
                    function DoStuffWithThings(html, regex) {
                        let matches = null;
                        try {
                            // tries to match
                            matches = html.match(regex);
                        } catch (error) {
                            reject(error);
                        }
                        if (matches === null) reject({reason: "Matches were null", message: "Couldn't find anything with the supplied regex :/"});
                        // returns matches
                        resolve(matches);
                    }
                    fetch(site).then(async response => {
                        try {
                            // attempts to get the response text (html n stuff)
                            let body = await response.text();
                            // checks if the response status is ze 200 (OK)
                            if (response.status !== 200) reject(response);
                            // magic...
                            DoStuffWithThings(body, regex);
                        } catch (error) {
                            // if it fails to get the text reject the error
                            reject(error);
                        }
                    }).catch(error => {
                        // if the request fails reject
                        reject(error);
                    });
                break;
                default:
                    // if the source isn't supported (like reddit) it'll reject with an error 
                    reject(new Error(`Unknown source '${source}'`));
                break;
            }
        }
    )
}
module.exports.makeRequest = request;
