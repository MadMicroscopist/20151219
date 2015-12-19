/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="./WizardPageTemplate" />
/// <reference path="ProviderLogos" />


module ui {
    interface IndexPageProps {}

    export class IndexPage extends PureComponent<IndexPageProps> {
        public render() {
            return <div className="home-page">
                <div style={{background: "white"}}>
                    <br/>
                    <div className="container">
                        <CenteredColumnTemplate className="text-center">
                            <div className="hidden-xs" style={{marginTop: 40}}/>
                            <h1 className="roboto-slab">Too Many Chat Apps?</h1>
                            <div className="text-center description">Pick one, connect the rest!</div>
                            <ui.ProviderLogos
                                urlPrefix={'/' + core.DefaulUnsignedPage}
                                big={true}
                                isColor={true}
                            />
                            <div className="video-button">
                                <div className="description">This video explains Sameroom (in just 27.5 seconds).</div>
                                <br/>
                                <a target="_blank" href="https://vimeo.com/127775997" className="fresco" data-fresco-options="onShow: function(){try{ui.App.tracking.trackEvent('explanation_play');}catch(e){}}">
                                    {<div className="video">
                                        <div className="play-button">
                                            <div className="triangle"/>
                                        </div>
                                    </div>}
                                </a>
                            </div>
                        </CenteredColumnTemplate>
                    </div>
                    <div style={{marginTop: 100}}/>
                    <div className="clearfix"/>
                </div>
                <div className="container page-with-image">
                    <CenteredColumnTemplate className="text-center">
                        <div className="hidden-xs" style={{marginTop: 100}}/>
                        <h1 className="roboto-slab">Who Uses Sameroom?</h1>
                    </CenteredColumnTemplate>
                </div>
                <div className="container">
                    {ThreeColumns(
                        SpeechBuble("jacob", "I’m Jacob, and I write software. I use Sameroom to read Freenode IRC channels in Slack."),
                        SpeechBuble("molly", "I’m Molly, and I run engineering. I use Sameroom to connect teams that can’t agree on a chat platform."),
                        SpeechBuble("brad", "I’m Brad, and I’m a venture capitalist. I use Sameroom to talk to my teams—on HipChat, Slack, or Hangouts.")
                    )}
                    <div style={{marginTop: 30}}/>
                    <div className="hidden-xs" style={{marginTop: 80}}/>
                </div>
                <div className="how-sameroom-works">
                    {_.map({
                            "how-tubes-work": "Connect two teams with a Tube:",
                            "how-portals-work": "Share a channel with a Portal:",
                            "get-creative": "…or, get creative:"
                        }, (title, key) =>
                        <div className="container" key={key}>
                            <CenteredColumnTemplate className="text-center">
                                <div className="hidden-xs" style={{marginTop: 100}}/>
                                <h1 className="roboto-slab">{title}</h1>
                            </CenteredColumnTemplate>
                            <div className="text-center how-works">
                                <img alt="Failed to load image" src={CDNify('/img/' + encodeURIComponent(key) + '.png')}/>
                            </div>
                            <div style={{marginTop: 80}}/>
                        </div>
                    )}
                    <div className="container">
                        <div className="clearfix"/>
                        <div className="hidden-xs" style={{marginTop: 80}}/>
                    </div>
                </div>
                <div className="trusted-logos">
                    <div className="container">
                        <div className="text-center">
                            <div className="hidden-xs" style={{marginTop: 100}}/>
                            <h1 className="roboto-slab">Trusted by Nifty Companies, Like:</h1>
                        </div>
                        <div className="text-center">
                            <ui.TrustedLogos/>
                        </div>
                        <div style={{marginTop: 80}}/>
                    </div>
                    <div className="container">
                        <div className="clearfix"/>
                        <div className="hidden-xs"style={{marginTop: 80}}/>
                    </div>
                </div>
            </div>;
        }
    }

    function SpeechBuble(who: string, text: string) {
        return <div>
            <div className={classNames('speech-bubble', who)}>
                {text}
            </div>
            <img src={CDNify('/img/who-uses/' + encodeURIComponent(who) + '.png')}/>
        </div>;
    }

    function ThreeColumns(col1: React.ReactNode, col2: React.ReactNode, col3: React.ReactNode) {
        return <div className="grid-24 row no-gutters">
            <div style={{marginTop: 40}}/>
            <div className="col-md-offset-1 col-md-6 row">
                <div className="centered-column">{col1}</div>
            </div>
            <div className="col-md-offset-2 col-md-6 row">
                <div className="centered-column">{col2}</div>
            </div>
            <div className="col-md-offset-2 col-md-6 row">
                <div className="centered-column">{col3}</div>
            </div>
        </div>
    }

    export class TrustedLogos extends PureComponent<{}> {
        // convert ~/BitTorrent\ Sync/btsync/Trusted\ by.jpg -crop 1920x685+320+440 ./img/trusted-logos.jpg
        private grid = {cols: 5, rows: 3};
        private size = {w: 1920/2, h: 685/2};
        private cropSize = {
            w: this.size.w/this.grid.cols,
            h: this.size.h/this.grid.rows
        };
        private iToPosition(i: number) {
            var cols = i % this.grid.cols;
            var rows = Math.floor(i / this.grid.cols);
            var w = this.cropSize.w*cols;
            var h = this.cropSize.h*rows;
            return '-' + w + 'px -' + h + 'px';
        }
        private links = [
            {href: "http://www.inceptures.com/", title: "Inceptures"},
            {href: "http://www.redhat.com/", title: "Red Hat"},
            {href: "http://www.paylocity.com/", title: "Paylocity"},
            {href: "https://www.restorationhardware.com/", title: "Restoration Hardware"},
            {href: "http://scopely.com/", title: "Scopely"},
            {href: "https://syneto.eu/", title: "Syneto"},
            {href: "http://www.bighugegames.com/", title: "Big Huge Games"},
            {href: "http://www.zenti.com", title: "Zenti"},
            {href: "http://www.rakuten.com/", title: "Rakuten"},
            {href: "http://www.sixfivenetworks.com/", title: "SIX5"},
            {href: "http://matricom.net/", title: "Matricom"},
            {href: "https://puppetlabs.com/", title: "Puppetlabs‎"},
            {href: "http://www.lazada.com.ph/", title: "Lazada"},
            {href: "https://prezi.com/", title: "Prezi"},
            {href: "http://www.wunderkraut.com/", title: "Wunderkraut"},
        ];
        private hiddenXs = 6;
        private hiddenSmMd = 12;
        public render() {
            return <div style={{maxWidth: this.size.w, margin: '0 auto'}}>
                {_.map(this.links, (link, i) => {
                    var linkStyle = {
                        width: this.cropSize.w,
                        height: this.cropSize.h,
                        backgroundImage: CDNBackgroundImage('/img/trusted-logos.jpg'),
                        backgroundSize: '500% 300%',
                        backgroundPosition: this.iToPosition(i),
                    };
                    var className = classNames('logo-link',
                        {
                            'hidden-xs': i >= this.hiddenXs,
                            'hidden-sm hidden-md': i >= this.hiddenSmMd
                        }
                    );
                    return <a
                        className={className}
                        target="_blank"
                        href={link.href}
                        key={link.title}
                        title={link.title}
                        style={linkStyle}
                    />
                })}
            </div>
        }
    }

    export module DOM {
        export var IndexPage = React.createFactory(ui.IndexPage);
    }
}
