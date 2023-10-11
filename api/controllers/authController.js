const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email:email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create and send a JSON Web Token (JWT)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success:true,token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}