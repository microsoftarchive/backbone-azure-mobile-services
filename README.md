# Backbone adapter for Windows Azure Mobile Data Services

This project is a backbone adapter for using data from Windows Azure Mobile from your [backbone application](http://backbonejs.org/).

[Windows Azure Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/) is a cloud based backend service which help streamline common development tasks like structuring storage, integrating push notifications and configuring user authentication.

## Using the adapter
Download the distributable file or its minified version and include it in your main HTML file. Ensure that you have a new table created (refer to this [this](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-html/) tutorial) that corresponds to the backbone collection. 
While creating the backbone collection (or model), add a couple of additional values to idenfity the Windows Azure Client and/or table name. 

```
var People = Backbone.Collection.extend({
	client: client, /* something like new WindowsAzure.MobileServiceClient('AppUrl', 'AppKey'),*/
	table: 'Table1' /* Table name as created in Windows Azure Mobile Services dashboard*/ 
	/* ... Other Attributes of the model ... */
});
```

If the client or the table are not specified, the adapter falls back to using the default `backbone.async` method.  

### Querying
Data can be conditionally fetched using the options in the `collection.fetch(options)` method. The options object can have one or more of the following objects

```
people.fetch({
	'skip' : count, /* Number of rows to skip before returning the data*/
	'take' : number /* Number of rows to return*/, 
	'where' : {key1:value1, key2:value2} /* Match key1 to value1 and key2 to value2. Can add more conditions*/
});
```

The where clause above can also take an array with 2 value, the first one being a function and the second one being a value. For example,

```
people.fetch({
	where: [function(len /* this is the second arg in the arry - in this case, 5* /) {
	  return len > this.length;
	},
	5 /* this number is passed to the function above as an argument */]
});
```

For more information about the queries, refer to the [documentation](http://msdn.microsoft.com/en-us/library/windowsazure/jj554207.aspx) on [skip](http://msdn.microsoft.com/en-us/library/windowsazure/jj613355.aspx), [take](http://msdn.microsoft.com/en-us/library/windowsazure/jj613354.aspx), or [where](http://msdn.microsoft.com/en-us/library/windowsazure/jj613351.aspx). 


## Building the project
You would need [NodeJS](http://nodejs.org/) installed on your system. To install grunt, run `npm install -g grunt-cli` on your command line. Then install all the dependencies using `npm install`.
To build the project, run `grunt build`. The build process currently runs jshint and minifies the output and places the files in the `dist` folder. 

## Running Tests
Once you have built the project (see section above), run `grunt dev` to start up a local HTTP server that hosts the [jasmine](http://pivotal.github.io/jasmine/) test suite. Open `http://127.0.0.1:9999/tests/SpecRunner.html` in your browser to see the tests run. 

Note that you will have update AppUrl and AppKey in `\tests\SpecRunner.html` (line 24 to line 29) with your information from the Windows Azure Mobile Services [Dashboard](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-html/#header-3).  
