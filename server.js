const app = require("./src/app");
const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
    console.log("WSV e-commerce start with port: " + PORT);
} );

// process.on("SIGINT", () => {
//     server.close(() => {
//         console.log("WSV e-commerce closed");

//         //thong bao khi server dong
//     });
// });