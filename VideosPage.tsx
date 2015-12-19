/// <reference path="FluxContainer" />

module ui {
    export class VideosPage extends PureComponent<{}> {
        private videos = [
            {
                video: "il-ybcQZYT8",
                title: "1. Share Slack channel with a public Portal URL",
                description: "In this video we walk you through the process of creating a URL linked to your Slack channel. You can send the URL to your partner or client, so they can connect to your channel from their own Slack."
            },
            {
                video: "CNp8a5hIIWk",
                title: "2. Respond to Intercom conversations from Slack",
                description: "With our Sameroom Attend feature, you can connect Intercom to Slack, giving your team the power to provide customer support without switching away from team chat, your mission control center."
            },
            {
                video: "eNUszGZyu4M",
                title: "3. Connect a team on Skype with team on Slack",
                description: "This is our most popular integration. Connect a channel in your Slack team with a group (or individual) on Skype."
            },
            {
                video: "ju3N7bL1wOY",
                title: "4. Connect your team on Slack with your other team on HipChat",
                description: "Be it a large firm where Slack and HipChat were adopted independently by different departments, or two companies in need of low-friction communication on a project—there are many situations when our Slack-to-HipChat integration can help."
            },
            {
                video: "pupCzJFDeGY",
                title: "5. Merge two Slack teams into one",
                description: "If you’ve been invited to yet another Slack team, but you really need to keep the conversation visibile to your own teammates, our Slack-to-Slack integration can help. This video is similar to the first one, except we create the connection directly, without a Portal."
            },
            {
                video: "_7uehYpvfpE",
                title: "6. Share a Slack channel with a team on HipChat",
                description: "This situation is particularly common for agencies and large companies: you use Slack, but need to work with a team on HipChat, where you don’t even have an account. By sharing a Portal URL to your Slack channel with the HipChat team, you can establish real-time communication with minimal disruption."
            }

        ];
        public render() {
            return <div className="videos-page">
                <div className="container">
                    <ui.CenteredColumnTemplate className="text-center">
                        <div className="hidden-xs" style={{marginTop: 70}}/>
                        <h1 className="roboto-slab">
                            Videos
                        </h1>
                    </ui.CenteredColumnTemplate>
                    <ui.CenteredColumnTemplate>
                        <div className="description">
                            The notion behind Sameroom can feel complicated at first. To assist, we’ve produced a series of videos that’ll help you make sense of what our service is, and how to make the most of it. :-)
                        </div>
                        <br/>
                    </ui.CenteredColumnTemplate>
                    <div className="clearfix" />
                    <TwoColumns>
                        {_.map(this.videos, (e, i) => {
                            return <div className="video" key={i}>
                                <YoutubeEmbed video={e.video} />
                                <div><b>{e.title}</b></div>
                                <div>{e.description}</div>
                            </div>
                        })}
                    </TwoColumns>
                    <div className="clearfix" />
                    <div className="hidden-xs" style={{marginTop: 140}}/>
                </div>
            </div>;
        }
    }

    class TwoColumns extends PureComponent<{children?: React.ReactNode}> {
        public render() {
            return <div>
                {React.Children.map(this.props.children, (child, i) => {
                    let className = `col-xs-12
                        col-sm-offset-2 col-sm-8
                        col-lg-offset-0 col-lg-6`;
                    return <div>
                        <div className={className}>
                            {child}
                        </div>
                        {i % 2 == 1 &&
                            <div className="clearfix"></div>
                        }
                    </div>
                })}
            </div>
        }
    }

    /*
     * youtube embed with autoresize of 100% width
     */
    class YoutubeEmbed extends PureComponent<{video: string}> {
        public state = {
            height: 303.75,
        }

        private updateSize = () => {
            let ref = ReactDOM.findDOMNode(this);
            if (ref) {
                let height = $(ref).width()*9/16;
                this.setState({height});
            }
        }

        public componentDidMount() {
            this.updateSize();
            window.addEventListener('resize', this.updateSize);
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.updateSize);
        }

        public render() {
            let {height} = this.state;
            let {video} = this.props;
            return <iframe
                type="text/html"
                width="100%" height={height}
                src={`https://www.youtube.com/embed/${video}?autoplay=0&origin=${window.location.origin}`}
                allowFullScreen={true}
                frameBorder="0"/>
        }
    }
}
