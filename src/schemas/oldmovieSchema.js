const mongoose = require('mongoose');

const oldmovieSchema = mongoose.Schema({
title: String,
movie_name: String,
banner_link: String,
banner_image: String,
category: String,
main_stars: String,
description: String,
releasing_year: String,
language: String,
resolution: String,
file_size: String,
quick_story: String,
download_low: String,
download_medium: String,
download_high: String,
youtube_trailer: String,
cover_image: String
});

module.exports = oldmovieSchema;