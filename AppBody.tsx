/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../classnames.d.ts" />
/// <reference path="Utils" />
/// <reference path="FluxContainer" />
/// <reference path="NavLink" />
/// <reference path="Debug" />
/// <reference path="FullScreenModal" />
/// <reference path="Faq" />
/// <reference path="IndexPage" />
/// <reference path="BuildBridgePage" />
/// <reference path="MainNavigation" />
/// <reference path="BootstrapModal" />
/// <reference path="SigninModal" />
/// <reference path="FantabulisticPage" />
/// <reference path="CreatePortalPage" />
/// <reference path="GlobalSpinner" />
/// <reference path="ManageInstrumentsPage" />
/// <reference path="PricingPage" />
/// <reference path="BuildBridgeByFactoryPage" />
/// <reference path="ContactPage" />
/// <reference path="AccountsPage" />
/// <reference path="OopsPage" />
/// <reference path="RedeemRoomcoinPage" />
/// <reference path="SigninPageTemplate" />
/// <reference path="DebugAdmin" />
/// <reference path="Developers" />
/// <reference path="TwitterConversionTracking" />
/// <reference path="Limitations" />
/// <reference path="LabsPage" />
/// <reference path="ManageRoomPrefix" />
/// <reference path="AttendPage" />
/// <reference path="AboutPage" />
/// <reference path="VideosPage" />


module ui {

    export class AppBody extends FluxSimpleContainer {
        public stores = {
            router: ui.App.router,
        };
        public getState = () => ({
            page: this.stores.router.page,
            routerParams: this.stores.router.params,
        });
        public state = this.getState();
        public render () {
            var actualPage = this.state.page;
            var routerParams = this.state.routerParams;

            var page = core.PageByActualPage(actualPage);

            let inverse = true;
            var body: React.ReactNode = null;
            if (page.split('.')[0] === 'debug') {
                body = <div style={{backgroundColor: '#fff'}}>
                    <div className="container">
                        {page === 'debug' ? (
                            <ui.DebugPageContainer/>
                        ) : (
                            <ui.DebugAdminPageContainer/>
                        )}
                    </div>
                </div>;
            } else if (page.split('.')[0] === 'labs') {
                body = <div>
                    <ui.LabsPageContainer/>
                </div>;
            } else if (page === 'faq') {
                body = <div className="container faq">
                    <ui.Faq/>
                </div>;
            } else if (page === 'developers') {
                body = <div>
                    <ui.Developers/>
                </div>;
            } else if (page === 'limitations') {
                body = <div>
                    <ui.Limitations/>
                </div>;
            } else if (page === 'about') {
                body = <ui.AboutPage/>;
            } else if (page === 'videos') {
                body = <ui.VideosPage/>;
            } else if (page === 'index' || page === 'signin-modal' || page === 'oauth-complete') {
                body = <div>
                    <ui.IndexPage/>
                </div>;
            } else if (page.split('.')[0] === 'pricing') {
                body = <div>
                    <ui.PricingPageContainer/>
                </div>;
            } else if (page.split('.')[0] === 'contact') {
                body = <div>
                    <ui.ContactPageContainer/>
                </div>;
            } else if (page === 'open-a-tube.fantabulistic') {
                body = <div>
                    <ui.FantabulisticPageContainer
                        type={FantabulisticPageType.OpenTube}
                        objId={routerParams['bridge-id']}
                    />
                </div>;
            } else if (page.split('.')[0] === 'open-a-tube') {
                body = <div>
                    <ui.BuildBridgePageContainer/>
                </div>;
             } else if (page === 'open-a-tube-by-portal.fantabulistic') {
                body = <div>
                    <ui.FantabulisticPageContainer
                        type={FantabulisticPageType.OpenTubeByPortal}
                        objId={routerParams['bridge-id']}
                    />
                </div>;
            }
            else if (page.split('.')[0] === 'open-a-tube-by-portal') {
                body = <div>
                    <ui.BuildBridgeByFactoryPageContainer/>
                </div>;
            } else if (page === 'create-a-portal.fantabulistic') {
                body = <div>
                    <ui.FantabulisticPageContainer
                        type={FantabulisticPageType.CreatePortal}
                        objId={routerParams['factory-id']}
                    />
                </div>;
            } else if (page.split('.')[0] === 'create-a-portal') {
                body = <div>
                    <ui.CreatePortalContainer/>
                </div>
            } else if (page.split('.')[0] === 'manage') {
                body = <div>
                    <ui.ManageInstrumentsPageContainer/>
                    {page == "manage.prefix" &&
                        <ui.ManageRoomPrefixContainer/>}
                </div>;
            } else if (page.split('.')[0] === 'attend') {
                inverse = false;
                body = <ui.AttendPageContainer/>;
            }
            else if (page.split('.')[0] === 'accounts') {
                body = <div>
                    <ui.AccountsPageContainer/>
                </div>;
            }
            else if (page.split('.')[0] === 'redeem') {
                body = <div>
                    <ui.RedeemRoomcoinPageContainer/>
                </div>;
            }
            else if (page === 'badRoute') {
                body = <div>
                    <ui.OopsPage
                        type={OopsPageType.BadRoute}
                    />
                </div>;
            } else {
                body = <div>{page}</div>;
            }

            var signinModal = ui.App.signinWithProviderStore.signinModal(page);

            return <div className={'app-body-wrapper ' + classByPage(page)}><div className="app-body">
                <div id="n-prog" className={classNames(inverse && "inverse")}/>
                <EmailNotSetAlert/>
                <ui.MainNavigationContainer/>
                {body}
                {signinModal && <ui.SigninModal
                    returnUrl={signinModal.returnUrl}
                    provider={routerParams['provider']}
                    renewIdentityId={routerParams['renew-identity-id']}
                />}
                <div className="main-footer">
                    <nav className="navbar navbar-inverse">
                        <div className="container">
                            <ul className="nav navbar-nav">
                                <li>
                                    <ui.NavLink href="/">
                                        <span>Home</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <ui.NavLink href="/pricing">
                                        <span>Pricing</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <ui.NavLink href="/roomcoin">
                                        <span>Roomcoin</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <ui.NavLink href="/developers">
                                        <span>Developers</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <a href="/blog" target="_blank">
                                        <span>Blog</span>
                                    </a>
                                </li>
                                <li>
                                    <ui.NavLink href="/faq">
                                        <span>FAQ</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <ui.NavLink href="/limitations">
                                        <span>Limitations</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <a href="https://sameroom.io/blog/sameroom-security-overview/" target="_blank">
                                        <span>Security</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="http://twitter.com/sameroomHQ" target="_blank">
                                        <span>Twitter</span>
                                    </a>
                                </li>
                                <li>
                                    <ui.NavLink href="/contact">
                                        <span>Contact</span>
                                    </ui.NavLink>
                                </li>
                                <li>
                                    <NavLink href="/about">
                                        <span>About</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href="/videos">
                                        <span>Videos</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="footer-logo">
                        <img className="footer-logo img-responsive" src={CDNify('/img/footer-logo.png')}/>
                    </div>
                    <div>© Sameroom, 2015</div>
                    <div>Version {core.WEB_RELEASE_VERSION}</div>
                    <div className="footer-legal">
                        <a className="privacy" target="_blank" href="https://github.com/sameroom/legal/blob/master/privacy-policy.md">Privacy Policy</a>
                        <a className="terms" target="_blank" href="https://github.com/sameroom/legal/blob/master/terms-of-use.md">Terms of Use</a>
                    </div>
                </div>
                <ui.TwitterConversionTracking/>
            </div></div>;
        }
    }

    var classByPage = (page: string) => {
        if (page.split('.')[0] === 'open-a-tube') {
            return 'open-a-tube';
        }
        else if (page.split('.')[0] === 'open-a-tube-by-portal') {
            return 'open-a-tube-by-portal';
        }
        else if (page === 'index') {
            return 'home';
        }
        if (page.split('.')[0] === 'create-a-portal') {
            return 'create-a-portal';
        }
        return '';
    }

    class EmailNotSetAlert extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            labsStore: ui.App.labsStore,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            hideEmailAlert: this.stores.labsStore.flags.hide_email_alert,
        });
        public state = this.getState();
        public render() {
            let {agent, hideEmailAlert} = this.state;
            let email = agent && agent.email;

            if (!agent || email || hideEmailAlert) {
                return <noscript/>
            }

            let addEmail = <ui.NavLink preserveScroll={true} href="/accounts/signin/email">
                add an email address
            </ui.NavLink>
            let onClose: React.MouseEventHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                ui.App.actions.updateLabsFlags({hide_email_alert: true});
            };
            let close = <button className="close" type="button" aria-hidden="true" data-toggle="collapse" data-target="#email_not_set_alert" onClick={onClose}>×</button>;
            let onClick = () => {
                ui.App.router.navigateTo("/accounts/signin/email", true);
            };
            return <div id="email_not_set_alert" className="collapse in text-center" onClick={onClick}>
                <span>
                    Please {addEmail} to your account, so we can send service messages and updates to it.
                </span>
                {close}
            </div>
        }
    }
}
