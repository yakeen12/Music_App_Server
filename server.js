const express = require('express');
const app = express();
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const songRoutes = require('./Routes/songRoutes');
const podcastRoutes = require('./Routes/podcastRoutes');
const communityRoutes = require('./Routes/communityRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const postRoutes = require('./Routes/postRoutes');
const secretGiftRoutes = require('./Routes/secretGiftRoutes');
const playlistsRoutes = require('./Routes/playListsRoutes');
// const upload = require('./MiddleWare/multer'); // استيراد Multer
const artistRoutes = require('./Routes/artistRoutes');

const mongoose = require('mongoose');


mongoose.
    connect('mongodb+srv://ireneredvelvet1991329:077777@music-app.oocg9.mongodb.net/')
    .then(() => {
        // app.listen(3000, () => {

        //     console.log('Node API app is running on port 3000')
        // })
        console.log("connected to mongoDB")
    }
    ).catch((error) => {
        console.log(error)
    });


// Middleware لمعالجة JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // يُستخدم لتحليل بيانات form-urlencoded

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Musiiiiiccc');
});




// ربط المسارات
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/secretGifts', secretGiftRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/playlists', playlistsRoutes);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});



