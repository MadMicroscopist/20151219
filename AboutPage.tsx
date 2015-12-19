/// <reference path="FluxContainer" />

module ui {
    export class AboutPage extends PureComponent<{}> {
        private people = [
            {name: "Luke Beatty", title: "Director", img: "Luke", href: "https://www.linkedin.com/in/lukebeatty"},
            {name: "Dave Carlson", title: "Investor", img: "Dave", href: "https://www.linkedin.com/in/eonbusiness0davecarlson"},
            {name: "Brad Feld", title: "Director", img: "Brad", href: "https://www.linkedin.com/in/bfeld"},
            {name: "Mitch Fox", title: "Investor", img: "Mitch", href: "https://www.linkedin.com/in/mitchellwfox"},
            {name: "Nicole Glaros", title: "Investor", img: "Nicole", href: "https://www.linkedin.com/in/nglaros/"},
            {name: "Peter Hizalev", title: "Co-founder, CTO", img: "Peter", href: "https://www.linkedin.com/in/hizalev/"},
            {name: "Charles Hudson", title: "Investor", img: "Charles", href: "https://www.linkedin.com/in/chudson"},
            {name: "Benny Joseph", title: "Investor", img: "Benny", href: "https://www.linkedin.com/in/bennyvenatjoseph"},
            {name: "Eric Karjaluoto", title: "Designer", img: "Karj", href: "https://officehours.io/people/karj"},
            {name: "Stefan Koenig", title: "Investor", img: "Stefan", href: "https://www.linkedin.com/in/stefankoenig"},
            {name: "Mikl Kurkov", title: "Engineer", img: "Mikl", href: "https://ru.linkedin.com/in/mkurkov"},
            {name: "Yaroslav Lapin", title: "Engineer", img: "Yaroslav", href: "https://plus.google.com/+YaroslavLapin"},
            {name: "Jared McGriff", title: "Head of Sales", img: "Jared", href: "https://www.linkedin.com/in/jaredmcgriff"},
            {name: "Sergei Pavlov", title: "Engineer", img: "Sergei", href: ""},
            {name: "Noah Pittard", title: "Investor", img: "Noah", href: "https://www.linkedin.com/in/noahpittard"},
            {name: "Eric Shelkie", title: "Engineer", img: "Shelkie", href: "https://officehours.io/people/shelkie"},
            {name: "Andrei Soroker", title: "Co-founder, CEO", img: "Andrei", href: "https://www.linkedin.com/in/soroker"},
            {name: "Boris Soroker", title: "Quality & Support", img: "Boris", href: "https://www.linkedin.com/in/borissoroker"},
            {name: "Sravish Sridhar", title: "Investor", img: "Sravish", href: "https://www.linkedin.com/in/sravishsridhar"},
            {name: "Peter Werner", title: "Counsel", img: "PeterWerner", href: "https://www.linkedin.com/in/phwerner"},
            {name: "Ayana Wicker", title: "Operations", img: "Ayana", href: ""},
            {name: "Agata Yurina", title: "Engineer", img: "Agata", href: "https://www.linkedin.com/in/airelain/en"},
        ];
        public render() {
            return <div className="about-page">
                <div className="container">
                    <ui.CenteredColumnTemplate className="text-center">
                        <div className="hidden-xs" style={{marginTop: 70}}/>
                        <h1 className="roboto-slab">
                            About
                        </h1>
                    </ui.CenteredColumnTemplate>
                    <ui.CenteredColumnTemplate>
                        <div className="description">
                            Chat is a mess. There are <a target="_blank" href="https://sameroom.io/blog/this-is-the-history-of-chat/">hundreds of different solutions</a>, and none of them speak to one another. That’s why we’re building Sameroom—because we love chat and want to make it better. We started by creating our own service (<a target="_blank" href="https://kato.im/">Kato</a>). Now, we’re taking all of that knowledge and putting it to work in a way to bridge different chat environments. Want to know more? <NavLink href="/contact">Contact us</NavLink>!
                        </div>
                        <br/>
                    </ui.CenteredColumnTemplate>
                    <div className="clearfix" />
                    <FourColumns>
                        {_.map(this.people, (e) => {
                            let image =
                                <LoadableImage
                                    className="person-image"
                                    src={CDNify(`/img/about/${e.img}.jpg`)}/>
                            let link = e.href ?
                                <a target="_blank" href={e.href}>
                                    {image}
                                </a> : image;
                            return <div className="person" key={e.name}>
                                {link}
                                <br/>
                                <div className="name"><b>{e.name}</b></div>
                                <div className="title">{e.title}</div>
                            </div>
                        })}
                    </FourColumns>
                    <div className="clearfix" />
                    <div className="hidden-xs" style={{marginTop: 140}}/>
                </div>
            </div>;
        }
    }

    class FourColumns extends PureComponent<{children?: React.ReactNode}> {
        public render() {
            return <div>
                {React.Children.map(this.props.children, (child, i) => {
                    let className = "col-lg-2 col-xs-3";
                    if (i % 4 == 0) {
                        className += " col-lg-offset-2";
                    }
                    return <div>
                        <div className={className}>
                            {child}
                        </div>
                        {i % 4 == 3 &&
                            <div className="clearfix"></div>
                        }
                    </div>
                })}
            </div>
        }
    }

    /*
     * Show transparent 1x1 image until real one is loaded
     * that allows us to fill place with same size (as long as image is square)
     */
    class LoadableImage extends PureComponent<React.HTMLAttributes> {
        public state = {
            src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        }
        public constructor(props: React.HTMLAttributes, context: any) {
            super(props, context);
            let {src} = props;
            let myImage = new Image();
            myImage.onload = (e) => {this.setState({src: src});}
            myImage.onerror = (e) => {console.error(`Failed to load ${src}`);}
            myImage.src = src;
        }

        public render() {
            let {src} = this.state;
            return <img {...this.props} src={src} />;
        }
    }
}
