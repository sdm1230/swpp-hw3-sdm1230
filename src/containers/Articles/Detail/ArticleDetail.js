import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ArticleDetail.css'

import * as actionCreators from '../../../store/actions/index';

import Comment from '../../../components/Comment/Comment'

class ArticleDetail extends Component {

    componentDidMount() {
        this.props.onGetArticle(parseInt(this.props.match.params.id));
        this.props.onGetComments();
    }

    state = {
        comment: "",
        loginUser: { id: 0 },
    }

    postComment = () => {
        this.props.onStoreComment(
            this.props.selectedArticle.id,
            this.state.loginUser.id,
            this.state.comment,
        )
    }
    clickEditComment = (comment) => {
        let modified = prompt("Edit your comment", comment.content);

        if (modified?.length > 0) {
            this.props.onEditComment(comment, modified);
        }
    }

    render() {
        if (!this.state.loginUser.name?.length > 0) {
            if (this.props.storedUsers.find(user => user.logged_in)?.name.length > 0) {
                this.setState({
                    loginUser: this.props.storedUsers.find(user => user.logged_in)
                })
            }
            else this.props.history.push('/login');
        }

        if (this.props.selectedArticle.id !== parseInt(this.props.match.params.id)) {
            this.props.onGetArticle(parseInt(this.props.match.params.id));
        }

        let title = "", content = "";
        let author = { id: 0, name: "" }; // article 쓴 사람

        if (this.props.selectedArticle.title?.length > 0) {
            title = this.props.selectedArticle.title;
            content = this.props.selectedArticle.content;

            let author_id = this.props.selectedArticle.author_id;
            author = this.props.storedUsers.find(user => user.id === author_id);
        }

        const article = () => {
            let Btn_EditArticle = null;

            if (this.props.selectedArticle.author_id === this.state.loginUser.id) {
                Btn_EditArticle =
                    <div>
                        <button
                            id="edit-article-button"
                            onClick={() => this.props.history.push(`/articles/${this.props.selectedArticle.id}/edit`)}
                        >Edit</button>

                        <button
                            id="delete-article-button"
                            onClick={() => {
                                this.props.onDeleteArticle(this.props.selectedArticle.id);
                                this.props.history.push('/articles');
                            }}
                        >Delete</button>
                    </div>
            }

            return (
                <div className='selected-article'>
                    <h2 id="article-title">{title}</h2>
                    <div className="author">
                        <div className="left"></div>
                        <h5 id="article-author">{author.name} </h5>
                        <div className="btns">
                            {Btn_EditArticle}
                        </div>
                    </div>
                    <div id="article-content">{content}</div>
                </div>
            )
        }

        const comments = this.props.storedComments
            .filter(comment => comment.article_id === this.props.selectedArticle?.id)
            .map((comment) => {

                let authorname = this.props.storedUsers.find(user => user.id === comment.author_id).name;

                let Btn_EditComment = null;
                if (comment.author_id === this.state.loginUser.id) {
                    Btn_EditComment =
                        <div className="btns">
                            <button
                                id="edit-comment-button"
                                onClick={() => this.clickEditComment(comment)}
                            >Edit</button>

                            <button
                                id="delete-comment-button"
                                onClick={() => this.props.onDeleteComment(comment.id)}
                            >Delete</button>
                        </div>
                }

                return (
                    <div className="commentBox">
                        <div className="component">
                            <Comment
                                username={authorname}
                                comment={comment.content}
                            />
                        </div>
                        <div className="editBtn">
                            {Btn_EditComment}
                        </div>
                    </div>
                )
            })



        let disabledBtn = !this.state.comment
        let Btn_confirm =
            <button
                id="confirm-create-comment-button"
                onClick={() => this.postComment()}
                disabled={disabledBtn}
            >Create Comment</button>



        return (
            <div className="ArticleDetail">
                <div className="header">
                    <div className="back">
                        <button
                            id="back-detail-article-button"
                            onClick={() => this.props.history.push('/articles')}
                        >Back</button>
                    </div>

                    <h1>ArticleDetail</h1>

                    <div className="logout">
                        <button id="logout-button"
                            onClick={() => {
                                this.props.onSetLogin(this.state.loginUser)
                                    .then(res => this.props.history.push('/login'))
                            }}
                        >Log Out</button>
                    </div>
                </div>
                <div className="article">
                    {article()}
                </div>

                <div className="newComment">
                    <label>New Comment</label>
                    <textarea
                        id="new-comment-content-input"
                        type="text"
                        value={this.state.comment}
                        onChange={(event) => this.setState({ comment: event.target.value })}
                    ></textarea>
                    {Btn_confirm}
                </div>

                <div className="comments">
                    <label>Comments</label>
                    {comments}
                </div>

            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteArticle: (id) =>
            dispatch(actionCreators.deleteArticle(id)),
        onGetArticle: (id) =>
            dispatch(actionCreators.getArticle(id)),
        onGetComments: () => dispatch(actionCreators.getComments()),
        onStoreComment: (article_id, author_id, comment) =>
            dispatch(actionCreators.postComment({ article_id: article_id, author_id: author_id, content: comment })),

        onEditComment: (comment, modified) =>
            dispatch(actionCreators.setComment(comment, modified)),
        onDeleteComment: (id) =>
            dispatch(actionCreators.deleteComment(id)),
        onSetLogin: (user) => dispatch(actionCreators.setUser(user)),
    };
};
const mapStateToProps = state => {
    return {
        storedArticles: state.articles.articles,
        storedUsers: state.users.users,
        selectedArticle: state.articles.selectedArticle,
        storedComments: state.comments.comments,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetail);