const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

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

exports.editUserDetail = async (req, res) => {
  try {
    console.log("edit detail api invoked");
    // User ID is now available from the middleware
    const userId = req.user.id;

    // Extract data from body
    const { firstName, lastName, email } = req.body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully.",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during edit user Details:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred during user update details. Please try again.",
    });
  }
};

// const client = new OAuth2Client(
//   "530592032796-pmki3auqli1ce063oar29inephua40pr.apps.googleusercontent.com"
// );

// exports.googleLogin = async (req, res) => {
//   try {
//     const { idToken, email, name } = req.body;

//     // Verify the Google ID token
//     const ticket = await client.verifyIdToken({
//       idToken: idToken,
//       audience:
//         "530592032796-pmki3auqli1ce063oar29inephua40pr.apps.googleusercontent.com",
//     });

//     const payload = ticket.getPayload();
//     const { sub: googleId } = payload;

//     // Find or create user
//     let user = await User.findOne({
//       $or: [{ email: email }, { "googleLogin.googleId": googleId }],
//     });

//     if (!user) {
//       // Create new user if doesn't exist
//       user = new User({
//         email: email,
//         firstName: name,
//         googleLogin: {
//           googleId: googleId,
//           verified: true,
//         },
//         // You might want to set a default password or handle it differently
//         password: " ",
//       });
//       await user.save();
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       success: true,
//       token: token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.firstName,
//       },
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     res.status(400).json({
//       success: false,
//       message: "Google authentication failed",
//     });
//   }
// };

// const FacebookStrategy = require("passport-facebook").Strategy;

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback", // Match Facebook app's configuration
//       profileFields: ["id", "emails", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ facebookId: profile.id });

//         if (!user) {
//           // Create a new user if not found
//           user = await User.create({
//             facebookId: profile.id,
//             email: profile.emails[0]?.value,
//             name: `${profile.name.givenName} ${profile.name.familyName}`,
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id); // Serialize user ID
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

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
