/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../core/Utils" />
/// <reference path="SameroomModal" />


module ui {

    export class SigninWithEmailModalContainer extends FluxSimpleContainer {
        public componentDidMount() {
            _.defer(() => {
                ui.App.actions.resetEmailAuth();
            })
        }
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
            router: ui.App.router,
            agentStore: ui.App.agentStore,
        }
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
            emailAuthCode: this.stores.signinWithProviderStore.emailAuthCode,
            page: this.stores.router.page.split('.')[0],
            agent: this.stores.agentStore.agent,
        })
        public state = this.getState();
        public render () {return <SigninWithEmailModal {...this.state} />}
    }

    export interface SigninWithEmailModalProps {
        status: core.SigninWithProviderStatus;
        emailAuthCode: string;
        page: string;
        agent: core.AgentData;
    }

    class SigninWithEmailModal extends PureComponent<SigninWithEmailModalProps> {
        private onEmailAdded = (emailAddress: string) => {
            ui.App.actions.getEmailAuth(emailAddress);
        }

        public render () {
            var emailAuthCode = this.props.emailAuthCode;
            var processing = this.props.status === core.SigninWithProviderStatus.Processing;
            let agent = this.props.agent;
            let oldEmail = agent && agent.email;

            let pageName = emailAuthCode ? "insert_code": (agent ? (oldEmail ? "change_email" : "set_email") : "signin");

            return <div>
                {processing && <ui.GlobalSpinner />}

                <div className="col-sm-12 signin-with-email-modal">
                    <div className="hidden-xs" style={{marginTop: 50}} />
                    <h1 className="text-center roboto-slab" style={{fontSize: 48}}>
                        {pageName == "insert_code" && "Insert Code"}
                        {pageName == "signin" && "Sign In With Email"}
                        {pageName == "change_email" && "Change Account Email"}
                        {pageName == "set_email" && "Set Account Email"}
                    </h1>

                    <SigninWithEmailDescription {...{oldEmail, pageName}} />

                    <div style={{marginTop: 30}} />

                    {emailAuthCode &&
                        <SigninWithEmailConfirmCodeForm />}
                    {!emailAuthCode &&
                        <SigninWithEmailAddNewEmailForm onEmailAdded={this.onEmailAdded} />}

                    <div className="hidden-xs" style={{marginTop: 30}} />
                </div>
            </div>
        }
    }

    class SigninWithEmailDescription extends FluxContainer<{oldEmail: string; pageName: string;}> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        public getState = () => ({
            email: this.stores.signinWithProviderStore.email,
            emailAuthCode: this.stores.signinWithProviderStore.emailAuthCode,
            emailError: this.stores.signinWithProviderStore.emailError,
            status: this.stores.signinWithProviderStore.status,
        })
        public state = this.getState()
        public render () {
            let {oldEmail, pageName} = this.props;
            let {email, emailAuthCode, emailError} = this.state;
            var failed = this.state.status === core.SigninWithProviderStatus.Fail;
            let e = core.EmailError;

            let contactUs = <ui.NavLink href="/contact">
                contact us
            </ui.NavLink>;
            if (emailAuthCode) {
                return <div className="description">
                    We’ve sent a 4 character validation code to your email address: {email}. Please check your inbox, copy the code, and paste it in the field below.
                    {failed && <div>
                        <br />
                        <span className="inline-error">
                            Oops! There’s a problem with that code (codes are valid for 15 minutes). Please resubmit it, or {contactUs} if you can’t resolve this issue.
                        </span>
                    </div>}
                </div>
            } else {
                return <div className="description">
                    {pageName == "signin" &&
                        <span>Enter your address below to be able to sign into Sameroom with email.</span>}
                    {pageName == "change_email" &&
                        <span>Sameroom is sending all updates and notifications to <b>{oldEmail}</b>. If you wish change your email address, please enter the new one below.</span>}
                    {pageName == "set_email" &&
                        <span>Add an email address, so we can send service messages and updates to it.</span>}
                    {" "}
                    (We’ll send a validation code momentarily, to provide access.)
                    {failed && <div>
                        <br />
                        {e.WrongEmail == emailError &&
                            <span className="inline-error">
                                Oops! Wrong email format.
                            </span>}
                        {e.ServerError == emailError &&
                            <span className="inline-error">
                                Oops! There’s a problem with this email. Please try again, or {contactUs} if you can’t resolve this issue.
                            </span>}
                    </div>}
                </div>
            }
        }
    }

    class SigninWithEmailConfirmCodeForm extends FluxSimpleContainer {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        public getState = () => ({
            emailAuthCode: this.stores.signinWithProviderStore.emailAuthCode,
        })
        public state = {
            emailAuthCode1: '',
            emailAuthCode0: this.getState().emailAuthCode,
        }
        public render () {
            return <form
                    className="form-inline full-width-submit-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        var emailCode = this.state.emailAuthCode0 + this.state.emailAuthCode1.toUpperCase();
                        ui.App.actions.createEmailIdentity(emailCode);
                    }}
                >
                <div className="form-group form-group-lg">
                    <input
                        valueLink={this.linkState("emailAuthCode1")}
                        className="form-control no-border"
                        placeholder="Confirmation code"
                    />
                </div>
                <button type="submit" className="btn btn-lg btn-bold-yellow btn-no-border">
                    Submit
                </button>
            </form>
        }
    }

    interface SigninWithEmailAddNewEmailFormProps {
        onEmailAdded: (email: string) => void;
    }

    class SigninWithEmailAddNewEmailForm extends FluxContainer<SigninWithEmailAddNewEmailFormProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        public state = {
            emailAddress: "",
        }
        public render () {
            return <form
                    className="form-inline full-width-submit-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        this.props.onEmailAdded(this.state.emailAddress);
                    }}
                >
                <div className="form-group form-group-lg">
                    <input
                        valueLink={this.linkState("emailAddress")}
                        className="form-control no-border"
                        placeholder="Email address"
                        name="email"
                    />
                </div>
                <button type="submit" className="btn btn-lg btn-bold-yellow btn-no-border">
                    Submit
                </button>
            </form>
        }
    }
}
