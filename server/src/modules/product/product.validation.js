const { body } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage(
      "Product description must be between 10 and 5000 characters"
    ),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be zero or greater"),

  body("categoryId")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
];

module.exports = {
  productValidation,
};