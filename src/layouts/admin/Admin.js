import React, {Component} from 'react'
import AppContext from '../../AppContext'
import * as firebase from 'firebase'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {Switch, Route} from 'react-router-dom'
import ListSchools from '../../containers/list-schools/ListSchools'

class Admin extends Component {
    render() {
        return (
            <div className="Admin">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">SCS - Admin</Typography>
                    </Toolbar>
                </AppBar>
                <div className={'container'}>
                    <Switch>
                        <Route componen={ListSchools} />
                    </Switch>
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
