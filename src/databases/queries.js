//postrgreSql DB
const Pool = require('pg').Pool

//credentials of Db
const pool = new Pool({

  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,

})


//utility function to validate passed ids
function validateId(id){

    pool.query('SELECT name FROM users where id=$1',[id],(error,results)=>{
        
        if(error){

            throw{
                status: error?.status || 502,
                message: error?.message || error,
            }

        }
        //if results return no rows => no record exists for passed id -> validation failed 
        if(results.rows.length ===0){
            return false;
        }
        else{
            return true;
        }
        

    })
}













//res processing of req to get all users
const getUsers = (req,res)=>{

    try{     

        //sql query
        pool.query('SELECT * FROM users ORDER BY id ASC' , (error,results) =>{

            //server errors mostly due to DB errors
            if(error){

                throw{
                    status: error?.status || 501,
                    message: error?.message || error,
                }

            }
            
            //return results in json format
            res.status(200).json(results.rows);
        })

    }catch(err){

        throw{
            status: err?.status || 500,
            message: err?.message || err,
        }
    }

};









//res processing for req to get a unique user 
const getUserById = (req,res)=>{

    //fetch the id from req parameter
    try{
        const {
            params: {id},
        } = req;

        //check if parameter exists or not
        if(!id){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "id parameter cant be empty"
                },
            })
            return;

        }

        //validate id passed
        if(!validateId(id)){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "passed id doesnt exist"
                },

            })
            return;
        }

        
        //run sql query to fetch result
        pool.query('SELECT * FROM users where id= $1',[id], (error,results)=>{
            if(error){
                res.status(501);
                throw error;
            }

            //send results
            res.status(200).json(results.rows);
        })

    }catch(err){
        throw{
            status: err?.status || 500,
            message: err?.message || err,
        }
    }
    
};










//res processing for req to create a user 
const createUser = (req,res)=>{

    try{

        //fetch name & email from request body
        const {name,email} = req.body;

        //if any field is missing ( validation failed )
        if(!name || !email){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "Missing fields in body"
                },
            })

            return;
        }

        //run sql (parameterized)
        pool.query('INSERT INTO users (name,email) VALUES ($1, $2) RETURNING *',[name,email], (error,results)=>{
            
            if(error){
                res.status(501);
                throw error;
            }

            //send confirmation on succesfull push to DB
            res.status(200).send(`User added with id: ${results.rows[0].id}`);
        })

    }catch(err){
        throw{
            status: err?.status || 500,
            message: err?.message || err,
        }
    }
    
};










//res processing for req to update a user
const updateUser = (req,res)=>{

    try{
        //fetch id from parameter
        const{
            params: {id},
        } =req;

        //parameter check 
        if(!id){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "id parameter cant be empty"
                },
            })
            return;
        }

        //validating id
        if(!validateId(id)){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "passed id doesnt exist"
                },

            })
            return;
        }

        //fetching fields from req body
        const {name,email} = req.body;

        if(!name || !email){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "Missing fields in body"
                },
            })
            return;
        }

        pool.query('UPDATE users SET name = $1 , email = $2 WHERE  id = $3' , [name,email,id] , (error,results)=>{

            if(error){
                res.status(501);
                throw error;
            }

            //send confirmation
            res.status(200).send(`User with id: ${id} has been updated`);

        })

    }catch(err){
        throw{
            status: err?.status || 500,
            message: err?.message || err,
        }
    }
};









//res processing for req to delete a user
const deleteUser = (req,res)=>{

    try{
        //fetch id from param
        const {
            params: {id},
        } =req;

        //param check
        if(!id){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "id parameter cant be empty"
                },
            })
            return;
        }

        //validate id
        if(!validateId(id)){
            res.status(400).send({
                status:"Failed",
                data: {
                    error:
                        "passed id doesnt exist"
                },

            })
            return;
        }


        pool.query('DELETE FROM users WHERE ID = $1',[id],(error,results)=>{
            
            if(error){
                res.status(501);
                throw error;
            }

            //confirmation
            res.status(200).send(`User with id: ${id} has been deleted`);
        })

    }catch(err){
        throw{
            status: err?.status || 500,
            message: err?.message || err,
        }
    }


};














//exporting
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}