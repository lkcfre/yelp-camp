const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')
mongoose.connect('mongodb+srv://first_user:ml4Whu2ltVt7qCFf@cluster0.j5gbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <350; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
            author: '613e33937ede83d75e6ae05c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem totam, at magni explicabo qui omnis illo recusandae veniam, quis reprehenderit dicta quisquam cumque nostrum aperiam hic minima, soluta velit saepe!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image:  [
                {
                url: 'https://res.cloudinary.com/danazvoz1/image/upload/v1631455639/YelpCamp/hpl3umvucnfn9yilqtwj.jpg',
                filename: 'YelpCamp/hpl3umvucnfn9yilqtwj',
                },
                {
                url: 'https://res.cloudinary.com/danazvoz1/image/upload/v1631455639/YelpCamp/zu0ccjrn95it293hdicx.jpg',
                filename: 'YelpCamp/zu0ccjrn95it293hdicx',
                },
                {
                url: 'https://res.cloudinary.com/danazvoz1/image/upload/v1631455639/YelpCamp/k0saanqgbu27r0uyhzpv.jpg',
                filename: 'YelpCamp/k0saanqgbu27r0uyhzpv'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})