## Social-Playlist Server

It is a collaboration between [Daniel Lee Bright](https://github.com/Brahyt), [Glaiza Wagner](https://github.com/glaizawagner), [Wesley Jacobs](https://github.com/wjacobs71086), [Julio Hernandez](https://github.com/hernandez-crypto), and [Lazandrea Celestine](https://github.com/zeecelest)

- [Live app](https://social-playlist.netlify.com)
- [Server-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-server)
- [Client-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-Client)
- [Heroku-endpoint](https://still-fortress-90057.herokuapp.com)
- [Heroku-git](https://git.heroku.com/still-fortress-90057.git)

## Technology Used

&ensp; Node | Express | PostgreSQL | GeoCode | Bcryptjs | JWT | Morgan | Chai | Supertest

## API Endpoints

The following are the request endpoints for this server:::

- Auth Endpoints

    - &ensp;POST api/auth/token => It is a request handler for user login to receive a JWT. It verifies credentials for login.          
    - &ensp;PUT api/auth/token => It is a request handler for user login that allows automatic refreshing of token.

- User Endpoints

    - &ensp;POST /api/user => request handler for user registration/sign-up.

- Spot Endpoints
    - &ensp; GET /api/spots
    - &ensp; GET /api/spots/:spot_id
    - &ensp; POST /api/spots
    - &ensp; DELETE /api/spots/:spot_id
    - &ensp; PATCH /api/spots/:spot_id
    
    
- List Endpoints
    - &ensp; GET /api/lists  => It returns all lists that are public. 
    &ensp; Response:
      ```json
       > [
            {
                "likes": "10",
                "liked_by_user": "1",
                "on_fire": "1",
                "id": 1,
                "name": "Date night",
                "tags": "#datenight",
                "city": "Los Angeles",
                "state": "CA",
                "is_public": true,
                "description": "something"
            },
            ... all other lists that match query
        ]
        ```
    - &ensp; GET /api/lists/user => It returns all lists from currently logged in user.
    &ensp; Response:
      > [
            {
                "users_id": 1,
                "list_id": 3,
                "id": 3,
                "name": "My secret list",
                "tags": "#private",
                "city": "San Diego",
                "state": "CA",
                "is_public": false
            },
            ... more lists
        ]
    - &ensp; GET /api/user/lists/:list_id
    - &ensp; GET /api/lists/city/:city
    - &ensp; POST /api/lists
        &ensp; Response:
       >{
            list_id: 122,
            name: 'new list',
            tags: '#hot #cheap #datenight',
            city: 'new_york',
            state: 'NY',
            description: "stuff in here",
            is_public: true
        }
    - &ensp; POST /api/lists/like/:id
    - &ensp; DELETE /api/lists/:list_id
    - &ensp; PATCH /api/lists/:list_id

## Getting Started
For Devs :
- npm i;
- createdb -U dunder_mifflin social-playlist-test;
- createdb -U dunder_mifflin social-playlist;

Copyright © 2020