const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const connectedDB = require("./database/databaseConnection");
const oldmovieSchema = require("./schemas/oldmovieSchema");

connectedDB();

const OldMovies = mongoose.model("oldmovies", oldmovieSchema);

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/insert_old_movie", async (req, res) => {
    try {
        const oldMovieData = req.body;
        const oldMovie = new OldMovies(oldMovieData);
        await oldMovie.save();

        return res.status(200).json({ message: "Data Inserted successfully" });
    } catch (error) {
        // Handle any errors that occur during insertion
        console.error("Error inserting old movie data:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/get_single_data', async (req, res) => {
    try {
        const dataId = req.body.id;
        const data = await OldMovies.findById(dataId);

        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.json(data);
    } catch (error) {
        console.error("Error retrieving data:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/delete_single_data', async (req, res) => {
    try {
        const { id } = req.body;
        const result = await OldMovies.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json({ message: 'Data Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/update_old_movie', async (req, res) => {
    try {
        const {
            _id,
            title,
            movie_name,
            banner_link,
            banner_image,
            category,
            main_stars,
            description,
            releasing_year,
            language,
            resolution,
            file_size,
            quick_story,
            download_low,
            download_medium,
            download_high,
            youtube_trailer,
            cover_image
        } = req.body;

        // Use updateOne to update the data by its ID
        const result = await OldMovies.updateOne(
            { _id },
            {
                $set: {
                    title,
                    movie_name,
                    banner_link,
                    banner_image,
                    category,
                    main_stars,
                    description,
                    releasing_year,
                    language,
                    resolution,
                    file_size,
                    quick_story,
                    download_low,
                    download_medium,
                    download_high,
                    youtube_trailer,
                    cover_image
                }
            }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'Data not found or no changes made' });
        }

        return res.status(200).json({ message: 'Data Update Successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get("/old_movies", async (req, res) => {
    try {
        const data = await OldMovies.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching old movies:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

});

app.listen(port, () => {
    console.log("server started on port ", port);
});