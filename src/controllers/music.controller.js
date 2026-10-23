const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Artist authentication required" });
  }

  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const { title, musics } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "A non-empty title is required" });
  }

  if (!Array.isArray(musics)) {
    return res.status(400).json({ message: "musics must be an array of music IDs" });
  }

  const album = await albumModel.create({
    title: title.trim(),
    artist: req.user.id,
    musics,
  });

  return res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}

async function getAllMusics(req ,res) {
  const musics = await musicModel.find()
  .limit(2)
  .populate("artist" , "username  email")

  res.status(200).json({
    message : "Music fetched successfully" ,
    musics : musics ,
  })
}


async function getAllAlbums(req ,res) {

  const albums = await albumModel.find().select("title artist").populate("artist" , "username email");

  res.status(200).json({
    message : "Albums fetched successfully" ,
    albums : albums ,
  })

}


async function getAlbumsById(req , res) {
 const albumId = req.params.albumId;
 const album = await albumModel
  .findById(albumId)
  .populate("artist", "username email");

 if (!album) {
  return res.status(404).json({ message: "Album not found" });
 }


 return res.status(200).json({
  message : "Album fetched successfully" ,
  album : album
 })
  
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumsById,
};
