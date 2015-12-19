/// <reference path="../core/App.ts" />

module ui {
    interface ProviderLimitations {
        [index: string]: React.ReactElement<LimitationItemProps>;
    }

    export class Limitations extends PureComponent<{}> {
        private needsBot = (title: string) => {
            return <div>
                If you don’t use a bot " + title + " account with Sameroom, your own messages will not be relayed.{" "}
                <ui.NavLink href="/faq#campfire">Click here</ui.NavLink>
                <span>{" "}to learn how to fix this.</span>
            </div>
        }

        private noDialog = "No DM support (direct messages, 1-1 chat).";

        private no2FA = "Two-factor authentication is not supported.";

        private noUnreadNotifications = <div>
            Owner of the Tube will not get notifications for new messages. For a possible solution,{" "}
            <ui.NavLink href="/faq#see-unread">click here.</ui.NavLink>
        </div>;
        private noEditDelete = "No support for message edits and deletion.";

        private messagePrefix = (provider?: string) => {
            var base = "Authors of messages relayed by Sameroom will appear to come from the owner of the Tube, with the actual author’s name prefixed in square brackets.";
            var helpUs = (url: string, title: string) => {
                return <div>
                    {base + " (To help us make this look better, please consider "}
                    <a href={url} target="_blank">{"asking " + title + " to improve their API"}</a>
                    {".)"}
                </div>
            }
            if (provider === 'hipchat') {
                return helpUs("https://twitter.com/hipchat", "HipChat");
            } else {
                return base as React.ReactNode;
            }
        }

        private filenameInSeparateMessage = (title: string) => {
            return "Files sent from Sameroom to " + title + " will be posted from account who have created Tube, and name of sender will be in separate message.";
        }

        private fileAsTempLink = (title: string) => {
            return "Files sent from Sameroom to " + title + " will appear as temporary links. Temporary links are good for 24 hours.";
        }

        private howFilesArePosted = (provider: string): React.ReactNode => {
            if (provider === "skype") {
                return this.fileAsTempLink("Skype");
            }
            else if (provider === "telegram") {
                return this.fileAsTempLink("Telegram");
            }
            else if (provider === "twitter") {
                return <span>
                    Photos (up to 5MB) and Videos (up to 15MB) sent as reply to Twitter mentions will be attached to tweet. For other files and for DMs temporary link will be shown.
                </span>
            }
            else if (provider === "facebook") {
                return this.filenameInSeparateMessage("Facebook");
            }
            else if (provider === "slack") {
                return "Files will be posted from account who have created Tube, and name of sender will be in file name description.";
            }
        }

        private noSameroomCommands = <div>
            No support for{" "}
            <ui.NavLink href="/faq#commands">Sameroom commands</ui.NavLink>
            {"."}
        </div>

        private limitations: ProviderLimitations = {
            "irc": <ui.LimitationItem name="IRC">
                No support for password-protected channels.
                <div>
                    <div>Required: either <a href="http://ircv3.net/specs/extensions/sasl-3.1.html" target="_blank">SASL</a> support or an extended /nickserv <code>IDENITFY</code> command that accepts a nick in addition to password (like on Freenode).</div>
                    <br />
                    {"No support for IRC networks without registered nicks (/NickServ). Known unsupported networks are:"}
                    <ul>
                        <li>irc.codetalk.io</li>
                        <li>EFNet</li>
                        <li>irc.gamesurge.net</li>
                        <li>irc.jaundies.com</li>
                        <li>irc.mafiareturns.com</li>
                        <li>irc.oftc.net</li>
                        <li>irc.rizon.net</li>
                        <li>irc.slashnet.org</li>
                        <li>irc.synirc.net</li>
                        <li>irc.utonet.org</li>
                    </ul>
                </div>
                <span>Passwords containing special characters may not work.</span>
                {this.noDialog}
                {this.noUnreadNotifications}
            </ui.LimitationItem>,
            "skype": <ui.LimitationItem name="Skype">
                <span>No support for chatrooms created before Microsoft acquired Skype. To check if Sameroom supports your Skype chatroom:
                    <ol>
                        <li>
                            Type{" "}
                            <code>{"/get name"}</code>
                        </li>
                        <li>
                            If the response is{" "}
                            <code>{"name=19:XXXXXX"}</code>
                            , you can create a Tube with this conversation
                        </li>
                        <li>
                            If the response is{" "}
                            <code>{"name=#XXXXXX"}</code>
                            , it's not supported. For a partial solution, type{" "}
                            <code>{"/fork"}</code>
                            {" "}in the old conversation—it will create a new one and auto-invite all the old participants who are in your contact list
                        </li>
                    </ol>
                </span>
                Only hotmail.com and outlook.com Microsoft accounts are supported. As a workaround, create a new Skype account for use with Sameroom and invite it to the conversations you’d like to connect.
                {this.noUnreadNotifications}
                {this.no2FA}
                {this.messagePrefix()}
                {this.howFilesArePosted("skype")}
                {this.noEditDelete}
            </ui.LimitationItem>,
            "google": <ui.LimitationItem name="Google Hangouts">
                Sameroom will only load exising conversations. If you don't see a conversation with a particular contact listed, send a message to your contact in Hangouts, and it should appear in Sameroom shortly thereafter.
                {this.noUnreadNotifications}
                {this.messagePrefix()}
            </ui.LimitationItem>,
            "campfire": <ui.LimitationItem name="Campfire">
                {this.needsBot("Campfire")}
                {this.noDialog}
                {this.noEditDelete}
                {this.noUnreadNotifications}
            </ui.LimitationItem>,
            "hipchat": <ui.LimitationItem name="HipChat">
                {this.noDialog}
                {this.noUnreadNotifications}
                {this.noEditDelete}
                {this.messagePrefix("hipchat")}
            </ui.LimitationItem>,
            "flowdock": <ui.LimitationItem name="Flowdock">
                {this.noDialog}
                {this.noEditDelete}
            </ui.LimitationItem>,
            "fleep": <ui.LimitationItem name="Fleep">
                Changing tasks state and pinning message will cause this message to be reposted to Tube.
                {this.noEditDelete}
            </ui.LimitationItem>,
            "slack": <ui.LimitationItem name="Slack">
                <p>
                    If your admin disabled 3rd party integrations for non-admins, you can’t use your Slack account with Sameroom. Ask your admin to turn off the limitation, or use an admin account to create a Sameroom Tube for you.
                    <br />
                    <br />
                    To learn about using Sameroom as a team, see <a href="https://sameroom.io/blog/using-sameroom-as-a-team/" target="_blank">https://sameroom.io/blog/using-sameroom-as-a-team/</a>.
                </p>
                Highlighted words coming across Sameroom will not cause desktop/mobile notifications. (But @mentions will.)
                {this.noEditDelete}
                {this.howFilesArePosted("slack")}
            </ui.LimitationItem>,
            "gitter": <ui.LimitationItem name="Gitter">
                {this.noEditDelete}
                {this.noUnreadNotifications}
            </ui.LimitationItem>,
            "facebook": <ui.LimitationItem name="Facebook">
                {this.noUnreadNotifications}
                {this.messagePrefix()}
                {this.howFilesArePosted("facebook")}
            </ui.LimitationItem>,
            "telegram": <ui.LimitationItem name="Telegram">
                {this.messagePrefix()}
                {this.howFilesArePosted("telegram")}
            </ui.LimitationItem>,
            "intercom": <ui.LimitationItem name="Intercom">
                <p>The Intercom integration is only inteded for use with <a href="/attend">Sameroom Attend</a>—a way to respond from Slack to messages from Intercom, Twitter, Skype, and Facebook (in real time).</p>
                <p>If a customer sends a message and you open the conversation from the Intercom dashboard, the customer will see their message marked as ”read”. This is not true if you read a message from Slack <i>only</i>—you have to reply for the ”read” marker to appear. (Note: this is clearly a feature, not a limitation!)</p>
                <p>Intercom’s API may occasionally experience issues: duplicated or missing messages and significant delays. Make sure to keep the Intercom dashboard open in a browser window as backup. Follow <a href="https://twitter.com/intercomstatus" target="_blank">@intercomstatus</a> on Twitter for information on outages and maintenance.</p>
            </ui.LimitationItem>,
            "twitter": <ui.LimitationItem name="Twitter">
                {this.noUnreadNotifications}
                {this.messagePrefix("twitter")}
                {this.howFilesArePosted("twitter")}
            </ui.LimitationItem>
        };
        public render() {
            // resort in KnownProviders order
            var limitationItems: ProviderLimitations = {};
            _.each(core.KnownProviders(), (provider) => {
                var limitItem = this.limitations[provider];
                if (limitItem && limitItem.props.children) {
                    limitationItems[provider] = limitItem;
                }
            });
            // order of limitationItems
            var limitationsToc = _.map(limitationItems, (l) =>
                <li key={l.props.name}>
                    <a
                        href={"#" + nameToId(l.props.name)}>
                        {l.props.name}
                    </a>
                </li>
            );
            return <div className="limitations-page">
                <ui.PageWithImageTemplate
                    imageId="robot-oops"
                    header="Limitations"
                    description={<div>
                        We’ve worked hard to integrate chat services so everyone can benefit from interoperability, but this isn’t without it’s limitations.
                        <br/>
                        <br/>
                        Whilst we’re working to fix most of these (where possible), we'd like you to be aware of current limitations.
                        <br/>
                        <br/>
                        <ol className="toc">
                            {limitationsToc}
                        </ol>

                        <ol className="content">
                            {React.addons.createFragment(limitationItems)}
                        </ol>
                    </div>}
                />
            </div>;
        }
    }

    function nameToId(name: string) {
        return name.toLowerCase().replace(' ', '-');
    }

    export interface LimitationItemProps {
        name: string;
        children?: React.ReactChildren;
    };

    export class LimitationItem extends PureComponent<LimitationItemProps> {
        public render() {
            if (!this.props.children) {
                return <noscript/>;
            }
            return <li>
                <h2 id={nameToId(this.props.name)}>{this.props.name}</h2>
                <ul>
                    {React.Children.map(
                        this.props.children,
                        (c) => <li>{c}</li>
                    )}
                </ul>
            </li>
        }
    }

    export module DOM {
        export var Limitations = React.createFactory(ui.Limitations);
        export var LimitationItem = React.createFactory(ui.LimitationItem);
    }
}
