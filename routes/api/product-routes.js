const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      // include: [{ model: Category }, {model: ProductTag}, {model: Tag}],
      include: [Category, Tag],
    });
    // Send successful response (default 200) to client with JSON data
    res.json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });

    if (!productData) {
      // HTTP response status code 404 - Not Found, Server cannot find requested resource
      res.status(404).json({ message: 'No product found with that id.' });
      return;
    }

    // Send successful response (default 200) to client with JSON data
    res.json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]    --- Changed to tagsIdRaw: "1234", and added logic to convert to tagIds 
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      let tagIds = [];
      for (let i = 0; i < req.body.tagIdsRaw.length; i++) {
        tagIds.push(req.body.tagIdsRaw[i]);
      }
      if (tagIds.length) {
        const productTagIdArr = tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      res.status(400).json(err);
      // next(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // --- Changed to tagsIdRaw: "1234" in req.body, and added logic to convert to tagIds
      let tagIds = [];
      for (let i = 0; i < req.body.tagIdsRaw.length; i++) {
        tagIds.push(req.body.tagIdsRaw[i]);
      }
      
      if (tagIds && tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const delProdData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });
    // Send successful response (default 200) to client with JSON data
    res.json(delProdData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
