const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: Int!
        email: String!
        name: String
    }
    
    type Post {
        id: Int
        title: String
        body: String
        image: String
        likes_count: Int
        unlikes_count: Int
        author_id: Int
        create_date: String
        author_name: String
        author_email: String
    }

    type PostResponse {
        status: Int
        message: String!
    }

    type LikeAndUnlikeResponse {
        status: Int
        message: String!
        likes_count: Int!
        unlikes_count: Int!
    }

    input CreatePostContent {
        title: String!
        body: String!
        image: String
        author_id: Int!
        create_date: String!
    }

    input UpdatePostContent {
        id: Int!
        title: String!
        body: String!
        image: String!
        author_id: Int!
    }

    input DeletePostContent {
        id: Int!
    }

    input LikeAndUnlikePostContent {
        id: Int!
    }

    type Comment {
        id: Int!
        body: String!
        user_id: Int!
        post_id: Int!
        create_date: String!
    }

    input CreateCommentContent {
        body: String!
        user_id: Int!
        post_id: Int!
        create_date: String!
    }

    input DeleteCommentContent {
        id: Int!
    }

    type CommentReply {
        id: Int!
        body: String!
        user_id: Int!
        comment_id: Int!
        create_date: String!
    }

    input CommentReplyContent {
        body: String!
        user_id: Int!
        comment_id: Int!
        create_date: String!
    }

    type Query {
        getPost(title: String!): Post
    }

    type Mutation {
        createPost(content: CreatePostContent!): PostResponse!
        updatePost(content: UpdatePostContent!): PostResponse!
        deletePost(content: DeletePostContent!): PostResponse!
        likePost(content: LikeAndUnlikePostContent!): LikeAndUnlikeResponse!
        unlikePost(content: LikeAndUnlikePostContent!): LikeAndUnlikeResponse!
        createComment(content: CreateCommentContent!): PostResponse!
        deleteComment(content: DeleteCommentContent!): PostResponse!
        replyComment(content: CommentReplyContent!): PostResponse!
    }
`;

module.exports = typeDefs;