const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const connectedDB = require("./database/databaseConnection");
const oldmovieSchema = require("./schemas/oldmovieSchema");
const adminusersSchema = require("./schemas/dashboarduserSchema");
const userrequirementSchema = require('./schemas/userrequirementSchema')

connectedDB();

const OldMovies = mongoose.model("oldmovies", oldmovieSchema);
const adminUser = mongoose.model("dashboard_users", adminusersSchema);
const userRequirement = mongoose.model("user_requirement", userrequirementSchema);

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/show_movie_request', async (req, res) => {
    const data = await userRequirement.find().select({ __v: 0});
    res.status(200).json({ message: 'all movie request', data });
})

app.post('/user_requirement', async (req, res) => {
    const { movie_name, email, mobile_number } = req.body;
    try {
        if (!movie_name || !email || !mobile_number) {
            return res.json({ message: 'Please fill all fields' });
        }
        const requirement = new userRequirement({movie_name, email, mobile_number});
        requirement.save();
        res.json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.log(error.message);
    }
})

app.post('/admin_login', async (req, res) => {
    const { email, password } = req.body;
    // const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const result = await adminUser.findOne({email});

    if (!result || result.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    // const token = jwt.sign({ userId: result._id, email: result.email }, secretKey, {
    //     expiresIn: '1h', // Token expiration time
    // });
    res.json({ message: 'Login successful', data:{full_name:result.full_name, role:result.role} });
})

app.post("/insert_old_movie", async (req, res) => {
    try {
        const oldMovieData = req.body;
        const {movie_name} = oldMovieData;
        const data = await OldMovies.findOne({ movie_name });
        if (data) {
            return res.status(200).json({ message: "Movie Already Inserted!" });
        }
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit);
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        const total = await OldMovies.countDocuments();
        const data = await OldMovies.find({movie_name:{$regex:search, $options: 'i'}}).skip(skip).limit(limit);
        res.json({data, total, page, limit});
    } catch (error) {
        console.error('Error fetching old movies:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

});

app.listen(port, () => {
    console.log("server started on port ", port);
});