const express = require("express");
const musicController = require("../controllers/music.controller");
const multer = require("multer");
const { authArtist, authUser } = require("../middleware/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  authArtist,
  upload.single("music"),
  musicController.createMusic,
);
router.post("/album", authArtist, musicController.createAlbum);

router.get("/" , authUser ,musicController.getAllMusics)

router.get("/albums", authUser, musicController.getAllAlbums);

router.get("/albums/:albumId", authUser, musicController.getAlbumsById);

module.exports = router;
