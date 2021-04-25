const userRoutes = require('./users');
const recipeRoutes = require('./recipes');
const ratingRoutes = require('./ratings');
const commentRoutes = require('./comments');
const searchRoutes = require('./search');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/recipes', recipeRoutes);
  app.use('/ratings', ratingRoutes);
  app.use('/comments', commentRoutes);
  app.use('/search', searchRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
