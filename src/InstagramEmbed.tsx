import './InstagramEmbed.scss'
import React, {Component, createRef} from "react";
import {Slide} from "./Slide";


interface InstagramEmbedProps {
    url: string
    width: number
    height: number
    shouldShowCaption: boolean
}

interface InstagramEmbedState {
    media: any
    isLoading: boolean
    username: string
    avatar: string
    caption: string
}

export class InstagramEmbed extends Component<InstagramEmbedProps, InstagramEmbedState> {
    constructor(props: Readonly<InstagramEmbedProps>) {
        super(props)
        this.state = {
            media: null,
            isLoading: false,
            username: '',
            avatar: '',
            caption: '',
        }
    }

    fetchData = (callback: (s: string) => void, url: string) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText)
                } else {
                    this.setState({isLoading: false});
                }
            }
        }
        xhr.open("GET", url)
        xhr.send()
    }
    parsePost = (str: string) => {
        const obj = this.parseSharedData(str)
        let media = obj['entry_data']['PostPage'][0]['graphql']['shortcode_media']
        console.log(media)
        this.setState({media: media})
        this.setState({username: media['owner']["username"]})
        this.setState({avatar: media['owner']["profile_pic_url"]})
        if (this.props.shouldShowCaption && media['edge_media_to_caption']['edges'].length >= 1)
            this.setState({caption: media['edge_media_to_caption']['edges'][0]['node']['text']})
    }

    parseSharedData(str: string) {
        const pattern = /<script type="text\/javascript">window\._sharedData = (.*?);<\/script>/
        const res = pattern.exec(str)
        if (res === null) return null
        return JSON.parse(res[1])
    }

    parseMedia = (obj: any) => {
        if (obj === null) {
            return (
                <div style={{width: this.props.width, height: this.props.height}}/>
            );
        }
        switch (obj['__typename']) {
            case 'GraphVideo':
                return (
                    <Video
                        videoUrl={obj['video_url']}
                        posterUrl={obj['display_url']}
                        key={obj['video_url']}/>
                );
            case 'GraphSidecar':
                let contents: JSX.Element[] = []
                obj['edge_sidecar_to_children']['edges'].forEach((value: { [x: string]: any }) => {
                    contents.push(this.parseMedia(value['node']))
                })
                return (<Slide {...this.props} contents={contents}/>);
            default:
                return (
                    <img key={obj['display_url']} style={{width: '100%', height: '100%', objectFit: 'cover'}}
                         src={obj['display_url']} alt=""/>
                );
        }
    }

    componentDidMount() {
        this.fetchData(this.parsePost, this.props.url)
    }

    render() {
        return (
            <div className={'instagram-embed'} style={{width: this.props.width}}>
                <div className={'ie-header'}>
                    <div className={'ie-avatar-container'}>
                        <img
                            className={'ie-avatar'}
                            src={this.state.avatar}
                            alt={''}/>
                    </div>
                    <div className={'ie-header-text'}>
                        <a className={'ie-username'} href={`https://www.instagram.com/${this.state.username}/`}
                           target={'blank'}>
                            <span className={'ie-username-text'}>
                                {this.state.username}
                            </span>
                        </a>
                    </div>
                </div>
                <div style={{width: this.props.width, height: this.props.height}}>
                    {this.parseMedia(this.state.media)}
                </div>
                <div className={'ie-feedback'}>
                    <a href={this.props.url} target={'blank'} className={'ie-heart-button'}><span/></a>
                    <a href={this.props.url} target={'blank'} className={'ie-comment-button'}><span/></a>
                    <a href={this.props.url} target={'blank'} className={'ie-share-button'}><span/></a>
                    <a href={this.props.url} target={'blank'} className={'ie-save-button'}><span/></a>
                </div>
                <div className={'ie-caption'} style={this.state.caption.length === 0 ? {display: "none"} : {}}>
                    {this.state.caption}
                </div>
            </div>
        )
    }
}

interface VideoProps {
    videoUrl: string
    posterUrl: string
}

interface VideoState {
    isPlaying: boolean
}

class Video extends Component<VideoProps, VideoState> {
    ref = createRef<HTMLVideoElement>()

    constructor(props: Readonly<VideoProps>) {
        super(props)
        this.state = {
            isPlaying: false,
        }
    }

    play = () => {
        this.ref.current?.play().then(
            () => {
                this.setState({isPlaying: true})
            }
        )
        this.setState({isPlaying: true})
    }

    pause = () => {
        this.ref.current?.pause()
        this.setState({isPlaying: false})
    }

    playOrStop = () => {
        if (this.state.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    render() {
        return (
            <div className={'video-container'}>
                <span className={'play-button' + (this.state.isPlaying ? ' is-playing' : '')}
                      onClick={this.playOrStop}/>
                <video className={'video-body'} ref={this.ref}
                       style={{width: '100%', height: '100%', objectFit: 'contain', outline: 'none'}}
                       poster={this.props.posterUrl}
                       src={this.props.videoUrl}
                       onEnded={this.pause}
                />
            </div>
        )
    }
}