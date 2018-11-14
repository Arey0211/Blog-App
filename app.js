const express     = require ('express'),
      bodyParser  = require ('body-parser'),
      mongoose    = require ('mongoose'),
      sanitizer   = require ('express-sanitizer'),
      override    = require ('method-override'),
      app         = express();


//MONGOOSE/MODEL CONFIG
mongoose.connect ('mongodb://localhost/blog_app');

const blogSchema = new mongoose.Schema ({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
}); 

const Blog = mongoose.model('Blog', blogSchema);


//APP CONFIG
app.set ('view engine', 'ejs');
app.use (express.static('public'));
app.use (bodyParser.urlencoded({extended: true}));
app.use (override('_method'));
app.use (sanitizer());


//ROUTES

//INDEX
app.get ('/', function(req, res){
  res.redirect ('/blogs');
});

app.get ('/blogs', function(req, res){
  Blog.find({}, function (err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render ('blogIndex', {blogs: blogs});
    }
  });
});

//CREATE
app.post ('/blogs', function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function (err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect ('/blogs');
		}
	});
});

//NEW FORM
app.get ('/blogs/new', function (req, res){
  res.render ('newBlog');
});

//SHOW
app.get ('/blogs/:id', function (req,res){
  Blog.findById (req.params.id, function (err, foundPost){
    if (err){
      res.redirect ('/');
    } else {
      res.render ('show', {post: foundPost})
    }
  });
});

//EDIT FORM
app.get ('/blogs/:id/edit', function (req, res){
  Blog.findById(req.params.id, function (err, foundPost){
    if (err){
      res.redirect('/');
    } else {
      res.render ('edit', {post: foundPost})
    }
  });
});

//UPDATE
app.put ('/blogs/:id', function (req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, udatedPost){
    if (err){
      res.redirect ('/');
    } else {
      res.redirect ('/blogs/' + req.params.id);
    }
  });
});

//DELETE
app.delete ('/blogs/:id', function (req, res){
  Blog.findByIdAndDelete (req.params.id, req.body.post, function (err, deletedPost){
    if (err){
      res.send('You Done messed up A-A-Ron!!!!');
    } else {
      res.redirect ('/');
    }
  });
});





app.listen(3000, function(){
  console.log('Blog App Started!');
});