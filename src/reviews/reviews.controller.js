const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await reviewsService.read(reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }
    next({ status: 404, message: `Review cannot be found` });
}

async function list(req, res) {
    const data = await reviewsService.list();
    res.json({ data });
}

async function update(req, res) {
    const { reviewId } = req.params;

    await reviewsService.update(reviewId, req.body.data);
    res.json({ data: await reviewsService.getUpdatedRecord(reviewId) });
}

async function destroy(req, res) {
    const { review } = res.locals;
    await reviewsService.delete(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};