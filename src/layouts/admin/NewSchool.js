import React, {Component} from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import * as firebase from 'firebase'

class NewSchool extends Component {
    state = {
        form: {
            name: '',
            key: '',
        }
    }
    handleClose = () => {
        this.props.toggle()
    }

    handleSave = () => {
        const {form} = this.state
        const {school} = this.props
        if (school[form.key]) alert('Mã trường trùng lặp')
        firebase.database().ref(this.props.DB_PREFIX + '/groups').set({
            ...school,
            [form.key]: {
                name: form.name
            }
        }).then(() => this.props.toggle())
    }

    changeInput = (key) => (e) => {
        const {value} = e.target
        this.setState(({form}) => ({
            form: {
                ...form,
                [key]: value,
            }
        }))
    }

    render() {
        const {open, toggle} = this.props
        const {form} = this.state

        return (
            <div className="NewSchool">
                <Dialog
                    open={open}
                    onClose={toggle}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Thêm trường mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="key"
                            onChange={this.changeInput('key')}
                            label="Mã trường"
                            value={form.key}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            onChange={this.changeInput('name')}
                            value={form.name}
                            label="Tên trường"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Hủy
                        </Button>
                        <Button variant="contained" onClick={this.handleSave} color="primary">
                            Thêm trường
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default NewSchool
