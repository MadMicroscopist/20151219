/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />
/// <reference path="ProviderLogos" />
/// <reference path="ProviderLogo" />
/// <reference path="../core/Utils" />

module ui {

    export class MainNavigationContainer extends FluxSimpleContainer {
        public stores = {
            agentStore: ui.App.agentStore,
            router: ui.App.router,
        };
        public getState = () => ({
            agent: this.stores.agentStore.agent,
            page: this.stores.router.page,
        });
        public state = this.getState();
        public render() {return <ui.MainNavigation {...this.state}/>;}
    }

    export interface MainNavigationProps {
        page: string;
        agent: core.AgentData;
    }

    export class MainNavigation extends PureComponent<MainNavigationProps> {
        public render() {
            var actualPage = this.props.page;
            var page = core.PageByActualPage(actualPage);
            var isSignedIn = !!this.props.agent;
            var navbarId = _.uniqueId('bs-navbar-collapse');

            var SignIn: React.ReactNode = null;
            var Navbar: React.ReactNode = null;

            var inverted = !isSignedIn && page == core.DefaulUnsignedPage || page === core.AttendPage;

            if (isSignedIn) {
                var name = this.props.agent.display_name || 'unknown';
                Navbar = <ul className="nav navbar-nav">
                    <li className={_.contains(['open-a-tube', 'open-a-tube-by-portal'], page.split('.')[0]) ? 'active' : ''}>
                        <ui.NavLink href="/open-a-tube">
                            <span>Open a Tube</span>
                        </ui.NavLink>
                    </li>
                    <li className={page.split('.')[0] === 'create-a-portal' ? 'active' : ''}>
                        <ui.NavLink href="/create-a-portal">
                            <span>Create a Portal</span>
                        </ui.NavLink>
                    </li>
                    <li className={page.split('.')[0] === 'manage' ? 'active' : ''}>
                        <ui.NavLink href="/manage">
                            <span>Manage</span>
                        </ui.NavLink>
                    </li>
                    <li className={classNames({active: page.split('.')[0] === 'attend'})}>
                        <ui.NavLink href="/attend">
                            <span>Attend</span>
                        </ui.NavLink>
                    </li>
                </ul>;
                SignIn = <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <span>{name}</span>
                    </a>
                    <ul className="dropdown-menu" role="menu">
                        <li>
                            <ui.NavLink href="/accounts">
                                <i className="fa fa-link item-icon-signed-in"/>
                                <span className="item-title">Accounts</span>
                            </ui.NavLink>
                        </li>
                        <li className="divider"/>
                        <li>
                            <ui.NavLink href="/plan">
                                <i className="fa fa-paper-plane item-icon-signed-in"/>
                                <span className="item-title">Plan</span>
                            </ui.NavLink>
                        </li>
                        <li className="divider"/>
                        <li>
                            <a
                                    href="/signout"
                                    onClick={ (e) => {
                                        e.preventDefault();
                                        App.rest.deleteSession();
                                    }}
                                >
                                <i className="fa fa-power-off item-icon-signed-in"/>
                                <span className="item-title">Sign out</span>
                            </a>
                        </li>
                    </ul>
                </li>
            } else {
                Navbar = <ul className="nav navbar-nav">
                    <li className={classNames({active: page.split('.')[0] === 'attend'})}>
                        <ui.NavLink href="/attend">
                            <span>Attend</span>
                        </ui.NavLink>
                    </li>
                </ul>;
                var pagePrefix = '/after-login';
                if (page.split(".")[0] == 'open-a-tube-by-portal') {
                    var pagePrefix = ui.App.signinWithProviderStore.signinPrefix(page);
                }

                let providers: React.ReactNode[] = [];
                let providersL: React.ReactNode[] = [];
                let providersR: React.ReactNode[] = [];
                let size = _.size(core.KnownProviders());

                _.each(core.KnownProviders(), (provider, i) => {
                    var props = {key: "k"+i, provider, pagePrefix, inverted};
                    if (i % 2 == 0) {
                        providersL.push(<li key={i} className="divider"/>);
                        providersR.push(<li key={i} className="divider"/>);
                        providersL.push(<ProviderItem {...props}/>);
                    } else {
                        providersR.push(<ProviderItem {...props}/>);
                    }
                    if (i != 0) {
                        providers.push(<li key={i} className="divider visible-xs"/>);
                    }
                    providers.push(<ProviderItem {...props} isMobile={true}/>);
                });

                SignIn = <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <span>Sign in / Join</span>
                    </a>

                    <ul className="dropdown-menu multi-column" role="menu">
                        <li className="hidden-xs">
                            <a style={{opacity: 0.5}}>
                                Sign in or join using:
                            </a>
                        </li>
                        {providers}
                        <li className="hidden-xs">
                            <div>
                                <ul className="dropdown-menu col-md-6">
                                    {providersL}
                                </ul>
                                <ul className="dropdown-menu col-md-6">
                                    {providersR}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </li>
            }

            return <nav className={classNames('navbar navbar-inverse main-navbar', {"bw-inverted": inverted})}>
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target={`#${navbarId}`}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar" />
                        </button>
                        <ui.NavLink className="navbar-brand" href="/" alt="sameroom.io">
                            <img className="logo img-responsive" src={CDNify('/img/logo' + (inverted ? '-black' : '') + '.png')}/>
                        </ui.NavLink>
                    </div>
                    <div className="collapse navbar-collapse" id={navbarId}>
                        {Navbar}
                        <ul className="nav navbar-nav navbar-right">
                            {SignIn}
                        </ul>
                    </div>
                </div>
            </nav>;
        }
    }

    class ProviderItem extends PureComponent<{provider: string, pagePrefix: string, inverted: boolean, isMobile?: boolean}> {
        public render() {
            let {provider, pagePrefix, inverted, isMobile} = this.props;
            let className = classNames(isMobile && "visible-xs");
            return <li className={className}>
                <ui.NavLink
                    href={core.ProviderModalUrl(pagePrefix, provider)}
                    onClick={(e) => {
                        if (!core.NeedsSignInModal(provider)) {
                            e.preventDefault();
                            App.oauth.showSignInPopup(provider, pagePrefix);
                            return true;
                        }
                    }}
                >
                    <ui.ProviderLogo
                        providerId={provider}
                        isBw={isMobile && !inverted}
                        style={{width: 20}}
                    ></ui.ProviderLogo>
                    <span className="item-title" style={{verticalAlign: '-11%', marginLeft: '10px'}}>{core.ProviderDisplayName(provider)}</span>
                </ui.NavLink>
            </li>
        }
    }

    export module DOM {
        export var MainNavigationContainer = React.createFactory(ui.MainNavigationContainer);
        export var MainNavigation = React.createFactory(ui.MainNavigation);
    }
}
