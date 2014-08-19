var deamdify = require('deamdify')
  , fs = require('fs')
  , Stream = require('stream')
  , oldRead;

describe('deamdify\'ing AMD module with a base URL', function() {

  var stream = deamdify('test/data/base-url.js')

  before(function() {
    oldRead = deamdify.readPackageJSON;
  })

  after(function() {
    deamdify.readPackageJSON = oldRead;
  })

  it('should return a stream', function() {
    expect(stream).to.be.an.instanceOf(Stream);
  });
  
  it('should transform module', function(done) {

	deamdify.readPackageJSON = function() {
	  console.log("reading fake package json");
	  return {
	    browser: {'boys': './lib/public/boys-1.2.4.js'},
	    deamdify: { base: '/test/' }
	  };
	};

	var output = '';
    stream.on('data', function(buf) {
      output += buf;
    });
    stream.on('end', function() {
      var expected = fs.readFileSync('test/data/base-url.expect.js', 'utf8')
      expect(output).to.be.equal(expected);
      done();
    });
    
    var file = fs.createReadStream('test/data/base-url.js');
    file.pipe(stream);
  });
  
});
