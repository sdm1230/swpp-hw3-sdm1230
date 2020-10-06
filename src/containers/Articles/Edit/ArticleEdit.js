import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ArticleEdit.css'

import * as actionCreators from '../../../store/actions/index'

class ArticleEdit extends Component {
    state = {
        title: "",
        content: "",
        selectedWriteTab: true,
        selectedPreviewTab: false,
        loginUser: {},
    }
    componentDidMount() {
        this.props.onGetArticle(parseInt(this.props.match.params.id));
        this.setState({ title: this.props.selectedArticle.title, content: this.props.selectedArticle.content })
    }

    EditArticleHandler = () => {
        this.props.onSetArticle(
            this.props.selectedArticle,
            this.state.title,
            this.state.content);
        this.props.history.push('/articles/' + this.props.selectedArticle.id)
    }

    clickToBack = () => {
        if (this.state.title !== this.props.selectedArticle.title || this.state.content !== this.props.selectedArticle.content) {
            let res = window.confirm("Are you sure? The change will be lost.");
            if (res) { }
            else return;
        }
        this.props.history.goBack();
    }

    render() {
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

        let Btn_confirm = null;
        if (this.state.title && this.state.content) {
            Btn_confirm =
                <button id="confirm-edit-article-button"
                    onClick={() => this.EditArticleHandler()}
                >Submit</button>
        }
        else {
            Btn_confirm = <button id="confirm-edit-article-button"
                onClick={() => this.EditArticleHandler()} disabled
            >Submit</button>
        }

        return (
            <div className="NewArticle">

                <div className="header">
                    <div className='back'>
                        <button id="back-edit-article-button" onClick={() => this.clickToBack()}>Back</button>
                    </div>

                    <h1>ArticleEdit</h1>

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
        onSetArticle: (article, newTitle, newContent) =>
            dispatch(actionCreators.setArticle(article, newTitle, newContent)),
        onGetArticle: (id) =>
            dispatch(actionCreators.getArticle(id)),
        onSetLogin: (user) => dispatch(actionCreators.setUser(user)),
    };
};
const mapStateToProps = state => {
    return {
        storedUsers: state.users.users,
        selectedArticle: state.articles.selectedArticle,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEdit);