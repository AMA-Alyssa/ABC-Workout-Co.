const Exercise = require("../models/Exercise");
const Workout = require("../models/Workout");

exports.getHome =  async (req,res)=>{
    const exercises = await Exercise.findOne().sort({ createdAt : 'desc' }).populate({path:'workouts', select:'_id letter exercise reps'})
    res.render('home.ejs', {user: req.user, exercise: exercises, layout:'./layouts/main'});
}

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
