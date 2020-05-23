import React from 'react';

import './PlaylistListItem.css';


class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        
    }

    handleClick(e) {
        this.props.onSelect(e.target.value);
    }

    
    render() {
        return(
            <div className="Playlist-list-item"
                onSelect={this.props.onSelect}>
                <h3 onClick={this.handleClick}>
                    {this.props.list.name}</h3>
                
            </div>
        )
    }
}

export default PlaylistListItem;