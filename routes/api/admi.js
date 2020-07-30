const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Admi = require("../../models/Admi");
const Product = require("../../models/Product");
const User = require("../../models/User");
const AdmiCart = require("../../models/AdmiCart");
const key = require("../../config/keys");
const validateAdmiLoginInput = require("../../validation/admiLogin");
const validateAdmiInput = require("../../validation/admi");
const validateRegisterInput = require("../../validation/register");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs");
const uploadPhotos = require("../../utils");

// @route  Post api/admi/signup
// @desc    Allow admi to register ... this will be removed
// @access  Public

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateAdmiInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    Admi.findOne({ username: req.body.username }).then((admi) => {
      if (admi) {
        errors.username = "username already exist";
        res.status(400).json(errors);
      } else {
        const newAdmi = new Admi({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmi.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmi.password = hash;
            newAdmi
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// @route   GEt api/admi/customers
// @desc    GET customers
// @access  Public

router.get(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({})
      .then((user) => {
        res.json(user);
      })
      .catch((err) => res.send(err));
  }
);

// Admi signin
router.post("/signin", (req, res) => {
  const { errors, isValid } = validateAdmiLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;

  Admi.findOne({ username: username }).then((admi) => {
    if (!admi) {
      errors.username = "User not found";
      res.status(400).json(errors);
    } else {
      bcrypt.compare(password, admi.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: admi.id,
            username: admi.username,
            name: admi.name,
          };
          jwt.sign(
            payload,
            key.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.status(200).json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          res.status(400).json(errors);
        }
      });
    }
  });
});

// @route   Post api/admi/
// @desc    add new admi
// @access  Private

router.post(
  "/others",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newAdmi = new Admi({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    Admi.findOne({ username: req.body.username }).then((admi) => {
      if (admi) {
        return res.status(400).json({ msg: "User Already Exist" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmi.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmi.password = hash;
            newAdmi
              .save()
              .then((admi) => {
                res.json(admi);
              })
              .catch((err) => res.json(err));
          });
        });
      }
    });
  }
);

// @route   GET api/admi/others
// @desc    get all admi
// @access  Private

router.get(
  "/others",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Admi.find({})
      .then((admi) => {
        res.json(admi);
      })
      .catch((err) => res.send(err));
  }
);

// @route   Post api/admi/product/add_item
// @desc    add new item
// @access  Private
router.post(
  "/product",
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image", maxCount: 12 },
  ]),
  passport.authenticate("jwt", { session: false }), // so sey ego authenticate first
  uploadPhotos, //so ago pass the req.body.images come here
  (req, res) => {
    //so sey we go fit barb the array of file paths for here, then we just go save to
    //db
    let newProduct = {};
    if (req.body.type) newProduct.type = req.body.type;
    if (req.body.status) newProduct.status = req.body.status;
    if (req.body.location) newProduct.location = req.body.location;
    if (req.body.price) newProduct.price = req.body.price;
    if (req.body.rooms) newProduct.rooms = req.body.rooms;
    if (req.body.bath) newProduct.bath = req.body.bath;
    if (req.body.bed) newProduct.bed = req.body.bed;
    if (req.body.description) newProduct.description = req.body.description;
    newProduct.main = req.body.main;
    newProduct.image = req.body.image;
    new Product(newProduct)
      .save()
      .then((product) => res.json(product))
      .catch((err) => res.json(err));
  }
);

// @route   Post api/admi/product/update/:id
// @desc    update item
// @access  Private
router.post(
  "/product/update/:id",
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image", maxCount: 12 },
  ]),
  passport.authenticate("jwt", { session: false }), // so sey ego authenticate first
  uploadPhotos, //so ago pass the req.body.images come here
  (req, res) => {
    //so sey we go fit barb the array of file paths for here, then we just go save to
    //db
    let newProduct = {};
    if (req.body.type) newProduct.type = req.body.type;
    if (req.body.status) newProduct.status = req.body.status;
    if (req.body.location) newProduct.location = req.body.location;
    if (req.body.price) newProduct.price = req.body.price;
    if (req.body.rooms) newProduct.rooms = req.body.rooms;
    if (req.body.bath) newProduct.bath = req.body.bath;
    if (req.body.bed) newProduct.bed = req.body.bed;
    if (req.body.description) newProduct.description = req.body.description;
    newProduct.main = req.body.main;
    newProduct.image = req.body.image;

    Product.findOneAndUpdate({ id: req.user.id }, { $set: newProduct })
      .then((product) => res.json(product))
      .catch((err) => res.json(err));
  }
);

// @route   Post api/admi/user/update/
// @desc    update user
// @access  Private

router.post(
  "/user/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.findOneAndUpdate({ email: req.body.email }, { $set: newUser })
            .then((user) => res.json(user))

            .catch((err) => console.log(err));
        });
      });
    }
  }
);

// @route   Post api/admi/others/update
// @desc    update admi
// @access  Private

router.post(
  "/user/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    } else {
      const newUser = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          Admi.findOneAndUpdate(
            { username: req.body.username },
            { $set: newUser }
          ).catch((err) => console.log(err));
        });
      });
    }
  }
);

// @route   Delete api/admi/product/:id
// @desc    remove item
// @access  Private

router.delete(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Product.findById(req.params.id).then((item) => {
      item
        .remove()
        .then(Product.find({}).then(([prod]) => res.json([prod])))
        .catch((err) => console.log(err));
    });
  }
);

// @route   delete api/admi/others
// @desc    remove admi
// @access  Private
router.delete(
  "/others/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Admi.findById(req.params.id).then((item) => {
      item
        .remove()
        .then(Admi.find({}).then((admi) => res.json(admi)))
        .catch((err) => console.log(err));
    });
  }
);

// @route   Delete api/admi/customer/:id
// @desc    remove customer
// @access  Private

router.delete(
  "/customer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id).then((item) => {
      item
        .remove()
        .then(User.find({}).then((user) => res.json(user)))
        .catch((err) => console.log(err));
    });
  }
);

// @route   GET api/admi/orders
// @desc    Show Orders
// @access  Private

router.get(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    AdmiCart.find({})
      .then((order) => {
        let allOrder = [];
        let ord = {};
        if (order) {
          for (let i = 0; i < order.length; i++) {
            Product.findById(order[i].product).then((product) => {
              User.findById(order.customer).then((user) => {
                ord = {
                  customer: user,
                  product: product,
                };
                // allOrder.push(ord);
                // console.log(ord);
              });
            });
          }
        }

        // console.log(order);
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
