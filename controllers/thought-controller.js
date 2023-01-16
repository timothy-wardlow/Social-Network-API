const { User, Thought } = require('../models');

const thoughtController = {
  getAllThought(req, res) {
      Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },

  getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'Uh oh! No thought found with this id...' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },

  addThought({ params, body }, res) {
      console.log(body);
      Thought.create(body)
          .then(({ _id }) => {
              return User.findOneAndUpdate(
                  { _id: params.userId },
                  { $push: { thought: _id } },
                  { new: true }
              );
          })
          .then(dbUserData => {
              if (!dbUserData) {
                  res.status(404).json({ message: 'Uh oh! No user found with this id...' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.json(err));
  },

  updateThought({ params, body }, res) {
      Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'Uh oh! No thought found with this id...' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
  },

  deleteThought(req, res ) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then( dbThoughtsData => {
       if ( !dbThoughtsData ) {
          return res.status( 404 ).json({ message: 'Uh oh! No thought found with this id...' });
          
       };
       return User.findOneAndUpdate(
        {thought: req.params.thoughtId},
        {$pull: {thought: req.params.thoughtId}},
        {new: true}
       );
    })
    .then((dbUserData)=>{
        if (!dbUserData){
            return res.status(404).json({message: 'Uh oh! No user with this id...'})
        }
        res.json({message: "Thought Sucessfully deleted..."});
    })
    .catch((err) => {res.status(500).json(err);
 })
},

  addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $addToSet: { reactions: body } },
          { new: true, runValidators: true }
      )
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  return res.status(404).json({ message: 'Uh oh! No thought found with this id...' });
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
  },

  deleteReaction({ params }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.id } } },
          { new: true }
      )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
  }
};

module.exports = thoughtController;