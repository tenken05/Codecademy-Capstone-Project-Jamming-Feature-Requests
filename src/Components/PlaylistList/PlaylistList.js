import React from 'react';
import './PlaylistList.css';

import PlaylistListItem from '../PlaylistListItem/PlaylistListItem'





class PlaylistList extends React.Component {  
          
    render() {
        return(
            <div className="Playlist-list">
                <h2>Local Playlists</h2>
                { this.props.playlists.map(list =>{
                    return <PlaylistListItem list={list}
                                                key={list.id}/>
                })}


            </div>




        )
    }
}

export default PlaylistList;