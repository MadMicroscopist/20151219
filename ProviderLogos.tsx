/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="ProviderLogo" />
/// <reference path="../core/Utils" />

module ui {

    export interface ProviderLogosProps {
        big: boolean;
        urlPrefix: string;
        isColor?: boolean;
        addEmail?: boolean;
        onlyProviders?: string[];
        addCantSeeYourRoom?: boolean;
    }

    export class ProviderLogos extends PureComponent<ProviderLogosProps> {
        render() {
            var serviceIds = core.OldestProviders();
            let {onlyProviders} = this.props;
            if (onlyProviders) {
                serviceIds = onlyProviders;
            }
            var {big, addCantSeeYourRoom} = this.props;
            return <div
                className={classNames({"col-sm-12": big, "only-providers": !!onlyProviders}, "provider-logos")}
            >
                <div
                    className={classNames("service-grid-icons", {"white-bg": this.props.isColor}, {"big": big})}
                >
                    {addCantSeeYourRoom && <div>
                        Can’t see your room? Add another service:
                        <br />
                        <br />
                    </div>}
                    {_.map(serviceIds, (provider: string) => {
                        let title = `Sign in with ${core.ProviderDisplayName(provider)}`;
                        return <ui.NavLink
                            key={provider}
                            className="service-grid-icon"
                            preserveScroll={true}
                            href={core.ProviderModalUrl(this.props.urlPrefix, provider)}
                            onClick={(e) => {
                                if (!core.NeedsSignInModal(provider)) {
                                    e.preventDefault();
                                    App.oauth.showSignInPopup(provider);
                                    return true;
                                }
                            }}
                        >
                            <ui.ProviderLogo
                                providerId={provider}
                                isBw={!this.props.isColor}
                                style={{title: title, alt: title}}
                            />
                        </ui.NavLink>
                    })}
                </div>
                {this.props.addEmail && <div className="text-center">
                    <ui.NavLink href={`${this.props.urlPrefix}/signin/email`} className="white-link" preserveScroll={true}>
                        Add an email account
                    </ui.NavLink>
                </div>}
            </div>
        }
    }

    export module DOM {
        export var ProviderLogos = React.createFactory(ui.ProviderLogos);
    }
}
