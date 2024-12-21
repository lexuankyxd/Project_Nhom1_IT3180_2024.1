import { MongoClient } from "mongodb";
import { mongoose } from "mongoose";
const uri =
  "mongodb+srv://panc-server:ZOxTRlVKk8XZBxIJ@panc-profile-cluster.tomd1.mongodb.net/?retryWrites=true&w=majority&appName=panc-profile-cluster";
mongoose
  .connect(uri)
  .then(() => {
    console.log("mongo connected");
  })
  .catch((err) => {
    console.log(err);
  });

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    friendCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    imageId: {
      type: String, // Lưu URL của ảnh sản phẩm
      required: true,
    },
    profileTags: {
      type: [
        {
          tag: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);
export const Profile = mongoose.model("profile", ProfileSchema);

export async function createProfile(
  name,
  city,
  description,
  imageId,
  profileTags,
) {
  try {
    const profile = new Profile({
      name,
      city,
      description,
      imageId,
    });
    const savedProfile = await profile.save();
    return savedProfile;
  } catch (error) {
    console.log("Error at creating profile process: ", error);
    return null;
  }
}

export async function updateProfile(
  id,
  name,
  city,
  description,
  imageId,
  profileTags,
) {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { name, city, description, imageId, profileTags },
      { new: true },
    );
    return updatedProfile;
  } catch (error) {
    console.log("Error at updating profile process: ", error);
    return null;
  }
}

export async function deleteProfile(id) {
  try {
    const deleteProfile = Profile.deleteOne({ _id: id });
    if (deleteProfile) {
      console.log("Profile does not exist");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Error at deleting profile process: ", error);
    return false;
  }
}

export async function getProfile(id) {
  try {
    const profile = await Profile.find({ _id: id });
    console.log("Profile", profile);
    return profile;
  } catch (error) {
    console.log(error);
  }
}

export async function disconnectMongoDB() {
  try {
    mongoose.connection.close();
  } catch (error) {}
}
