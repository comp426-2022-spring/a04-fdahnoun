const express = require('express')
const app = express()
const arguments = require('minimist')(process.argv.slice(2))



const port = arguments.port || process.env.port || 5000

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

// function coinFlip() {
//     return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
// }

app.get('/app/', (req, res) => {
// Respond with status 200
    res.statusCode = 200;
// respond with status message "OK"
    res.statusMessage = "OK";
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage);
    
})

function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
}

function coinFlips(flips) {
    const headsOrTails = []
    if (flips == null){
      headsOrTails.push(coinFlip())
      return headsOrTails
    }
    for (let x = 0; x < flips; x++){
      var outcome = Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails'
      headsOrTails.push(outcome)
    }
    
  
    return headsOrTails
  
    }

function countFlips(array) {
  var dict = {};
  dict = {heads: 0, tails: 0}
  
  for (let x = 0; x < array.length; x++){
    if (array[x] == "heads"){
      dict.heads += 1

    }else{
      dict.tails += 1
    }
  }
  if (dict.heads == 0){
    delete dict["heads"]
  } else if (dict.tails == 0){
    delete dict["tails"]
  }
  return dict
}

function flipACoin(call) {
    var flipCoin = {};
    var thisFlip = coinFlip()
    var final_result = ""
    if (call === thisFlip){
      final_result = 'win'
    } else{
      final_result = 'lose'
    }
    
    flipCoin = {call: call, flip: thisFlip, result: final_result}
  
    
    return flipCoin
  
  }


app.get('/app/flip/', (req, res) => {
   var flip = coinFlip()
   res.status(200).json({ 'flip' : flip })
})  


app.get('/app/flips/:number', (req, res) => {
    const finalFlips = coinFlips(req.params.number)
    res.status(200).json({ 'raw': finalFlips, 'summary': countFlips(finalFlips) })

}
)

app.get('/app/flip/call/heads', (req, res) => {
    const flipRandomCoin = flipACoin("heads")
    res.status(200).json( {"call": flipRandomCoin.call, "flip": flipRandomCoin.flip, "result": flipRandomCoin.result})
})

app.get('/app/flip/call/tails', (req, res) => {
    const flipRandomCoin = flipACoin("tails")
    res.status(200).json( {"call": flipRandomCoin.call, "flip": flipRandomCoin.flip, "result": flipRandomCoin.result})
})



// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')

})

// Require minimist module
const args = require('minimist')(process.argv.slice(2))
// See what is stored in the object produced by minimist
console.log(args)
// Store help text 
const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)
// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}


app.use( (req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
}
  })