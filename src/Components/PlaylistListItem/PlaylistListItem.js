import React from 'react';

import './PlaylistListItem.css';


class PlaylistListItem extends React.Component {
    render() {
        return(
            <div className="Playlist-list-item">
                <h3>{this.props.list.name
                }</h3>
                
            </div>
        )
    }
}

export default PlaylistListItem;