const sqlite3 = require('sqlite3').verbose();

//create a database if no exists
const database = new sqlite3.Database("blogDatabase.db");

const resolvers = {
    Query: {
        getPost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                database.get("SELECT * FROM posts WHERE title=?;", [args.title], function (err, postRecord) {
                    if (err) {
                        resolve({});
                    }
                    if (postRecord) {
                        database.get("SELECT name as author_name, email as author_email FROM users WHERE id=?;", [postRecord.author_id], function (err, userRecord) {
                            if (err) {
                                resolve({});
                            }
                            let finalData = { ...postRecord, ...userRecord };
                            resolve(finalData);
                        });
                    } else {
                        resolve({});
                    }
                });
            });
        },

    },

    Mutation: {
        createPost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.run("INSERT INTO posts(title, body, image, author_id, create_date) VALUES(?,?,?,?,?);", [clientData.title, clientData.body, clientData.image, clientData.authorId, clientData.createDate], function (err, rows) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${clientData.title}) saved successfully!` });
                });
            });
        },

        updatePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.run("UPDATE posts SET title=?, body=?, image=?, author_id=? WHERE id=?;", [clientData.title, clientData.body, clientData.image, clientData.authorId, clientData.id], function (err, rows) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${clientData.title}) updated successfully!` });
                });
            });
        },

        deletePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.get("SELECT title FROM posts WHERE id=?;", [clientData.id], function (err, row) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const titleOfPost = row.title;
                        database.run("DELETE FROM posts WHERE id=?;", [clientData.id], function (err, rows) {
                            if (err) {
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({ status: 200, message: `Post (${titleOfPost}) deleted successfully!` });
                        });
                    } else {
                        resolve({ status: 400, message: "No match!" });
                    }
                });
            });
        },

        likePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.get("SELECT title, likes_count, unlikes_count FROM posts WHERE id=?;", [clientData.id], function (err, row) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const title = row.title;
                        const numOfUnlikes = row.unlikes_count;
                        const numOfLikes = row.likes_count + 1;
                        database.run("UPDATE posts SET likes_count=? WHERE id=?;", [numOfLikes, clientData.id], function (err, rows) {
                            if (err) {
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({
                                status: 200,
                                message: `Post (${title}) successfully liked!`,
                                likesCount: numOfLikes,
                                unlikesCount: numOfUnlikes
                            });
                        });
                    } else {
                        resolve({ status: 400, message: "No match!" });
                    }
                });
            });
        },

        unlikePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.get("SELECT title, likes_count, unlikes_count FROM posts WHERE id=?;", [clientData.id], function (err, row) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const title = row.title;
                        const numOfLikes = row.likes_count;
                        const numOfUnlikes = row.unlikes_count + 1;
                        database.run("UPDATE posts SET unlikes_count=? WHERE id=?;", [numOfUnlikes, clientData.id], function (err, rows) {
                            if (err) {
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({
                                status: 200,
                                message: `Post (${title}) unliked successfully!`,
                                likesCount: numOfLikes,
                                unlikesCount: numOfUnlikes
                            });
                        });
                    } else {
                        resolve({ status: 400, message: "no match!" });
                    }
                });
            });
        },

        createComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.run("INSERT INTO comments(body, user_id, post_id, create_date) VALUES(?,?,?,?);", [clientData.body, clientData.userId, clientData.postId, clientData.createDate], function (err, rows) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Comment saved!` });
                });
            });
        },

        deleteComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                const clientData = args.content;
                database.get("SELECT id FROM comments WHERE id=?;", [clientData.id], function (err, row) {
                    if (err) {
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        database.run("DELETE FROM comments WHERE id=?;", [clientData.id], function (err, rows) {
                            if (err) {
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({ status: 200, message: `Comment deleted!` });
                        });
                    } else {
                        resolve({ status: 400, message: "no match!" });
                    }
                });
            });
        },

        replyComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const clientData = args.content;
                database.run("INSERT INTO comment_replies(body, user_id, comment_id, create_date) VALUES(?,?,?,?);", [clientData.body, clientData.userId, clientData.commentId, clientData.createDate], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Comment reply saved!` });
                });
            });
        },
    }
};

module.exports = resolvers;