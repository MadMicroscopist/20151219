/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface SigninWithFacebookContainerProps {
        renewIdentityId?: string;
        back: () => void;
    }

    export class SigninWithFacebookContainer extends FluxContainer<SigninWithFacebookContainerProps> {
        componentDidMount() {
            _.defer(() => {
                ui.App.actions.resetFacebookAuth();
            })
        }
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
            router: ui.App.router,
        };
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
            facebookAuthCode: this.stores.signinWithProviderStore.facebookAuthCode,
            facebookError: this.stores.signinWithProviderStore.facebookError,
            signinWithPage: this.stores.router.queryParams['page'] === "true",
            signinWithPageId: this.stores.router.queryParams['page_id'],
            signinWithPageName: this.stores.router.queryParams['page_name'],
        });
        public state = this.getState();
        public render () {
            return <ui.SigninWithFacebook {...this.props} {...this.state}/>;
        }
    }

    export interface SigninWithFacebookProps extends SigninWithFacebookContainerProps {
        status: core.SigninWithProviderStatus;
        facebookAuthCode: string;
        facebookError: core.FacebookError;
        signinWithPage: boolean;
        signinWithPageId: string;
        signinWithPageName: string;
    }

    export class SigninWithFacebook extends PureComponent<SigninWithFacebookProps> {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);

        private facebookpNameOk = () =>
            !!this.state.facebookName.length;
        private facebookNameNeedsAttention = () =>
            this.state.facebookNameMissing && !this.facebookpNameOk();

        private passwordOk = () =>
            !!this.state.facebookPassword.length;
        private passwordNeedsAttention = () =>
            this.state.facebookPasswordMissing && !this.passwordOk();

        private placeholders = {
            facebookName: 'Enter your Facebook Email or Phone',
            facebookPassword: 'Enter your Facebook Password',
        };

        public state = {
            facebookName: '',
            facebookPassword: '',
            facebookCode: '',
            facebookNameMissing: false,
            facebookPasswordMissing: false,
        };

        private onSubmitLogin = () => {
            var validInput = this.passwordOk();
            if (this.props.renewIdentityId) {
                if (validInput) {
                    ui.App.actions.renewFacebookIdentity(this.state.facebookPassword, this.props.renewIdentityId);
                }
            } else {
                validInput = validInput && this.facebookpNameOk();
                if (validInput) {
                    ui.App.actions.createFacebookIdentity(this.state.facebookName, this.state.facebookPassword, this.props.signinWithPageId);;
                }
            }
            this.setState({
                facebookNameMissing: !this.facebookpNameOk(),
                facebookPasswordMissing: !this.passwordOk(),
            });
        };

        private onSubmitCode = () => {
            ui.App.actions.createFacebookIdentityFromCode(this.props.facebookAuthCode, this.state.facebookCode, this.props.renewIdentityId);
        };

        public render() {
            var status = this.props.status;
            var renewIdentityId = this.props.renewIdentityId;
            var onCancel = this.props.back;
            var facebookAuthCode = this.props.facebookAuthCode || '';
            var facebookError = this.props.facebookError;
            var signinWithPage = this.props.signinWithPage;
            var signinWithPageId = this.props.signinWithPageId;
            var signinWithPageName = this.props.signinWithPageName;

            var showSigninWithPageForm = signinWithPage && !signinWithPageId;

            var s = core.SigninWithProviderStatus
            var processing = status === s.Processing;
            var alertClass = status === s.Fail ? 'alert-danger' : null;
            var fe = core.FacebookError;
            var ERROR_MSG: React.ReactNode = "Error while trying to sign you in. Please contact us if this issue is not resolved.";
            if (facebookError == fe.RequiresCheckpoint) {
                ERROR_MSG = <div>
                    Facebook triggered a ”suspicious login attempt” alert (similar to <a href="http://d2rg8zrqexm1mr.cloudfront.net/facebook-bulgaria.png" target="_blank" className="alert-link">this one</a>) when you tried adding your Facebook account to Sameroom.
                    <br/>
                    <br/>
                    This alert may mention <b>Chrome for Linux</b> and <b>Sofia, Bulgaria</b> (our servers are actually in California).
                    <br/>
                    <br/>
                    To fix this, go to <a href="https://www.facebook.com" target="_blank" className="alert-link">www.facebook.com</a> and verify your Facebook account before proceeding on Sameroom. (You may need to sign out of Facebook and then back in.)
                </div>
            }
            else if (facebookError == fe.WrongPassword) {
                ERROR_MSG = "Password you entered is incorrect.";
            }
            else if (facebookError == fe.WrongSecurityCode) {
                ERROR_MSG = "The security code you entered doesn’t match the one sent to your phone. Please check the number and try again.";
            }
            else if (facebookError == fe.WaitingForCode) {
                ERROR_MSG = "You need to enter verification code in order to sign in.";
            }
            else if (facebookError == fe.PageNotFound) {
                ERROR_MSG = "Page not found, please check page username.";
            }
            else if (facebookError == fe.NotAPage) {
                ERROR_MSG = "This username does not correspond to page.";
            }
            else if (facebookError == fe.NoAccessToPage) {
                ERROR_MSG = "You don’t have access to this page.";
            }

            var facebookNamePlaceholder = this.placeholders.facebookName + (this.state.facebookNameMissing ? ' *' : '');
            var facebookPasswordPlaceholder = this.placeholders.facebookPassword + (this.state.facebookPasswordMissing ? ' *' : '');

            return <div className="auth-modal">
                {processing && <ui.GlobalSpinner
                    hasCancelButton={true}
                    handleHide={() => {
                        if (ui.App.signinWithProviderStore.status === s.Processing) {
                            onCancel(); // user hit Esc
                        }
                    }}
                    onCancel={onCancel}
                />/**/}
                <div className="row facebook-form-title">
                    <div className="col-md-24 text-center roboto-slab">
                        {renewIdentityId && 'Renew Your Facebook Identity'}
                        {!renewIdentityId && <span>
                            {signinWithPageName && ("Sign In With ”" + signinWithPageName + "”!")}
                            {!signinWithPageName && <span>
                                {signinWithPage && 'Sign In With Page!'}
                                {!signinWithPage && 'Sign In With Facebook!'}
                            </span>}
                        </span>}
                    </div>
                </div>

                <ui.SigninWithFacebookDescription
                    signinWithPage={signinWithPage}
                />{/**/}

                {!facebookAuthCode && showSigninWithPageForm && <div className="col-xs-offset-2 col-xs-20">
                    <ui.SigninWithFacebookSigninWithPageForm />
                </div>}

                {!facebookAuthCode && !showSigninWithPageForm && <form
                        className="form-horizontal col-xs-offset-2 col-xs-20"
                        onSubmit={(e) => {
                            e.preventDefault();
                            this.onSubmitLogin();
                        }}
                    >
                    {!renewIdentityId && <div className="form-group">
                        <label className="col-sm-6 facebook-form-label" htmlFor="facebookName">Email</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('facebookName')} id="facebookName" type="text" className={classNames('form-control input-lg', {'attention': this.facebookNameNeedsAttention()})} placeholder={facebookNamePlaceholder} />
                        </div>
                    </div>}
                    <div className="form-group">
                        <label className="col-sm-6 facebook-form-label" htmlFor="facebookPassword">Password</label>
                        <div className="col-sm-18">
                            <input valueLink={this.linkState('facebookPassword')} id="facebookPassword" type="password" className={classNames('form-control input-lg', {'attention': this.passwordNeedsAttention()})} placeholder={facebookPasswordPlaceholder} />
                        </div>
                    </div>
                    <ui.SecurityInfo />
                    <div className="text-right">
                        <input type="submit" className="btn btn-bold-yellow btn-no-border btn-lg" value={renewIdentityId ? 'Submit' : 'Sign In'} />
                    </div>
                    {!renewIdentityId && !signinWithPageId && <div className="form-group text-right" style={{marginTop: '20px'}}>
                        <span className="col-sm-24">
                            Need to connect Facebook Page?{" "}
                            <ui.NavLink href="?page=true">
                                Click here.
                            </ui.NavLink>
                        </span>
                    </div>}
                </form>}
                {facebookAuthCode && <form
                        className="form-inline col-xs-offset-2 col-xs-20"
                        onSubmit={(e) => {
                            e.preventDefault();
                            this.onSubmitCode();
                        }}
                    >
                    <ui.FullWidthInputWithSumbit>
                        <input valueLink={this.linkState('facebookCode')} placeholder="Enter verification code" type="text" />
                    </ui.FullWidthInputWithSumbit>
                </form>}

                <div className="col-sm-24">
                    {alertClass && <div className={'alert ' + alertClass}>
                        {ERROR_MSG}
                    </div>}
                </div>
            </div>;
        }
    }

    export class SigninWithFacebookDescription extends FluxContainer<{signinWithPage: boolean}> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
            router: ui.App.router,
        }
        public getState = () => ({
            facebookAuthCode: this.stores.signinWithProviderStore.facebookAuthCode,
            signinWithPageId: this.stores.router.queryParams['page_id'],
        })
        public state = this.getState()
        public render () {
            var signinWithPage = this.props.signinWithPage;
            var facebookAuthCode = this.state.facebookAuthCode;
            var signinWithPageId = this.state.signinWithPageId;
            return <div className="description">
                {signinWithPage && <div>
                    Here you can connect your company Facebook{" "}
                    <a href="https://www.facebook.com/help/174987089221178" target="_blank">Page</a>
                    {" "}to talk to your customers. If not, please{" "}
                    <ui.NavLink href="?">go back to use regular Facebook Profile.</ui.NavLink>
                    <br/>
                    <br/>
                    {signinWithPageId && "Now enter your Facebook login details."}
                    {!signinWithPageId && <div>
                        Please enter your page username. If you don’t know it, just{" "}
                        <a href="https://www.facebook.com/bookmarks/pages" target="_blank">Log In</a>
                        {" "}to your page and copy it from address bar.
                        <div className="text-center" style={{padding: 10}}>
                            <img src={CDNify('/img/screen-facebook-username.png')} alt="https://www.facebook.com/kato720" />
                        </div>
                        In the example above, the username is ”kato720”.
                    </div>}
                    <div style={{marginTop: 30}} />
                </div>}
            </div>
        }
    }

    export class SigninWithFacebookSigninWithPageForm extends FluxSimpleContainer {
        private linkState = React.addons.LinkedStateMixin.linkState.bind(this);
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
        }
        public getState = () => ({
            facebookAuthCode: this.stores.signinWithProviderStore.facebookAuthCode,
            facebookPageUsername: this.stores.signinWithProviderStore.facebookPageUsername,
            facebookPageInfo: this.stores.signinWithProviderStore.facebookPageInfo,
        })
        public state = {
            facebookAuthCode: this.getState().facebookAuthCode,
            facebookPageUsername: this.getState().facebookPageUsername,
            facebookPageInfo: this.getState().facebookPageInfo,
            facebookPage: '',
        };
        public render () {
            var facebookPageInfo = this.state.facebookPageInfo;
            var hasPageInfo = facebookPageInfo && (this.state.facebookPage == this.state.facebookPageUsername);
            var pageInfoDiv: React.ReactNode = '';
            if (hasPageInfo) {
                var url = facebookPageInfo.picture && facebookPageInfo.picture.data && facebookPageInfo.picture.data.url;
                pageInfoDiv = <ui.FullScreenModal
                    title="Is it your page?"
                    warning={<div>
                        <div className="clearfix">
                            {url && <img className="pull-left" src={url} style={{margin: 7}} />}
                            <h3>{facebookPageInfo.name}</h3>
                        </div>
                        <span>{facebookPageInfo.about}</span>
                    </div>}
                    buttonText="Confirm"
                    onSure={ () => {
                        var href = window.location.pathname + "?" + jQuery.param({
                            page: true,
                            page_id: this.state.facebookPageInfo.id,
                            page_name: this.state.facebookPageInfo.name,
                        });
                        ui.App.router.navigateTo(href);
                    }}
                    onHide={ () => {
                        ui.App.actions.resetGetFacebookPageName();
                    }}
                />;/**/
            }
            return <form
                    className="form-inline"
                    onSubmit={ (e) => {
                        e.preventDefault();
                        var page = this.state.facebookPage;
                        if (page) {
                            ui.App.actions.getFacebookPageName(page);
                        }
                    }}
                >
                <ui.FullWidthInputWithSumbit>
                    <input valueLink={this.linkState('facebookPage')} placeholder="Enter page username" type="text" />
                </ui.FullWidthInputWithSumbit>
                <br/>
                {pageInfoDiv}
            </form>;
        }
    }

    export module DOM {
        export var SigninWithFacebookContainer = React.createFactory(ui.SigninWithFacebookContainer);
        export var SigninWithFacebook = React.createFactory(ui.SigninWithFacebook);
        export var SigninWithFacebookDescription = React.createFactory(ui.SigninWithFacebookDescription);
        export var SigninWithFacebookSigninWithPageForm = React.createFactory(ui.SigninWithFacebookSigninWithPageForm);
    }
}
