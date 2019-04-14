import React, {Component} from 'react'
import AppContext from '../../AppContext'
import * as firebase from 'firebase'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {Switch, Route} from 'react-router-dom'
import ListSchools from '../../containers/list-schools/ListSchools'

class Admin extends Component {
    constructor(props) {
        super(props)

        this.schoolRef = firebase.database().ref(this.props.DB_PREFIX + '/groups')
        this.schoolRef.on('child_added', this.updateSchool)
        this.schoolRef.on('child_changed', this.updateSchool)
        this.state = {
            school: {},

        }
    }

    updateSchool = (snap) => {
        this.setState(({school}) => ({
            school: {
                ...school,
                [snap.key]: snap.val(),
            }
        }))
    }

    clickSchool = (s) => () => {
        this.setState({
            selectedSchool: {...this.state.school[s]},
        })

        firebase.database().ref(this.props.DB_PREFIX- + '/users')
            .orderByChild('group')
            .equalTo(s)
            .once('value').then(snap => {
            var users = this.props.decodeFirebaseArray(snap.val() || {}, 'uid')
            console.log(users)
        })
    }

    render() {
        const {school, selectedSchool} = this.state

        return (
            <div className="Admin">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">SCS - Admin</Typography>
                    </Toolbar>
                </AppBar>
                <div className={'container'}>
                    {selectedSchool ? <div className={'card mt-3'}>
                            <div className={'card-header'}>
                                {selectedSchool.name}
                            </div>
                            <div className={'card-body'}>

                            </div>
                        </div> :
                        Object.keys(school).map((s, i) => <div className={'card card-body mt-3 Card'} key={i}
                                                               onClick={this.clickSchool(s)}>
                            <span>{school[s].name}</span>
                        </div>)}
                </div>
            </div>
        )
    }
}

export default function (props) {
    return (
        <AppContext.Consumer>
            {(app) => <Admin
                {...{
                    ...app,
                    ...props,
                }}
            />}
        </AppContext.Consumer>
    )
}
