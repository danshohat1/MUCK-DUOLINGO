

const axios = require('axios').default;

async function main(){


   await axios.get("http://localhost:8003/join_chat?lang=en").then((data) =>{
      console.log(data)
   })

   await axios.get("http://localhost:8003/join_chat?lang=sp").then((data) =>{
      console.log(data)
   })

}
/*
axios.delete('http://localhost:8001/update_user', {data: JSON.stringify({username: "user 3"})})
      .then((data) =>{
         console.log(data.data);
      })
*/

main()


