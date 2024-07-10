export default {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
    mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost/mydb',
    max_videos_per_upload: Number(process.env.MAX_VIDEOS_PER_UPLOAD) || 10,
    agenda_mongodb_uri: process.env.AGENDA_MONGODB_RUI || "mongodb://localhost:27017/agenda",
    // Add other configuration options here
};