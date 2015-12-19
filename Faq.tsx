/// <reference path="../core/App.ts" />

module ui {
    export class Faq extends PureComponent<{}> {
        private dashSameroom = '\u2011' + 'sameroom';
        public render() {
            return <div className="col-sm-offset-2 col-sm-8">
                <br/>
                <br/>

                <h1 className="faq-title text-center">FAQ</h1>

                <br/>
                <br/>

                <ol className="faq-toc">
                    <li>
                        <a href="#how-does-this-work">How does this work?</a>
                    </li>
                    <li>
                        <a href="#attend">What is Sameroom Attend?</a>
                    </li>
                    <li>
                        <a href="#stop">One of my chatrooms is relaying messages and I don’t know how to make it stop?</a>
                    </li>
                    <li>
                        <a href="#commands">Does Sameroom have commands?</a>
                    </li>
                    <li>
                        <a href="#how-many-rooms">How many other rooms can be connected to mine with a Portal?</a>
                    </li>
                    <li>
                        <a href="#kick-ban">Someone I don’t like found my Portal and created a Tube to my room. How can I kick them out?</a>
                    </li>
                    <li>
                        <a href="#see-unread">I don’t see any unread messages in a room</a>
                    </li>
                    <li>
                        <a href="#campfire">People on the other side of my Campfire Tube can’t see my messages</a>
                    </li>
                    <li>
                        <a href="#skype">Some of my Skype groups aren’t coming up in Sameroom search</a>
                    </li>
                    <li>
                        <a href="#google">My Hangouts conversations don’t appear in search results</a>
                    </li>
                    <li>
                        <a href="#sell-history">Will you sell my chat history?</a>
                    </li>
                    <li>
                        <a href="#pricing">What is the difference between limited and unlimited Tubes?</a>
                    </li>
                    <li>
                        <a href="#roomcoin">What is Roomcoin?</a>
                    </li>
                    <li>
                        <a href="#delete-account">How do I delete my account?</a>
                    </li>
                </ol>

                <br/>

                <ol className="faq-content">
                    <li>
                        <FAQHeader id="how-does-this-work">
                            How does this work?
                        </FAQHeader>

                        <p>If you have access to two different teams, you can connect a chatroom in each with a Tube:</p>

                        <img src={CDNify('/img/how-tubes-work.png')}/>
                        <p style={{marginTop: '30px'}}>If you don’t have access to the other team, or want to create a network of many teams, you can do that by opening a Portal. Each Portal has a URL you can share—others can create Tubes by navigating to your Portal URL:</p>

                        <img src={CDNify('/img/how-portals-work.png')}/>

                        <p style={{marginTop: '30px'}}>When you connect chatrooms with Tubes, a message posted in one of the rooms will show up in all the other ones.</p>
                    </li>
                    <li>
                        <FAQHeader id="attend">
                            What is Sameroom Attend?
                        </FAQHeader>
                        <p>
                            <a href="/attend">Attend</a> enables you to connect customer support accounts—Twitter, Intercom, Facebook, or Skype (more coming)—to your team chat (currently, Slack—more coming). For every new customer conversation, a new Slack channel is automatically created, where your entire team can respond.
                        </p>
                        <p>
                            You can have as many active Attend Tubes as your <a href="/plan">plan</a> allows. If you go over, Sameroom will automatically delete old tubes. Normal (not Attend) Tubes also count toward the limit, but are never automatically deleted.
                        </p>
                        <p>
                            For detailed instructions and additional -sameroom commands, see this <a href="https://docs.google.com/document/d/1VDIJTvOpj6oo7gLT5AZr39bPgEsWT_1IOptjOt6eZ1M/edit#" target="_blank">document</a>.
                        </p>
                    </li>

                    <li>
                        <FAQHeader id="stop">
                            One of my chatrooms is relaying messages and I don’t know how to make it stop?
                        </FAQHeader>
                        <p>
                            If you see a Tube connected to your chatroom on the
                            {" "}
                            <a href="/manage">Manage page</a>
                            , you can delete the Tube by clicking on the ”X” or pausing it by selecting ”Pause”.
                        </p>
                        <p>
                            If you don’t see the Tube and don’t know who configured it, you can issue the
                            {" "}
                            ”{this.dashSameroom} disable”
                            {" "}
                            command in your chatroom. For details, see the
                            {" "}
                            <a href="/faq#commands">Sameroom commands section</a>.
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="commands">
                            Sameroom commands
                        </FAQHeader>
                        <p>
                            Note: {this.dashSameroom} commands and responses are not relayed across your Tube Network—they are only visible in your room.
                        </p>
                        <span className="command-title">Hush Command</span>
                        <pre>
                            {'^^^ @alice, plz take a look'}
                        </pre>
                        <p>If you start your message with ^^^, the message will not replicate to other connected rooms—it will only be visible in your team chat. You can use the hush syntax to mention a teammate to bring her attention to a conversation.</p>
                        <span className="command-title">Ping</span>
                        <pre>
                            -sameroom ping
                        </pre>
                        <span className="command-output">Expected output:</span>
                        <pre>Sameroom: Pong</pre>
                        <br/>
                        <span className="command-title">Disable</span>
                        <pre>
                            -sameroom disable
                        </pre>
                        <span className="command-output">Expected output:</span>
                        <pre>OK</pre>
                        <p>This command is handy if you need to stop relaying messages to/from a room but can’t find the person who created the Tube (or don’t know who did it).</p>
                        <span className="command-title">List all rooms in Tube Network:</span>
                        <pre>
                            -sameroom map
                        </pre>
                        <span className="command-output">Sample output:</span>
                        <br/>
                        <pre>
                            Sameroom: Forwarding over 1 tube(s) between 2 room(s): map
                        </pre>
                        <p>
                            “map” will be a URL to a graphic showing all connected rooms. Note: time-to-live for map URLs is 24 hours. Below is an example of a map:
                        </p>
                        <img src={CDNify('/img/map.png')}/>
                    </li>
                    <li>
                        <FAQHeader id="how-many-rooms">
                            How many other rooms can be connected to mine with a Portal?
                        </FAQHeader>
                        <p>Any number.</p>
                    </li>
                    <li>
                        <FAQHeader id="kick-ban">
                            Someone I don’t like found my Portal and created a Tube to my room. How can I kick them out?
                        </FAQHeader>
                        <p>Step 1: Delete your Portal–this will prevent anyone else from connecting Tubes to your room with the old link, but will not delete any of the current Tubes.</p>
                        <p>Step 2: Delete the Tube you don’t want connecting to your room.</p>
                    </li>
                    <li>
                        <FAQHeader id="see-unread">
                            I don’t see any unread messages in a room
                        </FAQHeader>
                        <p>This problem exists only for Facebook, Google Hangouts, HipChat, Gitter, Skype, IRC, and Campfire.</p>
                        <p>Since every message Sameroom sends to rooms you have connected comes from your account, this automatically marks the room as “read” for you. To overcome this, you can create a bot account, sign in to Sameroom with this account, and use the bot account to create Tubes.</p>
                        <p>Once you do this, all new messages in your connected rooms will appear unread.</p>
                    </li>
                    <li>
                        <FAQHeader id="campfire">
                            People on the other side of my Campfire Tube can’t see my messages
                        </FAQHeader>
                        <p>Campfire does not echo your own messages if you’re logged in from multiple clients. Since Sameroom acts as a Campfire client, it doesn’t see your messages.</p>
                        <p>To fix this, create a bot account in Campfire and connect your room from that account instead of your own.</p>
                        <p>For more information, see our{" "}
                            <a href="/limitations#campfire">Limitations section for Campfire</a>
                            <span>.</span>
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="skype">
                            Some of my Skype groups aren’t coming up in Sameroom search
                        </FAQHeader>
                        <p>If your Skype group was created a while ago, it may still be using the old Skype infrastructure, which Sameroom does not support. However, if all members of your group are in your contact list, you can copy the group to the new infrastructure by issuing the following command, in your Skype group:</p>
                        <pre>
                            {'/fork'}
                        </pre>
                        <p>This will create another Skype group with all the same people, but without the history. This group will appear in Sameroom search results (please wait 5 minutes).</p>
                        <p>
                            For more information, see our
                            {" "}
                            <a href="/limitations#skype">Limitations section for Skype</a>
                            .
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="google">
                            My Hangouts conversations don’t appear in search results
                        </FAQHeader>
                        <p>
                            If you use Gmail, make sure to switch to Hangouts from GTalk (
                            <a href="https://support.google.com/hangouts/answer/3115176?hl=en" target="_blank">instructions</a>
                            ). If you use Google Apps, switch to <em>Hangouts Only</em> for your domain in Apps console (
                            <a href="https://support.google.com/a/answer/4213662?hl=en" target="_blank">instructions</a>
                            ).
                        </p>
                        <p>
                            For more information, see the
                            {" "}
                            <a href="/limitations#google-hangouts">Limitations section for Hangouts</a>
                            .
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="sell-history">
                            Will you sell my chat history?
                        </FAQHeader>
                        <p>Sameroom does not store any of your  chat data–it only relays messages between chatrooms.</p>
                        <p>
                            To learn more, please consult our{" "}
                            <a href="https://github.com/sameroom/legal/blob/master/privacy-policy.md" target="_blank">privacy policy</a>
                            {' and '}
                            <a href="https://sameroom.io/blog/sameroom-security-overview/" target="_blank">security overview</a>
                            .
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="pricing">
                            What is the difference between limited and unlimited Tubes?
                        </FAQHeader>
                        <p>Limited Tubes created by a particular account (say, a Skype user) can send up to 30 messages, collectively (all Tubes together), per day, with the counter resetting 24 hours after the first over-the-limit message. Service messages from Sameroom do not count toward this limit.</p>
                        <p>Unlimited Tubes will relay any number of messages, up to the rate limit allowed by participating chat systems.</p>
                    </li>
                    <li>
                        <FAQHeader id="roomcoin">
                            What is Roomcoin?
                        </FAQHeader>
                        <p>
                            Roomcoin is awesome! Each roomcoin is worth 1 Unlimited Tube. If you have roomcoin to redeem, click
                            {" "}
                            <ui.NavLink href="/redeem">here</ui.NavLink>
                            {" "}
                            and insert your roomcoin code.
                        </p>
                    </li>
                    <li>
                        <FAQHeader id="delete-account">
                            How do I delete my account?
                        </FAQHeader>
                        <p>
                            To delete your Sameroom account, delete all accounts listed in
                            {" "}
                            <ui.NavLink href="/accounts">Accounts</ui.NavLink>
                            .
                        </p>
                    </li>
                </ol>
                <br/>
                <br/>
            </div>;
        }
    }

    export module DOM {
        export var Faq = React.createFactory(ui.Faq);
    }

    class FAQHeader extends PureComponent<{id: string, children?: React.ReactNode}> {
        public render () {
            let {id} = this.props;
            return <h2 id={id}>
                <a href={`#${id}`}>{this.props.children}</a>
            </h2>
        }
    }
}
