

const axios = require('axios').default;

async function main(){


   await axios.post("http://localhost:8003/", {authorization_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDQxMjc0MzksInVzZXJuYW1lIjoidXNlcjEiLCJhZ2UiOjE3fQ.MGMtDGxzaFliAEs8pUYcEYato5w_nIDsiU4Dh7xMZIk", muck: "1234"}).then((res) =>{
      console.log(res.data)
   })

}
/*
axios.delete('http://localhost:8001/update_user', {data: JSON.stringify({username: "user 3"})})
      .then((data) =>{
         console.log(data.data);
      })
*/

main()


