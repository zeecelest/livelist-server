## Social-Playlist Server

It is a collaboration between [Daniel Lee Bright](https://github.com/Brahyt), [Glaiza Wagner](https://github.com/glaizawagner), [Wesley Jacobs](https://github.com/wjacobs71086), [Julio Hernandez](https://github.com/hernandez-crypto), and [Lazandrea Celestine](https://github.com/zeecelest).

- [Live app](https://social-playlist.netlify.com)
- [Server-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-server)
- [Client-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-Client)
- [Heroku-endpoint](https://still-fortress-90057.herokuapp.com)
- [Heroku-git](https://git.heroku.com/still-fortress-90057.git)

## Technology Used

- Node | Express | PostgreSQL | GeoCode | Bcryptjs | JWT | Morgan | Chai | Supertest </br>
- Deployed in Heroku

## API Endpoints

The following are the request endpoints for this server:

- <strong>Auth Endpoints</strong>
    - <strong>POST api/auth/token</strong> => It is a request handler for user login to receive a JWT. It verifies credentials for login.          
    - <strong>PUT api/auth/token</strong> => It is a request handler for user login that allows automatic refreshing of token.

- <strong>User Endpoints</strong>
    - <strong>POST /api/user</strong> => It is a request handler for user registration/sign-up.

- <strong>Spot Endpoints</strong>
    - <strong>GET /api/spots/:spot_id</strong>  => It returns the details from a specific spot. </br>
    Request:</br>
    &ensp; url param id = 134;</br>
    Response:
    ```
        {
            id: 134,
            spot_name: 'name',
            tags: '#cheapfood #goodviews',
            address: '132 somewhere st.',
            city: 'Orlando',
            state: 'FL',
            lat: 54.312937,
            lng: 12.319744
        }
    ```
    - <strong>POST /api/spots</strong> => It will add a spot to a list. It will insert a new record in the `spots` table as well as in the `lists_spots` table.</br>
    Request:
    ```
    {
        "list_id": 2,
        "name": "name",
        "tags": "#cheapfood #goodviews",
        "address": "132 somewhere st.",
        "city": "Orlando",
        "state": "FL"
    }
    ```
    Response:</br>
    <strong>`spots` table</Strong>
    ```
    {
        id: 134,
        spot_name: 'name',
        tags: '#cheapfood #goodviews',
        address: '132 somewhere st.',
        city: 'Orlando',
        state: 'FL',
        lat: 54.312937,
        lng: 12.319744
    }
    ```
    <strong>`lists_spots` table</strong>
    ```
    {
        list_id: 2,
        spot_id: 134
    }
    
    ```
    - <strong>DELETE /api/spots/:id</strong> => It will delete a record from the `spots` table. The request needs the req.params.id.</br>
    - <strong>PATCH /api/spots/:id</strong> => It will update the record in the `spots` table.</br>
    Request: 
    ```
   {
        "name": "Giggles Night Club updated",
        "tags": "#nightout",
        "address": "215 N Brand Blvd",
        "city": "CA",
        "state": "Los Angeles",
        "list_id": 1
    }
    ```
    Response:
    ```
     {
        "id": 1,
        "name": "Giggles Night Club updated",
        "tags": "#nightout",
        "address": "215 N Brand Blvd",
        "city": "CA",
        "state": "Los Angeles",
        "lat": "34.083824",
        "lon": "-118.344266"
    }
    ```
- <strong>List Endpoints</strong>
    - <strong>GET /api/lists</strong> => It returns all lists that are public.</br>
      Response:
      ```
        [
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
    - <strong>GET /api/lists/user</strong> => It returns all lists from currently logged-in user.</br>
    Response:
    ```
        [
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
    ```
    - <strong>GET /api/user/lists/:list_id</strong> => It will return the list and spots for that list;</br>
    Request:</br>
    &ensp; url param id;</br>
    Response:</br>
    ```
        {  
            list_name: 'list name',
            list_id: 1,
            tags: '#sick #cheap',
            created_by: 'username',
            description: 'stuff in here',
            liked: 10,
            tried: 100,
            spots: [
                {
                id: 1,
                name: 'spots name',
                tags: '#bestdrinks #goodmusic',
                address: '361 fake st.',
                city: 'city name',
                state: 'ST',
                lat: 12.091823,
                lng: 31.31525
                },
                ... more objects of spots
            ]
    }
    ```
    - <strong> GET /api/lists/city/:city_name </strong> => It returns all lists that are public, and from each city.</br>
        Response:
        ```
        [
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
    - <strong>POST /api/lists</strong></br> => It inserts a list in the `lists` table as well as the `users_lists` table.</br>
       Request:
       ```
        {
            "name": "new list",
            "tags": "#hot #cheap #datenight",
            "city": "new_york",
            "state": "NY",
            "description": "stuff in here",
            "is_public": true
        }
       ```
       Response:</br>
       <strong>`lists` table</strong>
       ```
        {
            list_id: 122,
            name: 'new list',
            tags: '#hot #cheap #datenight',
            city: 'new_york',
            state: 'NY',
            description: "stuff in here",
            is_public: true
        }
      ```
      <strong>`users_lists` table</strong>
      ```
        {
            users_id: 3,
            list_id: 122
        }
      ```
    - <strong>POST /api/lists/like/:list_id</strong> => It will toggle favorites for that list.</br>
    Response:
        ```
        {
            "like": "1"
        }
            OR
        {
            "like": "0"
        }
        ```
    - <strong>DELETE /api/lists/:list_id</strong> => It will delete a list from the `lists` table by list_id.</br>
    - <strong>PATCH /api/lists/:list_id</strong> => It will update the `lists` table by list_id.</br>
    Request:
    ```
        {
            "name": "new list",
            "tags": "#hot #cheap #datenight",
            "city": "new city",
            "state": "NY",
            "description": "new stuff",
            "is_public": true
        }
    ```
    Response: 
    ```
        {
            "id": 5,
            "name": "new list",
            "tags": "#hot #cheap #datenight",
            "city": "new city",
            "state": "NY",
            "is_public": true,
            "description": "new stuff"
        }
    ```

Copyright © 2020