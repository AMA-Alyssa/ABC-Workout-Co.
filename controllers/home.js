//importing models to controller page

const Exercise = require("../models/Exercise");
const Workout = require("../models/Workout");

//function that finds the letters and generates the exercise information in order to render it to home.ejs 
//I used asyn await because I want the database to get the information before anything else happens
exports.getHome =  async (req,res)=>{
    const exercises = await Exercise.findOne().sort({ createdAt : 'desc' }).populate({path:'workouts', select:'_id letter exercise reps'})
    res.render('home.ejs', {user: req.user, exercise: exercises, layout:'./layouts/main'});
}

//function that takes the word inputed by the user and makes it all upper case and splits it into an array. This will find the exercise 
//thats tied to that letter and type and generate the correct information. I used a for loop inside loop(nested loop). 
//The loops compare the letters from word the user entered and compares it to the exercise in the database that has that same letter and type.
// Once found it will console it.
exports.createWorkout = async (req, res) => {
    
        const letters = (req.body.workout).toUpperCase().split('')
        const selected = req.body.bodyFocus
        const newArray = []

    try{       
        
        
        let workouts = await Workout.find({
            type:selected,
            letter: letters,
        })

        for(let i= 0; i < letters.length; i++){
            for(let j = 0; j < workouts.length; j++){
                if( letters[i] === workouts[j].letter){
                    newArray.push(workouts[j])
                }else{
                    continue;
                }
            }
            console.log(workouts)
        } 

        await Exercise.create({userId: req.user.id, workouts:newArray})

        res.redirect('/home')

    } catch(err){
        console.log(err)
    }
}
