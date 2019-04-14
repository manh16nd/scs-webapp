import React, {Component} from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import AppContext from '../../AppContext'
import * as firebase from 'firebase'
import axios from 'axios'

const server = 'http://nuichatbot-1.herokuapp.com'

class Supporter extends Component {
    constructor(props) {
        super(props)
        const currentGroup = this.props.user.group

        this.convRef = firebase.database()
            .ref(this.props.DB_PREFIX + '/conversations/group/' + currentGroup)
            .orderByChild('status')
            .startAt(2)
            .endAt(3)
        this.messRef = null

        this.convRef.on('child_added', this.updateConversation)
        this.convRef.on('child_changed', this.updateConversation)

        this.state = {
            conversations: [],
            open: null,
            current: [],
            text: '',
        }
    }

    appendToMessageList = (snap) => {
        const msg = snap.val()
        this.setState(({current}) => ({
            current: [
                ...current,
                msg,
            ]
        }))
    }

    updateConversation = (snap) => {
        const userData = this.props.user
        const conversation = snap.val() || {}
        conversation.$tid = snap.key

        if (conversation.status !== 2 && conversation.status !== 3) return
        if (conversation.group !== userData.group) return

        var isnew = false
        const newConversations = this.state.conversations.map(c => {
            if (c.$tid === conversation.$tid) {
                isnew = true
                return conversation
            }
            return c
        })
        this.setState(({conversations}) => ({
            conversations: !isnew ? [conversation, ...conversations] : newConversations
        }))
    }

    onClickConversation = (c) => () => {
        if (this.state.open && this.state.open.$tid === c.$tid) {
            this.setState({
                open: null,
                current: [],
                text: '',
            })
            if (this.messRef) this.messRef.off('child_added', this.appendToMessageList)
            return
        }

        this.setState({
            open: c,
            current: [],
            text: '',
        })

        this.messRef = firebase.database()
            .ref(this.props.DB_PREFIX + '/conversations/msg/' + this.props.user.group + '/' + c.$tid)
            .orderByKey()
            .limitToLast(20)

        this.messRef.on('child_added', this.appendToMessageList)
    }

    _onSubmit = (c) => (e) => {
        e.preventDefault()
        if (this.state.text) return firebase.auth().currentUser.getIdToken(true).then((idToken) => {
            const {text} = this.state
            axios.post(`${server}/pagetuyensinh/staffSendMessage`, {
                idToken,
                tid: c.$tid,
                text
            })
                .then(success => this.setState({
                    text: '',
                }))
                .catch(err => alert(err.message || err))
        })
            .catch(e => alert(e.message || e))
    }

    renderConversation = () => {
        const {current, open} = this.state

        return <div className={'card mt-3 mb-3'}>
            <div className={'card-header Title'} onClick={this.onClickConversation(open)}>{this.state.open.name}</div>
            <div className=" card-body Card">
                {current.map((m, i) => <div key={i} className={'Message'}>
                    <div className={m.page ? 'Ours' : 'Yours'}>
                        <div className={'Textt'}>{m.text}</div>
                    </div>
                </div>)}
            </div>
            <div className={'Text'}>
                <form className={'FormMessage'} onSubmit={this._onSubmit(open)}>
                    <div className={'Actions'}>
                        <button>
                            <Icon>send
                            </Icon>
                        </button>
                    </div>
                    <input className={'form-control'} placeholder={'Gửi tin nhắn'} value={this.state.text}
                           onChange={e => this.setState({text: e.target.value})}/>
                    <div className={'SendIcon'}>
                        <button type={'submit'}>
                            <Icon>send
                            </Icon>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }

    render() {
        const {user} = this.props
        const {conversations, open} = this.state

        return (
            <div className={'Supporter'}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">SCS</Typography>
                    </Toolbar>
                </AppBar>
                <div className={'container mt-3'}>
                    <span className="text-muted">Xin chào,</span><span
                    className={'font-weight-bold'}> {user.name}</span>
                    {open ? this.renderConversation() :
                        conversations.map((c, i) => <div className={'card card-body mt-3 Card'} key={i}>
                            <div className={'Title'} onClick={this.onClickConversation(c)}>{c.name}</div>
                            <div
                                className={'text-muted Conversation'}>{c.lastMsg.text}</div>
                        </div>)}
                </div>
            </div>
        )
    }
}

export default function (props) {
    return (
        <AppContext.Consumer>
            {(app) => <Supporter
                {...{
                    ...app,
                    ...props,
                }}
            />}
        </AppContext.Consumer>
    )
}
