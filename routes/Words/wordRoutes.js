const router = require('express').Router();
const Word = require('./models/Word');
const Comment = require('../Comments/models/Comment');

router.get('/get-words', (req, res) => {
  Word.find()
    .then((foundWords) => {
      return res.render('main/index', { wordsList: foundWords });
      // return res.json({ foundWords });
    })
    .catch((err) => res.json({ err }));
  // return res.send('All Words Shown here');
});

router.post('/add-word', (req, res) => {
  Word.findOne({ word: req.body.word })
    .then((foundWord) => {
      if (foundWord) {
        return res.send('Word Already Exists');
      } else {
        if (!req.body.word || !req.body.meaning) {
          return res.send('All Inputs Must Be Filled');
        }

        let newWord = new Word({
          word: req.body.word,
          meaning: req.body.meaning
        });

        newWord
          .save()
          .then(() => {
            return res.redirect('/words/get-words');
            // return res.status(200).json({ wordCreated });
          })
          .catch((err) => {
            return res.status(400).json({ message: 'Word Not Created', err });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: 'Server Error', err });
    });
});

router.get('/add-word', (req, res) => {
  return res.render('main/add-word');
});

router.get('/single-word/:wordId', (req, res) => {
  Word.findById(req.params.wordId)
    .then((dbWord) => {
      if (dbWord) {
        Comment.find({ owner: dbWord.id }).then((dbComments) => {
          return res.render('main/single-word', {
            foundWord: dbWord,
            foundComments: dbComments
          });
        });
      } else {
        return res.status(400).send('No Word Found');
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ confirmation: 'fail', message: 'Server Error', err });
    });
});

router.get('/update/:wordId', (req, res) => {
  Word.findById(req.params.wordId)
    .then((dbWord) => {
      if (!dbWord) {
        return res.status(400).send('No Word Found');
      }
      return res.status(200).render('main/update-word', { foundWord: dbWord });
    })
    .catch((err) => {
      return res.status(500).json({ message: 'Server Error' });
    });
});

router.put('/update/:wordId', (req, res) => {
  Word.findById(req.params.wordId)
    .then((foundWord) => {
      if (!foundWord) {
        return res.status(400).send('No Word Found');
      }
      if (!req.body.meaning) {
        return res.status(400).send('All Inputs Must Be Filled');
      }

      foundWord.meaning = req.body.meaning;

      foundWord.save().then(() => {
        return res.redirect(`/words/single-word/${req.params.wordId}`);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: 'Server Error' });
    });
});

router.delete('/delete/:wordId', (req, res) => {
  Word.findByIdAndDelete(req.params.wordId)
    .then((foundWord) => {
      if (!foundWord) {
        return res.status(400).send('Word Not Found');
      }

      return res.status(200).redirect('/words/get-words');
    })
    .catch((err) => {
      return res.status(200).json({ message: 'Server Error' });
    });
});

module.exports = router;
