import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ArticleCreate.css'

import * as actionCreators from '../../../store/actions/index'

class ArticleCreate extends Component {
    state = {
        title: "",
        content: "",
        selectedWriteTab: true,
        selectedPreviewTab: false,
        loginUser: {},
        clickToPost: false,
        initialize: 0,
    }

    postArticleHandler = () => {
        this.props.onStoreArticle(
            this.state.loginUser,
            this.state.title,
            this.state.content);
        this.setState({ clickToPost: true })
    }

    render() {
        if (this.state.initialize < 2) {
            this.props.onInitialSelectedArticle();
            this.setState({ initialize: this.state.initialize + 1 })
        }

        if (this.state.clickToPost && this.props.selectedArticle.title?.length > 0) {
            this.props.history.push('/articles/' + this.props.selectedArticle.id)
        }

        if (!this.state.loginUser.name?.length > 0) {
            if (this.props.storedUsers.find(user => user.logged_in)?.name.length > 0) {
                this.setState({
                    loginUser: this.props.storedUsers.find(user => user.logged_in)
                })
            }
            else return <Redirect to='/login' />
        }

        let tab = null;
        if (this.state.selectedWriteTab) {
            tab =
                <div className="write-tab">
                    <label>Title</label>
                    <input
                        id="article-title-input"
                        type="text"
                        value={this.state.title}
                        onChange={(event) => this.setState({ title: event.target.value })}
                    ></input>

                    <label>Content</label>
                    <textarea
                        id="article-content-input"
                        rows="4"
                        type="text"
                        value={this.state.content}
                        onChange={(event) => this.setState({ content: event.target.value })}
                    ></textarea>
                </div>
        }
        if (this.state.selectedPreviewTab) {
            tab =
                <div className="preview-tab">
                    <h2 id="article-author">{this.state.loginUser.name}</h2>
                    <h1 id="article-title">{this.state.title} </h1>
                    <h3 id="article-content">{this.state.content}</h3>
                </div>
        }

        
        let disabledbtn =!(this.state.title && this.state.content)
        let Btn_confirm = <button 
            id="confirm-create-article-button" 
            onClick={() => this.postArticleHandler()} 
            disabled={disabledbtn}>Create</button>

        return (
            <div className="NewArticle">
                <div className="header">
                    <div className="back">
                        <button id="back-create-article-button" onClick={() => this.props.history.push('/articles')}>Back</button>
                    </div>

                    <h1>ArticleCreate</h1>

                    <div className="logout">
                        <button id="logout-button"
                            onClick={() => {
                                this.props.onSetLogin(this.state.loginUser)
                                    .then(res => this.props.history.push('/login'))
                            }}
                        >Log Out</button>
                    </div>
                </div>


                <div className="tabBtnContainer">
                    <div className="writeTab">
                        <button id="write-tab-button" onClick={() => {
                            this.setState({ selectedWriteTab: true, selectedPreviewTab: false })
                        }} style={{color: this.state.selectedWriteTab? "aqua":"black"}}
                        >WriteTab</button>
                    </div>

                    <div className="previewTab">
                        <button id="preview-tab-button" onClick={() => {
                            this.setState({ selectedWriteTab: false, selectedPreviewTab: true })
                        }} style={{color: this.state.selectedPreviewTab? "aqua":"black"}}
                        >PreviewTab</button>
                    </div>
                </div>


                <div className="tabBox">
                    {tab}
                </div>
                <div className="confirm">
                    {Btn_confirm}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onStoreArticle: (author, title, content) =>
            dispatch(actionCreators.postArticle({ author_id: author.id, title: title, content: content })),
        onInitialSelectedArticle: () => dispatch(actionCreators.getArticle_({})),
        onSetLogin: (user) => dispatch(actionCreators.setUser(user)),
    };
};
const mapStateToProps = state => {
    return {
        storedUsers: state.users.users,
        selectedArticle: state.articles.selectedArticle,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCreate);