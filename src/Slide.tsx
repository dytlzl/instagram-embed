import './Slide.scss'
import React, {Component} from "react";

interface SlideProps {
    contents: JSX.Element[]
    width: number
    height: number
}

interface SlideState {
    page: number
}


export class Slide extends Component<SlideProps, SlideState> {
    constructor(props: Readonly<SlideProps>) {
        super(props)
        this.state = {
            page: 0,
        }
    }

    pageDown = () => {
        this.setState({page: Math.max(this.state.page - 1, 0)})
    }
    pageUp = () => {
        this.setState({page: Math.min(this.state.page + 1, this.props.contents.length-1)})
    }

    render() {
        const containerSize = {
            width: this.props.width,
            height: this.props.height,
        }
        const bandSize = {
            width: this.props.width * this.props.contents.length,
            height: this.props.height,
        }
        const buttonTop = {
            top: (this.props.height-30)/2
        }

        let nodes = []
        for (const key in this.props.contents) {
            nodes.push(<div key={key} className={'slide-node'} style={containerSize}>
                {this.props.contents[key]}
            </div>)
        }

        let dots = []
        for (let i = 0; i < this.props.contents.length; i++) {
            dots.push(
                <div key={i} className={'slide-dot '+(this.state.page === i ? 'dot-active' : 'dot-inactive')} />)
        }
        return (
            <div className={'slide-container'} style={containerSize}>
                <div className={'slide-band'} style={{...bandSize, left: -this.props.width * this.state.page}}>
                    {nodes}
                </div>
                <div className={'slide-controller'} style={containerSize}>
                    <button className={'slide-button-left '+(this.state.page === 0 ? 'button-hidden' : 'button-visible')}
                            style={buttonTop}
                            onClick={this.pageDown}/>
                    <button className={'slide-button-right '+(this.state.page === this.props.contents.length-1 ? 'button-hidden' : 'button-visible')}
                            style={buttonTop}
                            onClick={this.pageUp}/>
                    <div className={'slide-dots-container'}>{dots}</div>
                </div>
            </div>);
    }
}