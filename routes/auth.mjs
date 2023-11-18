import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const usersCollection = db.collection('users');

        // Verify if the user exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Encript the password before is stored
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Inser the new user
        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName
        };
        const result = await usersCollection.insertOne(newUser);

        res.send(result).status(200);
    } catch (error) {
        console.error("Error to read collection:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Login with existent user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usersCollection = db.collection('users');

        // Verify if the user exists
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Compare the password received with the stored
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.json("Logged in successfully").status(200);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;