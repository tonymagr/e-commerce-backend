const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll({
      include: Product,
    });
    // Send successful response (default 200) to client with JSON data
    res.json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const catData = await Category.findByPk(req.params.id, {
      include: Product,
    });

    if (!catData) {
      // HTTP response status code 404 - Not Found, Server cannot find requested resource
      res.status(404).json({ message: 'No category found with that id.' });
      return;
    }

    // Send successful response (default 200) to client with JSON data
    res.json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCatData = await Category.create(req.body);
    // Send successful response (default 200) to client with JSON data
    res.json(newCatData);
  } catch (err) {
    // 400 - Bad request (assumed to be client-side error)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updCatData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // Send successful response (default 200) to client with JSON data (Count of rows updated)
    res.json(updCatData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const delCatData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });
    // Send successful response (default 200) to client with JSON data
    res.json(delCatData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
