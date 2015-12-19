/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../core/Utils" />
/// <reference path="SameroomModal" />


module ui {
    export interface SigninWithProxyContainerProps {
        renewIdentityId?: string; // not used
        back: () => void;
    }

    export class SigninWithProxyContainer extends FluxContainer<SigninWithProxyContainerProps> {
        public stores = {
            signinWithProviderStore: ui.App.signinWithProviderStore,
            router: ui.App.router,
        }
        public getState = () => ({
            status: this.stores.signinWithProviderStore.status,
            proxyError: this.stores.signinWithProviderStore.proxyError,
            email: this.stores.router.queryParams['email'],
            type: this.stores.router.queryParams['type'],
            code: this.stores.router.queryParams['code'],
            page: this.stores.router.page.split('.')[0],
        })
        public state = this.getState();
        public render () {return <SigninWithProxy {...this.props} {...this.state} />}
    }

    enum Pages {
        Unknown,
        XmppIndex,
        LyncIndex,
        Landing,
    }

    export interface SigninWithProxyProps extends SigninWithProxyContainerProps {
        status: core.SigninWithProviderStatus;
        proxyError: core.ProviderError;
        email: string;
        type: string;
        code: string;
        page: string;
    }

    class SigninWithProxy extends PureComponent<SigninWithProxyProps> {
        public render () {
            let {back: onCancel, status, proxyError, type, code} = this.props;
            let {Processing} = core.SigninWithProviderStatus;
            var processing = status === Processing;

            let {Unknown, XmppIndex, LyncIndex, Landing} = Pages;

            let pageName = Unknown;
            if (code) {
                pageName = Landing;
            }
            else if (type == 'xmpp') {
                pageName = XmppIndex;
            }
            else if (type == 'lync') {
                pageName = LyncIndex;
            }

            return <div className="auth-modal">
                {processing && <ui.SigninModalGlobalSpinner onCancel={onCancel}/>}

                <div className="col-sm-24 signin-with-email-modal">
                    <div className="hidden-xs" style={{marginTop: 50}} />
                    <h1 className="text-center roboto-slab" style={{fontSize: 48}}>
                        {pageName == Unknown && "Unknown Proxy"}
                        {pageName == XmppIndex && "Cisco Jabber"}
                        {pageName == LyncIndex && "Sign In With Microsoft Lync / S4B"}
                        {pageName == Landing && "Sign In With Proxy"}
                    </h1>
                    <SigninWithProxyDescription pageName={pageName} proxyError={proxyError}/>
                    <div style={{marginTop: 30}} />
                    <div className="hidden-xs" style={{marginTop: 30}} />
                </div>
            </div>
        }
    }

    class SigninWithProxyDescription extends PureComponent<{pageName: Pages; proxyError: core.ProviderError}> {
        public render () {
            let {pageName, proxyError} = this.props;
            let {None, BadRequest} = core.ProviderError;
            let {Unknown, XmppIndex, LyncIndex, Landing} = Pages;
            let contactUs = <ui.NavLink href="/contact">
                contact us
            </ui.NavLink>;
            return <div className="description">
                {pageName == Unknown && <div className="inline-error">
                    Unknown proxy type.
                </div>}
                {pageName == XmppIndex && <div>
                    To get started with our Cisco Jabber integration, please&nbsp;
                    <a href="/contact">contact us</a> or call +1-415-483-7743.
                </div>}
                {pageName == LyncIndex && <div>
                    In order to connect to Lync (Skype for Business) you have to download and install the Sameroom Proxy.
                    <br />
                    <br />
                    If you already have the proxy installed, skip to <b>Authorization</b>.
                    <br />
                    <br />
                    <b>Proxy Installation</b>
                    <br />
                    <ol>
                        <li>Download and install <a href="http://download.sameroom.io/SameroomLyncProxy.msi" target="_blank">the proxy package</a>.</li>
                    </ol>

                    <b>Authorization</b>
                    <br />
                    <ol>
                        <li>Make sure your Lync or S4B client is running</li>
                        <li>Run ”Sameroom Lync Proxy” from Programs—a console with a prompt should appear</li>
                        <li>Check your work email, look for a message containing your Sameroom proxy code</li>
                        <li>Enter the code in the console</li>
                        <li>The default browser will open with your Sameroom account authorized and ready. You can now add other chat services and create connectons.</li>
                    </ol>
                </div>}
                {pageName == Landing && <div>
                    We are connecting your proxy server to Sameroom.
                </div>}
                {proxyError != None && <div>
                    <br/>
                    <span className="inline-error">
                        Oops!
                        {" "}
                        {proxyError == BadRequest && <span>
                            This link seem to be outdated.
                        </span>}
                        {proxyError != BadRequest && <span>
                            There’s a problem with this request.
                        </span>}
                        {" "}
                        Please try again, or {contactUs} if you can’t resolve this issue.
                    </span>
                </div>}
            </div>
        }
    }
}
