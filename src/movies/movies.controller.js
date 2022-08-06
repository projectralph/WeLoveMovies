const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const { is_showing } = req.query;
    if (is_showing) {
        const data = await moviesService.listIsShowing();
        return res.json({ data });
    }
    const data = await moviesService.list();
    res.json({ data });
}


async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await moviesService.read(movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    } else {
        next({ status: 404, message: "Movie cannot be found." });
    }
}

function read(req, res, next) {
    res.json({ data: res.locals.movie });
}

const readTheatersByMovie = async (req, res, next) => {
    const movie = res.locals.movie.movie_id;
    res.json({ data: await moviesService.readTheatersByMovie(movie) });
};

const readReviewsByMovie = async (req, res, next) => {
    const movie = res.locals.movie.movie_id;
    res.json({ data: await moviesService.readReviewsByMovie(movie) });
};

module.exports = {
    list: asyncErrorBoundary(list),
    movieExists: asyncErrorBoundary(movieExists),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    readTheatersByMovie: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(readTheatersByMovie),
    ],
    readReviewsByMovie: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(readReviewsByMovie),
    ],
}