const requestHandler = require("../handler");
class RealShit {
    
    titty() {
        let subreddits = ["tittydrop"];
        return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
    }
    meme() {
        let subreddits = ["dankmemes","okbuddyretard","skamtebord","comedyheaven"];
        return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
    }
    autofellatio() {
        let subreddits = ["autofellatio"];
        return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
    }
    wholesome() {
        let subreddits = ["wholesomememes"];
        return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
    }
    ass() {
        let subreddits = ["ass", "paag", "asstastic", "buttplug", "whooties", "AssholeBehindThong", "Frogbutt", "rearpussy", "CuteLittleButts", "HungryButts", "reversecowgirl",
        "facedownassup", "butt", "butts", "pawg", "bigasses", "cosplaybutts", "girlsinyogapants", "BubbleButts", "assinthong", "smalltitsbigass", "CelebrityButts", "booty"];
        return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
    }
}
module.exports = new RealShit();
