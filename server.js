const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
require("dotenv").config(); //  à appeler dès le début
const connectDB = require("./config/db");
const { userAuth } = require("./middleware/auth");

// Connexion à la base de données
connectDB();

// Middlewares
app.use(express.json());
app.use(bodyParser.json()); // Peut être retiré si tu as déjà express.json()
app.use(cookieParser());

//  Routes
app.use("/api/auth", require("./routes/userRoute"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

// Lancement du serveur
const server = app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);

//  Gestion des erreurs globales
process.on("unhandledRejection", (err) => {
  console.error(` Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
