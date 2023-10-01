const userRoutes = (app, fs) => {
    //...unchanged ^^^
    const dataPath = './data/charities.json';
  
    // refactored helper methods
    const readFile = (
      callback,
      returnJson = false,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
          throw err;
        }
  
        callback(returnJson ? JSON.parse(data) : data);
      });
    };
  
    const writeFile = (
      fileData,
      callback,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
          throw err;
        }
  
        callback();
      });
    };

    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
      });
  
    // READ
    // Notice how we can make this 'read' operation much more simple now.
    app.get('/charities', (req, res) => {
      readFile((data) => {
        res.send(data);
        // console.log(data)
      }, true);
    });

    // CREATE
    app.post('/charities', (req, res) => {
        readFile((data) => {
        // Note: this needs to be more robust for production use.
        // e.g. use a UUID or some kind of GUID for a unique ID value.
        const newUserId = Date.now().toString();
    
        // add the new user
        data[newUserId] = req.body;
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('new user added');
        });
        }, true);
    });

    // UPDATE
    app.put('/charities/:id', (req, res) => {
        readFile((data) => {
        // add the new user
        const userId = req.params['id'];
        data.charities[userId - 1] = req.body;
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} updated`);
        });
        }, true);
    });

    // DELETE
    app.delete('/charities/:id', (req, res) => {
        readFile((data) => {
        // add the new user
        const userId = req.params['id'];
        delete data[userId];
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} removed`);
        });
        }, true);
    });
  };

  
  module.exports = userRoutes;