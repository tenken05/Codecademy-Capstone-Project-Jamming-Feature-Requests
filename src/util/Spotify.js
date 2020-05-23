
let accessToken;
const clientId = '9c5115646c68404f9fcfa89e220c651f';
const redirectUri = "http://localhost:3000";
let userId;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // this will clear parameters and allow us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        
        const accessToken = Spotify.getAccessToken();
            return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { headers: {
            Authorization: `Bearer ${accessToken}`
        }
            }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name, 
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },
//This is the function in question.  I'm trying to check if the userId has been set by a previous call to this function, if it is already set,
// then I'm trying to set user Id to the jsonResponse.id and use it .
    getCurrentUserId() {
        
        let accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me`, { 
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            jsonResponse.id = userId;
        })
           
},

    savePlaylist(name, trackUris) {
        if (!name || !trackUris) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        


        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id ;


        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ uris: trackUris })
                });
            })
        }) 
},

    
    
    getUserPlaylists() {
               
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        // let userId = Spotify.getCurrentUserId();
    //   This next portion is what i'm trying to replace with the function above...but won't work no matter what I do.       
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id ;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
        { 
            headers: headers
            
         }
        ).then(response => response.json()
        ).then(jsonResponse => {
            
                return jsonResponse.items.map(playlist => ({
                    
                    name: playlist.name,
                    id: playlist.id,
                    
                    
                }));
        })
        }) 
    },

    getPlaylist(id){
      if (!id){
          return;
      }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
           userId = jsonResponse.id ;
           return fetch (`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, { headers: headers}
           ).then(response => response.json()
           ).then(jsonResponse => {
               return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name, 
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri 

               }))
                
           }) 

        })

    }

}

export default Spotify;