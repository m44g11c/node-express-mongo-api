const express = require('express');
const app = express();
const router = express.Router();
const paginate = require('express-paginate');
const Article = require('../models/Article');

// Create article
router.route('/').post(function (req, res) {

  const article = new Article(req.body);

  article.save()
    .then(article => {
    res.status(200).json({
      '_id': `${article.id}`,
      "title": `${article.title}`,
      "body": `${article.body}`,
      "updated_at": `${article.updated_at}`,
      "created_at": `${article.created_at}`
      });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        const errorPath = Object.keys(err.errors)[0];
        return res.status(422).json(
          {
            "errors": [{  
                "field": errorPath,
                "error": `${errorPath} is required`
            }]
          }
        );
      }
    });
});

// Update article 
router.route('/:id').put(function (req, res) {
  Article.findById(req.params.id, function(err, article) {

    if (!article)
      return next(new Error('Could not load Document'));
    else {

      article.title = req.body.title;
      article.body = req.body.body;
      article.save().then(article => {
          res.json({
          '_id': `${article.id}`,
          "title": `${article.title}`,
          "body": `${article.body}`,
          "updated_at": `${article.updated_at}`,
          "created_at": `${article.created_at}`
        });
      })
      .catch(err => {
        if (err.name === 'ValidationError') {
          const errorPath = Object.keys(err.errors)[0];
          return res.status(422).json(
            {
              "errors": [{  
                  "field": errorPath,
                  "error": `${errorPath} is required`
              }]
            }
          );
        }
      });
    }
  });
});

// Get articles
router.use(paginate.middleware(1, 10));
router.get('/', async (req, res, next) => {
  try {

    if (req.query.limit == 0) {
      req.query.limit = 10; 
    }

    const [ results, itemCount ] = await Promise.all([
      Article.find({}).select('-__v').limit(req.query.limit).skip(req.skip).lean().exec(),
      Article.count({})
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);

    res.json({
      count: itemCount,
      page: req.query.page,
      limit: req.query.limit,
      articles: results
    });
  } catch (err) {
    return res.status(422).json(
      {
        "errors": [{
            "field": "query",
            "error": err.message
        }]
      }
    );
  }
});

// Get article by id
router.route('/:id').get(function (req, res, next) {
  const id = req.params.id;
  Article.findById(id, function (err, article){
    if (!article)
      return next(new Error('Not Found'));
    else
      res.json(article);
  }).select('-__v').catch(err => {
    return res.status(404).json(
      {
        "errors": [{
            "field": id,
            "error": "Not Found"
        }]
      }    
    );
  });
});

// Delete article
router.route('/delete/:id').get(function (req, res) {
  Article.findByIdAndRemove({_id: req.params.id}, function(err, article){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = router;
