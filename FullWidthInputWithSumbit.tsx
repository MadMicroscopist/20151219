module ui {

    interface FullWidthInputWithSumbitProps {
        children?: React.ReactElement<React.HTMLAttributes>;
    }

    export class FullWidthInputWithSumbit extends PureComponent<FullWidthInputWithSumbitProps> {
        public render () {
            var input: React.ReactElement<any>;
            React.Children.forEach(this.props.children, (x: any) => {
                if (React.isValidElement(x)) {
                    input = x;
                }
            })
            var className = classNames(input.props.className, 'form-control no-border');
            return React.DOM.div({
                    className: 'full-width-input-with-sumbit',
                },
                React.DOM.div({className: 'form-group form-group-lg no-border'},
                    React.cloneElement(input, {className: className})
                ),
                React.DOM.button({type: "submit", className: 'btn btn-lg btn-bold-yellow btn-no-border'},
                    "Submit"
                )
            )
        }
    }

    export module DOM {
        export var FullWidthInputWithSumbit = React.createFactory(ui.FullWidthInputWithSumbit);
    }
}
