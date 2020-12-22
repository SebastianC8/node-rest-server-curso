process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let url;

if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/cafe';
} else {
    url = 'mongodb+srv://sebastianc89:X5I5vQQ9yx6PAqCv@cluster0.nb9zc.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLBD = url;