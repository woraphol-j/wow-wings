# WOW-Wings Backend
## How to run
1. Install docker for mac by following the instraction in the following page:
> https://docs.docker.com/docker-for-mac/
2. Clone the project
> git clone https://github.com/woraphol-j/wow-wings
3. Run the following command in the project directory:
> docker-compose up -d
4. Use the following api endpoints to query or post data
 - To post score
> POST http://localhost:3000/api/plays/submit
> Json input =
> {
>     "name" : "name",
>     "score" : 30
> }
 - To retrieve top scores
> http://localhost:3000/api/plays?filter[include]=player&filter[fields][playerId]=false&filter[order]=submitTime DESC
 - To retrieve top players
> http://localhost:3000/api/players?&filter[order]=highestScore DESC
 - To retrieve scores for each player
> http://localhost:3000/api/players/{playerId}/plays
