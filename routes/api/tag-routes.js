const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      // include: [{ model: Product }, {model: ProductTag}],
      // include: { model: Product },
      include: Product,
    });
    // Send successful response (default 200) to client with JSON data
    res.json(tagData);
  } catch (err) {
    // next(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: Product,
    });

    if (!tagData) {
      // HTTP response status code 404 - Not Found, Server cannot find requested resource
      res.status(404).json({ message: 'No tag found with that id.' });
      return;
    }

    // Send successful response (default 200) to client with JSON data
    res.json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTagData = await Tag.create(req.body);
    // Send successful response (default 200) to client with JSON data
    res.json(newTagData);
  } catch (err) {
    // 400 - Bad request (assumed to be client-side error)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updTagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // Send successful response (default 200) to client with JSON data (Count of rows updated)
    res.json(updTagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const delTagData = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    });
    // Send successful response (default 200) to client with JSON data
    res.json(delTagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
