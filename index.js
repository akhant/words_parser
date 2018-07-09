var queue = require("async/queue");
var needle = require("needle");
var cheerio = require("cheerio");
var fs = require("fs");
var words = require("./words.js")




var results = []

//X-site name
for (let i = 0; i < words.length; i++) {
  var URL = `X/${words[i].word}`;
  results[i] = words[i]

  var q = queue(function(url, callback) {
    needle.get(url, function(err, res) {
      if (err) throw err;

      // парсим DOM
      var $ = cheerio.load(res.body);

//find text
      let forms = [];
    
      $(".conj-tense-block").map(function(j, el) {
        
          forms.push({
            title: $(this)
              .find(".conj-tense-block-header")
              .text()
          });
          results[i].forms = forms;
        
          let values = [];
          
     $(this)
          .find(".conj-result")
          .map(function(f, item) {
              
            values.push($(this).text());
            
          }); 
          results[i].forms[j].values = values
      }); 
      
     

      callback();
    });
  }, 10); // запускаем 10 параллельных потоков

  q.drain = function() {
    fs.writeFileSync("./results.json", JSON.stringify(results, null, 4));
  };

  q.push(URL);
}  

//find translated text
 /*      $(".wrow").map(function(i, el){
        results.push({
            word: $(this).find(".word").text(),
            trans: $(this).find(".trans").text()
        })
      }) */