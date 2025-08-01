const express = require("express");
const router = express.Router();
const noteModel = require("../models/note.model");

router.post("/note", async (req, res) => {
  console.log(req.body);

  const note = await noteModel.create({
    title: req.body.title,
    description: req.body.description,
  });

  res.status(201).json({
    title: "notes created successfully",
  });
});

router.get("/note", async (req, res) => {
  try {
    const note = await noteModel.find();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/note/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const note = await noteModel.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        message: "note not found",
      });
    }
    res.status(200).json({
      message: "item deleted succesfullly",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });

    console.log(error);
  }
});

module.exports = router;
