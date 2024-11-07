import mongoose from "mongoose";

// Define the schemas for student and agent userInfo
const studentInfoSchema = new mongoose.Schema(
  {
    university: { type: String, required: true },
    major: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    savedProperties: { type: [Number], default: [] }, // List of saved property IDs
    wishlist: { type: [String], default: [] }, // List of wishlist items (strings)
  },
  { _id: false }
); // Disable _id field generation for this sub-document

const agentInfoSchema = new mongoose.Schema(
  {
    agencyName: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Phone number for the agent
    propertiesListed: [
      {
        id: { type: Number, required: true }, // Property ID
        available: { type: Boolean, required: true }, // Availability userType
      },
    ],
  },
  { _id: false }
); // Disable _id field generation for this sub-document

// Common user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["student", "agent"],
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
      validate: {
        validator: function (value) {
          if (this.userType === "student") {
            return studentInfoSchema.validateSync(value) == null;
          } else if (this.userType === "agent") {
            return agentInfoSchema.validateSync(value) == null;
          }
          return false;
        },
        message: (props) => `Invalid userInfo for ${props.value.userType}`,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
