import newsService from '../services/news.service.js';

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            res.status(400).send({ message: "Submit all fields dor registration" });
        }

        const news = await newsService.createService({
            title,
            text,
            banner,
            userId: req.userId
        })

        res.status(201).send({ news });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        const news = await newsService.findAllService(offset, limit);
        const total = await newsService.countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no registered news" });
        }

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.userId.name,
                username: item.userId.username,
                avatar: item.userId.avatar,
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const topNews = async (req, res) => {
    try {
        const news = await newsService.topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There is no registered news" });
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.userId.name,
                username: news.userId.username,
                avatar: news.userId.avatar,
            }
        })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

const findAllById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await newsService.findByIdService(id);
        res.status(200).send({
            news: {
                id: news.id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.userId.name,
                username: news.userId.username,
                avatar: news.userId.avatar,
            }
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await newsService.searchByTitleService(title);

        if (news.length === 0) {
            return res.status(400).send({ message: "There are not news with this title" });
        }

        return res.status(200).send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.userId.name,
                username: item.userId.username,
                userAvatar: item.userId.avatar,
            })),
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await newsService.byUserService(id);

        return res.status(200).send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.userId.name,
                username: item.userId.username,
                userAvatar: item.userId.avatar,
            })),
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !banner && !text) {
            res.status(400).send({
                message: "Submit at least one field to update the News",
            });
        }

        //Busca a notícia
        const news = await newsService.findByIdService(id);

        //Verifica se o usuário desta notícia é o mesmo que está logado
        if (news.userId._id.toString() !== req.userId) {
            return res.status(403).send({
                message: "You didn't update this News",
            });
        }

        await newsService.updateService(id, title, text, banner);

        return res.send({ message: "News successfully updated!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await newsService.findByIdService(id);

        if (news.userId._id.toString() !== req.userId) {
            return res.status(403).send({
                message: "You didn't delete this News",
            });
        }

        await newsService.eraseService(id);

        return res.status(200).send({ message: "News deleted successfuly" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const linkeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await newsService.linkeNewsService(id, userId);

        if (!newsLiked) {
            await newsService.deleteLikeNewsService(id, userId);
            return res.status(200).send({ message: "Like successfully removed" });
        }

        res.status(200).send({ message: "Like done successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ message: "Write a message to comment" });
        }

        await newsService.addCommentService(id, comment, userId);
        res.status(200).send({ message: "comment successfully completed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;

        const commentDeleted = await newsService.deleteCommentService(idNews, idComment, userId);

        const commentFinder = commentDeleted.comments.find((comment) => comment.idComment === idComment);

        if (!commentFinder) {
            return res.status(404).send({ message: "Comment not found" });
        }

        if (commentFinder.userId !== req.userId) {
            return res.status(400).send({ message: "You can't delete this comment" });
        }

        res.status(200).send({ message: "comment successfully removed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}


export default { create, findAll, topNews, findAllById, searchByTitle, byUser, update, erase, linkeNews, addComment, deleteComment }