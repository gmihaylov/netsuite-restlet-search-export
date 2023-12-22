# NetSuite RESTlet Search Export
Simple RESTlet that loads saved search and return its results into JSON string. 

## Options / Features
- Column labels are used as JSON object properties. 
- RESTlet returns JSON stringified array of objects.
- LIMIT can be applied by using limit=true, from=X, to=X
- If results are exhausted the RESTlet will return empty array []

## Usage/Examples

```javascript
Call RESTlet and get results from 0 to 5
https://XXXX.app.netsuite.com/app/site/hosting/restlet.nl?script=XX&deploy=XX&limit=true&from=0&to=5
}
```

```javascript
Call RESTlet and get all results
https://XXXX.app.netsuite.com/app/site/hosting/restlet.nl?script=XX&deploy=XX
}
```

## Screenshots

![App Screenshot](src/FileCabinet/SuiteScripts/NetSuite%20RESTlet%20Search%20Export/screenshots/screenshot1.png)
![App Screenshot](src/FileCabinet/SuiteScripts/NetSuite%20RESTlet%20Search%20Export/screenshots/screenshot2.png)
