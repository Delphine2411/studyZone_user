
const User = require("../model/userModel")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {
  const { username, password, email, profil } = req.body;


  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
      email,
      profil
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          process.env.jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};


///login

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Comparer les mots de passe
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const maxAge = 3 * 60 * 60; // 3 heures en secondes
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        jwtSecret,
        { expiresIn: maxAge }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // en millisecondes
      });

      res.status(200).json({
        message: "User successfully logged in",
        user: user._id,
      });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};


exports.update = async (req, res, next) => {
  try {
    const { role, id } = req.body;

    // Vérification des champs obligatoires
    if (!role || !id) {
      return res.status(400).json({ message: "Role and ID are required" });
    }

    // Seul le rôle 'admin' est autorisé ici
    if (role !== "admin") {
      return res.status(400).json({ message: "Only 'admin' role is allowed in this operation" });
    }

    // Recherche de l'utilisateur
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifie si l'utilisateur est déjà admin
    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an Admin" });
    }

    // Mise à jour du rôle
    user.role = role;
    await user.save();

    res.status(200).json({ message: "Update successful", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    await User.findById(id)
      .then(user => user.remove())
      .then(user =>
        res.status(201).json({ message: "User successfully deleted", user })
      )
      .catch(error =>
        res
          .status(400)
          .json({ message: "An error occurred", error: error.message })
      )
  }