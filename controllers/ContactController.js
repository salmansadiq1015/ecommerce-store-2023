import contactModel from "../models/contactModel.js";

export const createMessageController = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    // Validation
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(401).send({ message: "Email is required!" });
    }
    if (!phone) {
      return res.status(401).send({ message: "Phone is required!" });
    }
    if (!message) {
      return res.status(401).send({ message: "Message is required!" });
    }

    // Create Message
    const contact = await new contactModel({
      name,
      email,
      phone,
      message,
    }).save();

    res.status(200).send({
      success: true,
      message: "Message send successfully!",
      contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while creating Message!",
      error,
    });
  }
};

// Get All Messages

export const getMessageController = async (req, res) => {
  try {
    const Messages = await contactModel.find({});
    res.status(200).send({
      success: true,
      total: Messages.length,
      message: "All messages list!",
      Messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Message!",
      error,
    });
  }
};

// Delete Message Controller

export const deleteMessageController = async (req, res) => {
  try {
    const { id } = req.params;

    const Messages = await contactModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Message is deleted successfully!",
      Messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting Message!",
      error,
    });
  }
};
