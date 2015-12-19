/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../core/Utils" />
/// <reference path="SameroomModal" />
/// <reference path="SigninWithEmailModal" />
/// <reference path="SignInIRC" />
/// <reference path="SignInHipChat" />
/// <reference path="SigninWithSkype" />
/// <reference path="SigninWithFleep" />
/// <reference path="SigninWithFacebook" />
/// <reference path="SigninWithGoogle" />
/// <reference path="SigninWithTelegram" />
/// <reference path="SigninWithIntercom" />
/// <reference path="SigninWithProxy" />
/// <reference path="SigninWithOlark" />


module ui {

    export interface SigninModalProps {
        provider: string;
        renewIdentityId: string;
        returnUrl: string;
    }

    export class SigninModal extends PureComponent<SigninModalProps> {
        public componentDidMount() {
            _.defer(() => ui.App.actions.resetSigninWithProviderStatus());
        }

        public render(): React.ReactElement<any> {
            var provider = this.props.provider;
            var renewIdentityId = this.props.renewIdentityId;
            var back = () => {
                ui.App.signinWithProviderStore.closeModalIfOpened(ui.App.router);
            };
            var url = ui.App.oauth.signInUrl(provider, {renew_identity_id: renewIdentityId});
            if (!core.NeedsSignInModal(provider)) {
                // redirect user that somehow oppened this page instead of oauth popup
                window.location.href = url;
                return <div className="modal-body">
                    Redirecting to <a href={url}>{provider}</a>...
                </div>
            } else {
                let modalProps = {
                    renewIdentityId,
                    back,
                }

                // this is non-oauth provider, we have to show something instead
                return <ui.SameroomModal
                        id="signin_modal"
                        className={''}
                        hasCancelButton={true}
                        handleClose={back}
                        handleHide={back}
                        isShown={true}
                    >
                    {provider === 'email' ? (
                        <ui.SigninWithEmailModalContainer />
                    ) : (
                        <FullScreenModalBody
                            title={provider === 'hipchat' ? (
                                renewIdentityId ? 'Renew HipChat Token' : 'Sign In With HipChat!'
                            ) : null}
                            onHide={() => {
                                back();
                            }}
                            elements={<div>
                                {provider === 'hipchat' ? (
                                    <ui.SigninWithHipChatContainer {...modalProps}/>
                                ) : provider === 'irc' ? (
                                    <ui.SignInIRCContainer {...modalProps}/>
                                ) : provider === 'skype' ? (
                                    <ui.SigninWithSkypeContainer {...modalProps}/>
                                ) : provider === 'fleep' ? (
                                    <ui.SigninWithFleepContainer {...modalProps}/>
                                ) : provider === 'google' ? (
                                    <ui.SigninWithGoogleContainer {...modalProps}/>
                                ) : provider === 'facebook' ? (
                                    <ui.SigninWithFacebookContainer {...modalProps}/>
                                ) : provider === 'telegram' ? (
                                    <ui.SigninWithTelegramContainer {...modalProps}/>
                                ) : provider === 'olark' ? (
                                    <ui.SigninWithOlarkContainer {...modalProps}/>
                                ) : provider === 'intercom' ? (
                                    <ui.SigninWithIntercomContainer {...modalProps}/>
                                ) : provider === 'proxy' ? (
                                    <ui.SigninWithProxyContainer {...modalProps}/>
                                ) : (
                                    <div className="alert alert-danger">
                                        unknown provider
                                    </div>
                                )}
                            </div>}
                        />
                    )}
                </ui.SameroomModal>;
            }
        }
    }

    export module DOM {
        export var SigninModal = React.createFactory(ui.SigninModal);
    }
}
