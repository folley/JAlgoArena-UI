import React from 'react';
import {findDOMNode} from 'react-dom';
import {Grid, Col, Button, FormGroup, PageHeader} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import FontAwesome from '../components/FontAwesome';
import {attemptLogin} from "../actions/AuthActions";
import {navigatedAwayFromAuthFormPage} from "../actions/AuthActions";
import {validateEmail, validatePassword} from '../utilities/RegexValidators';
import {showModal} from "../actions/index";
import WorkInProgress from '../components/WorkInProgress';

const initialFormState = {
    errorMessage: null,
    isEmailFieldIncorrect: false,
    isPasswordFieldIncorrect: false
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialFormState);
        this.onLogin = this.onLogin.bind(this);
    }

    transferToDashboardIfLoggedIn() {
        if (this.props.userAuthSession.isLoggedIn) {
            hashHistory.push('/profile');
        }
    }

    componentWillMount() {
        this.transferToDashboardIfLoggedIn();
    }

    componentDidUpdate() {
        this.transferToDashboardIfLoggedIn();

        if (this.props.userAuthSession.error === "Incorrect login or password.") {
            if (!this.state.isEmailFieldIncorrect) {
                let newState = Object.assign({}, this.state);
                newState.isEmailFieldIncorrect = true;
                this.setState(newState);
            }
            findDOMNode(this.refs.email).focus();
        }
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    componentDidMount() {
        findDOMNode(this.refs.email).focus();
    }

    getInputContainerClass(inputIncorrect) {
        return ("form-group " + (inputIncorrect ? "has-error" : "") );
    }

    findErrorsInLoginForm(formData) {
        // Only finding one error at a time.
        let newState = Object.assign({}, initialFormState);

        // Checking email
        if (formData.email === "") {
            newState.errorMessage = "Email is required";
            newState.isEmailFieldIncorrect = true;
        }
        else if (!validateEmail(formData.email)) {
            newState.errorMessage = "Please enter a valid email address";
            newState.isEmailFieldIncorrect = true;
        }
        // Checking password
        else if (formData.password === "") {
            newState.errorMessage = "Password is required";
            newState.isPasswordFieldIncorrect = true;
        }
        else if (!validatePassword(formData.password)) {
            newState.errorMessage = "Passwords must contain at least 6 valid characters";
            newState.isPasswordFieldIncorrect = true;
        }

        return newState;
    }

    onLogin() {
        const formData = {
            email: findDOMNode(this.refs.email).value.trim(),
            password: findDOMNode(this.refs.password).value.trim(),
        };

        let newState = this.findErrorsInLoginForm(formData);
        this.setState(newState);
        if (!newState.errorMessage) {
            this.props.onLogin(formData);
        }
    }

    render() {
        let errorLabel;

        if(this.state.errorMessage){
            errorLabel = (
                <div className={this.getInputContainerClass(true)}>
                    <label className="control-label">{this.state.errorMessage}</label>
                </div> );
        }
        else if(this.props.userAuthSession.error){
            errorLabel = (
                <div className={this.getInputContainerClass(true)}>
                    <label className="control-label">{this.props.userAuthSession.error}</label>
                </div> );
        }

        return <Grid>
            <WorkInProgress showModal={this.props.showModal} />
            <Col mdOffset={4} md={4}>
                <PageHeader className="text-center">Sign In</PageHeader>
                {errorLabel}
                <form>
                    <div className={this.getInputContainerClass(this.state.isEmailFieldIncorrect)}>
                        <input className="form-control" type="text" placeholder="Email" ref="email"/>
                    </div>
                    <div className={this.getInputContainerClass(this.state.isPasswordFieldIncorrect)}>
                        <input className="form-control" type="password" placeholder="Password" ref="password" />
                    </div>

                    <FormGroup className="text-center">
                        <Button bsStyle="success" onClick={this.onLogin} block>
                            <FontAwesome name="sign-in"/> Sign In
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <span>Don't have account?</span>
                        <LinkContainer to='/signup'>
                            <Button className="pull-right">
                                <FontAwesome name="user"/> Create Account
                            </Button>
                        </LinkContainer>
                    </FormGroup>
                </form>
            </Col>
        </Grid>;
    }
}

const mapStateToProps = (state) => {
    return {
        userAuthSession: state.userAuthSession,
        showModal: state.showModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (formData) => {
            dispatch(showModal());
            dispatch(attemptLogin(formData.email, formData.password));
        },
        onUnmount: () => {
            dispatch(navigatedAwayFromAuthFormPage());
        }
    }
};

const LoginPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default LoginPage;