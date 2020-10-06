import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ArticleList.css'

import * as actionCreators from '../../../store/actions/index';

import Article from '../../../components/Article/Article';

class ArticleList extends Component {
    state = {
        loginUser: { name: "" },
    }

    componentDidMount() {
        this.props.onGetAll();
    }

    clickArticleHandler = (article) => {
        this.props.onGetArticle(article.id);
        this.props.history.push('/articles/' + article.id);
    }

    clickLogout = () => {
        this.props.onSetLogin(this.state.loginUser)
            .then(res => this.props.history.push('/login'))
    }

    render() {
        if (!this.state.loginUser.name.length > 0) {
            if (this.props.storedUsers.find(user => user.logged_in)?.name.length > 0) {
                this.setState({
                    loginUser: this.props.storedUsers.find(user => user.logged_in)
                })
            }
            else this.props.history.push('/login');
        }


        const articles = this.props.storedArticles.map(article => {

            let author = this.props.storedUsers.find(user => user.id === article.author_id);

            return (
                <Article
                    id={article.id}
                    title={article.title}
                    author={author.name}
                    clickDetail={() => this.clickArticleHandler(article)}
                />
            )
        })

        return (
            <div className='ArticleList'>

                <div className="logout">
                    <button id="logout-button"
                        onClick={() => this.clickLogout()}
                    >Log Out</button>
                </div>

                <h1>ArticleList</h1>

                <div className="create">
                    <button
                        id="create-article-button"
                        onClick={() => this.props.history.push('/articles/create')}
                    >Create New Article</button>
                </div>

                <div className='articles'>
                    <div className='header'>
                        <div className='left'>
                            Article Id
                        </div>
                        <div className='center'>
                            Article Title
                        </div>
                        <div className='right'>
                            Author Name
                        </div>
                    </div>
                    {articles}
                </div>

            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetAll: () => dispatch(actionCreators.getArticles()),
        onSetLogin: (user) => dispatch(actionCreators.setUser(user)),
        onGetArticle: (id) =>
            dispatch(actionCreators.getArticle(id)),
    };
};
const mapStateToProps = state => {
    return {
        storedArticles: state.articles.articles,
        storedUsers: state.users.users,
        selectedArticle: state.articles.selectedArticle,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);