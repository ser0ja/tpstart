// -------------------------------------------------------------------------- //
declare function require(arg: string): any;
// -------------------------------------------------------------------------- //
import * as React from "react";
import * as cn from "classnames";

let moment = require('moment');
let css = require('../../styles/index.css');

export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className={cn({[css.maindiv]: true})}><p>{moment().format()}</p></div>
        )
    }
}