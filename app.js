const { createMachine } = require('@xmachina/message');
const client = require('./contentful-client')
const http = require('http');
const { PORT = 3000 } = process.env;

http.createServer(async (req, res) => {
  let body = '';

  req.on('data', (data) => {
    body += data;
  });

  req.on('end', async () => {
    try {
      const reply = await main(JSON.parse(body));
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(reply));
    } catch (error) {
      console.log(error);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(error));
    }
    res.end();
  });
  
}).listen(PORT);

const main = async (obj) => {
  return new Promise (function(resolve, reject) {
    try {
      let result = {};
  
      // initialize object for interrogating input.
      const machine = createMachine();
      machine.updateWorkObj(obj);
  
      // grab a copy of the validated data object
      const args = machine.getWorkObj();
  
      // begin to construct the response object
      result.sender = args.message.From;
      result.orgmessage = args;
      result.reply = [];
  
      //retrieve data for reply array of message object.
      getMessage(args, (response) => {
        result.reply = response.slice();
        machine.setResponse(result);
        let newObj = machine.getWorkObj();
        resolve(newObj);
      });
    } catch (error) {
      reject(error);
    }
  });
}

const getMessage = async (args, cb) => {
  const msgArray = [];
  const topic = args.classifier.topclass.toLowerCase();

  // call contenful cms to retrieve predefined content.
  const response = await client.getEntries({
    content_type: 'message',
    select: 'sys.id,fields.topic,fields.link,fields.phraseObject'
  });

  //filter response by the topic provided.
  const queryResult = response.items.filter(r => r.fields.topic === topic);
  if (queryResult.length === 0) {
    msgArray.push('I did not understand your request. Please contact support.');
  } else {
    const fields = queryResult[0].fields;

    // *****experiment*****
    for (var property in fields) {
      if (fields.hasOwnProperty(property)) {
        console.log(property);
      }
    }
    // *****experiment*****

    // select random phrase from array
    msgArray.push(fields.phraseObject.phrases[getRandomInt(fields.phraseObject.phrases.length - 1)]);
    if (fields.link !== null) msgArray.push(fields.link);    
  }
  cb(msgArray);
};

// Retrieve random number from 0 to max.
const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1));
};
