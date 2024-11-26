const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.signUp = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again.",
    });
  }
};

// ChangePassword Controller
// exports.changePassword = async (req, res) => {
//   try {
//     const userDetails = await User.findById(req.user.id);
//     const { oldPassword, newPassword, confirmNewPassword } = req.body;
//     const isPasswordMatch = await bcrypt.compare(
//       oldPassword,
//       userDetails.password,
//     );
//     if (!isPasswordMatch) {
//       return res
//         .status(401)
//         .json({ success: false, message: "The password is incorrect" });
//     }
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "The password and confirm password does not match",
//       });
//     }

//     // Update password
//     const encryptedPassword = await bcrypt.hash(newPassword, 10);
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: encryptedPassword },
//       { new: true },
//     );

//     // Send notification email
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lname}`,
//         ),
//       );
//       console.log("Email sent successfully:", emailResponse.response);
//     } catch (error) {
//       console.error("Error occurred while sending email:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email",
//         error: error.message,
//       });
//     }
//     return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Error occurred while updating password:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while updating password",
//       error: error.message,
//     });
//   }
// };
