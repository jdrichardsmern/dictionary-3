const router = require('express').Router();
const Comment = require('./models/Comment');
const Word = require('../Words/models/Word');

router.post('/add-comment/:wordId', (req, res) => {
  Word.findById(req.params.wordId)
    .then((foundWord) => {
      if (!req.body.comment) {
        return res.status(400).send('No Comment Entered');
      }

      const newComment = new Comment({
        comment: req.body.comment,
        owner: foundWord.id
      });

      newComment
        .save()
        .then(() => {
          return res.redirect(`/words/single-word/${foundWord.id}`);
        })
        .catch((err) => {
          return res.status(400).send('Word was Not saved');
        });
    })
    .catch((err) => {
      return res.status(500).send('Server Error');
    });
});

module.exports = router;
