import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';


function DERMALForm(){
    //define constants
    //csrfToken for Django API authentication
    const csrfToken = Cookies.get('csrftoken')
    //for image input
    const [image,setImage]=useState("")
    //for duration input
    const [duration,setDuration]=useState('UNKNOWN')
    //to track symptoms
    const [symptoms,setSymptoms]=useState(
        {truesymptoms:[]}
    )

    //list of symptoms for creating the form
    const symptomTitles=['textures_raised_or_bumpy',
       'textures_flat', 'textures_rough_or_flaky', 'textures_fluid_filled',
       'body_parts_head_or_neck', 'body_parts_arm', 'body_parts_palm',
       'body_parts_back_of_hand', 'body_parts_torso_front',
       'body_parts_torso_back', 'body_parts_genitalia_or_groin',
       'body_parts_buttocks', 'body_parts_leg', 'body_parts_foot_top_or_side',
       'body_parts_foot_sole', 'body_parts_other',
       'condition_symptoms_bothersome_appearance',
       'condition_symptoms_bleeding', 'condition_symptoms_increasing_size',
       'condition_symptoms_darkening', 'condition_symptoms_itching',
       'condition_symptoms_burning', 'condition_symptoms_pain',
       'condition_symptoms_no_relevant_experience', 'other_symptoms_fever',
       'other_symptoms_chills', 'other_symptoms_fatigue',
       'other_symptoms_joint_pain', 'other_symptoms_mouth_sores',
       'other_symptoms_shortness_of_breath']

    //list of durations for creating the form
    const durationTitles=[
        'UNKNOWN',
        'ONE_DAY',
        'LESS_THAN_ONE_WEEK',
        'ONE_TO_FOUR_WEEKS',
        'ONE_TO_THREE_MONTHS',
        'THREE_TO_TWELVE_MONTHS',
        'MORE_THAN_ONE_YEAR',
        'MORE_THAN_FIVE_YEARS',
        'SINCE_CHILDHOOD',
    ]

    //for handling the change of images and duration, simply take what the new value is
    //and apply it to our state
    function handleImageChange(e){
        setImage(e.target.files[0]);
    }
    function handleDurationChange(e){
        setDuration(e.target.value);
    }

    //track the state of each checkbox
    function handleSymptomChange(e){
        //delare value as the target input
        const {value,checked}=e.target;
        //"import" the currently tracked symptoms
        const {truesymptoms}=symptoms
        
        //if the input checkbox is being checked,
        //add the input checkbox value to the tracked symptom array
        if (checked)(
            setSymptoms({
                truesymptoms:[...truesymptoms,value]
            })
        );

        //otherwise remove it
        else(
            setSymptoms({
                truesymptoms:truesymptoms.filter(
                    e=>e!==value
                )
            })
        );
    }
     

    function formatSymptoms(){
        //create the object we will return with prefromatted dict
        const symptomTracker={};
        

        symptomTitles.forEach(
            function ifIn(item, index, arr){
            
            if (symptoms.truesymptoms.includes(item)){
                symptomTracker[item]=true
            }
            else{
                symptomTracker[item]=false
            }
        });
        return(symptomTracker)
    }
    

    function handleSubmit(e){
        e.preventDefault(); //Prevent default form submissions

        //require an image to submit form
        if (!image){
            alert("select an image file");
            return;
        }

        const formData= new FormData();

        //create an API post request to django
        const api=axios.create({
            baseURL:"http://localhost:8000/runDERMAL/",
            withCredentials: true
        })

        api.interceptors.request.use(config => {  
            config.headers['X-CSRFToken'] = csrfToken;  
            return config;  
        }); 

        formData.append("symptoms",JSON.stringify(formatSymptoms()));
        
        formData.append("image",image);
        
        formData.append("duration",duration);
        
        api.post('',formData)
        .then(function (response) {
            console.log(response)
        });
        


        //callRestAPI();
    }

    function callRestAPI(){
        const restEndpoint="http://localhost:8000/runDERMAL/"
        const response = fetch(restEndpoint);
        console.log(response)
    }

    return(
        <div id="form" method='post' onSubmit={handleSubmit} >
            <h3>Upload image and symptoms</h3>
            <form>
                <label for="cname">Upload an image:</label><br></br>
                <input type="file" accept="image/*" onChange={handleImageChange}></input><br></br>
                <label>Enter your symptoms/location:</label><br></br>
                {symptomTitles.map(element => (
                    <div>
                        <label>{element}:</label>
                        <input type="checkbox" value={element} onChange={handleSymptomChange}></input><br></br>
                    </div>
                ))}
                
                <label>duration:</label><br></br>
                <select name="duration" id="duration" onChange={handleDurationChange}>
                    {durationTitles.map(element => (
                        <option value={element} >{element}</option>
                    ))}
                </select><br></br>
                
                <input type="submit" value="Submit"></input>
            </form>

            <p></p>
        </div>
    )
}

export default DERMALForm;